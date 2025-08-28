import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useField } from "react-final-form";
import type {
  FormField as FormFieldType,
  SelectFormField,
} from "../types/formTypes";

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

  const isSelectField = (field: FormFieldType): field is SelectFormField => {
    return field.type === "select";
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: 1,
      }}
    >
      {isSelectField(field) ? (
        <FormControl fullWidth required={field.required} error={!!showError}>
          <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
          <Select
            labelId={`${field.name}-label`}
            {...input}
            label={field.label}
            fullWidth
            error={!!showError}
          >
            <MenuItem value="">
              <em>{field.label}</em>
            </MenuItem>
            {field.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {showError && (
            <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 0.5 }}>
              {error || submitError}
            </Box>
          )}
        </FormControl>
      ) : (
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
              <InputAdornment position="start">
                {field.startIcon}
              </InputAdornment>
            ) : undefined,
            endAdornment: field.endIcon ? (
              <InputAdornment position="end">{field.endIcon}</InputAdornment>
            ) : undefined,
          }}
        />
      )}
    </Box>
  );
};

export default FormField;
