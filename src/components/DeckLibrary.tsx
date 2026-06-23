"use client";

import { useState } from "react";
import { STATUS_LABELS } from "../constants";
import type { CardDraft, CardStats, CardStatus, Flashcard } from "../types";
import { DeckCard } from "./DeckCard";
import { ConfirmModal } from "./ConfirmModal";

function DeleteIcon() {
  return (
    <svg
      aria-hidden="true"
      className="clear-learned-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

type DeckLibraryProps = {
  cards: Flashcard[];
  stats: CardStats;
  activeTab: CardStatus;
  onTabChange: (status: CardStatus) => void;
  onUpdate: (id: string, draft: CardDraft) => void;
  onMove: (id: string, status: CardStatus) => void;
  onDelete: (id: string) => void;
  onDeleteLearned: () => void;
};

export function DeckLibrary({
  cards,
  stats,
  activeTab,
  onTabChange,
  onUpdate,
  onMove,
  onDelete,
  onDeleteLearned,
}: DeckLibraryProps) {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const visibleCards = cards.filter((card) => card.status === activeTab);

  return (
    <section className="card section deck-panel">
      <h2>Deck library</h2>
      <p>Every card is editable. Move cards between decks whenever your priorities change.</p>

      <div className="tabs" role="tablist" aria-label="Filter cards by learning status">
        {(Object.keys(STATUS_LABELS) as CardStatus[]).map((status) => (
          <button
            key={status}
            role="tab"
            type="button"
            aria-selected={activeTab === status}
            className={`tab ${activeTab === status ? "active" : ""}`}
            onClick={() => onTabChange(status)}
          >
            {STATUS_LABELS[status]} <span className="tab-count">{stats[status]}</span>
          </button>
        ))}
      </div>

      <div className="word-list">
        {visibleCards.map((card) => (
          <DeckCard
            key={card.id}
            card={card}
            onUpdate={onUpdate}
            onMove={onMove}
            onDelete={onDelete}
          />
        ))}

        {!visibleCards.length && (
          <div className="empty-list">
            <p>No cards in this deck yet.</p>
          </div>
        )}

        {activeTab === "learned" && stats.learned > 0 && (
          <button
            className="clear-learned-action"
            type="button"
            onClick={() => setIsConfirmingClear(true)}
          >
            <DeleteIcon />
            <span>Delete all learned cards</span>
          </button>
        )}
      </div>

      {isConfirmingClear && (
        <ConfirmModal
          title="Delete all learned cards?"
          description={`${stats.learned} learned card${stats.learned === 1 ? "" : "s"
            } will be permanently removed. Active and Future cards will not be affected.`}
          confirmLabel="Delete learned cards"
          onConfirm={() => {
            onDeleteLearned();
            setIsConfirmingClear(false);
          }}
          onCancel={() => setIsConfirmingClear(false)}
        />
      )}
    </section>
  );
}
