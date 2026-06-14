type AppHeaderProps = {
  onReset: () => void;
  onClear: () => void;
};

export function AppHeader({ onReset, onClear }: AppHeaderProps) {
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
        <button className="btn secondary" type="button" onClick={onReset}>
          Reset demo
        </button>
        <button className="btn danger" type="button" onClick={onClear}>
          Clear all
        </button>
      </div>
    </header>
  );
}
