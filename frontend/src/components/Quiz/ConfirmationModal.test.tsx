/* eslint-disable @typescript-eslint/no-explicit-any */

import { act, fireEvent, render, screen } from "@testing-library/react";
import ConfirmationModal from "./ConfirmationModal";

jest.mock("@mui/material", () => {
  const originalModule = jest.requireActual("@mui/material");
  return {
    ...originalModule,
    Fade: ({ children, in: inProp }: any) => (inProp ? children : null),
    Slide: ({ children }: any) => children,
  };
});

describe("ConfirmationModal", () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: "Test Title",
    message: "Are you sure you want to proceed?",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props when open is true", () => {
    render(<ConfirmationModal {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();

    const messageElement = screen.getByTestId("confirmation-message");
    expect(messageElement).toHaveTextContent(
      "Are you sure you want to proceed?"
    );

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<ConfirmationModal {...defaultProps} open={false} />);

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });

  it("renders with custom button texts", () => {
    render(
      <ConfirmationModal
        {...defaultProps}
        confirmText="Yes, Delete"
        cancelText="No, Keep"
      />
    );

    expect(screen.getByText("Yes, Delete")).toBeInTheDocument();
    expect(screen.getByText("No, Keep")).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    render(<ConfirmationModal {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    render(<ConfirmationModal {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    render(<ConfirmationModal {...defaultProps} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    expect(screen.getByText("Test Title")).toBeInTheDocument();

    const messageElement = screen.getByTestId("confirmation-message");
    expect(messageElement).toHaveTextContent(
      "Are you sure you want to proceed?"
    );
  });

  it("has confirm button focused by default", () => {
    render(<ConfirmationModal {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toHaveFocus();
  });

  it("handles multiple rapid clicks correctly", async () => {
    render(<ConfirmationModal {...defaultProps} />);

    const confirmButton = screen.getByText("Confirm");

    await act(async () => {
      fireEvent.click(confirmButton);
      fireEvent.click(confirmButton);
      fireEvent.click(confirmButton);
    });

    expect(mockOnConfirm).toHaveBeenCalledTimes(3);
  });

  it("renders with long text content correctly", () => {
    const longTitle =
      "This is a very long title that should wrap properly in the dialog";
    const longMessage =
      "This is a very long message that should also wrap properly and not break the layout of the confirmation modal dialog component";

    render(
      <ConfirmationModal
        {...defaultProps}
        title={longTitle}
        message={longMessage}
      />
    );

    expect(screen.getByText(longTitle)).toBeInTheDocument();

    const messageElement = screen.getByTestId("confirmation-message");
    expect(messageElement).toHaveTextContent(longMessage);
  });

  it("does not call onClose when clicking inside the dialog content", async () => {
    render(<ConfirmationModal {...defaultProps} />);

    const messageElement = screen.getByTestId("confirmation-message");

    await act(async () => {
      fireEvent.click(messageElement);
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("calls onClose when clicking on the backdrop", async () => {
    render(<ConfirmationModal {...defaultProps} />);

    const backdrop = document.querySelector(".MuiBackdrop-root");

    if (backdrop) {
      await act(async () => {
        fireEvent.click(backdrop);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });
});
