import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Announcement } from "../types/Announcement";
import { formatDate } from "../utils/formatDate";

const AnnouncementCard = ({ announcement }: { announcement: Announcement }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/announcements/${announcement._id}`);
  };

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
        <Button
          size="small"
          variant="outlined"
          onClick={handleViewDetails}
          sx={{ borderRadius: 2 }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default AnnouncementCard;
