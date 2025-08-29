import SchoolIcon from "@mui/icons-material/School";
import { Alert, Box, Container, Paper, Typography } from "@mui/material";
import { useLayoutEffect } from "react";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useCourse } from "../hooks/useCourse";
import { UserRole } from "../types/Auth";
import type { Course } from "../types/Course";

const ProfessorCoursesPage = () => {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        {user?.role == UserRole.manager ? "All Courses" : "My Courses"}
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
