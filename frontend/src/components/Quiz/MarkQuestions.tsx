import { Box, List, ListItem, ListItemButton, Typography } from "@mui/material";

interface MarkQuestionsProps {
  markedQuestions: Set<number>;
  onQuestionClick: (index: number) => void;
}
const MarkQuestions = ({
  markedQuestions,
  onQuestionClick,
}: MarkQuestionsProps) => {
  const sortedMarkedQuestions = Array.from(markedQuestions).sort(
    (a, b) => a - b
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        p: { xs: 1, md: 2 },
      }}
    >
      <Box
        sx={{
          border: 1,
          borderColor: "grey.300",
          boxShadow: 3,
          borderRadius: 3,
          width: "100%",
          maxHeight: { xs: "350px", md: "75vh" },
          minHeight: { xs: "180px", md: "auto" },
          overflowY: "auto",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            fontWeight: "bold",
            borderRadius: "inherit",
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          Marked Questions
        </Typography>
        {sortedMarkedQuestions.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            No questions marked yet.
          </Typography>
        ) : (
          <List
            sx={{
              p: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              justifyContent: "center",
            }}
          >
            {sortedMarkedQuestions.map((index) => (
              <ListItem key={index} disablePadding sx={{ width: "auto" }}>
                <ListItemButton
                  onClick={() => onQuestionClick(index)}
                  sx={{
                    minWidth: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "grey.200",
                    color: "black",
                    boxShadow: 1,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: 3,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {index + 1}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default MarkQuestions;
