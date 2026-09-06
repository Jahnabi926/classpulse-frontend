import { createBrowserRouter } from "react-router-dom";
import Body from "./components/Body";

const AppRouter = createBrowserRouter([
  {
    path: "",
    Component: Body,
    children: [{}],
  },
]);

export default AppRouter;
