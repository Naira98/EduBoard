import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAnnouncement } from "../hooks/useAnnouncement";

const AnnouncementDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentAnnouncement,
    loading,
    error,
    fetchById,
    resetCurrentAnnouncement,
    resetError,
  } = useAnnouncement();

  useLayoutEffect(() => {
    if (id) {
      fetchById(id);
    }
    return () => {
      resetCurrentAnnouncement();
      resetError();
    };
  }, [id, fetchById, resetCurrentAnnouncement, resetError]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error loading announcement:
          </Typography>
          <Typography variant="body1">{error}</Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!currentAnnouncement) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Announcement not found.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            {currentAnnouncement.title}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-line" }}>
          {currentAnnouncement.content}
        </Typography>

        <Typography component="div" variant="body2" sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'medium' }}>Semester:</Box> {currentAnnouncement.semester?.name || 'N/A'}
          </Typography>
          <Typography component="div" variant="body2" sx={{ mb: 0.5 }}>
            <Box component="span" sx={{ fontWeight: 'medium' }}>Author:</Box> {currentAnnouncement.author?.username || 'N/A'} (Role:{" "}
            {currentAnnouncement.author?.role || "N/A"})
          </Typography>
        <Typography
          variant="caption"
          display="block"
          sx={{ mt: 4, textAlign: "right", color: "text.disabled" }}
        >
          Posted On: {new Date(currentAnnouncement.createdAt).toLocaleString()}
        </Typography>
        <Typography
          variant="caption"
          display="block"
          sx={{ textAlign: "right", color: "text.disabled" }}
        >
          Last Updated:{" "}
          {new Date(currentAnnouncement.updatedAt).toLocaleString()}
        </Typography>
      </Paper>
    </Container>
  );
};

export default AnnouncementDetailPage;
