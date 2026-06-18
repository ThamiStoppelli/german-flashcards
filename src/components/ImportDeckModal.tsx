"use client";
import { useEffect } from "react";

type ImportDeckModalProps = {
    fileName: string;
    isImporting: boolean;
    onMerge: () => void;
    onReplace: () => void;
    onCancel: () => void;
};

function MergeIcon() {
    return (
        <svg
            aria-hidden="true"
            className="import-modal-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 7h6a4 4 0 0 1 4 4v6" />
            <path d="m11 14 3 3 3-3" />
            <path d="M4 17h4" />
        </svg>
    );
}

function ReplaceIcon() {
    return (
        <svg
            aria-hidden="true"
            className="import-modal-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6v5h-5" />
            <path d="M4 18v-5h5" />
            <path d="M18.5 9A7 7 0 0 0 6 6.5L4 9" />
            <path d="M5.5 15A7 7 0 0 0 18 17.5l2-2.5" />
        </svg>
    );
}

export function ImportDeckModal({
    fileName,
    isImporting,
    onMerge,
    onReplace,
    onCancel,
}: ImportDeckModalProps) {

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isImporting) {
                onCancel();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isImporting, onCancel]);

    return (
        <div
            className="modal-backdrop"
            role="presentation"
            onPointerDown={(event) => {
                if (event.target === event.currentTarget && !isImporting) {
                    onCancel();
                }
            }}
        >
            <section
                className="import-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="import-modal-title"
                aria-describedby="import-modal-description"
            >
                <div className="import-modal-heading">
                    <div>
                        <h2 id="import-modal-title">Import deck</h2>
                        <p id="import-modal-description">
                            Choose how the imported cards should be added.
                        </p>
                    </div>

                    <button
                        className="modal-close-button"
                        type="button"
                        aria-label="Close import dialog"
                        disabled={isImporting}
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>

                <div className="import-file-summary">
                    <span>Selected file</span>
                    <strong>{fileName}</strong>
                </div>

                <div className="import-choice-list">
                    <button
                        className="import-choice"
                        type="button"
                        disabled={isImporting}
                        onClick={onMerge}
                    >
                        <MergeIcon />

                        <span>
                            <strong>Merge with current deck</strong>
                            <small>
                                Keep your current cards and skip imported duplicates.
                            </small>
                        </span>
                    </button>

                    <button
                        className="import-choice danger-choice"
                        type="button"
                        disabled={isImporting}
                        onClick={onReplace}
                    >
                        <ReplaceIcon />

                        <span>
                            <strong>Replace current deck</strong>
                            <small>
                                Remove the current cards and use only the imported deck.
                            </small>
                        </span>
                    </button>
                </div>

                <button
                    className="btn secondary import-cancel-button"
                    type="button"
                    disabled={isImporting}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </section>
        </div>
    );
}