export type CardStatus = "active" | "learned" | "future";
export type GermanLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Flashcard = {
  id: string;
  german: string;
  translation: string;
  article?: string;
  plural?: string;
  example?: string;
  level: GermanLevel;
  tags: string[];
  status: CardStatus;
  ease: number;
  repetitions: number;
  nextReviewAt: string;
  createdAt: string;
  source: "manual" | "core" | "seed";
};

export type CandidateCard = Pick<
  Flashcard,
  "german" | "translation" | "article" | "plural" | "example" | "level" | "tags"
>;

export type CardDraft = {
  german: string;
  translation: string;
  article: string;
  plural: string;
  example: string;
  level: GermanLevel;
  status: CardStatus;
};

export type CardStats = Record<CardStatus, number>;
