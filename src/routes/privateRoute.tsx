import { Navigate, Outlet } from 'react-router-dom';
import AuthHelper from '../shared/auth/auth.helper';

const PrivateLayout = () => {
  const token = AuthHelper.isAuthenticated();
  if (!token) {
    AuthHelper.logout();
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateLayout;
