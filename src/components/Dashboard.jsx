import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { CreateClassForm, JoinClassForm } from "./ClassForm";

const Dashboard = () => {
  const user = useSelector((store) => store.user);
  const [myClasses, setMyClasses] = useState(null);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await axios.get(BASE_URL + "/class/my-classes", {
        withCredentials: true,
      });
      setMyClasses(res.data?.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (!user) return null;
  const { role, firstName } = user;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">Hi, {firstName}</h1>
      {role === "teacher" ? (
        <CreateClassForm onCreated={fetchClasses} />
      ) : (
        <JoinClassForm onJoined={fetchClasses} />
      )}
      <div className="grid gap-3">
        {myClasses === null && <p className="opacity-60">Loading classes...</p>}
        {myClasses?.length === 0 && (
          <p className="opacity-60">No classes yet.</p>
        )}
        <h1 className="text-2xl font-semibold mb-6 mx-auto">Your Classes</h1>
        {myClasses?.map((c) => (
          <div
            key={c._id}
            onClick={() => navigate(`/class/${c._id}`)}
            className="card bg-base-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center gap-6">
              <div>
                <p className="font-semibold">{c.className}</p>
                <p className="text-sm opacity-70">{c.subject}</p>
              </div>
              {role === "teacher" && (
                <span className="badge badge-outline">{c.joinCode}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
