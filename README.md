# Wortschatz

A German flashcard app built with Next.js and TypeScript. It includes active, learned, and future learning decks, editable cards, spaced review scheduling, and a built-in CEFR vocabulary library.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Architecture

The App Router folder contains only route-level files. The flashcard feature is colocated under `src/features/flashcards`:

```text
app/
  globals.css
  layout.tsx
  page.tsx
src/features/flashcards/
  components/
    AddVocabularyPanel.tsx
    AppHeader.tsx
    CardFields.tsx
    CoreVocabularyPanel.tsx
    DeckCard.tsx
    DeckLibrary.tsx
    FlashcardApp.tsx
    StudyPanel.tsx
  data/
    seed.ts
    vocabulary.ts
  hooks/
    useFlashcards.ts
  lib/
    cards.ts
    storage.ts
  constants.ts
  types.ts
```

Responsibilities are separated as follows:

* `components` contains focused presentation and interaction components.
* `useFlashcards` owns card state, derived data, persistence, and domain actions.
* `lib` contains pure card utilities and the local storage adapter.
* `data` contains static seed and CEFR vocabulary data.
* `types.ts` and `constants.ts` centralize shared contracts and labels.

The storage adapter can later be replaced with Supabase without rewriting the UI components.

## Current storage

Cards are stored in browser `localStorage`. This keeps the app free and simple, but data does not sync between devices yet.
