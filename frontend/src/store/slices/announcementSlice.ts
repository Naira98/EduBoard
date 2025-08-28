import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiReq from "../../utils/apiReq";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type {
  Announcement,
  CreateAnnouncementData,
  GetAllAnnouncementsParams,
  UpdateAnnouncementData,
} from "../../types/Announcement";

interface AnnouncementState {
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  currentAnnouncement: null,
  loading: false,
  error: null,
};

export const createAnnouncement = createAsyncThunk<
  Announcement,
  CreateAnnouncementData,
  { rejectValue: string }
>(
  "announcement/createAnnouncement",
  async (announcementData, { rejectWithValue }) => {
    try {
      const response = await apiReq("POST", "/announcements", announcementData);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to create announcement."
        );
      }
      const data: { announcement: Announcement; message: string } =
        await response.json();
      return data.announcement;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAllAnnouncements = createAsyncThunk<
  Announcement[],
  GetAllAnnouncementsParams | undefined,
  { rejectValue: string }
>("announcement/fetchAllAnnouncements", async (params, { rejectWithValue }) => {
  try {
    const queryString = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const response = await apiReq("GET", `/announcements?${queryString}`);
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(
        errorData.message || "Failed to fetch announcements."
      );
    }
    const data: Announcement[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAnnouncementById = createAsyncThunk<
  Announcement,
  string,
  { rejectValue: string }
>(
  "announcement/fetchAnnouncementById",
  async (announcementId, { rejectWithValue }) => {
    try {
      const response = await apiReq("GET", `/announcements/${announcementId}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch announcement."
        );
      }
      const data: Announcement = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateAnnouncement = createAsyncThunk<
  Announcement,
  UpdateAnnouncementData,
  { rejectValue: string }
>(
  "announcement/updateAnnouncement",
  async ({ id, ...fields }, { rejectWithValue }) => {
    try {
      const response = await apiReq("PUT", `/announcements/${id}`, fields);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to update announcement."
        );
      }
      const data: { announcement: Announcement; message: string } =
        await response.json();
      return data.announcement;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAnnouncement = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "announcement/deleteAnnouncement",
  async (announcementId, { rejectWithValue }) => {
    try {
      const response = await apiReq(
        "DELETE",
        `/announcements/${announcementId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to delete announcement."
        );
      }
      await response.json();
      return announcementId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    clearAnnouncementError: (state) => {
      state.error = null;
    },
    clearCurrentAnnouncement: (state) => {
      state.currentAnnouncement = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAnnouncement.fulfilled,
        (state, action: PayloadAction<Announcement>) => {
          state.loading = false;
          state.announcements.push(action.payload);
          state.currentAnnouncement = action.payload;
        }
      )
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllAnnouncements.fulfilled,
        (state, action: PayloadAction<Announcement[]>) => {
          state.loading = false;
          state.announcements = action.payload;
        }
      )
      .addCase(fetchAllAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.announcements = [];
      })

      .addCase(fetchAnnouncementById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentAnnouncement = null;
      })
      .addCase(
        fetchAnnouncementById.fulfilled,
        (state, action: PayloadAction<Announcement>) => {
          state.loading = false;
          state.currentAnnouncement = action.payload;
        }
      )
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentAnnouncement = null;
      })

      .addCase(updateAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAnnouncement.fulfilled,
        (state, action: PayloadAction<Announcement>) => {
          state.loading = false;
          const index = state.announcements.findIndex(
            (a) => a._id === action.payload._id
          );
          if (index !== -1) {
            state.announcements[index] = action.payload;
          }
          if (state.currentAnnouncement?._id === action.payload._id) {
            state.currentAnnouncement = action.payload;
          }
        }
      )
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAnnouncement.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.announcements = state.announcements.filter(
            (announcement) => announcement._id !== action.payload
          );
          if (state.currentAnnouncement?._id === action.payload) {
            state.currentAnnouncement = null;
          }
        }
      )
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnnouncementError, clearCurrentAnnouncement } =
  announcementSlice.actions;
export default announcementSlice.reducer;
