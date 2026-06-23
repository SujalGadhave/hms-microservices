import { Navigate, Outlet } from 'react-router-dom';

interface Props { 
  allowedRoles: string[]; 
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole') ?? '';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Support both new 'ROLE_ADMIN' format and old 'admin' format from fake auth
  const hasAccess = allowedRoles.some(r => role === r || role === r.replace('ROLE_', '').toLowerCase());

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
