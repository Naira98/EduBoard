import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Quiz {
  _id: string;
  title: string;
  dueDate: string;
  course: { _id: string; name: string } | null;
  creator: { _id: string; username: string } | null;
}

const QuizCard = ({ quiz }: { quiz: Quiz }) => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate(`/quiz/start/${quiz._id}`);
  };

  const isDueDatePassed = new Date(quiz.dueDate) < new Date();

  return (
    <Card
      elevation={3}
      sx={{
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
          {new Date(quiz.dueDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Created by:
          </Box>{" "}
          {quiz.creator?.username || "N/A"}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}
      >
        <Button
          size="small"
          variant="contained"
          onClick={handleStartQuiz}
          startIcon={<PlayArrowIcon />}
          disabled={isDueDatePassed}
          sx={{ borderRadius: 2 }}
        >
          {isDueDatePassed ? "Past Due" : "Start Quiz"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuizCard;
