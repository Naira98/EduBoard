import { Box, Button, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";

interface ControlsBarProps {
  onPreviousQuestion: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  onEraseAnswer: () => void;
  selectedAnswer: string | null;
  onToggleMark: () => void;
  isMarked: boolean;
  onSubmitQuiz: () => void;
}

const ControlsBar = ({
  onPreviousQuestion,
  currentQuestionIndex,
  totalQuestions,
  onNextQuestion,
  onEraseAnswer,
  selectedAnswer,
  onToggleMark,
  isMarked,
  onSubmitQuiz,
}: ControlsBarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 2, md: 3 },
          p: 2,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "primary.main",
          boxShadow: 3,
          mb: 3,
        }}
      >
        {/* Question Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            onClick={onPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="text"
            color="inherit"
            size="large"
            sx={{
              minWidth: 40,
              p: 0,
              color: "text.secondary",
              "&.Mui-disabled": {
                cursor: "not-allowed",
                color: "text.disabled",
              },
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Typography variant="body1" sx={{ mx: 1, fontWeight: "medium" }}>
            <Box component="span" sx={{ color: "text.primary" }}>
              {currentQuestionIndex + 1}
            </Box>{" "}
            /{" "}
            <Box component="span" sx={{ color: "text.secondary" }}>
              {totalQuestions}
            </Box>
          </Typography>
          <Button
            onClick={onNextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
            variant="text"
            color="inherit"
            size="large"
            sx={{
              minWidth: 40,
              p: 0,
              color: "text.secondary",
              "&.Mui-disabled": {
                cursor: "not-allowed",
                color: "text.disabled",
              },
            }}
          >
            <ArrowForwardIcon />
          </Button>
        </Box>

        {/* Vertical Separator */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", md: "block" }, mx: 2, height: 24 }}
        />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={onEraseAnswer}
            disabled={!selectedAnswer}
            variant="contained"
            sx={{
              bgcolor: "error.light",
              color: "error.contrastText",
              "&:hover": { bgcolor: "error.dark" },
              borderRadius: 2,
              "&.Mui-disabled": {
                cursor: "not-allowed",
                bgcolor: "grey.300",
                color: "grey.500",
              },
            }}
            startIcon={<ClearIcon />}
          >
            Erase Answer
          </Button>
          <Button
            onClick={onToggleMark}
            variant="contained"
            sx={{
              bgcolor: isMarked ? "warning.dark" : "warning.light",
              color: "warning.contrastText",
              "&:hover": {
                bgcolor: isMarked ? "warning.main" : "warning.dark",
              },
              borderRadius: 2,
              "&.Mui-disabled": {
                cursor: "not-allowed",
                bgcolor: "grey.300",
                color: "grey.500",
              },
            }}
            startIcon={isMarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          >
            {isMarked ? "Unmark Question" : "Mark Question"}
          </Button>
        </Box>
      </Box>

      {/* Submit Button */}
      <Button
        onClick={onSubmitQuiz}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{
          maxWidth: { xs: "100%", md: 300 },
          borderRadius: 2,
          "&.Mui-disabled": {
            cursor: "not-allowed",
            bgcolor: "grey.300",
            color: "grey.500",
          },
        }}
        startIcon={<CheckCircleIcon />}
      >
        Submit Quiz
      </Button>
    </Box>
  );
};

export default ControlsBar;
