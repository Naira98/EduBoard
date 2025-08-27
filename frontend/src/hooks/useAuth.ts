import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  clearError,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    (credentials: { email: string; password: string }) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: { username: string; email: string; password: string }) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const getMe = useCallback(() => {
    return dispatch(getUser());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    getMe,
    resetError,
  };
};
