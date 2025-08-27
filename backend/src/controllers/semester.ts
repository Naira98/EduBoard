import { asyncHandler } from "../middlewares/asyncHandler";
import { Semester } from "../models/semester";

export const getSemestersController = asyncHandler(async (req, res) => {
  const semesters = await Semester.find({});
  res.status(200).json(semesters);
});

export const createSemesterController = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const existingSemester = await Semester.findOne({ name });
  if (existingSemester) {
    return res
      .status(409)
      .json({ message: "A semester with this name already exists." });
  }

  const newSemester = new Semester({ name });
  await newSemester.save();
  res
    .status(201)
    .json({ message: "Semester created successfully.", semester: newSemester });
});

export const updateSemesterController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const semester = await Semester.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );

  if (!semester) {
    return res.status(404).json({ message: "Semester not found." });
  }

  res.status(200).json({ message: "Semester updated successfully.", semester });
});
