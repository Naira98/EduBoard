import { useLayoutEffect } from "react";
import { Box, Typography, Alert, Container, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../hooks/useAuth";
import { useCourse } from "../hooks/useCourse";
import Spinner from "../components/Spinner";
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

const ProfessorCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const {
    courses,
    loading,
    error,
    fetchAll: fetchAllCourses,
    resetError,
    resetCourses,
  } = useCourse();

  useLayoutEffect(() => {
    if (user?.id) {
      fetchAllCourses({ professorId: user.id });
    } else {
      resetCourses();
    }
    return () => {
      resetError();
      resetCourses();
    };
  }, [user, fetchAllCourses, resetError, resetCourses]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading courses: {error}</Alert>
      </Container>
    );
  }

  if (!user || user.role !== "professor") {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Access Denied: You must be logged in as a professor to view this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        My Courses
        <SchoolIcon
          sx={{ ml: 1, verticalAlign: "middle", fontSize: "inherit" }}
        />
      </Typography>

      {courses.length === 0 ? (
        <Paper
          elevation={1}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="body1" color="text.secondary">
            No courses assigned to you at the moment.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {courses.map((course: Course) => (
            <Box
              key={course._id}
              sx={{
                width: {
                  xs: "100%",
                  sm: `calc(50% - ${(3 * 2) / 2}px)`,
                  md: `calc(33.333% - ${(3 * 2) / 3}px)`,
                },
                display: "flex",
              }}
            >
              <CourseCard course={course} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ProfessorCoursesPage;
