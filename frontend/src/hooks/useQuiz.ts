import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  clearCurrentQuiz,
  clearQuizError,
  createQuiz,
  deleteQuiz,
  fetchAllQuizzes,
  fetchQuizById,
  updateQuiz,
} from "../store/slices/quizSlice";
import type {
  CreateQuizData,
  GetAllQuizzesParams,
  UpdateQuizData,
} from "../types/Quiz";

export const useQuiz = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, currentQuiz, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );

  const create = useCallback(
    (quizData: CreateQuizData) => {
      return dispatch(createQuiz(quizData));
    },
    [dispatch]
  );

  const fetchAll = useCallback(
    (params?: GetAllQuizzesParams) => {
      return dispatch(fetchAllQuizzes(params));
    },
    [dispatch]
  );

  const fetchById = useCallback(
    (quizId: string) => {
      return dispatch(fetchQuizById(quizId));
    },
    [dispatch]
  );

  const update = useCallback(
    (updateData: UpdateQuizData) => {
      return dispatch(updateQuiz(updateData));
    },
    [dispatch]
  );

  const remove = useCallback(
    (quizId: string) => {
      return dispatch(deleteQuiz(quizId));
    },
    [dispatch]
  );

  const resetError = useCallback(() => {
    dispatch(clearQuizError());
  }, [dispatch]);

  const resetCurrentQuiz = useCallback(() => {
    dispatch(clearCurrentQuiz());
  }, [dispatch]);

  return {
    quizzes,
    currentQuiz,
    loading,
    error,
    create,
    fetchAll,
    fetchById,
    update,
    remove,
    resetError,
    resetCurrentQuiz,
  };
};
