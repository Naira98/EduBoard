import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useQuiz } from "../hooks/useQuiz";
import { UserRole } from "../types/Auth";

const ProfessorQuizzesPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const {
    quizzes,
    loading,
    error,
    fetchAll: fetchAllQuizzes,
    resetError,
    resetCurrentQuiz,
  } = useQuiz();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (user?.id && user.role === UserRole.professor) {
      fetchAllQuizzes();
    }
    return () => {
      resetError();
      resetCurrentQuiz();
    };
  }, [user, fetchAllQuizzes, resetError, resetCurrentQuiz]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading quizzes: {error}</Alert>
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
          My Quizzes
          <QuizIcon
            sx={{ ml: 1, verticalAlign: "middle", fontSize: "inherit" }}
          />
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate("/professor/quizzes/new")}
          sx={{ borderRadius: 2 }}
        >
          Create New Quiz
        </Button>
      </Box>

      {quizzes.length === 0 ? (
        <Paper
          elevation={1}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            You haven't created any quizzes yet.
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
          {quizzes.map((quiz) => (
            <Box
              key={quiz._id}
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
              <QuizCard quiz={quiz} viewerRole={UserRole.professor} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ProfessorQuizzesPage;
