import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterSlice from "./slices/semesterSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    semester: semesterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
