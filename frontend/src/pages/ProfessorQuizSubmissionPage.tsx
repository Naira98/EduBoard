import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useGrade } from "../hooks/useGrade";
import { useQuiz } from "../hooks/useQuiz";
import type { GradeSubmission } from "../types/Grade";
import { fromatDateTime } from "../utils/formatDate";

const ProfessorQuizSubmissionsPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const {
    currentQuiz,
    loading: quizLoading,
    error: quizError,
    fetchById: fetchQuizById,
    resetCurrentQuiz,
    resetError: resetQuizError,
  } = useQuiz();
  const {
    quizGrades: submissions,
    loading: gradesLoading,
    error: gradesError,
    fetchByQuizId,
    resetError: resetGradesError,
  } = useGrade();

  useLayoutEffect(() => {
    if (quizId) {
      fetchQuizById(quizId);

      fetchByQuizId(quizId);
    }
    return () => {
      resetCurrentQuiz();
      resetQuizError();
      resetGradesError();
    };
  }, [
    quizId,
    fetchQuizById,
    fetchByQuizId,
    resetCurrentQuiz,
    resetQuizError,
    resetGradesError,
  ]);

  if (quizLoading || gradesLoading) {
    return <Spinner />;
  }

  if (quizError || gradesError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading data: {quizError || gradesError}
        </Alert>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!currentQuiz) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Quiz not found.</Alert>
        <Button
          onClick={() => navigate("/professor/quizzes")}
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back to My Quizzes
        </Button>
      </Container>
    );
  }

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
          Submissions for "{currentQuiz.title}"
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/professor/quizzes")}
          sx={{ borderRadius: 2 }}
        >
          Back to My Quizzes
        </Button>
      </Box>

      {submissions.length === 0 ? (
        <Paper
          elevation={1}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            No submissions found for this quiz yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "primary.light" }}>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Student
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Score
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Percentage
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", color: "primary.contrastText" }}
                >
                  Submitted On
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((grade: GradeSubmission) => (
                <TableRow key={grade._id} hover>
                  <TableCell>{grade.student.username || "N/A"} </TableCell>
                  <TableCell>
                    {grade.score} / {grade.totalQuestions}
                  </TableCell>
                  <TableCell>
                    {((grade.score / grade.totalQuestions) * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell>{fromatDateTime(grade.submittedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ProfessorQuizSubmissionsPage;
