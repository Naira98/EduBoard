import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useUsers } from "../hooks/useUser";
import { UserRole } from "../types/Auth";
import type { CreateNewUserData } from "../types/UserManaged";
import { toast } from "react-toastify";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddUsersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    createUser,
    fetchAllCourses,
    availableCourses,
    loading: usersLoading,
    error: usersError,
    resetError: resetUsersError,
  } = useUsers();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<
    UserRole.professor | UserRole.manager | ""
  >("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    fetchAllCourses();
    return () => {
      resetUsersError();
    };
  }, [
    user,
    navigate,
    fetchAllCourses,
    resetUsersError,
    availableCourses.length,
  ]);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = "Username is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format.";
    if (!password.trim()) errors.password = "Password is required.";
    if (password.trim().length < 6)
      errors.password = "Password must be at least 6 characters long.";
    if (!selectedRole) errors.selectedRole = "Role is required.";

    if (selectedRole === UserRole.professor && selectedCourseIds.length === 0) {
      errors.selectedCourseIds =
        "At least one course must be selected for a professor.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [username, email, password, selectedRole, selectedCourseIds]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      toast("Please correct the errors in the form.", { type: "error" });
      return;
    }

    const userData = {
      username,
      email,
      password,
      semesterId: null,
      role: selectedRole,
      courseIds:
        selectedRole === UserRole.professor ? selectedCourseIds : undefined,
    } as CreateNewUserData;

    try {
      await createUser(userData).unwrap();
      toast(`${selectedRole} "${username}" created successfully!`, {
        type: "success",
      });
    } catch (err) {
      toast(`Failed to create user: ${err || "Unknown error"}`, {
        type: "error",
      });
    }
  };

  if (usersLoading) {
    return <Spinner />;
  }

  if (usersError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Error: {usersError}</Alert>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
          startIcon={<CancelIcon />}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        Add New User
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            error={!!formErrors.username}
            helperText={formErrors.username}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            error={!!formErrors.password}
            helperText={formErrors.password}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={!!formErrors.selectedRole}
          >
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              label="Role"
              onChange={(e) =>
                setSelectedRole(
                  e.target.value as UserRole.professor | UserRole.manager
                )
              }
            >
              <MenuItem value={UserRole.professor}>Professor</MenuItem>
              <MenuItem value={UserRole.manager}>Manager</MenuItem>
            </Select>
            {formErrors.selectedRole && (
              <Typography color="error" variant="caption">
                {formErrors.selectedRole}
              </Typography>
            )}
          </FormControl>

          {selectedRole === UserRole.professor && (
            <FormControl
              fullWidth
              margin="normal"
              error={!!formErrors.selectedCourseIds}
            >
              <InputLabel id="course-multi-select-label">
                Assign Courses
              </InputLabel>
              <Select
                labelId="course-multi-select-label"
                multiple
                value={selectedCourseIds}
                onChange={(e) =>
                  setSelectedCourseIds(e.target.value as string[])
                }
                input={
                  <OutlinedInput
                    id="select-multiple-chip"
                    label="Assign Courses"
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const course = availableCourses.find(
                        (c) => c._id === value
                      );
                      return (
                        <Chip
                          key={value}
                          label={course ? course.name : value}
                        />
                      );
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {availableCourses.length === 0 ? (
                  <MenuItem disabled>No courses available</MenuItem>
                ) : (
                  availableCourses.map((course) => (
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
              {formErrors.selectedCourseIds && (
                <Typography color="error" variant="caption">
                  {formErrors.selectedCourseIds}
                </Typography>
              )}
            </FormControl>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={usersLoading}
              sx={{ borderRadius: 2 }}
            >
              {usersLoading ? "Adding User..." : "Add User"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddUsersPage;
