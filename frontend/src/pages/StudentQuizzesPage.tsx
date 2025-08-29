import {
  Alert,
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useLayoutEffect } from "react";
import QuizCard from "../components/QuizCard";
import Spinner from "../components/Spinner";
import { useGrade } from "../hooks/useGrade";
import { useQuiz } from "../hooks/useQuiz";
import { UserRole } from "../types/Auth";
import type { Grade } from "../types/Grade";

const StudentQuizzesPage = () => {
  const theme = useTheme();
  const {
    quizzes,
    loading: quizzesLoading,
    error: quizzesError,
    fetchAll: fetchAllQuizzes,
  } = useQuiz();
  const {
    myGrades,
    loading: gradesLoading,
    error: gradesError,
    fetchAll: fetchMyGrades,
  } = useGrade();

  useLayoutEffect(() => {
    fetchAllQuizzes();
    fetchMyGrades();
  }, [fetchAllQuizzes, fetchMyGrades]);

  const overallLoading = quizzesLoading || gradesLoading;
  const overallError = quizzesError || gradesError;

  if (overallLoading) {
    return <Spinner />;
  }

  if (overallError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading quizzes or grades: {overallError}
        </Alert>
      </Container>
    );
  }

  const gradesMap = new Map<string, (typeof myGrades)[0]>();
  myGrades.forEach((grade: Grade) => {
    const quizId = typeof grade.quiz === "string" ? grade.quiz : grade.quiz._id;
    gradesMap.set(quizId, grade);
  });

  const sortedQuizzes = [...quizzes].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
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
        All Quizzes
      </Typography>

      {sortedQuizzes.length === 0 ? (
        <Paper
          elevation={1}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            No quizzes available at the moment.
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
          {sortedQuizzes.map((quiz) => {
            const studentGrade = gradesMap.get(quiz._id);
            return (
              <Box
                key={quiz._id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: `calc(50% - ${theme.spacing(cardSpacing / 2)})`,
                    md: `calc(33.333% - ${theme.spacing(
                      (cardSpacing * 2) / 3
                    )})`,
                  },
                  display: "flex",
                }}
              >
                <QuizCard
                  quiz={quiz}
                  studentGrade={studentGrade}
                  viewerRole={UserRole.student}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default StudentQuizzesPage;
