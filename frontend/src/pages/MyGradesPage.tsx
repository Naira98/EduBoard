import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useGrade } from "../hooks/useGrade";
import type { Grade } from "../types/Grade";
import { formatDate } from "../utils/formatDate";


const MyGradesPage = () => {
  const navigate = useNavigate();
  const {
    myGrades,
    loading,
    error,
    fetchAll: fetchMyGrades,
    resetError,
  } = useGrade();

  useLayoutEffect(() => {
    fetchMyGrades();
    return () => {
      resetError();
    };
  }, [fetchMyGrades, resetError]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading grades: {error}</Alert>
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        My Grades
      </Typography>

      {myGrades.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't submitted any quizzes yet.
        </Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {myGrades.map((grade: Grade) => (
            <Card
              key={grade._id}
              elevation={3}
              sx={{
                width: {
                  xs: "100%",
                  sm: `calc(50% - ${(3 * 2) / 2}px)`,
                  md: `calc(33.333% - ${(3 * 2) / 3}px)`,
                },
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component="div"
                  color="primary"
                  sx={{ fontWeight: "bold", mb: 1 }}
                  gutterBottom
                >
                  {typeof grade.quiz !== "string"
                    ? grade.quiz.title
                    : "Quiz Title N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  <Box component="span" sx={{ fontWeight: "medium" }}>
                    Score:
                  </Box>{" "}
                  {grade.score} / {grade.totalQuestions}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  <Box component="span" sx={{ fontWeight: "medium" }}>
                    Percentage:
                  </Box>{" "}
                  {((grade.score / grade.totalQuestions) * 100).toFixed(2)}%
                </Typography>
                {typeof grade.quiz !== "string" && grade.quiz.course && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    <Box component="span" sx={{ fontWeight: "medium" }}>
                      Course:
                    </Box>{" "}
                    {grade.quiz.course.name}
                  </Typography>
                )}
                {typeof grade.quiz !== "string" && grade.quiz.semester && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    <Box component="span" sx={{ fontWeight: "medium" }}>
                      Semester:
                    </Box>{" "}
                    {grade.quiz.semester.name}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 2, textAlign: "right", color: "text.disabled" }}
                >
                  Submitted On: {formatDate(grade.submittedAt)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MyGradesPage;
