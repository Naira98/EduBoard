import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiReq from "../../utils/apiReq";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type {
  Course,
  CreateCourseData,
  GetAllCoursesParams,
  UpdateCourseData,
} from "../../types/Course";

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: true,
  error: null,
};

export const createCourse = createAsyncThunk<
  Course,
  CreateCourseData,
  { rejectValue: string }
>("courses/createCourse", async (courseData, { rejectWithValue }) => {
  try {
    const response = await apiReq("POST", "/courses", courseData);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to create course.");
    }
    const data: { course: Course; message: string } = await response.json();
    return data.course;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllCourses = createAsyncThunk<
  Course[],
  GetAllCoursesParams | undefined,
  { rejectValue: string }
>("courses/fetchAllCourses", async (params, { rejectWithValue }) => {
  try {
    const queryString = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const response = await apiReq("GET", `/courses?${queryString}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch courses.");
    }
    const data: Course[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchCourseById = createAsyncThunk<
  Course,
  string,
  { rejectValue: string }
>("courses/fetchCourseById", async (courseId, { rejectWithValue }) => {
  try {
    const response = await apiReq("GET", `/courses/${courseId}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch course.");
    }
    const data: Course = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateCourse = createAsyncThunk<
  Course,
  UpdateCourseData,
  { rejectValue: string }
>("courses/updateCourse", async ({ id, ...fields }, { rejectWithValue }) => {
  try {
    const response = await apiReq("PUT", `/courses/${id}`, fields);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to update course.");
    }
    const data: { course: Course; message: string } = await response.json();
    return data.course;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteCourse = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("courses/deleteCourse", async (courseId, { rejectWithValue }) => {
  try {
    const response = await apiReq("DELETE", `/courses/${courseId}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to delete course.");
    }

    await response.json();
    return courseId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseError: (state) => {
      state.error = null;
    },

    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },

    resetCoursesState: (state) => {
      state.courses = [];
      state.currentCourse = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCourse.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.loading = false;
          state.courses.push(action.payload);
          state.currentCourse = action.payload;
        }
      )
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCourses.fulfilled,
        (state, action: PayloadAction<Course[]>) => {
          state.loading = false;
          state.courses = action.payload;
        }
      )
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.courses = [];
      })

      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCourse = null;
      })
      .addCase(
        fetchCourseById.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.loading = false;
          state.currentCourse = action.payload;
        }
      )
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentCourse = null;
      })

      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCourse.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.loading = false;

          const index = state.courses.findIndex(
            (c) => c._id === action.payload._id
          );
          if (index !== -1) {
            state.courses[index] = action.payload;
          }

          if (state.currentCourse?._id === action.payload._id) {
            state.currentCourse = action.payload;
          }
        }
      )
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCourse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;

          state.courses = state.courses.filter(
            (course) => course._id !== action.payload
          );

          if (state.currentCourse?._id === action.payload) {
            state.currentCourse = null;
          }
        }
      )
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCourseError, clearCurrentCourse, resetCoursesState } =
  coursesSlice.actions;
export default coursesSlice.reducer;
