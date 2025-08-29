import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiReq from "../../utils/apiReq";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { UserRole } from "../../types/Auth";
import type {
  UserManaged,
  CourseOption,
  CreateNewUserData,
} from "../../types/UserManaged";

interface UsersState {
  users: UserManaged[];
  availableCourses: CourseOption[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  availableCourses: [],
  loading: false,
  error: null,
};

export const createManagerOrProfessor = createAsyncThunk<
  UserManaged,
  CreateNewUserData,
  { rejectValue: string }
>("users/createManagerOrProfessor", async (userData, { rejectWithValue }) => {
  try {
    const response = await apiReq("POST", "/auth/manager/users", userData);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to create user.");
    }
    const data: { id: string; role: UserRole; message: string } =
      await response.json();
    return {
      _id: data.id,
      role: data.role,
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAllCoursesForManager = createAsyncThunk<
  CourseOption[],
  undefined,
  { rejectValue: string }
>("users/fetchAllCoursesForManager", async (_, { rejectWithValue }) => {
  try {
    const response = await apiReq("GET", "/courses");
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || "Failed to fetch courses.");
    }
    const data: CourseOption[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
    resetUsersState: (state) => {
      state.users = [];
      state.availableCourses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createManagerOrProfessor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createManagerOrProfessor.fulfilled,
        (state, action: PayloadAction<UserManaged>) => {
          state.loading = false;
          state.users.push(action.payload);
        }
      )
      .addCase(createManagerOrProfessor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllCoursesForManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCoursesForManager.fulfilled,
        (state, action: PayloadAction<CourseOption[]>) => {
          state.loading = false;
          state.availableCourses = action.payload;
        }
      )
      .addCase(fetchAllCoursesForManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.availableCourses = [];
      });
  },
});

export const { clearUsersError, resetUsersState } = usersSlice.actions;
export default usersSlice.reducer;
