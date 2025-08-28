import { ObjectId } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler";
import { Course } from "../models/course";
import { Quiz } from "../models/quiz";
import { Semester } from "../models/semester";
import { User, UserRole } from "../models/user";

export const createQuizController = asyncHandler(async (req, res) => {
  const { title, dueDate, questions, courseId, semesterId } = req.body;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  if (
    !title ||
    !dueDate ||
    !questions ||
    questions.length === 0 ||
    !courseId ||
    !semesterId
  ) {
    return res.status(400).json({
      message:
        "Please provide title, dueDate, questions, courseId, and semesterId.",
    });
  }

  const semesterExists = await Semester.findById(semesterId);
  if (!semesterExists) {
    return res.status(404).json({ message: "Semester not found." });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found." });
  }
  if (
    userRole === UserRole.Professor &&
    course.professor.toString() !== userId?.toString()
  ) {
    return res
      .status(403)
      .json({ message: "Forbidden: You are not assigned to this course." });
  }

  for (const q of questions) {
    if (
      !q.questionText ||
      !Array.isArray(q.options) ||
      q.options.length < 2 ||
      !q.correctAnswer
    ) {
      return res.status(400).json({
        message:
          "Invalid question format. Each question needs text, at least two options, and a correct answer.",
      });
    }
    if (!q.options.includes(q.correctAnswer)) {
      return res.status(400).json({
        message: `Correct answer "${q.correctAnswer}" for question "${q.questionText}" must be one of the provided options.`,
      });
    }
  }

  const newQuiz = new Quiz({
    title,
    dueDate,
    questions,
    course: courseId,
    semester: semesterId,
    creator: userId,
  });

  await newQuiz.save();
  res
    .status(201)
    .json({ message: "Quiz created successfully.", quiz: newQuiz });
});

export const getAllQuizzesController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  let { semesterId, courseId }: { semesterId?: string; courseId?: string } =
    req.query;

  let query: any = {};

  switch (userRole) {
    case UserRole.Student:
      const studentUser = await User.findById(userId);

      if (!studentUser || !studentUser.semester) {
        return res.status(200).json([]);
      }
      const studentSemesterId = studentUser.semester.toString();

      if (semesterId && semesterId !== studentSemesterId) {
        return res.status(403).json({
          message: "Forbidden: You are not assigned to this semester.",
        });
      }
      query.semester = studentSemesterId;

      if (courseId) {
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: "Course not found." });
        }
        if (course.semester.toString() !== studentSemesterId) {
          return res.status(403).json({
            message:
              "Forbidden: The requested course is not in your assigned semester.",
          });
        }
        query.course = courseId;
      }
      break;

    case UserRole.Professor:
      const professorCourses: { _id: ObjectId }[] = await Course.find({
        professor: userId,
      }).select("_id");
      const professorCourseIds = professorCourses.map((course) =>
        course._id.toString()
      );

      if (professorCourseIds.length === 0) {
        return res.status(200).json([]);
      }

      query.course = { $in: professorCourseIds };

      if (semesterId) {
        query.semester = semesterId;
      }
      if (courseId && !professorCourseIds.includes(courseId)) {
        return res
          .status(403)
          .json({ message: "Forbidden: You are not assigned to this course." });
      } else if (courseId) {
        query.course = courseId;
      }
      break;

    case UserRole.Manager:
      if (semesterId) {
        query.semester = semesterId;
      }
      if (courseId) {
        query.course = courseId;
      }
      break;

    default:
      return res.status(403).json({ message: "Forbidden: Invalid user role." });
  }

  const quizzes = await Quiz.find(query)
    .populate("course", "name professor")
    .populate("semester", "name")
    .populate("creator", "username email role")
    .sort({ dueDate: 1 });

  res.status(200).json(quizzes);
});

export const getQuizByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const quiz = await Quiz.findById(id)
    .populate("course", "name professor")
    .populate("semester", "name")
    .populate("creator", "username email role");

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found." });
  }

  if (userRole === UserRole.Student) {
    const studentUser = await User.findById(userId);
    if (
      !studentUser ||
      !studentUser.semester ||
      studentUser.semester.toString() !== quiz.semester.toString()
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are not assigned to the semester for this quiz.",
      });
    }
  } else if (userRole === UserRole.Professor) {
    if (quiz.creator.toString() !== userId?.toString()) {
      return res.status(403).json({
        message: "Forbidden: You are not the professor for this quiz's course.",
      });
    }
  }

  res.status(200).json(quiz);
});

export const updateQuizController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, dueDate, questions, courseId, semesterId } = req.body;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const originalQuiz = await Quiz.findById(id);

  if (!originalQuiz) {
    return res.status(404).json({ message: "Quiz not found." });
  }

  const course = await Course.findById(originalQuiz.course);
  if (!course) {
    return res.status(404).json({ message: "Associated course not found." });
  }

  if (
    userRole !== UserRole.Manager &&
    originalQuiz.creator.toString() !== userId?.toString()
  ) {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to update this quiz.",
    });
  }

  // Validate if a new courseId or semesterId is provided
  if (courseId && !(await Course.findById(courseId))) {
    return res.status(404).json({ message: "New course not found." });
  }
  if (semesterId && !(await Semester.findById(semesterId))) {
    return res.status(404).json({ message: "New semester not found." });
  }

  // Basic validation for questions array structure if provided
  if (questions) {
    for (const q of questions) {
      if (
        !q.questionText ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        !q.correctAnswer
      ) {
        return res.status(400).json({
          message:
            "Invalid question format. Each question needs text, at least two options, and a correct answer.",
        });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({
          message: `Correct answer "${q.correctAnswer}" for question "${q.questionText}" must be one of the provided options.`,
        });
      }
    }
  }

  const updatedQuiz = await Quiz.findByIdAndUpdate(
    id,
    { title, dueDate, questions, course: courseId, semester: semesterId },
    { new: true, runValidators: true }
  )
    .populate("course", "name professor")
    .populate("semester", "name")
    .populate("creator", "username email role");

  res
    .status(200)
    .json({ message: "Quiz updated successfully.", quiz: updatedQuiz });
});

export const deleteQuizController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found." });
  }

  if (
    userRole !== UserRole.Manager &&
    quiz.creator.toString() !== userId?.toString()
  ) {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to delete this quiz.",
    });
  }

  await Quiz.findByIdAndDelete(id);

  res.status(200).json({ message: "Quiz deleted successfully." });
});
