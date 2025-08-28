import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  clearCurrentGrade,
  clearGradesError,
  fetchMyGrades,
  fetchQuizGrades,
  resetGradesState,
  submitQuizAnswers,
} from "../store/slices/gradeSlice";
import type { GetMyGradesParams, SubmitQuizData } from "../types/Grade";

export const useGrade = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { myGrades, quizGrades, currentGrade, loading, error } = useSelector(
    (state: RootState) => state.grades
  );

  const submit = useCallback(
    (submissionData: SubmitQuizData) => {
      return dispatch(submitQuizAnswers(submissionData));
    },
    [dispatch]
  );

  const fetchAll = useCallback(
    (params?: GetMyGradesParams) => {
      return dispatch(fetchMyGrades(params));
    },
    [dispatch]
  );

  const fetchByQuizId = useCallback(
    (quizId: string) => {
      return dispatch(fetchQuizGrades(quizId));
    },
    [dispatch]
  );

  const resetError = useCallback(() => {
    dispatch(clearGradesError());
  }, [dispatch]);

  const resetCurrentGrade = useCallback(() => {
    dispatch(clearCurrentGrade());
  }, [dispatch]);

  const resetGrades = useCallback(() => {
    dispatch(resetGradesState());
  }, [dispatch]);

  return {
    myGrades,
    quizGrades,
    currentGrade,
    loading,
    error,
    submit,
    fetchAll,
    fetchByQuizId,
    resetError,
    resetCurrentGrade,
    resetGrades,
  };
};
