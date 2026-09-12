import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";

const Body = () => {
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(!userData);

  const fetchUser = async () => {
    try {
      if (userData) {
        return;
      } // already have the user, skip refetch

      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true, // withCredentials required , Otherwise the cookie won't be sent and you'll get 401s even when logged in.
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setCheckingAuth(false); // only ever runs after the await — deferred, not synchronous
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
