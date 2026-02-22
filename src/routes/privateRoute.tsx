import { Navigate, Outlet } from 'react-router-dom';
import AuthHelper from '../shared/auth/auth.helper';

const PrivateLayout = () => {
  const token = AuthHelper.getAccessToken();
  console.log('TOKEN CHECK:', token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default PrivateLayout;
