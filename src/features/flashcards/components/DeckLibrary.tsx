import { STATUS_LABELS } from "../constants";
import type { CardDraft, CardStats, CardStatus, Flashcard } from "../types";
import { DeckCard } from "./DeckCard";

type DeckLibraryProps = {
  cards: Flashcard[];
  stats: CardStats;
  activeTab: CardStatus;
  onTabChange: (status: CardStatus) => void;
  onUpdate: (id: string, draft: CardDraft) => void;
  onMove: (id: string, status: CardStatus) => void;
  onDelete: (id: string) => void;
};

export function DeckLibrary({
  cards,
  stats,
  activeTab,
  onTabChange,
  onUpdate,
  onMove,
  onDelete,
}: DeckLibraryProps) {
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
          <div className="empty-list"><p>No cards in this deck yet.</p></div>
        )}
      </div>
    </section>
  );
}
