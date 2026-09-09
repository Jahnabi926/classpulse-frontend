import axios from "axios";
import { useState } from "react";
import BASE_URL from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import ErrorToast from "./ErrorToast";

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data?.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        // server responded with an error (e.g. wrong credentials)
        setError(error.response.data || "Invalid email or password.");
      } else if (error.request) {
        // request sent, no response came back
        setError("Network error — please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data?.data));
      navigate("/profile");
    } catch (error) {
      if (error.response) {
        // server responded with an erroro (e.g. wrong credentials)
        setError(error.response.data || "Sign up failed.");
      } else if (error.request) {
        // request sent, no response came back
        setError("Network error — please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="flex justify-center my-10">
      <ErrorToast key={error} error={error} />
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="mx-auto">
          <legend className="fieldset-legend">
            {isLoginForm ? "Login" : "SignUp"}
          </legend>
        </div>
        {!isLoginForm && (
          <>
            {" "}
            <label className="label">First Name</label>
            <input
              type="text"
              className="input"
              placeholder="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label className="label">Last Name</label>
            <input
              type="text"
              className="input"
              placeholder="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-neutral mt-4"
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {isLoginForm ? "Login" : "SignUp"}
        </button>
        <p
          className=" mx-auto py-5 cursor-pointer"
          onClick={() => setIsLoginForm(!isLoginForm)}
        >
          {isLoginForm ? "New User ? Sign Up" : "Existing user ? Login here"}
        </p>
      </fieldset>
    </div>
  );
};

export default Login;
