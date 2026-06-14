import type { CardDraft, CardStatus, GermanLevel } from "./types";

export const STORAGE_KEY = "wortschatz-ai-cards-v1";

export const GERMAN_LEVELS: GermanLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const STATUS_LABELS: Record<CardStatus, string> = {
  active: "Active learning",
  learned: "Learned",
  future: "Future learning",
};

export const SHORT_STATUS_LABELS: Record<CardStatus, string> = {
  active: "Active",
  learned: "Learned",
  future: "Future",
};

export const EMPTY_CARD_DRAFT: CardDraft = {
  german: "",
  translation: "",
  article: "",
  plural: "",
  example: "",
  level: "A1",
  status: "active",
};
