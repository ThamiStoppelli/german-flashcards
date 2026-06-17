import type { Flashcard } from "../types";

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
