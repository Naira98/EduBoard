import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../types/Auth";
import type { Grade } from "../types/Grade";
import type { Quiz } from "../types/Quiz";
import { formatDate } from "../utils/formatDate";

interface QuizCardProps {
  quiz: Quiz;
  studentGrade?: Grade;
  viewerRole?: UserRole;
}

const QuizCard = ({ quiz, studentGrade, viewerRole }: QuizCardProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isDueDatePassed = new Date(quiz.dueDate) < new Date();
  const hasSubmitted = !!studentGrade;

  const handleActionButtonClick = () => {
    if (hasSubmitted) {
      console.log(`Viewing score for quiz: ${quiz.title}`);
    } else {
      navigate(`/quiz/start/${quiz._id}`);
    }
  };

  const handleViewSubmissionsClick = () => {
    navigate(`/professor/quizzes/${quiz._id}/submissions`);
  };

  const showStudentActionButton =
    viewerRole === UserRole.student || viewerRole === undefined;

  return (
    <Card
      elevation={3}
      sx={{
        width: "100%",
        height: "100%",
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
          {quiz.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Course:
          </Box>{" "}
          {quiz.course?.name || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Due Date:
          </Box>{" "}
          {formatDate(quiz.dueDate)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Created by:
          </Box>{" "}
          {quiz.creator?.username || "N/A"}
        </Typography>

        {hasSubmitted && studentGrade && (
          <Box
            sx={{
              mt: 2,
              p: 1,
              bgcolor: theme.palette.success.light + "40",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              border: `1px solid ${theme.palette.success.main}`,
            }}
          >
            <CheckCircleIcon
              sx={{ mr: 1, color: theme.palette.success.main }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: theme.palette.success.dark }}
            >
              Score: {studentGrade.score} / {studentGrade.totalQuestions} (
              {(
                (studentGrade.score / studentGrade.totalQuestions) *
                100
              ).toFixed(0)}
              %)
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        {showStudentActionButton ? (
          <Button
            size="small"
            variant="contained"
            onClick={handleActionButtonClick}
            startIcon={hasSubmitted ? <CheckCircleIcon /> : <PlayArrowIcon />}
            disabled={hasSubmitted || isDueDatePassed}
            sx={{
              borderRadius: 2,
              "&.Mui-disabled": {
                bgcolor: theme.palette.grey[400],
                color: theme.palette.grey[600],
                cursor: "not-allowed",
              },
            }}
          >
            {hasSubmitted
              ? "Quiz Submitted"
              : isDueDatePassed
              ? "Past Due"
              : "Start Quiz"}
          </Button>
        ) : (
          <Button
            size="small"
            variant="contained"
            onClick={handleViewSubmissionsClick}
            sx={{
              borderRadius: 2,
            }}
          >
            View Submissions
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default QuizCard;
