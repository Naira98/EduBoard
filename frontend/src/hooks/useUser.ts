import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  createManagerOrProfessor,
  fetchAllCoursesForManager,
  clearUsersError,
  resetUsersState,
} from "../store/slices/userSlice";
import type { CreateNewUserData } from "../types/UserManaged";

export const useUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, availableCourses, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  const createUser = useCallback(
    (userData: CreateNewUserData) => {
      return dispatch(createManagerOrProfessor(userData));
    },
    [dispatch]
  );

  const fetchAllCourses = useCallback(() => {
    return dispatch(fetchAllCoursesForManager());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearUsersError());
  }, [dispatch]);

  const resetUsers = useCallback(() => {
    dispatch(resetUsersState());
  }, [dispatch]);

  return {
    users,
    availableCourses,
    loading,
    error,
    createUser,
    fetchAllCourses,
    resetError,
    resetUsers,
  };
};
