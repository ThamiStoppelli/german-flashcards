"use client";

import { useState } from "react";
import { EMPTY_CARD_DRAFT, SHORT_STATUS_LABELS, STATUS_LABELS } from "../constants";
import type { CardDraft, CardStatus, Flashcard } from "../types";
import { CardFields } from "./CardFields";

type DeckCardProps = {
  card: Flashcard;
  onUpdate: (id: string, draft: CardDraft) => void;
  onMove: (id: string, status: CardStatus) => void;
  onDelete: (id: string) => void;
};

export function DeckCard({ card, onUpdate, onMove, onDelete }: DeckCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [draft, setDraft] = useState<CardDraft>(EMPTY_CARD_DRAFT);

  function startEditing() {
    setDraft({
      german: card.german,
      translation: card.translation,
      article: card.article ?? "",
      plural: card.plural ?? "",
      example: card.example ?? "",
      level: card.level,
      status: card.status,
    });
    setIsMenuOpen(false);
    setIsEditing(true);
  }

  function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.german.trim() || !draft.translation.trim()) return;

    onUpdate(card.id, draft);
    setIsEditing(false);
  }

  function move(status: CardStatus) {
    onMove(card.id, status);
    setIsMenuOpen(false);
  }

  function remove() {
    if (!window.confirm("Delete this card? This cannot be undone.")) return;
    onDelete(card.id);
    setIsMenuOpen(false);
  }

  return (
    <article className={`word-row status-${card.status}`}>
      {isEditing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <CardFields value={draft} onChange={setDraft} />
          <div className="word-actions">
            <button className="btn" type="submit">Save</button>
            <button className="btn secondary" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="word-main">
            <div className="word-copy">
              <strong>{card.article ? `${card.article} ` : ""}{card.german}</strong>
              <span>{card.translation}</span>
            </div>
            <div className="icon-actions">
              <button className="icon-button" type="button" aria-label={`Edit ${card.german}`} title="Edit card" onClick={startEditing}>✎</button>
              <div className="menu-wrap">
                <button
                  className="icon-button"
                  type="button"
                  aria-label={`More actions for ${card.german}`}
                  aria-expanded={isMenuOpen}
                  title="More actions"
                  onClick={() => setIsMenuOpen((open) => !open)}
                >
                  ⋯
                </button>
                {isMenuOpen && (
                  <div className="action-menu" role="menu">
                    {(Object.keys(STATUS_LABELS) as CardStatus[]).map((status) => (
                      <button
                        key={status}
                        role="menuitem"
                        type="button"
                        disabled={card.status === status}
                        onClick={() => move(status)}
                      >
                        Move to {STATUS_LABELS[status]}
                      </button>
                    ))}
                    <div className="menu-divider" />
                    <button role="menuitem" type="button" className="menu-danger" onClick={remove}>Delete card</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {card.plural && <span className="word-detail">Plural: {card.plural}</span>}
          {card.example && <span className="word-detail">{card.example}</span>}
          <div className="word-meta">
            <span className="pill">{card.level}</span>
            <span className="pill">{card.source}</span>
            <span className={`status-badge ${card.status}`}>{SHORT_STATUS_LABELS[card.status]}</span>
          </div>
        </>
      )}
    </article>
  );
}
