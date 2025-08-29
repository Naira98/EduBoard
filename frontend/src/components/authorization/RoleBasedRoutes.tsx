import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../store/hook";
import type { UserRole } from "../../types/Auth";
import { getTokens } from "../../utils/tokens";
import Spinner from "../Spinner";

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

export default function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  const { getMe } = useAuth();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const { accessToken } = getTokens();
    if (accessToken) {
      getMe();
    }
  }, [getMe]);

  if (loading) return <Spinner />;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  if (!allowedRoles.includes(user!.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
