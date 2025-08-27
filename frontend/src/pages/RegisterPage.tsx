import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { getRegisterConfig } from "../config/formConfigs";
import { useAuth } from "../hooks/useAuth";
import type { FormValues } from "../types/formTypes";

const RegisterPage = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const { t } = useTranslation();
  const registerConfig = getRegisterConfig(t);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { username, email, password } = values;
      if (!username || !email || !password)
        throw new Error("Username, email, and password are required");

      register({ username, email, password });
      setError("");
      navigate("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <AuthForm config={registerConfig} onSubmit={handleSubmit} error={error} />
  );
};

export default RegisterPage;
