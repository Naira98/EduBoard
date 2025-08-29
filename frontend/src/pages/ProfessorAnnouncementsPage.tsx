import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnnouncementCard from "../components/AnnouncementCard";
import Spinner from "../components/Spinner";
import { useAnnouncement } from "../hooks/useAnnouncement";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types/Auth";

const ProfessorAnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    announcements,
    loading,
    error,
    fetchAll: fetchAllAnnouncements,
    resetError,
  } = useAnnouncement();

  useLayoutEffect(() => {
    if (user?.id) {
      fetchAllAnnouncements({ authorId: user.id });
    }
    return () => {
      resetError();
    };
  }, [user, fetchAllAnnouncements, resetError]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading announcements: {error}</Alert>
      </Container>
    );
  }

  const cardSpacing = 3;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          My Announcements
          <AnnouncementIcon
            sx={{ ml: 1, verticalAlign: "middle", fontSize: "inherit" }}
          />
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate("/professor/announcements/new")}
          sx={{ borderRadius: 2 }}
        >
          Create New Announcement
        </Button>
      </Box>

      {announcements.length === 0 ? (
        <Paper
          elevation={1}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            You haven't created any announcements yet.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing(cardSpacing),
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {announcements.map((announcement) => (
            <Box
              key={announcement._id}
              sx={{
                width: {
                  xs: "100%",
                  sm: `calc(50% - ${theme.spacing(cardSpacing / 2)})`,
                  md: `calc(33.333% - ${theme.spacing((cardSpacing * 2) / 3)})`,
                },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AnnouncementCard
                announcement={announcement}
                viewerRole={UserRole.professor}
              />{" "}
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ProfessorAnnouncementsPage;
