import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  GetMyGradesParams,
  Grade,
  GradeSubmission,
  SubmitQuizData,
} from "../../types/Grade";
import apiReq from "../../utils/apiReq";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface GradeState {
  myGrades: Grade[];
  quizGrades: GradeSubmission[];
  currentGrade: Grade | null;
  loading: boolean;
  error: string | null;
}

const initialState: GradeState = {
  myGrades: [],
  quizGrades: [],
  currentGrade: null,
  loading: false,
  error: null,
};

export const submitQuizAnswers = createAsyncThunk<
  Grade,
  SubmitQuizData,
  { rejectValue: string }
>("grades/submitQuizAnswers", async (submissionData, { rejectWithValue }) => {
  try {
    const response = await apiReq(
      "POST",
      "/grades/",
      submissionData
    );
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to submit quiz.");
    }
    const data: { grade: Grade; message: string } = await response.json();
    return data.grade;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchMyGrades = createAsyncThunk<
  Grade[],
  GetMyGradesParams | undefined,
  { rejectValue: string }
>("grades/fetchMyGrades", async (params, { rejectWithValue }) => {
  try {
    const queryString = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const response = await apiReq("GET", `/grades/my-grades?${queryString}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch my grades.");
    }
    const data: Grade[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchQuizGrades = createAsyncThunk<
  GradeSubmission[],
  string,
  { rejectValue: string }
>("grades/fetchQuizGrades", async (quizId, { rejectWithValue }) => {
  try {
    const response = await apiReq("GET", `/grades/${quizId}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to fetch quiz grades."
      );
    }
    const data: GradeSubmission[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {
    clearGradesError: (state) => {
      state.error = null;
    },

    clearCurrentGrade: (state) => {
      state.currentGrade = null;
    },

    resetGradesState: (state) => {
      state.myGrades = [];
      state.quizGrades = [];
      state.currentGrade = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        submitQuizAnswers.fulfilled,
        (state, action: PayloadAction<Grade>) => {
          state.loading = false;
          state.myGrades.push(action.payload);
          state.currentGrade = action.payload;
        }
      )
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchMyGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyGrades.fulfilled,
        (state, action: PayloadAction<Grade[]>) => {
          state.loading = false;
          state.myGrades = action.payload;
        }
      )
      .addCase(fetchMyGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.myGrades = [];
      })

      .addCase(fetchQuizGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchQuizGrades.fulfilled,
        (state, action: PayloadAction<GradeSubmission[]>) => {
          state.loading = false;
          state.quizGrades = action.payload;
        }
      )
      .addCase(fetchQuizGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.quizGrades = [];
      });
  },
});

export const { clearGradesError, clearCurrentGrade, resetGradesState } =
  gradesSlice.actions;
export default gradesSlice.reducer;
