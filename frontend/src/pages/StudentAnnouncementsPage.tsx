import {
  Alert,
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useLayoutEffect } from "react";
import AnnouncementCard from "../components/AnnouncementCard";
import Spinner from "../components/Spinner";
import { useAnnouncement } from "../hooks/useAnnouncement";
import { UserRole } from "../types/Auth";

const StudentAnnouncementsPage: React.FC = () => {
  const theme = useTheme();
  const {
    announcements,
    loading: announcementsLoading,
    error: announcementsError,
    fetchAll: fetchAllAnnouncements,
  } = useAnnouncement();

  useLayoutEffect(() => {
    fetchAllAnnouncements();
  }, [fetchAllAnnouncements]);

  if (announcementsLoading) {
    return <Spinner />;
  }

  if (announcementsError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading announcements: {announcementsError}
        </Alert>
      </Container>
    );
  }

  const sortedAnnouncements = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const cardSpacing = 3;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        All Announcements
      </Typography>

      {sortedAnnouncements.length === 0 ? (
        <Paper
          elevation={1}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            No announcements available at the moment.
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
          {sortedAnnouncements.map((announcement) => (
            <Box
              key={announcement._id}
              sx={{
                width: {
                  xs: "100%",
                  sm: `calc(50% - ${theme.spacing(cardSpacing / 2)})`,
                  md: `calc(33.333% - ${theme.spacing((cardSpacing * 2) / 3)})`,
                },
                display: "flex",
              }}
            >
              <AnnouncementCard
                announcement={announcement}
                viewerRole={UserRole.student}
              />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default StudentAnnouncementsPage;
