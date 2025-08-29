import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  CreateQuizData,
  GetAllQuizzesParams,
  Quiz,
  UpdateQuizData,
} from "../../types/Quiz";
import apiReq from "../../utils/apiReq";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  loading: true,
  error: null,
};

export const createQuiz = createAsyncThunk<
  Quiz,
  CreateQuizData,
  { rejectValue: string }
>("quiz/createQuiz", async (quizData, { rejectWithValue }) => {
  try {
    const response = await apiReq("POST", "/quizzes", quizData);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to create quiz.");
    }
    const data: { quiz: Quiz; message: string } = await response.json();
    return data.quiz;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllQuizzes = createAsyncThunk<
  Quiz[],
  GetAllQuizzesParams | undefined,
  { rejectValue: string }
>("quiz/fetchAllQuizzes", async (params, { rejectWithValue }) => {
  try {
    const queryString = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const response = await apiReq("GET", `/quizzes?${queryString}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch quizzes.");
    }
    const data: Quiz[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchQuizById = createAsyncThunk<
  Quiz,
  string,
  { rejectValue: string }
>("quiz/fetchQuizById", async (quizId, { rejectWithValue }) => {
  try {
    const response = await apiReq("GET", `/quizzes/${quizId}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch quiz.");
    }
    const data: Quiz = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateQuiz = createAsyncThunk<
  Quiz,
  UpdateQuizData,
  { rejectValue: string }
>("quiz/updateQuiz", async ({ id, ...fields }, { rejectWithValue }) => {
  try {
    const response = await apiReq("PUT", `/quizzes/${id}`, fields);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to update quiz.");
    }
    const data: { quiz: Quiz; message: string } = await response.json();
    return data.quiz;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteQuiz = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("quiz/deleteQuiz", async (quizId, { rejectWithValue }) => {
  try {
    const response = await apiReq("DELETE", `/quizzes/${quizId}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to delete quiz.");
    }
    await response.json();
    return quizId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearQuizError: (state) => {
      state.error = null;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.loading = false;
        state.quizzes.push(action.payload);
        state.currentQuiz = action.payload;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllQuizzes.fulfilled,
        (state, action: PayloadAction<Quiz[]>) => {
          state.loading = false;
          state.quizzes = action.payload;
        }
      )
      .addCase(fetchAllQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.quizzes = [];
      })

      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentQuiz = null;
      })
      .addCase(
        fetchQuizById.fulfilled,
        (state, action: PayloadAction<Quiz>) => {
          state.loading = false;
          state.currentQuiz = action.payload;
        }
      )
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentQuiz = null;
      })

      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.loading = false;
        const index = state.quizzes.findIndex(
          (q) => q._id === action.payload._id
        );
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        if (state.currentQuiz?._id === action.payload._id) {
          state.currentQuiz = action.payload;
        }
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.quizzes = state.quizzes.filter(
          (quiz) => quiz._id !== action.payload
        );
        if (state.currentQuiz?._id === action.payload) {
          state.currentQuiz = null;
        }
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearQuizError, clearCurrentQuiz } = quizSlice.actions;
export default quizSlice.reducer;
