import { Navigate, type RouteObject } from "react-router-dom";
import PrivateLayout from "../../routes/privateRoute";
import LayoutDefault from "./layout-default/layout-default";
import { hrRoutes } from "../hri/routes";
import { configRoutes } from "../config/routes";
import { productRoutes } from "../product/routes";

export const layoutRoutes: RouteObject[] = [
  {
    element: <PrivateLayout />, // check login
    children: [
      {
        path: '/',
        element: <LayoutDefault />, // layout
        children: [
          {
            index: true,
            element: <Navigate to="/hr" />
          },
          ...hrRoutes,
          ...configRoutes,
          ...productRoutes,
        ],
      },
    ],
  },
];
