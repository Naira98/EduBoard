import AnnouncementIcon from "@mui/icons-material/Announcement";
import QuizIcon from "@mui/icons-material/Quiz";
import { Alert, Box, Container, Paper, Typography } from "@mui/material";
import { useLayoutEffect } from "react";
import hero from "../assets/hero.png";
import AnnouncementCard from "../components/AnnouncementCard";
import QuizCard from "../components/QuizCard";
import Spinner from "../components/Spinner";
import { useAnnouncement } from "../hooks/useAnnouncement";
import { useGrade } from "../hooks/useGrade";
import { useQuiz } from "../hooks/useQuiz";

const DashboardPage = () => {
  const {
    quizzes,
    loading: quizzesLoading,
    error: quizzesError,
    fetchAll: fetchAllQuizzes,
  } = useQuiz();
  const {
    announcements,
    loading: announcementsLoading,
    error: announcementsError,
    fetchAll: fetchAllAnnouncements,
  } = useAnnouncement();
  const {
    myGrades,
    loading: gradesLoading,
    error: gradesError,
    fetchAll: fetchMyGrades,
  } = useGrade();

  useLayoutEffect(() => {
    fetchAllQuizzes();
    fetchAllAnnouncements();
    fetchMyGrades();
  }, [fetchAllQuizzes, fetchAllAnnouncements, fetchMyGrades]);

  const overallLoading =
    quizzesLoading || announcementsLoading || gradesLoading;
  const overallError = quizzesError || announcementsError || gradesError;

  if (overallLoading) {
    return <Spinner />;
  }

  if (overallError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading dashboard data: {overallError}
        </Alert>
      </Container>
    );
  }

  const submittedQuizIds = new Set(
    myGrades.map((grade) =>
      typeof grade.quiz === "string" ? grade.quiz : grade.quiz._id
    )
  );

  const upcomingQuizzes = [...quizzes]
    .filter((quiz) => new Date(quiz.dueDate) >= new Date())
    .filter((quiz) => !submittedQuizIds.has(quiz._id))
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 4, pt: 0, pb: 0 }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          borderRadius: 2,
          mb: 6,
          p: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
        >
          Welcome to Your Student Dashboard!
        </Typography>
        <Typography
          variant="h6"
          sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}
        >
          Stay updated with your quizzes and announcements.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: { md: "2 1 0%" },
            width: { xs: "100%" },
            mb: { xs: 6, md: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              pb: 1,
              borderBottom: "2px solid",
              borderColor: "primary.light",
            }}
          >
            {" "}
            <AnnouncementIcon
              sx={{ mr: 1, color: "primary.dark", fontSize: "2rem" }}
            />{" "}
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: "primary.dark",
                fontWeight: "bold",
              }}
            >
              Latest Announcements
            </Typography>
          </Box>
          {announcements.length === 0 ? (
            <Paper
              elevation={1}
              sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
            >
              <Typography variant="body1" color="text.secondary">
                No announcements available at the moment.
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[...announcements]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((announcement) => (
                  <AnnouncementCard
                    key={announcement._id}
                    announcement={announcement}
                  />
                ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            flex: { md: "1 1 0%" },
            width: { xs: "100%" },
          }}
        >
          <Box sx={{ mb: 6 }}>
            {" "}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                pb: 1,
                borderBottom: "2px solid",
                borderColor: "primary.light",
              }}
            >
              <QuizIcon
                sx={{ mr: 1, color: "primary.dark", fontSize: "2rem" }}
              />{" "}
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  color: "primary.dark",
                  fontWeight: "bold",
                }}
              >
                Upcoming Quizzes
              </Typography>
            </Box>
            {upcomingQuizzes.length === 0 ? (
              <Paper
                elevation={1}
                sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
              >
                <Typography variant="body1" color="text.secondary">
                  No upcoming quizzes found. Keep an eye out!
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {upcomingQuizzes.map((quiz) => (
                  <QuizCard key={quiz._id} quiz={quiz} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
