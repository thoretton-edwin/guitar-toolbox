import { createBrowserRouter } from "react-router";
import { HomeRoute } from "../routes/home-route";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoute />,
  },
]);
