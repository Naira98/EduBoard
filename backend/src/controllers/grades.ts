import { asyncHandler } from "../middlewares/asyncHandler";
import { Grade, ISubmittedAnswer } from "../models/grade";
import { Quiz } from "../models/quiz";
import { User, UserRole } from "../models/user";

interface IStudentQuizSubmission {
  questionText: string;
  selectedOption: string;
}

export const submitQuizController = asyncHandler(async (req, res) => {
  const {
    quizId,
    answers,
  }: { quizId: string; answers: IStudentQuizSubmission[] } = req.body;
  const studentId = req.user?.userId;

  if (!quizId || !Array.isArray(answers) || answers.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide quizId and an array of answers." });
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found." });
  }

  const studentUser = await User.findById(studentId);
  if (
    !studentUser ||
    !studentUser.semester ||
    studentUser.semester.toString() !== quiz.semester.toString()
  ) {
    return res.status(403).json({
      message: "Forbidden: You are not assigned to the semester for this quiz.",
    });
  }

  if (quiz.dueDate < new Date()) {
    return res
      .status(400)
      .json({ message: "Quiz submission deadline has passed." });
  }

  const existingGrade = await Grade.findOne({
    student: studentId,
    quiz: quizId,
  });
  if (existingGrade) {
    return res
      .status(409)
      .json({ message: "You have already submitted this quiz." });
  }

  let score = 0;
  const submittedAnswers: ISubmittedAnswer[] = [];
  const quizQuestionsMap = new Map(
    quiz.questions.map((q) => [q.questionText, q])
  );

  for (const studentAnswer of answers) {
    const quizQuestion = quizQuestionsMap.get(studentAnswer.questionText);

    if (quizQuestion) {
      const isCorrect =
        quizQuestion.correctAnswer === studentAnswer.selectedOption;
      if (isCorrect) {
        score++;
      }
      submittedAnswers.push({
        questionText: studentAnswer.questionText,
        selectedOption: studentAnswer.selectedOption,
        isCorrect: isCorrect,
      });
    } else {
      // Handle when student sends an answer for a non-existing question
      submittedAnswers.push({
        questionText: studentAnswer.questionText,
        selectedOption: studentAnswer.selectedOption,
        isCorrect: false,
      });
    }
  }

  const newGrade = new Grade({
    student: studentId,
    quiz: quizId,
    score: score,
    totalQuestions: quiz.questions.length,
    submittedAnswers: submittedAnswers,
  });

  await newGrade.save();
  res
    .status(201)
    .json({ message: "Quiz submitted successfully.", grade: newGrade });
});

export const getMyGradesController = asyncHandler(async (req, res) => {
  const studentId = req.user?.userId;
  const { quizId } = req.query;

  let query: any = { student: studentId };
  if (quizId) {
    query.quiz = quizId;
  }

  const grades = await Grade.find(query)
    .populate("quiz", "title dueDate course semester")
    .populate({
      path: "quiz",
      populate: [
        { path: "course", select: "name" },
        { path: "semester", select: "name" },
      ],
    })
    .sort({ submittedAt: -1 });

  res.status(200).json(grades);
});

export const getQuizGradesController = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (userRole !== UserRole.Professor && userRole !== UserRole.Manager) {
    return res.status(403).json({
      message: "Forbidden: Only professors or managers can view quiz grades.",
    });
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found." });
  }

  if (userRole === UserRole.Professor) {
    if (quiz.creator.toString() !== userId?.toString()) {
      return res.status(403).json({
        message: "Forbidden: You are not the professor for this quiz.",
      });
    }
  }

  const grades = await Grade.find({ quiz: quizId })
    .populate("student", "username email")
    .sort({ submittedAt: 1 });

  res.status(200).json(grades);
});
