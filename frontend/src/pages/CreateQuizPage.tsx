import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import SendIcon from "@mui/icons-material/Send";
import dayjs from "dayjs";
import { useAuth } from "../hooks/useAuth";
import { useQuiz } from "../hooks/useQuiz";
import { useCourse } from "../hooks/useCourse";
import Spinner from "../components/Spinner";
import { UserRole } from "../types/Auth";
import type { Question } from "../types/Quiz";
import type { Semester } from "../types/Semester";
import { toast } from "react-toastify";

const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    create: createQuiz,
    loading: quizLoading,
    error: quizError,
    resetError: resetQuizError,
  } = useQuiz();
  const {
    courses: professorCourses,
    loading: coursesLoading,
    error: coursesError,
    fetchAll: fetchProfessorCourses,
  } = useCourse();

  const [quizTitle, setQuizTitle] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(
    dayjs().add(7, "day").format("YYYY-MM-DD")
  );
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", options: ["", ""], correctAnswer: "" },
  ]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    if (user?.id && user.role === UserRole.professor) {
      fetchProfessorCourses({ professorId: user.id });
    }
    return () => {
      resetQuizError();
    };
  }, [user, fetchProfessorCourses, resetQuizError, navigate]);

  const availableSemesters: Semester[] = Array.from(
    new Map(
      professorCourses
        .map((course) => {
          const semester =
            typeof course.semester === "string"
              ? { _id: course.semester, name: `Semester ${course.semester}` }
              : course.semester;
          return [semester?._id, semester];
        })
        .filter(Boolean) as [string, Semester][]
    ).values()
  ).filter((s): s is Semester => s !== null && s !== undefined);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!quizTitle.trim()) errors.quizTitle = "Quiz title is required.";
    if (!dueDate) errors.dueDate = "Due date is required.";
    if (!selectedCourseId) errors.selectedCourseId = "Course is required.";
    if (!selectedSemesterId)
      errors.selectedSemesterId = "Semester is required.";

    if (questions.length === 0) {
      errors.questions = "At least one question is required.";
    } else {
      questions.forEach((q, qIndex) => {
        if (!q.questionText.trim())
          errors[`questionText-${qIndex}`] = "Question text is required.";
        if (q.options.length < 2)
          errors[`options-${qIndex}`] = "At least two options are required.";
        q.options.forEach((opt, optIndex) => {
          if (!opt.trim())
            errors[`option-${qIndex}-${optIndex}`] = "Option cannot be empty.";
        });
        if (!q.correctAnswer.trim())
          errors[`correctAnswer-${qIndex}`] = "Correct answer is required.";
        if (q.correctAnswer.trim() && !q.options.includes(q.correctAnswer)) {
          errors[`correctAnswer-${qIndex}`] =
            "Correct answer must be one of the options.";
        }
      });
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [quizTitle, dueDate, selectedCourseId, selectedSemesterId, questions]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", ""], correctAnswer: "" },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    if (
      !newQuestions[qIndex].options.includes(newQuestions[qIndex].correctAnswer)
    ) {
      newQuestions[qIndex].correctAnswer = "";
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast("Please correct the errors in the form.", { type: "error" });
      return;
    }

    if (!user?.id || !user.role) {
      toast("Authentication error: User not logged in or role not defined.", {
        type: "error",
      });

      return;
    }

    const quizData = {
      title: quizTitle,
      dueDate: dayjs(dueDate).toISOString(),
      questions: questions.map(({ questionText, options, correctAnswer }) => ({
        questionText,
        options,
        correctAnswer,
      })),
      courseId: selectedCourseId,
      semesterId: selectedSemesterId,
    };

    try {
      await createQuiz(quizData).unwrap();
      toast("Quiz created successfully!", { type: "success" });
      navigate("/professor/quizzes");
    } catch (err) {
      toast(`Failed to create quiz: ${err || "Unknown error"}`, {
        type: "error",
      });
    }
  };

  if (coursesLoading || quizLoading) {
    return <Spinner />;
  }

  if (coursesError || quizError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Error: {coursesError || quizError}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: 4,
        maxHeight: "calc(100vh - 64px - 32px)",
        overflowY: "auto",
      }}
    >
      {" "}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        Create New Quiz
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Quiz Title"
            fullWidth
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            margin="normal"
            error={!!formErrors.quizTitle}
            helperText={formErrors.quizTitle}
          />

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.dueDate}
            helperText={formErrors.dueDate}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={!!formErrors.selectedCourseId}
          >
            <InputLabel>Course</InputLabel>
            <Select
              value={selectedCourseId}
              label="Course"
              onChange={(e) => {
                const courseId = e.target.value as string;
                setSelectedCourseId(courseId);
                const selectedCourse = professorCourses.find(
                  (c) => c._id === courseId
                );
                if (selectedCourse) {
                  const semester =
                    typeof selectedCourse.semester === "string"
                      ? selectedCourse.semester
                      : selectedCourse.semester?._id;
                  if (semester) setSelectedSemesterId(semester);
                }
              }}
            >
              {professorCourses.length === 0 ? (
                <MenuItem disabled>No courses available</MenuItem>
              ) : (
                professorCourses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.name} (
                    {typeof course.semester === "string"
                      ? `Semester ${course.semester}`
                      : course.semester?.name}
                    )
                  </MenuItem>
                ))
              )}
            </Select>
            {formErrors.selectedCourseId && (
              <Typography color="error" variant="caption">
                {formErrors.selectedCourseId}
              </Typography>
            )}
          </FormControl>

          <FormControl
            fullWidth
            margin="normal"
            error={!!formErrors.selectedSemesterId}
          >
            <InputLabel>Semester</InputLabel>
            <Select
              value={selectedSemesterId}
              label="Semester"
              onChange={(e) => setSelectedSemesterId(e.target.value as string)}
              disabled={!selectedCourseId}
            >
              {availableSemesters.length === 0 ? (
                <MenuItem disabled>No semesters available</MenuItem>
              ) : (
                availableSemesters.map((semester) => (
                  <MenuItem key={semester._id} value={semester._id}>
                    {semester.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {formErrors.selectedSemesterId && (
              <Typography color="error" variant="caption">
                {formErrors.selectedSemesterId}
              </Typography>
            )}
          </FormControl>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="h5"
            sx={{ mb: 2, color: "secondary.main", fontWeight: "bold" }}
          >
            Questions
          </Typography>

          {questions.map((q, qIndex) => (
            <Paper
              key={qIndex}
              elevation={1}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                borderLeft: "4px solid",
                borderColor: "primary.light",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Question {qIndex + 1}
                </Typography>
                {questions.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    size="small"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
              <TextField
                label="Question Text"
                fullWidth
                value={q.questionText}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[qIndex].questionText = e.target.value;
                  setQuestions(newQuestions);
                }}
                margin="normal"
                error={!!formErrors[`questionText-${qIndex}`]}
                helperText={formErrors[`questionText-${qIndex}`]}
              />

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Options:
              </Typography>
              {q.options.map((opt, optIndex) => (
                <Box
                  key={optIndex}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TextField
                    label={`Option ${optIndex + 1}`}
                    fullWidth
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    error={!!formErrors[`option-${qIndex}-${optIndex}`]}
                    helperText={formErrors[`option-${qIndex}-${optIndex}`]}
                  />
                  {q.options.length > 2 && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveOption(qIndex, optIndex)}
                      size="small"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => handleAddOption(qIndex)}
                variant="outlined"
                size="small"
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Add Option
              </Button>

              <FormControl
                fullWidth
                margin="normal"
                error={!!formErrors[`correctAnswer-${qIndex}`]}
              >
                <InputLabel>Correct Answer</InputLabel>
                <Select
                  value={q.correctAnswer}
                  label="Correct Answer"
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[qIndex].correctAnswer = e.target
                      .value as string;
                    setQuestions(newQuestions);
                  }}
                >
                  {q.options.filter((opt) => opt.trim()).length === 0 ? (
                    <MenuItem disabled>Enter options first</MenuItem>
                  ) : (
                    q.options
                      .filter((opt) => opt.trim())
                      .map((opt, optIndex) => (
                        <MenuItem key={optIndex} value={opt}>
                          {opt}
                        </MenuItem>
                      ))
                  )}
                </Select>
                {formErrors[`correctAnswer-${qIndex}`] && (
                  <Typography color="error" variant="caption">
                    {formErrors[`correctAnswer-${qIndex}`]}
                  </Typography>
                )}
              </FormControl>
            </Paper>
          ))}

          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddQuestion}
            variant="contained"
            sx={{ mt: 2, mb: 4, borderRadius: 2 }}
          >
            Add New Question
          </Button>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate("/professor/quizzes")}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={quizLoading}
              sx={{ borderRadius: 2 }}
            >
              {quizLoading ? "Creating..." : "Create Quiz"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateQuizPage;
