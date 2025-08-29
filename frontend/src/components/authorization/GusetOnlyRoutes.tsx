import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../store/hook";
import { getHomePath } from "../../utils/getHomePath";
import { getTokens } from "../../utils/tokens";
import Spinner from "../Spinner";

export default function GuestOnlyRoute() {
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

  if (isAuthenticated && user?.role)
    return <Navigate to={getHomePath(user.role)} replace />;

  return <Outlet />;
}
