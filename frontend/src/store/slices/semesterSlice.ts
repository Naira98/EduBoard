import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  CreateSemesterData,
  Semester,
  UpdateSemesterData,
} from "../../types/Semester";
import apiReq from "../../utils/apiReq";
import { getErrorMessage } from "../../utils/getErrorMessage";
import publicApiReq from "../../utils/publicApiReq";

interface SemesterState {
  semesters: Semester[];
  loading: boolean;
  error: string | null;
}

const initialState: SemesterState = {
  semesters: [],
  loading: true,
  error: null,
};

export const fetchSemesters = createAsyncThunk<Semester[], void>(
  "semester/fetchSemesters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await publicApiReq("GET", "/semesters");

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(getErrorMessage(errorData));
      }

      const data: Semester[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createSemester = createAsyncThunk<
  Semester,
  CreateSemesterData,
  { rejectValue: string }
>(
  "semester/createSemester",
  async (semesterData: CreateSemesterData, { rejectWithValue }) => {
    try {
      const response = await apiReq("POST", "/semesters", semesterData);

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(getErrorMessage(errorData));
      }

      const data: { message: string; semester: Semester } =
        await response.json();
      return data.semester;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateSemester = createAsyncThunk<Semester, UpdateSemesterData>(
  "semester/updateSemester",
  async ({ id, name }: UpdateSemesterData, { rejectWithValue }) => {
    try {
      const response = await apiReq("PUT", `/semesters/${id}`, { name });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(getErrorMessage(errorData));
      }

      const data: { message: string; semester: Semester } =
        await response.json();
      return data.semester;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const semesterSlice = createSlice({
  name: "semester",
  initialState,
  reducers: {
    clearSemesterError: (state) => {
      state.error = null;
    },
    setSemesters: (state, action: PayloadAction<Semester[]>) => {
      state.semesters = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSemesters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSemesters.fulfilled,
        (state, action: PayloadAction<Semester[]>) => {
          state.loading = false;
          state.semesters = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSemesters.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch semesters.";
      })
      .addCase(createSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createSemester.fulfilled,
        (state, action: PayloadAction<Semester>) => {
          state.loading = false;
          state.semesters.push(action.payload);
          state.error = null;
        }
      )
      .addCase(createSemester.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to create semester.";
      })
      .addCase(updateSemester.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateSemester.fulfilled,
        (state, action: PayloadAction<Semester>) => {
          state.loading = false;
          const index = state.semesters.findIndex(
            (s) => s._id === action.payload._id
          );
          if (index !== -1) {
            state.semesters[index] = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(updateSemester.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update semester.";
      });
  },
});

export const { clearSemesterError, setSemesters } = semesterSlice.actions;
export default semesterSlice.reducer;
