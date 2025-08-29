import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        id="confirmation-dialog-title"
        sx={{
          p: 3,
          pb: 2,
        }}
      >
        <Box
          component="span"
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            lineHeight: 1.6,
            color: "primary.main",
            display: "block",
          }}
          data-testid="confirmation-title"
        >
          {title}
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <DialogContentText
          id="confirmation-dialog-description"
          component="div"
          sx={{ m: 0 }}
        >
          <Box
            component="div"
            sx={{ lineHeight: 1.5 }}
            data-testid="confirmation-message"
          >
            {message}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{ borderRadius: 2 }}
          data-testid="cancel-button"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          autoFocus
          sx={{ borderRadius: 2 }}
          data-testid="confirm-button"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
