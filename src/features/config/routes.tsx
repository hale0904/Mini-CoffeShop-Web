import type { RouteObject } from 'react-router-dom';
import ListAccount from './pages/listAccount/listAccount';
import ListFeature from './pages/listFeaure/listFeaure';

export const configRoutes: RouteObject[] = [
  {
    path: 'config',
    children: [
      {
        index: true,
        element: <ListAccount />,
      },
      {
        path: 'listAccount',
        element: <ListAccount />,
      },
      {
        path: 'listFeature',
        element: <ListFeature />
      },
    ],
  },
];
