import { configureStore } from "@reduxjs/toolkit";
import announcementSlice from "./slices/announcementSlice";
import authSlice from "./slices/authSlice";
import gradeSlice from "./slices/gradeSlice";
import quizSlice from "./slices/quizSlice";
import semesterSlice from "./slices/semesterSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    semester: semesterSlice,
    quiz: quizSlice,
    announcement: announcementSlice,
    grades: gradeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
