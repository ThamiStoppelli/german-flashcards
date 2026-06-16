"use client";

import { useState } from "react";
import { useFlashcards } from "../hooks/useFlashcards";
import type { CardStatus } from "../types";
import { AddVocabularyPanel } from "./AddVocabularyPanel";
import { AppHeader } from "./AppHeader";
import { CoreVocabularyPanel } from "./CoreVocabularyPanel";
import { DeckLibrary } from "./DeckLibrary";
import { StudyPanel } from "./StudyPanel";

export default function FlashcardApp() {
  const [activeTab, setActiveTab] = useState<CardStatus>("active");
  const flashcards = useFlashcards();

  return (
    <main className="app-shell">
      <AppHeader onReset={flashcards.resetCards} onClear={flashcards.clearCards} />

      <div className="dashboard-grid">
        <StudyPanel
          card={flashcards.currentCard}
          stats={flashcards.stats}
          progress={flashcards.progress}
          onReview={flashcards.reviewCard}
          onMove={flashcards.moveCard}
          onOpenFuture={() => setActiveTab("future")}
        />

        <DeckLibrary
          cards={flashcards.cards}
          stats={flashcards.stats}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUpdate={flashcards.updateCard}
          onMove={flashcards.moveCard}
          onDelete={flashcards.deleteCard}
        />

        <div className="secondary-panels">
          <AddVocabularyPanel onAdd={flashcards.addCard} />

          <div className="core-panel-slot">
            <CoreVocabularyPanel
              existingCards={flashcards.cards}
              onAddMany={flashcards.addCards}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
