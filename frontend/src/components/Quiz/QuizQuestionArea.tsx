import { Box, FormControl, RadioGroup, Typography } from "@mui/material";
import type { Question } from "../../types/Quiz";
import ControlsBar from "./ControlsBar";
import QuestionChoice from "./QuestionChoice";

interface QuestionProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  isMarked: boolean;
  onAnswerSelect: (answer: string) => void;
  onToggleMark: () => void;
  onEraseAnswer: () => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmitQuiz: () => void;
}

const QuizQuestionArea = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  isMarked,
  onAnswerSelect,
  onToggleMark,
  onEraseAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitQuiz,
}: QuestionProps) => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Question */}
      <Box sx={{ mb: 4, flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          <Box
            component="span"
            sx={{ color: "primary.main", fontWeight: "bold", mr: 1 }}
          >
            Q{currentQuestionIndex + 1}:
          </Box>
          <Box component="span" sx={{ fontWeight: "medium" }}>
            {question.questionText}
          </Box>
        </Typography>

        {/* Choices */}
        <FormControl component="fieldset" sx={{ width: "100%", mt: 3 }}>
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => onAnswerSelect(e.target.value)}
          >
            {question.options.map((option, index) => (
              <QuestionChoice
                key={index}
                option={option}
                selectedAnswer={selectedAnswer}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Controls Bar */}
      <ControlsBar
        onPreviousQuestion={onPreviousQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onNextQuestion={onNextQuestion}
        onEraseAnswer={onEraseAnswer}
        selectedAnswer={selectedAnswer}
        onToggleMark={onToggleMark}
        isMarked={isMarked}
        onSubmitQuiz={onSubmitQuiz}
      />
    </Box>
  );
};

export default QuizQuestionArea;
