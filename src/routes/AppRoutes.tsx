import { createBrowserRouter } from "react-router-dom";
import { layoutRoutes } from "../features/layouts/router";
import NotFound from "../features/layouts/notFound/notFound";
import { authRoutes } from "../features/login/routes";
import { hrRoutes } from "../features/hri/routes";

export const router = createBrowserRouter([
  ...authRoutes,
  ...layoutRoutes,
  {
    path: '*',
    element: <NotFound />,
  },
]);