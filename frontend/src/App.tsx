import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AppLayoutNavbar from "./components/Layouts/AppLayoutNavbar";
import AppLayoutSidebar from "./components/Layouts/AppLayoutSidebar";
import ProfessorLayoutSidbar from "./components/Layouts/ProfessorLayoutSidebar";
import GuestOnlyRoute from "./components/authorization/GusetOnlyRoutes";
import RoleBasedRoute from "./components/authorization/RoleBasedRoutes";
import AnnouncementDetailPage from "./pages/AnnouncementDetailPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import MyGradesPage from "./pages/MyGradesPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfessorCoursesPage from "./pages/ProfessorCoursesPage";
import ProfessorQuizSubmissionsPage from "./pages/ProfessorQuizSubmissionPage";
import ProfessorQuizzesPage from "./pages/ProfessorQuizzesPage";
import QuizPage from "./pages/QuizPage";
import RegisterPage from "./pages/RegisterPage";
import StudentAnnouncementsPage from "./pages/StudentAnnouncementsPage";
import StudentQuizzesPage from "./pages/StudentQuizzesPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CustomThemeProvider from "./theme/ThemeProvider";
import { UserRole } from "./types/Auth";
import "./utils/lang";

const App = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    window.document.dir = i18n.dir();
    document.documentElement.setAttribute("lang", i18n.language);
  }, [t, i18n]);

  return (
    <CustomThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Guest-Only routes */}
          <Route path="/auth" element={<GuestOnlyRoute />}>
            <Route element={<AppLayoutNavbar />}>
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
            </Route>
          </Route>

          {/* Students-Only routes */}
          <Route element={<RoleBasedRoute allowedRoles={[UserRole.student]} />}>
            <Route path="/" element={<AppLayoutSidebar />}>
              <Route index element={<DashboardPage />} />
              <Route
                path="/announcements/:id"
                element={<AnnouncementDetailPage />}
              />
              <Route path="/quiz/start/:quizId" element={<QuizPage />} />
              <Route path="/my-grades" element={<MyGradesPage />} />
              <Route path="/quizzes" element={<StudentQuizzesPage />} />
              <Route
                path="/announcements"
                element={<StudentAnnouncementsPage />}
              />
            </Route>
          </Route>

          {/* Professors-Only routes */}
          <Route
            element={<RoleBasedRoute allowedRoles={[UserRole.professor]} />}
          >
            <Route element={<ProfessorLayoutSidbar />}>
              <Route
                path="/professor/courses"
                element={<ProfessorCoursesPage />}
              />
              <Route
                path="/professor/quizzes"
                element={<ProfessorQuizzesPage />}
              />
              <Route
                path="/professor/quizzes/new"
                element={<CreateQuizPage />}
              />
              <Route
                path="/professor/quizzes/:quizId/submissions"
                element={<ProfessorQuizSubmissionsPage />}
              />
              {/* <Route path="/professor/announcements" element={} />
              <Route path="/professor/grades" element={} /> */}
            </Route>
          </Route>

          {/* Managers-Only routes */}
          <Route
            element={<RoleBasedRoute allowedRoles={[UserRole.manager]} />}
          ></Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </CustomThemeProvider>
  );
};

export default App;
