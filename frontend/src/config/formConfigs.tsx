import { type TFunction } from "i18next";
import type { FormConfig, FormValues } from "../types/formTypes";

export const getLoginConfig = (t: TFunction): FormConfig => ({
  title: t("signInTitle"),
  submitButtonText: t("signInButtonText"),
  linkText: t("signUpLinkText"),
  linkPath: "/register",
  linkDescription: t("signUpLinkDescription"),
  fields: [
    {
      name: "email",
      label: t("emailLabel"),
      type: "email",
      required: true,
      autoComplete: "email",
      validation: (value: string) => {
        if (!value) return t("emailRequired");
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return t("invalidEmail");
        }
        return undefined;
      },
      gridSize: { xs: 12, sm: 12 },
    },
    {
      name: "password",
      label: t("passwordLabel"),
      type: "password",
      required: true,
      autoComplete: "current-password",
      validation: (value: string) => {
        if (!value) return t("passwordRequired");
        return undefined;
      },
      gridSize: { xs: 12, sm: 12 },
    },
  ],
});

export const getRegisterConfig = (
  t: TFunction,
  availableSemesters: { id: string; name: string }[] = []
): FormConfig => ({
  title: t("createAccountTitle"),
  submitButtonText: t("signUpButtonText"),
  linkText: t("signInLinkText"),
  linkPath: "/login",
  linkDescription: t("signInLinkDescription"),
  fields: [
    {
      name: "username",
      label: t("usernameLabel"),
      type: "text",
      required: true,
      autoComplete: "given-name",
      validation: (value: string) => {
        if (!value) return t("usernameRequired");
        return undefined;
      },
      gridSize: { xs: 12, sm: 6 },
    },
    {
      name: "email",
      label: t("emailLabel"),
      type: "email",
      required: true,
      autoComplete: "email",
      validation: (value: string) => {
        if (!value) return t("emailRequired");
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return t("invalidEmail");
        }
        return undefined;
      },
      gridSize: { xs: 12, sm: 12 },
    },
    {
      name: "password",
      label: t("passwordLabel"),
      type: "password",
      required: true,
      autoComplete: "new-password",
      validation: (value: string) => {
        if (!value) return t("passwordRequired");
        if (value.length < 6) return t("passwordLength");
        return undefined;
      },
      gridSize: { xs: 12, sm: 6 },
    },
    {
      name: "confirmPassword",
      label: t("confirmPasswordLabel"),
      type: "password",
      required: true,
      autoComplete: "new-password",
      validation: (value: string, allValues?: FormValues) => {
        if (!value) return t("confirmPasswordRequired");
        if (value !== allValues?.password) return t("passwordsMismatch");
        return undefined;
      },
      gridSize: { xs: 12, sm: 6 },
    },
    {
      name: "semesterId",
      label: t("semesterLabel"),
      type: "select",
      required: true,
      options: availableSemesters.map((semester) => ({
        value: semester.id,
        label: semester.name,
      })),
      validation: (value: string) => {
        if (!value) return t("semesterRequired");
        return undefined;
      },
      gridSize: { xs: 12, sm: 12 },
    },
  ],
});
