import type { RouteObject } from "react-router-dom";
import ListStaff from "./pages/listStaff/listStaff";

export const hrRoutes: RouteObject[] = [
  {
    path: 'hri',
    children: [
      {
        index: true,              // page mặc định: /hri
        element: <ListStaff />,
      },
      {
        path: 'listStaff',        // /hri/listStaff
        element: <ListStaff />,
      },
    ],
  },
];