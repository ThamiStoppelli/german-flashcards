"use client";

import { useState } from "react";
import type { CardStats, CardStatus, Flashcard } from "../types";

type StudyPanelProps = {
  card?: Flashcard;
  stats: CardStats;
  progress: number;
  onReview: (id: string, quality: "again" | "good") => void;
  onMove: (id: string, status: CardStatus) => void;
  onOpenFuture: () => void;
};

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
                Show answer
              </button>
            ) : (
              <>
                <button className="btn danger" type="button" onClick={() => handleReview("again")}>Again</button>
                <button className="btn" type="button" onClick={() => handleReview("good")}>Keep active</button>
                <button className="btn success" type="button" onClick={() => handleMove("learned")}>I know this</button>
                <button className="btn warn" type="button" onClick={() => handleMove("future")}>Later</button>
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
