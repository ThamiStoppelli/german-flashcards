"use client";

import { useState } from "react";
import { EMPTY_CARD_DRAFT } from "../constants";
import type { CandidateCard, CardDraft, CardStatus, Flashcard } from "../types";
import { CardFields } from "./CardFields";

type AddVocabularyPanelProps = {
  onAdd: (card: CandidateCard, source: Flashcard["source"], status: CardStatus) => void;
};

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="add-action-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function AddVocabularyPanel({ onAdd }: AddVocabularyPanelProps) {
  const [draft, setDraft] = useState<CardDraft>(EMPTY_CARD_DRAFT);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.german.trim() || !draft.translation.trim()) return;

    onAdd({ ...draft, tags: ["manual"] }, "manual", draft.status);
    setDraft((current) => ({
      ...EMPTY_CARD_DRAFT,
      level: current.level,
      status: current.status,
    }));
  }

  return (
    <section className="card section add-panel">
      <h2>Add vocabulary</h2>
      <p>Create your own card and choose where it belongs.</p>
      <form className="form" onSubmit={handleSubmit}>
        <CardFields value={draft} onChange={setDraft} />
        <button 
          className="btn core-add-button" 
          type="submit"
        >
          <PlusIcon />
          <span>Add card</span>
        </button>
      </form>
    </section>
  );
}
