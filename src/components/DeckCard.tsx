"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SHORT_STATUS_LABELS, STATUS_LABELS } from "../constants";
import type { CardDraft, CardStatus, Flashcard } from "../types";
import { ConfirmModal } from "./ConfirmModal";
import { EditCardModal } from "./EditCardModal";

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
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const availableStatuses = (
    Object.keys(STATUS_LABELS) as CardStatus[]
  ).filter((status) => status !== card.status);


  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleOutsideClick(event: PointerEvent) {
      const target = event.target as Node;

      const clickedButton = menuButtonRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (clickedButton || clickedMenu) {
        return;
      }

      setIsMenuOpen(false);
    }

    function closeMenu() {
      setIsMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [isMenuOpen]);

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
    setIsMenuOpen(false);
    setIsEditing(true);
  }

  function saveEdit(id: string, draft: CardDraft) {
    onUpdate(id, draft);
    setIsEditing(false);
  }

  function move(status: CardStatus) {
    onMove(card.id, status);
    setIsMenuOpen(false);
  }

  function requestDelete() {
    setIsMenuOpen(false);
    setIsConfirmingDelete(true);
  }

  function confirmDelete() {
    onDelete(card.id);
    setIsConfirmingDelete(false);
  }

  return (
    <>
      <article className={`word-row status-${card.status}`}>
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
                    ref={menuRef}
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
                      onClick={requestDelete}
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
      </article>
      
      {isEditing && (
        <EditCardModal
          card={card}
          onSave={saveEdit}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {isConfirmingDelete && (
        <ConfirmModal
          title="Delete card?"
          description={`"${card.german}" will be permanently removed from your library.`}
          confirmLabel="Delete card"
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </>
  );
}
