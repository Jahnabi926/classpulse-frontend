import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import ErrorToast from "./ErrorToast";
import QuizGenerator from "./QuizGenerator";

const Quiz = () => {
  const { classId } = useParams();
  const user = useSelector((store) => store.user);
  const role = user?.role;

  // useRef, not useState — the socket connection has no bearing on what's
  // rendered, so there's no reason to trigger a re-render when it's set.
  // useState exists specifically to trigger re-renders on change (that's
  // its whole purpose); useRef exists specifically to persist a value
  // across renders WITHOUT causing one — the right tool for holding a
  // long-lived reference like a socket, a timer ID, or a DOM node.

  const socketRef = useRef(null); // holds the socket instance across re-renders

  const [activeQuestion, setActiveQuestion] = useState(null); // { question, options }
  const [answer, setAnswer] = useState("");
  const [tally, setTally] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState({ message: "", id: 0 });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket; // just stores the reference quietly, no re-render happens.If you'd used useState instead (const [socket, setSocket] = useState(null)), calling setSocket(socket) would cause Quiz to re-render immediately — and since the socket connection itself doesn't need to be displayed anywhere in the UI, that re-render would be pointless, wasted work.

    socket.on("connect", () => {
      socket.emit("joinClass", { classId });
    });

    socket.on("new-question", (data) => {
      setActiveQuestion(data);
      setAnswer("");
      setResults(null);
      setTally(0);
      setSubmitted(false);
    });

    socket.on("answers-received", (data) => {
      setTally(data.totalAnswers);
    });

    socket.on("quiz-results", (data) => {
      setResults(data);
      setActiveQuestion(null);
    });

    socket.on("error", (err) => {
      setError({ message: err.message, id: Date.now() });
    });

    // Cleanup — runs when this component unmounts (e.g. navigating away).
    // Without this, listeners pile up every time you revisit this page.
    return () => {
      socket.disconnect();
    };
  }, [classId]);

  const handleSubmitAnswer = () => {
    // Implemented submit-answer emission with { classId, answer } and locked the answer with submitted.
    socketRef.current?.emit("submit-answer", { classId, answer });
    setSubmitted(true);
  };

  const launchQuestion = ({ question, options }) => {
    socketRef.current?.emit("start-question", { classId, question, options });
  };
  const handleEndQuestion = () => {
    // Implemented the end-question socket emission with { classId }
    socketRef.current?.emit("end-question", { classId });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <ErrorToast key={error.id} error={error.message} />
      <h1 className="text-2xl font-semibold mb-6">Live Quiz</h1>
      {role === "teacher" && (
        <QuizGenerator
          onLaunch={launchQuestion}
          questionActive={!!activeQuestion}
        />
      )}
      {role === "teacher" && activeQuestion && (
        <div className="card bg-base-200 p-4 mb-6 flex flex-col gap-3">
          <p className="font-medium">{activeQuestion.question}</p>
          <p className="text-sm opacity-70">
            {tally} {tally === 1 ? "answer" : "answers"} received
          </p>
          <button className="btn btn-error" onClick={handleEndQuestion}>
            End question
          </button>
        </div>
      )}
      {/* question display, selectable option buttons, and a
      disabled-until-selected “Submit answer” button. */}
      {role === "student" && activeQuestion && (
        <div className="card bg-base-200 p-4 mb-6 flex flex-col gap-3">
          <h2 className="text-lg font-medium">{activeQuestion.question}</h2>
          {activeQuestion.options.map((option) => (
            <button
              key={option}
              className={`btn ${answer === option ? "btn-primary" : "btn-outline"}`}
              onClick={() => setAnswer(option)}
              disabled={submitted}
            >
              {option}
            </button>
          ))}
          <button
            className="btn btn-primary"
            onClick={handleSubmitAnswer}
            disabled={!answer || submitted}
          >
            Submit answer
          </button>
          {submitted && (
            <p className="opacity-70">
              Answer submitted. Waiting for results...
            </p>
          )}
        </div>
      )}
      {role === "student" && !activeQuestion && !results && (
        <p className="opacity-60">
          Waiting for the teacher to start a question...
        </p>
      )}
      {/* Implemented the results count */}
      {results &&
        (() => {
          const count = Object.keys(results).length;
          return (
            <div className="card bg-base-200 p-4">
              <p>
                {count} {count === 1 ? "student" : "students"} answered.
              </p>
              {/* finalAnswers is your answers object — the exact same shape you built in submit-answer: { studentId1: "answer1", studentId2: "answer2", ... }. It's not a count, not an array — it's an object where each key is a student's ID, and the value is what they answered. */}
            </div>
          );
        })()}
      {/* (() => { ... })() is  IIFE — Immediately Invoked Function Expression. this defines an anonymous arrow function. The trailing () — this is the actual call — it immediately invokes the function you just defined, right there, in the same line */}
    </div>
  );
};

export default Quiz;
