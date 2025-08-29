import { Box, Paper, Typography } from "@mui/material";
import type { Course } from "../types/Course";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const semesterName =
    typeof course.semester === "string"
      ? course.semester
      : course.semester?.name || "N/A";
  const professorNames = Array.isArray(course.professors)
    ? course.professors
        .map((p) => (typeof p === "string" ? p : p.username))
        .join(", ")
    : "N/A";

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        color="primary"
        sx={{ fontWeight: "bold", mb: 1 }}
      >
        {course.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <Box component="span" sx={{ fontWeight: "medium" }}>
          Semester:
        </Box>{" "}
        {semesterName}
      </Typography>{" "}
      <Typography variant="body2" color="text.secondary">
        <Box component="span" sx={{ fontWeight: "medium" }}>
          Professors:
        </Box>{" "}
        {professorNames}
      </Typography>
    </Paper>
  );
};

export default CourseCard;
