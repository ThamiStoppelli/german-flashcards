"use client";
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
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

function MoreIcon() {
  return (
    <HeaderIcon>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleImport(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPendingFile(file);
    setMessage("");
    setIsMobileMenuOpen(false);
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

  function handleExport() {
    onExport();
    setIsMobileMenuOpen(false);
  }

  function handleReset() {
    onReset();
    setIsMobileMenuOpen(false);
  }

  function handleClear() {
    onClear();
    setIsMobileMenuOpen(false);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
    setIsMobileMenuOpen(false);
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

        <div className="desktop-header-actions">
          <button
            className="btn secondary"
            type="button"
            onClick={handleImportClick}
          >
            <ImportIcon />
            <span>Import deck</span>
          </button>
          <button
            className="btn secondary"
            type="button"
            onClick={handleExport}
          >
            <ExportIcon />
            <span>Export deck</span>
          </button>
          <button 
            className="btn secondary" type="button" 
            onClick={handleReset}
          >
            <ResetIcon />
            <span>Reset demo</span>
          </button>
          <button 
            className="btn danger" type="button" 
            onClick={handleClear}
          >
            <ClearIcon />
            <span>Clear all</span>
          </button>
        </div>

        <div className="mobile-header-menu" ref={mobileMenuRef}>
          <button
            className="mobile-header-menu-button"
            type="button"
            aria-label="Open application menu"
            aria-expanded={isMobileMenuOpen}
            aria-haspopup="menu"
            onClick={() => {
              setIsMobileMenuOpen((current) => !current);
            }}
          >
            <MoreIcon />
          </button>

          {isMobileMenuOpen && (
            <div
              className="header-action-menu"
              role="menu"
              aria-label="Application actions"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleImportClick}
              >
                <ImportIcon />
                <span>Import deck</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleExport}
              >
                <ExportIcon />
                <span>Export deck</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleReset}
              >
                <ResetIcon />
                <span>Reset demo</span>
              </button>

              <div className="header-action-menu-divider" />

              <button
                className="header-menu-danger"
                type="button"
                role="menuitem"
                onClick={handleClear}
              >
                <ClearIcon />
                <span>Clear all</span>
              </button>
            </div>
          )}
        </div> 

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
