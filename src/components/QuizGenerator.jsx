import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";
import ErrorToast from "./ErrorToast";

const QuizGenerator = ({ onLaunch, questionActive }) => {
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState({ message: "", id: 0 });
  const [nextIndex, setNextIndex] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setQuestions([]);
    setNextIndex(0);
    try {
      const res = await axios.post(
        BASE_URL + "/api/quiz/generate",
        { topic, gradeLevel, numQuestions: Number(numQuestions), difficulty },
        { withCredentials: true },
      );
      setQuestions(res.data.questions);
      console.log(res.data.questions);
    } catch (err) {
      setError({ message: getErrorMessage(err), id: Date.now() });
    } finally {
      setLoading(false);
    }
  };
  const handleSendNext = () => {
    const q = questions[nextIndex];
    onLaunch({ question: q.question, options: q.options });
    setNextIndex(nextIndex + 1);
  };

  const handleDiscard = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="card bg-base-200 p-4 mb-6 flex flex-col gap-3">
      <ErrorToast key={error.id} error={error.message} />
      <h2 className="text-lg font-medium">Generate a quiz with AI</h2>
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Topic (e.g. Fractions)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Grade level (e.g. Grade 6)"
        value={gradeLevel}
        onChange={(e) => setGradeLevel(e.target.value)}
      />
      <input
        type="number"
        min={1}
        max={10}
        className="input input-bordered w-full"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
      />
      <select
        className="select select-bordered w-full"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={loading || !topic.trim() || !gradeLevel.trim()}
      >
        {loading ? "Generating..." : "Generate quiz"}
      </button>
      {questions.map((q, i) => (
        <div key={i} className="card bg-base-100 p-3 flex flex-col gap-2">
          <p className="font-medium">
            {i + 1}. {q.question}
          </p>
          {i < nextIndex && <span className="badge badge-success">Sent</span>}
          <ul className="flex flex-col gap-1">
            {q.options.map((opt, j) => (
              <li
                key={j}
                className={
                  j === q.correctIndex ? "text-success font-semibold" : ""
                }
              >
                {opt}
                {j === q.correctIndex && " ✓"}
              </li>
            ))}
          </ul>
          {i >= nextIndex && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => handleDiscard(i)}
            >
              Discard
            </button>
          )}
        </div>
      ))}
      {questions.length > 0 &&
        (nextIndex < questions.length ? (
          <button
            className="btn btn-secondary"
            onClick={handleSendNext}
            disabled={questionActive}
          >
            {nextIndex === 0 ? "Start quiz" : "Send next question"}
          </button>
        ) : (
          <p className="opacity-70">All questions sent.</p>
        ))}
    </div>
  );
};

export default QuizGenerator;
