"use client";

import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEY } from "../constants";
import { seedCards } from "../data/seed";
import { calculateNextReview, createCard, shuffle } from "../lib/cards";
import {
  exportCards,
  loadCards,
  readImportedCards,
  saveCards
} from "../lib/storage";
import type { CandidateCard, CardDraft, CardStatus, Flashcard } from "../types";

export function useFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [studyQueue, setStudyQueue] = useState<string[]>([]);

  useEffect(() => {
    const loadedCards = loadCards(STORAGE_KEY, seedCards);
    const now = Date.now();

    setCards(loadedCards);
    setStudyQueue(
      shuffle(
        loadedCards
          .filter(
            (card) =>
              card.status === "active" &&
              new Date(card.nextReviewAt).getTime() <= now,
          )
          .map((card) => card.id),
      ),
    );
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveCards(STORAGE_KEY, cards);
  }, [cards, loaded]);

  const currentCard = useMemo(() => {
    const currentId = studyQueue[0];

    if (!currentId) {
      return undefined;
    }

    return cards.find((card) => card.id === currentId);
  }, [cards, studyQueue]);

  const stats = useMemo(
    () => ({
      active: cards.filter((card) => card.status === "active").length,
      learned: cards.filter((card) => card.status === "learned").length,
      future: cards.filter((card) => card.status === "future").length,
    }),
    [cards],
  );

  const startedCards = stats.active + stats.learned;

  const progress = startedCards
    ? Math.round((stats.learned / startedCards) * 100)
    : 0;

  function addCard(
    card: CandidateCard,
    source: Flashcard["source"],
    status: CardStatus,
  ) {
    const createdCard = createCard(card, source, status);

    setCards((previous) => [createdCard, ...previous]);

    if (status === "active") {
      setStudyQueue((previous) => [createdCard.id, ...previous]);
    }
  }

  function addCards(
    newCards: CandidateCard[],
    source: Flashcard["source"],
    status: CardStatus,
  ) {
    const createdCards = newCards.map((card) =>
      createCard(card, source, status),
    );

    setCards((previous) => [...createdCards, ...previous]);

    if (status === "active") {
      setStudyQueue((previous) => [
        ...shuffle(createdCards.map((card) => card.id)),
        ...previous,
      ]);
    }
  }

  function updateCard(id: string, draft: CardDraft) {
    setCards((previous) =>
      previous.map((card) =>
        card.id === id
          ? {
            ...card,
            german: draft.german.trim(),
            translation: draft.translation.trim(),
            article: draft.article.trim(),
            plural: draft.plural.trim(),
            example: draft.example.trim(),
            level: draft.level,
            status: draft.status,
          }
          : card,
      ),
    );

    if (draft.status !== "active") {
      setStudyQueue((previous) =>
        previous.filter((cardId) => cardId !== id),
      );
    }
  }

  function moveCard(id: string, status: CardStatus) {
    setCards((previous) =>
      previous.map((card) =>
        card.id === id ? { ...card, status } : card,
      ),
    );

    setStudyQueue((previous) =>
      previous.filter((cardId) => cardId !== id),
    );
  }

  function reviewCard(id: string, quality: "again" | "good") {
    setCards((previous) =>
      previous.map((card) =>
        card.id === id
          ? {
            ...card,
            repetitions: quality === "again" ? 0 : card.repetitions + 1,
            ease:
              quality === "again"
                ? Math.max(1.3, card.ease - 0.2)
                : Math.min(3.2, card.ease + 0.08),
            nextReviewAt: calculateNextReview(card.repetitions, quality),
          }
          : card,
      ),
    );
    setStudyQueue((previous) =>
      previous.filter((cardId) => cardId !== id),
    );
  }

  function deleteCard(id: string) {
    setCards((previous) =>
      previous.filter((card) => card.id !== id),
    );

    setStudyQueue((previous) =>
      previous.filter((cardId) => cardId !== id),
    );
  }

  function deleteLearnedCards() {
    setCards((previous) =>
      previous.filter((card) => card.status !== "learned"),
    );
  }

  function restartActiveLearning() {
    const now = new Date().toISOString();
    const activeIds = cards
      .filter((card) => card.status === "active")
      .map((card) => card.id);

    setCards((previous) =>
      previous.map((card) =>
        card.status === "active"
          ? {
              ...card,
              nextReviewAt: now,
            }
          : card,
      ),
    );

    setStudyQueue(shuffle(activeIds));
  }

  function exportDeck() {
    exportCards(cards);
  }

  async function importDeck(
    file: File,
    mode: "merge" | "replace",
  ): Promise<{ imported: number; skipped: number }> {
    const importedCards = await readImportedCards(file);

    if (mode === "replace") {
      setCards(importedCards);
      setStudyQueue(
        shuffle(
          importedCards
            .filter((card) => card.status === "active")
            .map((card) => card.id),
        ),
      );

      return {
        imported: importedCards.length,
        skipped: 0,
      };
    }

    const existingKeys = new Set(
      cards.map(
        (card) =>
          `${card.level}:${card.german
            .trim()
            .toLocaleLowerCase("de")}`,
      ),
    );

    const uniqueCards = importedCards.filter((card) => {
      const key = `${card.level}:${card.german
        .trim()
        .toLocaleLowerCase("de")}`;

      if (existingKeys.has(key)) {
        return false;
      }

      existingKeys.add(key);
      return true;
    });

    setCards((previous) => [...uniqueCards, ...previous]);
    setStudyQueue((previous) => [
      ...shuffle(
        uniqueCards
          .filter((card) => card.status === "active")
          .map((card) => card.id),
      ),
      ...previous,
    ]);

    return {
      imported: uniqueCards.length,
      skipped: importedCards.length - uniqueCards.length,
    };
  }

  function resetCards() {
    setCards(seedCards);
    setStudyQueue(
      shuffle(
        seedCards
          .filter((card) => card.status === "active")
          .map((card) => card.id),
      ),
    );
  }

  function clearCards() {
    setCards([]);
    setStudyQueue([]);
  }

  return {
    cards,
    currentCard,
    stats,
    progress,
    exportDeck,
    importDeck,
    addCard,
    addCards,
    updateCard,
    moveCard,
    reviewCard,
    deleteCard,
    deleteLearnedCards,
  restartActiveLearning,
    resetCards,
    clearCards,
  };
}
