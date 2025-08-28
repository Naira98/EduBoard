import AnnouncementIcon from "@mui/icons-material/Announcement";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GradeIcon from "@mui/icons-material/Grade";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import QuizIcon from "@mui/icons-material/Quiz";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 240;

const AppLayoutSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    handleDrawerToggle();
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Quizzes", icon: <QuizIcon />, path: "/quizzes" },
    {
      text: "Announcements",
      icon: <AnnouncementIcon />,
      path: "/announcements",
    },
    { text: "My Grades", icon: <GradeIcon />, path: "/grades" },
  ];

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "64px",
        }}
      >
        <img
          src={logo}
          alt="LMS Logo"
          style={{ maxWidth: "100%", height: "auto", maxHeight: "70px" }}
        />
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, p: 1 }}>
        {" "}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            {" "}
            <NavLink
              to={item.path}
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "100%",
              }}
            >
              {({ isActive }) => (
                <ListItemButton
                  selected={isActive}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    backgroundColor: isActive
                      ? "rgba(7, 125, 39, 0.1)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "rgba(7, 125, 39, 0.2)"
                        : "action.hover",
                    },
                    transition: "background-color 0.15s ease-in-out",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: isActive ? "primary.main" : "text.primary",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>
      {/* User Info and Logout Section */}
      {user && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            {" "}
            <ListItemButton
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "transparent",
                },
                cursor: "default",
              }}
            >
              <ListItemIcon
                sx={{ minWidth: "unset", mr: 1, color: "text.secondary" }}
              >
                <PermIdentityIcon fontSize="large" />
              </ListItemIcon>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    color: "primary.main",
                  }}
                >
                  {user.username}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.2 }}
                >
                  {user.email}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
              justifyContent: "flex-start",
              transition: "background-color 0.15s ease-in-out",
            }}
          >
            <ListItemIcon sx={{ color: "text.secondary" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ color: "text.primary", fontWeight: "normal" }}
            />
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: { xs: "transparent", sm: "background.paper" },
          boxShadow: "none",
          borderBottom: "none",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRadius: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRadius: 0,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayoutSidebar;
