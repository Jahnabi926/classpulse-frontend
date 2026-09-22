import { useState } from "react";
import ErrorToast from "./ErrorToast";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const CreateClassForm = ({ onCreated }) => {
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [error, setError] = useState({ message: "", id: 0 });

  const handleCreate = async () => {
    try {
      await axios.post(
        BASE_URL + "/class/create",
        { className, subject },
        { withCredentials: true },
      );
      setClassName("");
      setSubject("");
      onCreated(); // tell Dashboard to refetch
    } catch (err) {
      if (err.response) {
        setError({ message: err.response?.data, id: Date.now() });
      } else if (err.request) {
        setError("Network error — please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="card bg-base-200 p-4 mb-6 w-3/4 mx-auto">
      <ErrorToast key={error.id} error={error.message} />
      <div className="card bg-base-200 p-4 mb-6 flex flex-col gap-3 items-center">
        <input
          type="text"
          className="input"
          placeholder="Which Class do you want to create ?"
          list="classes"
          value={className}
          onChange={(e) => {
            setClassName(e.target.value);
            setError({ message: "", id: Date.now() });
          }}
        />
        <datalist id="classes">
          <option value="Class-9-A"></option>
          <option value="Class-9-B"></option>
          <option value="Class-10-A"></option>
          <option value="Class-10-B"></option>
        </datalist>
        <input
          type="text"
          className="input"
          placeholder="Select your subject"
          list="subjects"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setError({ message: "", id: Date.now() });
          }}
        />
        <datalist id="subjects">
          <option value="Physics"></option>
          <option value="Chemistry"></option>
          <option value="Mathematics"></option>
          <option value="English"></option>
          <option value="Social Science"></option>
        </datalist>

        <button className="btn btn-primary w-fit" onClick={handleCreate}>
          Create Class
        </button>
      </div>
    </div>
  );
};

export const JoinClassForm = ({ onJoined }) => {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState({ message: "", id: 0 });

  const handleJoin = async () => {
    try {
      await axios.post(
        BASE_URL + "/class/join",
        { joinCode },
        { withCredentials: true },
      );
      setJoinCode("");
      onJoined();
    } catch (err) {
      if (err.response) {
        setError({ message: err.response.data, id: Date.now() });
      } else if (err.request) {
        setError("Network error — please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="card bg-base-200 p-4 mb-6 w-full max-w-xl mx-auto">
      <ErrorToast key={error.id} error={error.message} />
      <div className="card bg-base-200 p-4 mb-6 flex flex-col gap-3 items-center">
        <input
          type="text"
          className="input"
          placeholder="Enter your code"
          value={joinCode}
          onChange={(e) => {
            setJoinCode(e.target.value);
            setError({ message: "", id: Date.now() });
          }}
        />
        <button className="btn btn-primary w-fit" onClick={handleJoin}>
          Join Class
        </button>
      </div>
    </div>
  );
};
