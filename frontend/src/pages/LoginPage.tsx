import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthForm from "../components/AuthForm";
import { getLoginConfig } from "../config/formConfigs";
import { useAuth } from "../hooks/useAuth";
import type { FormValues } from "../types/formTypes";
import i18next from "i18next";

const LoginPage = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const { t } = useTranslation();
  const loginConfig = getLoginConfig(t);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { email, password } = values;
      if (!email || !password)
        throw new Error("Email and password are required");

      const result = await login({ email, password });
      if (result.type.endsWith("rejected")) {
        const error = result.payload as { message: string };
        toast(error.message, { type: "error" });
      } else {
        setError("");
        i18next.changeLanguage("en");
        navigate("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <AuthForm config={loginConfig} onSubmit={handleSubmit} error={error} />
  );
};

export default LoginPage;
