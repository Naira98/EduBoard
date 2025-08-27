import type { ReactNode } from "react";

export type FieldValidator<T> = (
  value: T,
  allValues?: Record<string, string>,
  meta?: { form?: string; field?: string }
) => string | undefined;

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "tel" | "url";
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  validation?: FieldValidator<string>;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  gridSize?: {
    xs: number;
    sm: number;
  };
}

export interface FormConfig {
  fields: FormField[];
  submitButtonText: string;
  title: string;
  linkText: string;
  linkPath: string;
  linkDescription: string;
}

export interface FormValues {
  [key: string]: string;
}

export interface FormMeta {
  form?: string;
  field?: string;
}
