import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAnnouncement } from "../hooks/useAnnouncement";
import type { Announcement } from "../types/Announcement";
import { UserRole } from "../types/Auth";
import { formatDate } from "../utils/formatDate";

interface AnnouncementCardProps {
  announcement: Announcement;
  viewerRole?: UserRole;
}

const AnnouncementCard = ({
  announcement,
  viewerRole,
}: AnnouncementCardProps) => {
  const navigate = useNavigate();
  const { remove: deleteAnnouncement } = useAnnouncement();

  const handleViewDetails = () => {
    navigate(`/announcements/${announcement._id}`);
  };

  const handleDeleteClick = async () => {
    try {
      await deleteAnnouncement(announcement._id).unwrap();
      toast("Announcement deleted successfully!", { type: "success" });
    } catch (err) {
      toast(`Failed to delete announcement: ${err || "Unknown error"}`, {
        type: "error",
      });
    }
  };

  const isStudentView =
    viewerRole === UserRole.student || viewerRole === undefined;

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="div"
          color="primary"
          sx={{ fontWeight: "bold", mb: 1 }}
          gutterBottom
        >
          {announcement.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Content:
          </Box>{" "}
          {announcement.content.length > 100
            ? `${announcement.content.substring(0, 100)}...`
            : announcement.content}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Semester:
          </Box>{" "}
          {announcement.semester?.name || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Author:
          </Box>{" "}
          {announcement.author?.username || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Box component="span" sx={{ fontWeight: "medium" }}>
            Date:
          </Box>{" "}
          {formatDate(announcement.createdAt)}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        {isStudentView ? (
          <Button
            size="small"
            variant="outlined"
            onClick={handleViewDetails}
            sx={{ borderRadius: 2 }}
          >
            View Details
          </Button>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleDeleteClick}
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default AnnouncementCard;
