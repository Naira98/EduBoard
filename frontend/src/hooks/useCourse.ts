import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  clearCourseError,
  clearCurrentCourse,
  createCourse,
  deleteCourse,
  fetchAllCourses,
  fetchCourseById,
  resetCoursesState,
  updateCourse,
} from "../store/slices/courseSlice";
import type {
  CreateCourseData,
  GetAllCoursesParams,
  UpdateCourseData,
} from "../types/Course";

export const useCourse = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, currentCourse, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  const create = useCallback(
    (courseData: CreateCourseData) => {
      return dispatch(createCourse(courseData));
    },
    [dispatch]
  );

  const fetchAll = useCallback(
    (params?: GetAllCoursesParams) => {
      return dispatch(fetchAllCourses(params));
    },
    [dispatch]
  );

  const fetchById = useCallback(
    (courseId: string) => {
      return dispatch(fetchCourseById(courseId));
    },
    [dispatch]
  );

  const update = useCallback(
    (updateData: UpdateCourseData) => {
      return dispatch(updateCourse(updateData));
    },
    [dispatch]
  );

  const remove = useCallback(
    (courseId: string) => {
      return dispatch(deleteCourse(courseId));
    },
    [dispatch]
  );

  const resetError = useCallback(() => {
    dispatch(clearCourseError());
  }, [dispatch]);

  const resetCurrentCourse = useCallback(() => {
    dispatch(clearCurrentCourse());
  }, [dispatch]);

  const resetCourses = useCallback(() => {
    dispatch(resetCoursesState());
  }, [dispatch]);

  return {
    courses,
    currentCourse,
    loading,
    error,
    create,
    fetchAll,
    fetchById,
    update,
    remove,
    resetError,
    resetCurrentCourse,
    resetCourses,
  };
};
