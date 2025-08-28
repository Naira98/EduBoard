import { asyncHandler } from "../middlewares/asyncHandler";
import { Announcement } from "../models/announcement";
import { Semester } from "../models/semester";
import { User, UserRole } from "../models/user";

export const createAnnouncementController = asyncHandler(async (req, res) => {
  const { title, content, semesterId } = req.body;
  const author = req.user?.userId;
  const userRole = req.user?.role;

  if (userRole !== UserRole.Manager && userRole !== UserRole.Professor) {
    return res.status(403).json({
      message:
        "Forbidden: Only managers or professors can create announcements.",
    });
  }

  if (!title || !content || !semesterId) {
    return res
      .status(400)
      .json({ message: "Please provide title, content, and semesterId." });
  }

  const semesterExists = await Semester.findById(semesterId);
  if (!semesterExists) {
    return res.status(404).json({ message: "Semester not found." });
  }

  const newAnnouncement = new Announcement({
    title,
    content,
    author,
    semester: semesterId,
  });

  await newAnnouncement.save();
  res.status(201).json({
    message: "Announcement created successfully.",
    announcement: newAnnouncement,
  });
});

export const getAllAnnouncementsController = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  let { semesterId, authorId, myAnnouncements } = req.query;

  let query: any = {};

  switch (userRole) {
    case UserRole.Student:
      const studentUser = await User.findById(userId);

      if (!studentUser || !studentUser.semester) {
        return res.status(200).json([]);
      }
      query.semester = studentUser.semester.toString();
      break;

    case UserRole.Professor:
      if (myAnnouncements === "true") {
        query.author = userId;
      } else if (semesterId) {
        query.semester = semesterId;
      } else if (authorId) {
        query.author = authorId;
      }
      break;

    case UserRole.Manager:
      if (semesterId) {
        query.semester = semesterId;
      }
      if (authorId) {
        query.author = authorId;
      }
      break;

    default:
      return res.status(403).json({ message: "Forbidden: Invalid user role." });
  }

  const announcements = await Announcement.find(query)
    .populate("author", "username email role")
    .populate("semester", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(announcements);
});

export const getAnnouncementByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const announcement = await Announcement.findById(id)
    .populate("author", "username email role")
    .populate("semester", "name");

  if (!announcement) {
    return res.status(404).json({ message: "Announcement not found." });
  }
  if (userRole === UserRole.Student) {
    const studentUser = await User.findById(userId);
    if (
      !studentUser ||
      !studentUser.semester ||
      studentUser.semester.toString() !== announcement.semester._id.toString()
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You are not assigned to the semester for this announcement.",
      });
    }
  }

  res.status(200).json(announcement);
});

export const updateAnnouncementController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, semesterId } = req.body;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const originalAnnouncement = await Announcement.findById(id);

  if (!originalAnnouncement) {
    return res.status(404).json({ message: "Announcement not found." });
  }

  if (
    userRole !== UserRole.Manager &&
    originalAnnouncement.author.toString() !== userId?.toString()
  ) {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to update this announcement.",
    });
  }

  if (semesterId && !(await Semester.findById(semesterId))) {
    return res.status(404).json({ message: "New semester not found." });
  }

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(
    id,
    { title, content, semester: semesterId },
    { new: true, runValidators: true }
  )
    .populate("author", "username email role")
    .populate("semester", "name");

  res.status(200).json({
    message: "Announcement updated successfully.",
    announcement: updatedAnnouncement,
  });
});

export const deleteAnnouncementController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const announcement = await Announcement.findById(id);

  if (!announcement) {
    return res.status(404).json({ message: "Announcement not found." });
  }

  if (
    userRole !== UserRole.Manager &&
    announcement.author.toString() !== userId?.toString()
  ) {
    return res.status(403).json({
      message: "Forbidden: You are not authorized to delete this announcement.",
    });
  }

  await Announcement.findByIdAndDelete(id);

  res.status(200).json({ message: "Announcement deleted successfully." });
});
