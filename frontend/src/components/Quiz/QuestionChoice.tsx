import { FormControlLabel, Radio, Typography } from "@mui/material";

interface OptionProps {
  option: string;
  selectedAnswer: string | null;
}

const QuestionChoice = ({ option, selectedAnswer }: OptionProps) => {
  return (
    <FormControlLabel
      value={option}
      control={
        <Radio
          sx={{
            color: "primary.main",
            "&.Mui-checked": { color: "primary.dark" },
          }}
        />
      }
      label={
        <Typography variant="body1" sx={{ ml: 1, py: 0.5 }}>
          {option}
        </Typography>
      }
      sx={{
        mb: 1,
        border: 1,
        borderColor: selectedAnswer === option ? "primary.main" : "grey.300",
        borderRadius: 3,
        p: 1,
        transition: "all 0.2s ease-in-out",
        transform: selectedAnswer === option ? "translateX(8px)" : "none",
        "&:hover": {
          borderColor: "primary.light",
          transform: "translateX(8px)",
        },
        bgcolor: selectedAnswer === option ? "grey.200" : "transparent",
      }}
    />
  );
};

export default QuestionChoice;
