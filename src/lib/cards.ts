import type { CandidateCard, CardStatus, Flashcard } from "../types";

export function createCard(
  card: CandidateCard,
  source: Flashcard["source"],
  status: CardStatus = "active",
): Flashcard {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    german: card.german.trim(),
    translation: card.translation.trim(),
    article: card.article?.trim(),
    plural: card.plural?.trim(),
    example: card.example?.trim(),
    level: card.level,
    tags: card.tags ?? [],
    status,
    ease: 2.5,
    repetitions: 0,
    nextReviewAt: now,
    createdAt: now,
    source,
  };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

export function calculateNextReview(
  repetitions: number,
  quality: "again" | "good",
): string {
  if (quality === "again") {
    return new Date(Date.now() + 1000 * 60 * 10).toISOString();
  }

  const days = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.min(30, repetitions * 5);
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * days).toISOString();
}
