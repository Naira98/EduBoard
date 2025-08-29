import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthForm from "../components/AuthForm";
import Spinner from "../components/Spinner";
import { getRegisterConfig } from "../config/formConfigs";
import { useAuth } from "../hooks/useAuth";
import { useSemester } from "../hooks/useSemester";
import { UserRole } from "../types/Auth";
import type { FormValues } from "../types/formTypes";

const RegisterPage = () => {
  const [localError, setLocalError] = useState<string>("");
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();

  const { semesters, loading: semestersLoading, getSemesters } = useSemester();

  useEffect(() => {
    getSemesters();
  }, [getSemesters]);

  const availableSemestersForForm = semesters.map((s) => ({
    id: s._id,
    name: s.name,
  }));
  const registerConfig = getRegisterConfig(t, availableSemestersForForm);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { username, email, password, semesterId } = values;
      if (!username || !email || !password)
        throw new Error("Username, email, and password are required");

      const result = await register({
        username,
        email,
        password,
        semesterId,
        role: UserRole.student,
        courseIds: null,
      });
      if (result.type.endsWith("rejected")) {
        const error = result.payload as { message: string };
        toast(error.message, { type: "error" });
        setLocalError(error.message);
      } else {
        setLocalError("");
        navigate("/auth/login");
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  if (semestersLoading) {
    return <Spinner />;
  }

  return (
    <AuthForm
      config={registerConfig}
      onSubmit={handleSubmit}
      error={localError}
    />
  );
};

export default RegisterPage;
