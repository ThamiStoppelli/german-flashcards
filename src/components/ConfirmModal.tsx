"use client";

import { useEffect, type ReactNode } from "react";

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type ModalIconProps = {
  children: ReactNode;
};

function ModalIcon({ children }: ModalIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="modal-action-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function DeleteIcon() {
  return (
    <ModalIcon>
      <path d="M4 7h16" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </ModalIcon>
  );
}

function CancelIcon() {
  return (
    <ModalIcon>
      <path d="m7 7 10 10" />
      <path d="m17 7-10 10" />
    </ModalIcon>
  );
}

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <section
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="import-modal-heading">
          <div>
            <h2 id="confirm-modal-title">{title}</h2>
            <p>{description}</p>
          </div>

          <button
            className="modal-close-button"
            type="button"
            aria-label="Close confirmation modal"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        <div className="modal-actions">
          <button
            className="btn danger compact-button"
            type="button"
            onClick={onConfirm}
          >
            <DeleteIcon />
            <span>{confirmLabel}</span>
          </button>

          <button
            className="btn secondary compact-button"
            type="button"
            onClick={onCancel}
          >
            <CancelIcon />
            <span>{cancelLabel}</span>
          </button>
        </div>
      </section>
    </div>
  );
}