import { asyncHandler } from "../middlewares/asyncHandler";
import { Semester } from "../models/semester";
import { User, UserRole } from "../models/user";

export const enrollStudentController = asyncHandler(async (req, res) => {
  const { semesterId } = req.body;

  const studentId = req.user?.userId;

  const semesterExists = await Semester.findById(semesterId);
  if (!semesterExists) {
    return res.status(404).json({ message: "Semester not found." });
  }

  const user = await User.findById(studentId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  if (user.role !== UserRole.Student)
    return res.status(403).json({
      message: "Forbidden: Only students can enroll in a semester.",
    });

  user.semester = semesterId;
  await user.save();

  res.status(200).json({
    message: "Enrollment successful.",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      semester: user.semester,
    },
  });
});
