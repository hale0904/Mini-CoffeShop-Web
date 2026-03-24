import { Navigate, Outlet } from 'react-router-dom';
import AuthHelper from '../shared/auth/auth.helper';

const PrivateLayout = () => {
   if (!AuthHelper.isAuthenticated()) {
    AuthHelper.logout();
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateLayout;
