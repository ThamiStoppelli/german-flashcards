"use client";

import { useState, type ReactNode } from "react";
import type { CardStats, CardStatus, Flashcard } from "../types";

type StudyPanelProps = {
  card?: Flashcard;
  stats: CardStats;
  progress: number;
  onReview: (id: string, quality: "again" | "good") => void;
  onMove: (id: string, status: CardStatus) => void;
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

export function StudyPanel({
  card,
  stats,
  progress,
  onReview,
  onMove,
  onOpenFuture,
}: StudyPanelProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  function handleReview(quality: "again" | "good") {
    if (!card) return;
    onReview(card.id, quality);
    setShowAnswer(false);
  }

  function handleMove(status: CardStatus) {
    if (!card) return;
    onMove(card.id, status);
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
                  className="btn danger"
                  type="button"
                  onClick={() => handleReview("again")}
                >
                  <AgainIcon />
                  <span>Again</span>
                </button>

                <button
                  className="btn"
                  type="button"
                  onClick={() => handleReview("good")}
                >
                  <ActiveStudyIcon />
                  <span>Keep active</span>
                </button>

                <button
                  className="btn success"
                  type="button"
                  onClick={() => handleMove("learned")}
                >
                  <KnownIcon />
                  <span>I know this</span>
                </button>

                <button
                  className="btn warn"
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
            <p>Move words from Future Learning into Active when you are ready.</p>
            <button className="btn secondary" type="button" onClick={onOpenFuture}>
              Review future words
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
