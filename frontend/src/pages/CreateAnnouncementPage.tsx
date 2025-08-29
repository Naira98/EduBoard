import { useState, useLayoutEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";

import { useAuth } from "../hooks/useAuth";
import { useAnnouncement } from "../hooks/useAnnouncement";
import { useCourse } from "../hooks/useCourse";
import Spinner from "../components/Spinner";
import { UserRole } from "../types/Auth";
import type { Semester } from "../types/Semester";
import { toast } from "react-toastify";

const CreateAnnouncementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    create: createAnnouncement,
    loading: announcementLoading,
    error: announcementError,
    resetError: resetAnnouncementError,
  } = useAnnouncement();
  const {
    courses: professorCourses,
    loading: coursesLoading,
    error: coursesError,
    fetchAll: fetchProfessorCourses,
  } = useCourse();

  const [announcementTitle, setAnnouncementTitle] = useState<string>("");
  const [announcementContent, setAnnouncementContent] = useState<string>("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    if (user?.id && user.role === UserRole.professor) {
      fetchProfessorCourses({ professorId: user.id });
    }
    return () => {
      resetAnnouncementError();
    };
  }, [user, fetchProfessorCourses, resetAnnouncementError, navigate]);

  const availableSemesters: Semester[] = Array.from(
    new Map(
      professorCourses
        .map((course) => {
          const semester =
            typeof course.semester === "string"
              ? { _id: course.semester, name: `Semester ${course.semester}` }
              : course.semester;
          return [semester?._id, semester];
        })
        .filter(Boolean) as [string, Semester][]
    ).values()
  ).filter((s): s is Semester => s !== null && s !== undefined);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!announcementTitle.trim())
      errors.announcementTitle = "Announcement title is required.";
    if (!announcementContent.trim())
      errors.announcementContent = "Announcement content is required.";
    if (!selectedSemesterId)
      errors.selectedSemesterId = "Semester is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [announcementTitle, announcementContent, selectedSemesterId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast("Please correct the errors in the form.", { type: "error" });
      return;
    }

    if (!user?.id || !user.role) {
      toast("Authentication error: User not logged in or role not defined.", {
        type: "error",
      });
      return;
    }

    const announcementData = {
      title: announcementTitle,
      content: announcementContent,
      semesterId: selectedSemesterId,
    };

    try {
      await createAnnouncement(announcementData).unwrap();

      toast("Announcement created successfully!", { type: "success" });
      navigate(
        `${
          user.role === UserRole.professor
            ? "/professor/announcements"
            : "/manager/announcements"
        }`
      );
    } catch (err) {
      toast(`Failed to create announcement: ${err || "Unknown error"}`, {
        type: "error",
      });
    }
  };

  if (coursesLoading || announcementLoading) {
    return <Spinner />;
  }

  if (coursesError || announcementError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error: {coursesError || announcementError}
        </Alert>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          startIcon={<CancelIcon />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: 4,
        maxHeight: "calc(100vh - 64px - 32px)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        Create New Announcement
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Announcement Title"
            fullWidth
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            margin="normal"
            error={!!formErrors.announcementTitle}
            helperText={formErrors.announcementTitle}
          />

          <TextField
            label="Content"
            fullWidth
            multiline
            rows={6}
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            margin="normal"
            error={!!formErrors.announcementContent}
            helperText={formErrors.announcementContent}
            sx={{ mt: 2 }}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={!!formErrors.selectedSemesterId}
            sx={{ mt: 2 }}
          >
            <InputLabel>Semester</InputLabel>
            <Select
              value={selectedSemesterId}
              label="Semester"
              onChange={(e) => setSelectedSemesterId(e.target.value as string)}
            >
              {availableSemesters.length === 0 ? (
                <MenuItem disabled>No semesters available</MenuItem>
              ) : (
                availableSemesters.map((semester) => (
                  <MenuItem key={semester._id} value={semester._id}>
                    {semester.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {formErrors.selectedSemesterId && (
              <Typography color="error" variant="caption">
                {formErrors.selectedSemesterId}
              </Typography>
            )}
          </FormControl>

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate("/professor/announcements")}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={announcementLoading}
              sx={{ borderRadius: 2 }}
            >
              {announcementLoading ? "Creating..." : "Create Announcement"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAnnouncementPage;
