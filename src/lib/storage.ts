import type { Flashcard, CandidateCard } from "../types";

export function loadCards(storageKey: string, fallback: Flashcard[]): Flashcard[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Flashcard[]) : fallback;
  } catch {
    return fallback;
  }
}

export function saveCards(storageKey: string, cards: Flashcard[]): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(cards));
  } catch {
  }
}

type DeckExport = {
  app: "wortschatz";
  version: 1;
  exportedAt: string;
  cards: Flashcard[];
};

export function exportCards(cards: Flashcard[]): void {
  const deck: DeckExport = {
    app: "wortschatz",
    version: 1,
    exportedAt: new Date().toISOString(),
    cards,
  };

  const fileContent = JSON.stringify(deck, null, 2);

  const blob = new Blob([fileContent], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `wortschatz-deck-${date}.json`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function isFlashcard(value: unknown): value is Flashcard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const card = value as Partial<Flashcard>;

  const validLevel =
    card.level === "A1" ||
    card.level === "A2" ||
    card.level === "B1" ||
    card.level === "B2" ||
    card.level === "C1" ||
    card.level === "C2";

  const validStatus =
    card.status === "active" ||
    card.status === "learned" ||
    card.status === "future";

  const validSource =
    card.source === "manual" ||
    card.source === "core" ||
    card.source === "seed";

  return (
    typeof card.id === "string" &&
    typeof card.german === "string" &&
    typeof card.translation === "string" &&
    validLevel &&
    validStatus &&
    validSource &&
    Array.isArray(card.tags) &&
    typeof card.ease === "number" &&
    typeof card.repetitions === "number" &&
    typeof card.nextReviewAt === "string" &&
    typeof card.createdAt === "string"
  );
}

function isCandidateCard(value: unknown): value is CandidateCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const card = value as Partial<CandidateCard>;

  const validLevel =
    card.level === "A1" ||
    card.level === "A2" ||
    card.level === "B1" ||
    card.level === "B2" ||
    card.level === "C1" ||
    card.level === "C2";

  const validTags =
    card.tags === undefined || Array.isArray(card.tags);

  return (
    typeof card.german === "string" &&
    card.german.trim().length > 0 &&
    typeof card.translation === "string" &&
    card.translation.trim().length > 0 &&
    validLevel &&
    validTags
  );
}

export async function readImportedCards(
  file: File,
): Promise<Flashcard[]> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  let importedCards: unknown[];

  if (Array.isArray(parsed)) {
    importedCards = parsed;
  } else if (parsed && typeof parsed === "object") {
    const deck = parsed as {
      app?: string;
      version?: number;
      cards?: unknown[];
    };

    if (
      deck.app !== "wortschatz" ||
      deck.version !== 1 ||
      !Array.isArray(deck.cards)
    ) {
      throw new Error("This is not a supported Wortschatz deck file.");
    }

    importedCards = deck.cards;
  } else {
    throw new Error("This is not a valid Wortschatz deck.");
  }

  const now = new Date().toISOString();

  return importedCards.map((value, index) => {
    if (isFlashcard(value)) {
      return value;
    }

    if (isCandidateCard(value)) {
      return {
        id: crypto.randomUUID(),
        german: value.german.trim(),
        translation: value.translation.trim(),
        article: value.article,
        plural: value.plural,
        example: value.example,
        level: value.level,
        tags: value.tags ?? [],
        status: "active",
        ease: 2.5,
        repetitions: 0,
        nextReviewAt: now,
        createdAt: now,
        source: "manual",
      };
    }

    throw new Error(
      `Card ${index + 1} has an invalid format.`,
    );
  });
}