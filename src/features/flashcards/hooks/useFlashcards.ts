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
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    setCards(loadCards(STORAGE_KEY, seedCards));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveCards(STORAGE_KEY, cards);
  }, [cards, loaded]);

  const dueCards = useMemo(() => {
    const now = Date.now();
    return shuffle(
      cards.filter(
        (card) => card.status === "active" && new Date(card.nextReviewAt).getTime() <= now,
      ),
    );
  }, [cards]);

  const currentCard = useMemo(() => {
    if (currentId) {
      return cards.find((card) => card.id === currentId) ?? dueCards[0];
    }

    return dueCards[0];
  }, [cards, currentId, dueCards]);

  const stats = useMemo(
    () => ({
      active: cards.filter((card) => card.status === "active").length,
      learned: cards.filter((card) => card.status === "learned").length,
      future: cards.filter((card) => card.status === "future").length,
    }),
    [cards],
  );

  const progress = cards.length ? Math.round((stats.learned / cards.length) * 100) : 0;

  function addCard(card: CandidateCard, source: Flashcard["source"], status: CardStatus) {
    setCards((previous) => [createCard(card, source, status), ...previous]);
  }

  function addCards(newCards: CandidateCard[], source: Flashcard["source"], status: CardStatus) {
    setCards((previous) => [
      ...newCards.map((card) => createCard(card, source, status)),
      ...previous,
    ]);
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
  }

  function moveCard(id: string, status: CardStatus) {
    setCards((previous) =>
      previous.map((card) => (card.id === id ? { ...card, status } : card)),
    );
    setCurrentId(null);
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
    setCurrentId(null);
  }

  function deleteCard(id: string) {
    setCards((previous) => previous.filter((card) => card.id !== id));
    setCurrentId(null);
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
      setCurrentId(null);

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
    setCurrentId(null);

    return {
      imported: uniqueCards.length,
      skipped: importedCards.length - uniqueCards.length,
    };
  }

  function resetCards() {
    setCards(seedCards);
    setCurrentId(null);
  }

  function clearCards() {
    setCards([]);
    setCurrentId(null);
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
    resetCards,
    clearCards,
  };
}
