import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  clearSemesterError,
  createSemester,
  fetchSemesters,
  updateSemester,
} from "../store/slices/semesterSlice";
import type { CreateSemesterData, UpdateSemesterData } from "../types/Semester";

export const useSemester = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { semesters, loading, error } = useSelector(
    (state: RootState) => state.semester
  );

  const getSemesters = useCallback(() => {
    return dispatch(fetchSemesters());
  }, [dispatch]);

  const addSemester = useCallback(
    (semesterData: CreateSemesterData) => {
      return dispatch(createSemester(semesterData));
    },
    [dispatch]
  );

  const editSemester = useCallback(
    (semesterData: UpdateSemesterData) => {
      return dispatch(updateSemester(semesterData));
    },
    [dispatch]
  );

  const resetSemesterError = useCallback(() => {
    dispatch(clearSemesterError());
  }, [dispatch]);

  return {
    semesters,
    loading,
    error,
    getSemesters,
    addSemester,
    editSemester,
    resetSemesterError,
  };
};
