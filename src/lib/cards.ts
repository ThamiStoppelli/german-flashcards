import type {
  CandidateCard,
  CardStatus,
  Flashcard,
  ReviewRating,
} from "../types";

const MIN_EASE = 1.3;
const MAX_EASE = 3.2;
const MAX_INTERVAL_DAYS = 365;

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function clampInterval(days: number): number {
  return Math.min(MAX_INTERVAL_DAYS, Math.max(1, days));
}

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
    intervalDays: 0,
    lapses: 0,
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

export function scheduleReview(
  card: Flashcard,
  rating: ReviewRating,
): Flashcard {
  const now = new Date();

  let ease = card.ease ?? 2.5;
  let repetitions = card.repetitions ?? 0;
  let intervalDays = card.intervalDays ?? 0;
  let lapses = card.lapses ?? 0;

  if (rating === "again") {
    ease = Math.max(MIN_EASE, ease - 0.2);
    repetitions = 0;
    intervalDays = 0;
    lapses += 1;

    return {
      ...card,
      status: "active",
      ease,
      repetitions,
      intervalDays,
      lapses,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: addMinutes(now, 10).toISOString(),
    };
  }

  if (rating === "hard") {
    ease = Math.max(MIN_EASE, ease - 0.15);
    repetitions += 1;

    intervalDays =
      intervalDays <= 0
        ? 1
        : clampInterval(Math.ceil(intervalDays * 1.2));

    return {
      ...card,
      status: "active",
      ease,
      repetitions,
      intervalDays,
      lapses,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: addDays(now, intervalDays).toISOString(),
    };
  }

  if (rating === "good") {
    repetitions += 1;

    if (card.repetitions === 0) {
      intervalDays = 1;
    } else if (card.repetitions === 1) {
      intervalDays = 3;
    } else {
      intervalDays = clampInterval(
        Math.round(Math.max(1, intervalDays) * ease),
      );
    }

    return {
      ...card,
      status: "active",
      ease,
      repetitions,
      intervalDays,
      lapses,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: addDays(now, intervalDays).toISOString(),
    };
  }

  ease = Math.min(MAX_EASE, ease + 0.15);
  repetitions += 1;

  if (card.repetitions === 0) {
    intervalDays = 3;
  } else if (card.repetitions === 1) {
    intervalDays = 5;
  } else {
    intervalDays = clampInterval(
      Math.round(Math.max(1, intervalDays) * ease * 1.3),
    );
  }

  return {
    ...card,
    status: "active",
    ease,
    repetitions,
    intervalDays,
    lapses,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addDays(now, intervalDays).toISOString(),
  };
}