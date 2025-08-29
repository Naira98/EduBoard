import HomeIcon from "@mui/icons-material/Home";
import { Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/Auth";
import { getHomePath } from "../utils/getHomePath";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    const homePath = getHomePath(user?.role || UserRole.student);
    navigate(homePath);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: "center", borderRadius: 2 }}>
        <Typography
          variant="h1"
          color="primary"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Oops! The page you are looking for does not exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
          sx={{ borderRadius: 2, px: 4, py: 1.5 }}
        >
          Go to Homepage
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
