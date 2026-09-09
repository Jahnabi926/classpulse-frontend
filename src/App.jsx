import { createBrowserRouter } from "react-router-dom";
import Body from "./components/Body";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Quiz from "./components/Quiz";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    Component: Body,
    children: [
      // children are what get swapped into that <Outlet />, based on the URL.
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "class/:classId",
        Component: Quiz,
      },
    ],
  },
]);

export default AppRouter;
