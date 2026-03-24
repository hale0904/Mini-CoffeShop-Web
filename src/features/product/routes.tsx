import type { RouteObject } from 'react-router-dom';
import  ListCategory from './pages/listCategory/listCategory';
import ListProduct from './pages/listproduct/listProduct';

export const productRoutes: RouteObject[] = [
  {
    path: 'product',
    children: [
      {
        index: true,
        element: <ListCategory />,
      },
      {
        path: 'listCategory',
        element: <ListCategory />,
      },
      {
        path: 'listProduct',
        element: <ListProduct />,
      },
    ],
  },
];
