import { Outlet, type RouteObject } from 'react-router-dom';
import ListStaff from './pages/listStaff/listStaff';
import TypeOfContract from './pages/typeOfContract/typeOfContract';
import TypeOfPersonnel from './pages/typeOfPersonnel/typeOfPersonnel';
import TypeOfPosition from './pages/typeOfPosition/typeOfPosition';

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
      {
        path:'typeOfPersonnel',
        element: <TypeOfPersonnel />
      },
      {
        path:'contractType',
        element: <TypeOfContract />
      },
      {
        path:'listPosition',
        element: <TypeOfPosition />
      },
    ],
  },
];
