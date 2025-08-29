import { Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useAuth } from "../hooks/useAuth";
import { getHomePath } from "../utils/getHomePath";

const NotAuthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRedirect = () => {
    if (user) {
      navigate(getHomePath(user.role));
    } else {
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 5, textAlign: "center", borderRadius: 2 }}>
        <Typography
          variant="h1"
          color="error"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          403
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You do not have permission to view this page. Please contact your
          administrator if you believe this is an error.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={user ? <DashboardIcon /> : <LockIcon />}
          onClick={handleRedirect}
          sx={{ borderRadius: 2, px: 4, py: 1.5 }}
        >
          {user ? "Go to Dashboard" : "Log In"}
        </Button>
      </Paper>
    </Container>
  );
};

export default NotAuthorizedPage;
