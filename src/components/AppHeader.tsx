"use client";
import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { ImportDeckModal } from "./ImportDeckModal";

type ImportResult = {
  imported: number;
  skipped: number;
};

type AppHeaderProps = {
  onExport: () => void;
  onImport: (
    file: File,
    mode: "merge" | "replace",
  ) => Promise<ImportResult>;
  onReset: () => void;
  onClear: () => void;
};

type HeaderIconProps = {
  children: ReactNode;
};

function HeaderIcon({ children }: HeaderIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="header-action-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function ImportIcon() {
  return (
    <HeaderIcon>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </HeaderIcon>
  );
}

function ExportIcon() {
  return (
    <HeaderIcon>
      <path d="M12 21V9" />
      <path d="m7 14 5-5 5 5" />
      <path d="M5 3h14" />
    </HeaderIcon>
  );
}

function ResetIcon() {
  return (
    <HeaderIcon>
      <path d="M4 10a8 8 0 1 1 2 7" />
      <path d="M4 4v6h6" />
    </HeaderIcon>
  );
}

function ClearIcon() {
  return (
    <HeaderIcon>
      <path d="M4 7h16" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
      <path d="m6 7 1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </HeaderIcon>
  );
}

export function AppHeader({
  onExport,
  onImport,
  onReset,
  onClear,
}: AppHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  function handleImport(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPendingFile(file);
    setMessage("");
    event.target.value = "";
  }

  async function confirmImport(mode: "merge" | "replace") {
    if (!pendingFile) {
      return;
    }

    setIsImporting(true);

    try {
      const result = await onImport(pendingFile, mode);

      setMessage(
        mode === "replace"
          ? `Imported ${result.imported} cards and replaced the current deck.`
          : `Imported ${result.imported} cards. ${result.skipped} duplicates were skipped.`,
      );

      setPendingFile(null);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The deck could not be imported.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-mark" aria-hidden="true">W</div>
        <div>
          <div>Wortschatz</div>
          <small>German flashcards</small>
        </div>
      </div>

      <div className="header-actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImport}
        />

        <button
          className="btn secondary"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImportIcon />
          <span>Import deck</span>
        </button>

        <button
          className="btn secondary"
          type="button"
          onClick={onExport}
        >
          <ExportIcon />
          <span>Export deck</span>
        </button>
        <button className="btn secondary" type="button" onClick={onReset}>
          <ResetIcon />
          <span>Reset demo</span>
        </button>
        <button className="btn danger" type="button" onClick={onClear}>
          <ClearIcon />
          <span>Clear all</span>
        </button>

        {message && (
          <div className="header-notice" role="status">
            {message}
          </div>
        )}
      </div>

      {pendingFile && (
        <ImportDeckModal
          fileName={pendingFile.name}
          isImporting={isImporting}
          onMerge={() => confirmImport("merge")}
          onReplace={() => confirmImport("replace")}
          onCancel={() => {
            if (!isImporting) {
              setPendingFile(null);
            }
          }}
        />
      )}

    </header>
  );
}
