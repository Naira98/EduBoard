import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import GuestOnlyRoute from "./components/authorization/GusetOnlyRoutes";
import RoleBasedRoute from "./components/authorization/RoleBasedRoutes";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import CustomThemeProvider from "./theme/ThemeProvider";
import { UserRole } from "./types/Auth";
import "./utils/lang";
import DashboardPage from "./pages/DashboardPage";

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
          <Route element={<GuestOnlyRoute />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Students-Only routes */}
          <Route element={<RoleBasedRoute allowedRoles={[UserRole.student]} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Professors-Only routes */}
          <Route
            element={<RoleBasedRoute allowedRoles={[UserRole.professor]} />}
          ></Route>

          {/* Managers-Only routes */}
          <Route
            element={<RoleBasedRoute allowedRoles={[UserRole.manager]} />}
          ></Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </CustomThemeProvider>
  );
};

export default App;
