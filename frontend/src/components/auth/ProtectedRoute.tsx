import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  allowedRoles: string[];
}

/**
 * RBAC guard component.
 * - If no token → redirect to /login (unauthenticated)
 * - If token but wrong role → redirect to /unauthorized (authenticated but forbidden)
 */
const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole') ?? '';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role stored as e.g. "ROLE_ADMIN". Match against the provided list directly.
  const hasAccess = allowedRoles.includes(role);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
