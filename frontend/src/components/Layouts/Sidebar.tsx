import LogoutIcon from "@mui/icons-material/Logout";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import type { User } from "../../types/Auth";

interface MenuItem {
  text: string;
  icon: ReactNode;
  path: string;
}

type sidebarUser = Pick<User, "username" | "email">;

interface SidebarContentProps {
  navItems: MenuItem[];
  user: sidebarUser | null;
  onLogout: () => void;
  onToggleDrawer?: () => void;
}

const Sidebar = ({
  navItems,
  user,
  onLogout,
  onToggleDrawer,
}: SidebarContentProps) => {
  return (
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
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
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
                  onClick={onToggleDrawer}
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
            <ListItemButton
              sx={{
                borderRadius: 2,
                px: 1.5,
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
            onClick={onLogout}
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
};

export default Sidebar;
