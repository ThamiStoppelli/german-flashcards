"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { CardDraft, CardStats, CardStatus, Flashcard, ReviewRating } from "../types";
import { ConfirmModal } from "./ConfirmModal";
import { EditCardModal } from "./EditCardModal";

type StudyPanelProps = {
  card?: Flashcard;
  stats: CardStats;
  progress: number;
  onReview: (id: string, rating: ReviewRating) => void;
  onMove: (id: string, status: CardStatus) => void;
  onUpdate: (id: string, draft: CardDraft) => void;
  onDelete: (id: string) => void;
  onRestartActive: () => void;
  onOpenFuture: () => void;
};

type StudyIconProps = {
  children: ReactNode;
};

function StudyIcon({ children }: StudyIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="study-action-icon"
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

function RevealIcon() {
  return (
    <StudyIcon>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </StudyIcon>
  );
}

function AgainIcon() {
  return (
    <StudyIcon>
      <path d="M4 10a8 8 0 1 1 2 7" />
      <path d="M4 4v6h6" />
    </StudyIcon>
  );
}

function HardIcon() {
  return (
    <StudyIcon>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.4 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0Z" />
    </StudyIcon>
  );
}

function EasyIcon() {
  return (
    <StudyIcon>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />
    </StudyIcon>
  );
}

function ActiveStudyIcon() {
  return (
    <StudyIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8 6 4-6 4Z" />
    </StudyIcon>
  );
}

function KnownIcon() {
  return (
    <StudyIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </StudyIcon>
  );
}

function LaterIcon() {
  return (
    <StudyIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </StudyIcon>
  );
}

function EditIcon() {
  return (
    <StudyIcon>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </StudyIcon>
  );
}

function DeleteIcon() {
  return (
    <StudyIcon>
      <path d="M4 7h16" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </StudyIcon>
  );
}

function RestartIcon() {
  return (
    <StudyIcon>
      <path d="M4 10a8 8 0 1 1 2 7" />
      <path d="M4 4v6h6" />
    </StudyIcon>
  );
}

export function StudyPanel({
  card,
  stats,
  progress,
  onReview,
  onMove,
  onUpdate,
  onDelete,
  onRestartActive,
  onOpenFuture,
}: StudyPanelProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [card?.id]);

  function handleReview(rating: ReviewRating) {
    if (!card) return;
    onReview(card.id, rating);
    setShowAnswer(false);
  }

  function handleMove(status: CardStatus) {
    if (!card) return;
    onMove(card.id, status);
    setShowAnswer(false);
  }

  function saveEdit(id: string, draft: CardDraft) {
    onUpdate(id, draft);
    setIsEditing(false);
  }

  function confirmDelete() {
    if (!card) return;

    onDelete(card.id);
    setIsConfirmingDelete(false);
    setShowAnswer(false);
  }

  return (
    <section className="card study-panel" aria-live="polite">
      <div className="panel-heading">
        <div>
          <h1>Study</h1>
          <p>{stats.active} card{stats.active === 1 ? "" : "s"} in active learning</p>
        </div>
        <span className="progress-label">{progress}% learned</span>
      </div>

      <div
        className="progress-line"
        style={{ "--progress": `${progress}%` } as React.CSSProperties}
        role="progressbar"
        aria-label="Learning progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div />
      </div>

      {card ? (
        <>
          <div className="flashcard">
            <div className="study-card-toolbar">
              <button
                className="study-card-tool"
                type="button"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
                <span>Edit</span>
              </button>

              <button
                className="study-card-tool danger-tool"
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <DeleteIcon />
                <span>Delete</span>
              </button>
            </div>
            <div>
              <small>{card.level} · {card.tags.join(", ") || "vocabulary"}</small>
              <h2>{card.article ? `${card.article} ` : ""}{card.german}</h2>
              {showAnswer && (
                <div className="answer">
                  <div className="translation">{card.translation}</div>
                  {card.plural && <div>Plural: {card.plural}</div>}
                  {card.example && <p>{card.example}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="study-actions">
            {!showAnswer ? (
              <button className="btn" type="button" onClick={() => setShowAnswer(true)}>
                <RevealIcon />
                <span>Show answer</span>
              </button>
            ) : (
              <>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => handleMove("learned")}
                >
                  <KnownIcon />
                  <span>I know this</span>
                </button>
                <button
                  className="btn danger"
                  type="button"
                  onClick={() => handleReview("again")}
                >
                  <AgainIcon />
                  <span>Again</span>
                </button>

                <button
                  className="btn warn"
                  type="button"
                  onClick={() => handleReview("hard")}
                >
                  <HardIcon />
                  <span>Hard</span>
                </button>

                <button
                  className="btn"
                  type="button"
                  onClick={() => handleReview("good")}
                >
                  <ActiveStudyIcon />
                  <span>Good</span>
                </button>

                <button
                  className="btn success"
                  type="button"
                  onClick={() => handleReview("easy")}
                >
                  <EasyIcon />
                  <span>Easy</span>
                </button>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => handleMove("future")}
                >
                  <LaterIcon />
                  <span>Later</span>
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flashcard empty-study">
          <div>
            <h2>You are all caught up</h2>
            <p>
              Restart your active cards for another round or review words
              waiting in Future learning.
            </p>

            <div className="empty-study-actions">
              {stats.active > 0 && (
                <button
                  className="btn compact-button"
                  type="button"
                  onClick={onRestartActive}
                >
                  <RestartIcon />
                  <span>Shuffle and restart Active</span>
                </button>
              )}

              {stats.future > 0 && (
                <button
                  className="btn secondary compact-button"
                  type="button"
                  onClick={onOpenFuture}
                >
                  <LaterIcon />
                  <span>Review future words</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {card && isEditing && (
        <EditCardModal
          card={card}
          onSave={saveEdit}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {card && isConfirmingDelete && (
        <ConfirmModal
          title="Delete card?"
          description={`"${card.german}" will be permanently removed from your library.`}
          confirmLabel="Delete card"
          onConfirm={confirmDelete}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}
    </section>
  );
}
