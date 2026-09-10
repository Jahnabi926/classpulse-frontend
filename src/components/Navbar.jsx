import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import ErrorToast from "./ErrorToast";
import { useState } from "react";

const Navbar = () => {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      if (err.request) {
        setError("Network error — please check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <ErrorToast error={error} />
      <div className="flex-1">
        <Link
          to={user ? "/dashboard" : "/login"}
          className="btn btn-ghost text-xl"
        >
          ClassPulse
        </Link>
      </div>
      {user && (
        <div className="flex gap-2 items-center">
          <p>Welcome, {user?.firstName}</p>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar avatar-placeholder"
            >
              <div className="bg-neutral text-neutral-content w-10 rounded-full">
                <span>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </span>
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link onClick={handleLogout}>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
