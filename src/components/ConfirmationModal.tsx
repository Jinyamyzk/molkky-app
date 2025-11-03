"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  dangerous?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  dangerous,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "30px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 3)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: dangerous ? "#dc3545" : "#333",
            marginBottom: "15px",
            fontSize: "18px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button
            className="button secondary"
            onClick={onCancel}
            style={{ minWidth: "80px" }}
          >
            {cancelText}
          </button>
          <button
            className={`button ${dangerous ? "danger" : "success"}`}
            onClick={onConfirm}
            style={{ minWidth: "80px" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
