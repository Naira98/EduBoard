import { Box, InputAdornment, TextField } from "@mui/material";
import { useField } from "react-final-form";
import type { FormField as FormFieldType } from "../types/formTypes";

interface FormFieldProps {
  field: FormFieldType;
}

const FormField = ({ field }: FormFieldProps) => {
  const wrappedValidation = field.validation
    ? (value: string, allValues?: object) => {
        const stringValues = allValues as Record<string, string>;
        return field.validation!(value, stringValues);
      }
    : undefined;

  const {
    input,
    meta: { touched, error, submitError },
  } = useField(field.name, {
    validate: wrappedValidation,
  });

  const showError = (touched && error) || (submitError && !touched);

  return (
    <Box
      sx={{
        width: "100%",
        padding: 1,
      }}
    >
      <TextField
        {...input}
        fullWidth
        label={field.label}
        type={field.type}
        required={field.required}
        autoComplete={field.autoComplete}
        autoFocus={field.autoFocus}
        error={!!showError}
        helperText={showError ? error || submitError : ""}
        InputProps={{
          startAdornment: field.startIcon ? (
            <InputAdornment position="start">{field.startIcon}</InputAdornment>
          ) : undefined,
          endAdornment: field.endIcon ? (
            <InputAdornment position="end">{field.endIcon}</InputAdornment>
          ) : undefined,
        }}
      />
    </Box>
  );
};

export default FormField;
