"use client";

import { useState } from "react";
import { GERMAN_LEVELS, STATUS_LABELS } from "../constants";
import { coreVocabulary, coreVocabularyCount } from "../data/vocabulary";
import type { CandidateCard, CardStatus, Flashcard, GermanLevel } from "../types";

type CoreVocabularyPanelProps = {
  existingCards: Flashcard[];
  onAddMany: (cards: CandidateCard[], source: Flashcard["source"], status: CardStatus) => void;
};

export function CoreVocabularyPanel({ existingCards, onAddMany }: CoreVocabularyPanelProps) {
  const [level, setLevel] = useState<GermanLevel>("A1");
  const [status, setStatus] = useState<CardStatus>("future");
  const [message, setMessage] = useState("");

  function addVocabulary() {
    const existing = new Set(
      existingCards.map((card) => `${card.level}:${card.german.toLocaleLowerCase("de")}`),
    );
    const additions = coreVocabulary[level].filter(
      (card) => !existing.has(`${card.level}:${card.german.toLocaleLowerCase("de")}`),
    );

    onAddMany(additions, "core", status);
    setMessage(
      additions.length
        ? `Added ${additions.length} ${level} words to ${STATUS_LABELS[status]}.`
        : `All ${level} core words are already in your library.`,
    );
  }

  return (
    <section className="card section core-panel">
      <h2>Core vocabulary library</h2>
      <p>{coreVocabularyCount} curated words total, with 100 words per CEFR level.</p>
      <div className="form core-form">
        <select aria-label="Vocabulary level" value={level} onChange={(event) => setLevel(event.target.value as GermanLevel)}>
          {GERMAN_LEVELS.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select aria-label="Destination deck" value={status} onChange={(event) => setStatus(event.target.value as CardStatus)}>
          {(Object.keys(STATUS_LABELS) as CardStatus[]).map((item) => (
            <option key={item} value={item}>{STATUS_LABELS[item]}</option>
          ))}
        </select>
        <button className="btn secondary" type="button" onClick={addVocabulary}>
          Add {level} core vocabulary
        </button>
      </div>
      {message && <div className="notice" role="status">{message}</div>}
    </section>
  );
}
