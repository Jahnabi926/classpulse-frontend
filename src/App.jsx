import { createBrowserRouter } from "react-router-dom";
import Body from "./components/Body";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Profile from "./components/Profile";

const AppRouter = createBrowserRouter([
  {
    path: "",
    Component: Body,
    children: [
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
    ],
  },
]);

export default AppRouter;
