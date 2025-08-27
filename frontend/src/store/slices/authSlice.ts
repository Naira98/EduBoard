import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  TokenPayload,
  User,
} from "../../types/Auth";
import apiReq from "../../utils/apiReq";
import { getErrorMessage } from "../../utils/getErrorMessage";
import publicApiReq from "../../utils/publicApiReq";
import { clearTokens, getTokens, setTokens } from "../../utils/tokens";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials) => {
    try {
      const response = await publicApiReq("POST", "/auth/login", credentials);

      if (!response.ok) {
        const errorData = await response.json();
        return errorData.message;
      }

      const data: LoginResponse = await response.json();

      setTokens(data.accessToken, data.refreshToken);

      return {
        user: {
          id: data.user.id,
          username: data.user.username,
          email: credentials.email,
          role: data.user.role,
        },
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
      };
    } catch (error) {
      return getErrorMessage(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData) => {
    try {
      const response = await publicApiReq("POST", "/auth/register", userData);

      if (!response.ok) {
        const errorData = await response.json();
        return getErrorMessage(errorData);
      }

      const data = await response.json();
      return { message: data.message, userId: data.id };
    } catch (error) {
      return getErrorMessage(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { refreshToken } = getTokens();

      if (refreshToken) {
        try {
          await apiReq("POST", "/auth/logout", { refreshToken });
        } catch (error) {
          console.warn(
            "Logout API call failed, but proceeding with local logout" + error
          );
        }
      }
      return true;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    } finally {
      clearTokens();
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { accessToken } = getTokens();

      if (!accessToken) {
        return rejectWithValue("No access token found");
      }

      const decodedToken = jwtDecode<TokenPayload>(accessToken);

      if (Date.now() >= decodedToken.exp * 1000) {
        return rejectWithValue("Token expired");
      }

      const response = await apiReq("GET", "/auth/me");

      if (!response.ok) {
        return rejectWithValue("Failed to fetch user data");
      }

      const userData = await response.json();

      return {
        user: {
          id: decodedToken.userId,
          username: userData.username,
          email: userData.email,
          role: decodedToken.role,
        },
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
        clearTokens();
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Check auth status
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
        clearTokens();
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
