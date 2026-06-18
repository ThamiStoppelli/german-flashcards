"use client";

import { useState } from "react";
import { GERMAN_LEVELS, STATUS_LABELS } from "../constants";
import { coreVocabulary, coreVocabularyCount } from "../data/vocabulary";
import type { CandidateCard, CardStatus, Flashcard, GermanLevel } from "../types";
import { SelectMenu } from "./SelectMenu";

type CoreVocabularyPanelProps = {
  existingCards: Flashcard[];
  onAddMany: (
    cards: CandidateCard[],
    source: Flashcard["source"],
    status: CardStatus
  ) => void;
};

const LEVEL_DESCRIPTIONS: Record<GermanLevel, string> = {
  A1: "Essential words for introductions, everyday objects and basic conversations.",
  A2: "Common vocabulary for routines, travel and familiar everyday situations.",
  B1: "Practical vocabulary for work, experiences, opinions and independent communication.",
  B2: "More precise vocabulary for detailed discussions, arguments and complex topics.",
  C1: "Advanced vocabulary for fluent, flexible and professional communication.",
  C2: "Nuanced vocabulary for highly precise, academic and sophisticated expression.",
};

const LEVEL_OPTIONS = GERMAN_LEVELS.map((item) => ({
  value: item,
  label: item,
}));

const STATUS_OPTIONS = (
  Object.keys(STATUS_LABELS) as CardStatus[]
).map((item) => ({
  value: item,
  label: STATUS_LABELS[item],
}));

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

export function CoreVocabularyPanel({
  existingCards,
  onAddMany
}: CoreVocabularyPanelProps) {
  const [level, setLevel] = useState<GermanLevel>("A1");
  const [status, setStatus] = useState<CardStatus>("future");
  const [message, setMessage] = useState("");

  const selectedWords = coreVocabulary[level];

  function addVocabulary() {
    const existing = new Set(
      existingCards.map((card) =>
        `${card.level}:${card.german.toLocaleLowerCase("de")}`),
    );

    const additions = selectedWords.filter(
      (card) =>
        !existing.has(`${card.level}:${card.german.toLocaleLowerCase("de")}`),
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
      <p>
        {coreVocabularyCount} curated words total, with 100 words per CEFR level.
      </p>

      <div className="core-form">
        <SelectMenu
          ariaLabel="Vocabulary level"
          value={level}
          options={LEVEL_OPTIONS}
          onChange={(nextLevel) => {
            setLevel(nextLevel);
            setMessage("");
          }}
        />
        <SelectMenu
          ariaLabel="Destination deck"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(nextStatus) => {
            setStatus(nextStatus);
            setMessage("");
          }}
        />
      </div>

      <div className="level-summary">
        <div className="level-summary-heading">
          <span className="level-summary-badge">{level}</span>
          <strong>{selectedWords.length} curated words</strong>
        </div>

        <p>{LEVEL_DESCRIPTIONS[level]}</p>
      </div>

      <div className="vocabulary-preview">
        <div className="vocabulary-preview-heading">
          <h3>Vocabulary preview</h3>
          <span>{selectedWords.length} words</span>
        </div>

        <ul className="vocabulary-preview-list">
          {selectedWords.map((word, index) => (
            <li key={`${level}-${word.german}-${index}`}>
              <div className="vocabulary-preview-copy">
                <strong>
                  {word.article ? `${word.article} ` : ""}
                  {word.german}
                </strong>

                <span>{word.translation}</span>
              </div>

              {word.plural && (
                <span className="vocabulary-preview-plural">
                  {word.plural}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="core-panel-footer">
        {message && (
          <div className="notice" role="status">
            {message}
          </div>
        )}

        <button
          className="btn secondary core-add-button"
          type="button"
          onClick={addVocabulary}
        >
          <PlusIcon />
          <span>
            Add all {level} words to {STATUS_LABELS[status]}
          </span>
        </button>
      </div>
    </section>
  );
}
