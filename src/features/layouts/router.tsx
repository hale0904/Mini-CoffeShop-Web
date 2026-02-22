import type { RouteObject } from "react-router-dom";
import PrivateLayout from "../../routes/privateRoute";
import LayoutDefault from "./layout-default/layout-default";
import { hrRoutes } from "../hri/routes";

export const layoutRoutes: RouteObject[] = [
  {
    element: <PrivateLayout />, // check login
    children: [
      {
        path: '/',
        element: <LayoutDefault />, // layout
        children: [
          ...hrRoutes,
        ],
      },
    ],
  },
];
