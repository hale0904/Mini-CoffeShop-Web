import type { RouteObject } from 'react-router-dom';
import ListStaff from './pages/listStaff/listStaff';

export const hrRoutes: RouteObject[] = [
  {
    path: 'hr',
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
