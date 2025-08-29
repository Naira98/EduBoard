import { Box, CircularProgress, Typography } from "@mui/material";

interface SpinnerProps {
  message?: string;
}

const Spinner = ({ message }: SpinnerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <CircularProgress color="primary" />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Spinner;
