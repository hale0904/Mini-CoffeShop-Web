import { Outlet, type RouteObject } from 'react-router-dom';
import ListStaff from './pages/listStaff/listStaff';

export const hrRoutes: RouteObject[] = [
  {
    path: 'hr',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ListStaff />,
      },
      {
        path: 'listHr',
        element: <ListStaff />,
      },
    ],
  },
];
