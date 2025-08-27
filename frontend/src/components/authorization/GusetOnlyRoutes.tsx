import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../store/hook";
import { getTokens } from "../../utils/tokens";
import Spinner from "../Spinner";

export default function GuestOnlyRoute() {
  const { getMe } = useAuth();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const { accessToken } = getTokens();
    if (accessToken) {
      getMe();
    }
  }, [getMe]);

  if (loading) return <Spinner />;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
