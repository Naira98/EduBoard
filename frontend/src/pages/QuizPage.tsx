import { Alert, Box, Button } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/Quiz/ConfirmationModal";
import MarkQuestions from "../components/Quiz/MarkQuestions";
import QuizQuestionArea from "../components/Quiz/QuizQuestionArea";
import Spinner from "../components/Spinner";
import { useGrade } from "../hooks/useGrade";
import { useQuiz } from "../hooks/useQuiz";
import type { IStudentQuizSubmission } from "../types/Quiz";

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const {
    currentQuiz,
    loading: loadingFetchingQuiz,
    error,
    fetchById,
  } = useQuiz();
  const {
    submit,
    loading: loadingQuizSubmission,
    myGrades,
    fetchAll: fetchMyGrades,
  } = useGrade();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, string>>(
    new Map()
  );
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(
    new Set()
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

  useLayoutEffect(() => {
    if (quizId) {
      fetchById(quizId);
      fetchMyGrades({ quizId });
    }
  }, [quizId, fetchById, fetchMyGrades]);

  useLayoutEffect(() => {
    if (myGrades && quizId) {
      const alreadySubmitted = myGrades.some((grade) => {
        const gradeQuizId =
          typeof grade.quiz === "string" ? grade.quiz : grade.quiz._id;
        return gradeQuizId === quizId;
      });
      if (alreadySubmitted) {
        setHasSubmitted(true);
      }
    }
  }, [myGrades, quizId]);

  if (loadingFetchingQuiz || loadingQuizSubmission) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Error loading quiz: {error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const questionsToUse = currentQuiz?.questions ?? [];
  const totalQuestions = questionsToUse.length;

  if (totalQuestions === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">Quiz not found or no questions available.</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (hasSubmitted) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="info">You have already submitted this quiz.</Alert>
        <Button onClick={() => navigate("/my-grades")} sx={{ mt: 2 }}>
          Go to Your Grades
        </Button>
      </Box>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) =>
      new Map(prev).set(currentQuestionIndex, answer)
    );
  };

  const handleToggleMark = () => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleEraseAnswer = () => {
    setSelectedAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.delete(currentQuestionIndex);
      return newMap;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleInitiateSubmission = () => {
    const answeredQuestionsCount = selectedAnswers.size;
    const currentUnansweredCount = totalQuestions - answeredQuestionsCount;
    setUnansweredCount(currentUnansweredCount);

    if (currentUnansweredCount > 0) {
      setIsModalOpen(true);
    } else {
      confirmSubmission();
    }
  };

  const confirmSubmission = async () => {
    setIsModalOpen(false);

    const submissionAnswers: IStudentQuizSubmission[] = [];
    selectedAnswers.forEach((selectedOption, questionIndex) => {
      const question = questionsToUse[questionIndex];
      if (question) {
        submissionAnswers.push({
          questionText: question.questionText,
          selectedOption: selectedOption,
        });
      }
    });

    if (submissionAnswers.length === 0 && totalQuestions > 0) {
      toast("Please answer at least one question before submitting.", { type: "warning" });
      return; 
    }

    if (quizId) {
      try {
        await submit({ quizId, answers: submissionAnswers }).unwrap();
        setHasSubmitted(true);
        navigate("/my-grades");
      } catch (submissionError) {
        toast(`Failed to submit quiz: ${submissionError}`, { type: "error" });
      }
    } else {
      toast("Quiz ID is missing, cannot submit the quiz.", { type: "error" });
    }
  };
  const currentQuestion = questionsToUse[currentQuestionIndex];
  const isCurrentQuestionMarked = markedQuestions.has(currentQuestionIndex);
  const currentSelectedAnswer =
    selectedAnswers.get(currentQuestionIndex) || null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        overflowX: "hidden",
        p: 2,
      }}
    >
      <Box
        sx={{
          flex: { xs: "1", md: "2" },
          display: "flex",
          flexDirection: "column",
          height: { xs: "auto", md: "100%" },
        }}
      >
        <QuizQuestionArea
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          selectedAnswer={currentSelectedAnswer}
          isMarked={isCurrentQuestionMarked}
          onAnswerSelect={handleAnswerSelect}
          onToggleMark={handleToggleMark}
          onEraseAnswer={handleEraseAnswer}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          onSubmitQuiz={handleInitiateSubmission}
        />
      </Box>

      <Box
        sx={{
          flex: { xs: "1", md: "1" },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: { xs: 0, md: 4 },
        }}
      >
        <MarkQuestions
          markedQuestions={markedQuestions}
          onQuestionClick={handleQuestionClick}
        />
      </Box>

      <ConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmSubmission}
        title="Unanswered Questions"
        message={`You have ${unansweredCount} unanswered questions. Are you sure you want to submit the quiz?`}
        confirmText="Submit Anyway"
        cancelText="Review Quiz"
      />
    </Box>
  );
};

export default QuizPage;
