import { asyncHandler } from "../middlewares/asyncHandler";
import { Course } from "../models/course";
import { Semester } from "../models/semester";
import { User, UserRole } from "../models/user";

export const createCourseController = asyncHandler(async (req, res) => {
  const { name, professors, semesterId } = req.body;

  if (!name || !professors || professors.length === 0 || !semesterId) {
    return res.status(400).json({
      message:
        "Please provide course name, at least one professor, and a semester ID.",
    });
  }

  const semesterExists = await Semester.findById(semesterId);
  if (!semesterExists) {
    return res.status(404).json({ message: "Semester not found." });
  }

  const validProfessors = await User.find({
    _id: { $in: professors },
    role: UserRole.Professor,
  });
  if (validProfessors.length !== professors.length) {
    return res.status(400).json({
      message:
        "One or more provided professor IDs are invalid or do not belong to a professor role.",
    });
  }

  const newCourse = new Course({
    name,
    professors,
    semester: semesterId,
  });

  await newCourse.save();
  res
    .status(201)
    .json({ message: "Course created successfully.", course: newCourse });
});

export const getAllCoursesController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  let { semesterId }: { semesterId?: string } = req.query;

  let query: any = {};

  if (!userId || !userRole) {
    return res.status(401).json({ message: "Not authenticated." });
  }

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
      break;

    case UserRole.Professor:
      query.professors = userId;
      if (semesterId) {
        query.semester = semesterId;
      }
      break;

    case UserRole.Manager:
      if (semesterId) {
        query.semester = semesterId;
      }
      break;

    default:
      return res.status(403).json({ message: "Forbidden: Invalid user role." });
  }

  const courses = await Course.find(query)
    .populate("professors", "username email role")
    .populate("semester", "name")
    .sort({ name: 1 });

  res.status(200).json(courses);
});

export const updateCourseController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, professors, semesterId } = req.body;

  if (professors && professors.length > 0) {
    const validProfessors = await User.find({
      _id: { $in: professors },
      role: UserRole.Professor,
    });
    if (validProfessors.length !== professors.length) {
      return res.status(400).json({
        message:
          "One or more provided professor IDs are invalid or do not belong to a professor role.",
      });
    }
  }

  if (semesterId && !(await Semester.findById(semesterId))) {
    return res.status(404).json({ message: "New semester not found." });
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    { name, professors, semester: semesterId },
    { new: true, runValidators: true }
  )
    .populate("professors", "username email role")
    .populate("semester", "name");

  if (!updatedCourse) {
    return res.status(404).json({ message: "Course not found." });
  }

  res
    .status(200)
    .json({ message: "Course updated successfully.", course: updatedCourse });
});

export const deleteCourseController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCourse = await Course.findByIdAndDelete(id);

  if (!deletedCourse) {
    return res.status(404).json({ message: "Course not found." });
  }

  res.status(200).json({ message: "Course deleted successfully." });
});
