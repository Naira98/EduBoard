import { configureStore } from "@reduxjs/toolkit";
import announcementSlice from "./slices/announcementSlice";
import authSlice from "./slices/authSlice";
import courseSlice from "./slices/courseSlice";
import gradeSlice from "./slices/gradeSlice";
import quizSlice from "./slices/quizSlice";
import semesterSlice from "./slices/semesterSlice";
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    semester: semesterSlice,
    quiz: quizSlice,
    announcement: announcementSlice,
    grades: gradeSlice,
    courses: courseSlice,
    users: userSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
