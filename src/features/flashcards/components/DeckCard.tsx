"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { EMPTY_CARD_DRAFT, SHORT_STATUS_LABELS, STATUS_LABELS } from "../constants";
import type { CardDraft, CardStatus, Flashcard } from "../types";
import { CardFields } from "./CardFields";

type DeckCardProps = {
  card: Flashcard;
  onUpdate: (id: string, draft: CardDraft) => void;
  onMove: (id: string, status: CardStatus) => void;
  onDelete: (id: string) => void;
};

type IconProps = {
  children: ReactNode;
};

function Icon({ children }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className="menu-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function EditIcon() {
  return (
    <Icon>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </Icon>
  );
}

function ActiveIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4Z" />
    </Icon>
  );
}

function LearnedIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </Icon>
  );
}

function FutureIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

function DeleteIcon() {
  return (
    <Icon>
      <path d="M4 7h16" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </Icon>
  );
}

const STATUS_ICONS: Record<CardStatus, ReactNode> = {
  active: <ActiveIcon />,
  learned: <LearnedIcon />,
  future: <FutureIcon />,
};

export function DeckCard({ card, onUpdate, onMove, onDelete }: DeckCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [draft, setDraft] = useState<CardDraft>(EMPTY_CARD_DRAFT);
  const availableStatuses = (
    Object.keys(STATUS_LABELS) as CardStatus[]
  ).filter((status) => status !== card.status);

  function toggleMenu() {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    const button = menuButtonRef.current;

    if (!button || window.innerWidth <= 560) {
      setMenuStyle({});
      setIsMenuOpen(true);
      return;
    }

    const rect = button.getBoundingClientRect();
    const estimatedMenuHeight = 230;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < estimatedMenuHeight;

    setMenuStyle({
      top: openUpward ? rect.top - 8 : rect.bottom + 8,
      right: window.innerWidth - rect.right,
      transform: openUpward ? "translateY(-100%)" : undefined,
    });

    setIsMenuOpen(true);
  }

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
            <button className="btn" type="submit">
              Save
            </button>

            <button
              className="btn secondary"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="word-main">
            <div className="word-copy">
              <strong>
                {card.article ? `${card.article} ` : ""}
                {card.german}
              </strong>

              <span>{card.translation}</span>
            </div>

            <div className="menu-wrap">
              <button
                ref={menuButtonRef}
                className="icon-button"
                type="button"
                aria-label={`More actions for ${card.german}`}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                title="Card actions"
                onClick={toggleMenu}
              >
                ⋯
              </button>

              {isMenuOpen && (
                <div
                  className="action-menu"
                  role="menu"
                  aria-label={`Actions for ${card.german}`}
                  style={menuStyle}
                >
                  <button
                    role="menuitem"
                    type="button"
                    onClick={startEditing}
                  >
                    <EditIcon />
                    <span>Edit card</span>
                  </button>

                  <div className="menu-divider" />

                  <p className="action-menu-label">Change status</p>

                  {availableStatuses.map((status) => (
                    <button
                      key={status}
                      role="menuitem"
                      type="button"
                      onClick={() => move(status)}
                    >
                      {STATUS_ICONS[status]}
                      <span>{STATUS_LABELS[status]}</span>
                    </button>
                  ))}

                  <div className="menu-divider" />

                  <button
                    role="menuitem"
                    type="button"
                    className="menu-danger"
                    onClick={remove}
                  >
                    <DeleteIcon />
                    <span>Delete card</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {card.plural && (
            <span className="word-detail">
              Plural: {card.plural}
            </span>
          )}

          {card.example && (
            <span className="word-detail">
              {card.example}
            </span>
          )}

          <div className="word-meta">
            <span className="pill">{card.level}</span>
            <span className="pill">{card.source}</span>

            <span className={`status-badge ${card.status}`}>
              {SHORT_STATUS_LABELS[card.status]}
            </span>
          </div>
        </>
      )}
    </article>
  );
}
