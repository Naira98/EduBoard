import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  Grid,
} from "@mui/material";
import { Form } from "react-final-form";
import { Link as RouterLink } from "react-router-dom";
import type { FormConfig, FormValues } from "../types/formTypes";
import FormField from "./FormField";

interface AuthFormProps {
  config: FormConfig;
  onSubmit: (values: FormValues) => void | Promise<void>;
  error?: string;
  initialValues?: FormValues;
}

const AuthForm = ({
  config,
  onSubmit,
  error,
  initialValues,
}: AuthFormProps) => {
  const validate = (values: FormValues) => {
    const errors: Record<string, string> = {};

    config.fields.forEach((field) => {
      if (field.validation) {
        const errorMessage = field.validation(values[field.name], values);
        if (errorMessage) {
          errors[field.name] = errorMessage;
        }
      }
    });

    return errors;
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {config.title}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Form
            onSubmit={onSubmit}
            validate={validate}
            initialValues={initialValues}
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {config.fields.map((field) => (
                    <FormField key={field.name} field={field} />
                  ))}
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={submitting}
                >
                  {config.submitButtonText}
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2" component="span">
                    {config.linkDescription}{" "}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to={config.linkPath}
                    variant="body2"
                  >
                    {config.linkText}
                  </Link>
                </Box>
              </form>
            )}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthForm;
