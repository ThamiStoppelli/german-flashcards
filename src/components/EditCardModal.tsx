"use client";

import { useEffect, useState, type ReactNode } from "react";
import { EMPTY_CARD_DRAFT } from "../constants";
import type { CardDraft, Flashcard } from "../types";
import { CardFields } from "./CardFields";

type EditCardModalProps = {
  card: Flashcard;
  onSave: (id: string, draft: CardDraft) => void;
  onCancel: () => void;
};

type ActionIconProps = {
  children: ReactNode;
};

function ActionIcon({ children }: ActionIconProps) {
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

function SaveIcon() {
  return (
    <ActionIcon>
      <path d="m5 12 4 4L19 6" />
    </ActionIcon>
  );
}

function CancelIcon() {
  return (
    <ActionIcon>
      <path d="m7 7 10 10" />
      <path d="m17 7-10 10" />
    </ActionIcon>
  );
}

export function EditCardModal({
  card,
  onSave,
  onCancel,
}: EditCardModalProps) {
  const [draft, setDraft] = useState<CardDraft>(EMPTY_CARD_DRAFT);

  useEffect(() => {
    setDraft({
      german: card.german,
      translation: card.translation,
      article: card.article ?? "",
      plural: card.plural ?? "",
      example: card.example ?? "",
      level: card.level,
      status: card.status,
    });
  }, [card]);

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.german.trim() || !draft.translation.trim()) {
      return;
    }

    onSave(card.id, draft);
  }

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
        className="edit-card-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-card-title"
      >
        <div className="import-modal-heading">
          <div>
            <h2 id="edit-card-title">Edit card</h2>
            <p>Update the vocabulary information or destination deck.</p>
          </div>

          <button
            className="modal-close-button"
            type="button"
            aria-label="Close edit modal"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        <form className="edit-card-modal-form" onSubmit={handleSubmit}>
          <CardFields value={draft} onChange={setDraft} />

          <div className="modal-actions">
            <button className="btn compact-button" type="submit">
              <SaveIcon />
              <span>Save changes</span>
            </button>

            <button
              className="btn secondary compact-button"
              type="button"
              onClick={onCancel}
            >
              <CancelIcon />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}