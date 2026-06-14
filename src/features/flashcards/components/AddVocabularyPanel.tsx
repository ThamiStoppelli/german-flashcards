"use client";

import { useState } from "react";
import { EMPTY_CARD_DRAFT } from "../constants";
import type { CandidateCard, CardDraft, CardStatus, Flashcard } from "../types";
import { CardFields } from "./CardFields";

type AddVocabularyPanelProps = {
  onAdd: (card: CandidateCard, source: Flashcard["source"], status: CardStatus) => void;
};

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
        <button className="btn" type="submit">Add card</button>
      </form>
    </section>
  );
}
