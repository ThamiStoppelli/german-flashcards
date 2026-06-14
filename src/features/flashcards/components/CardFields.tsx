import { GERMAN_LEVELS, STATUS_LABELS } from "../constants";
import type { CardDraft, CardStatus, GermanLevel } from "../types";

type CardFieldsProps = {
  value: CardDraft;
  onChange: (value: CardDraft) => void;
  includeStatus?: boolean;
};

export function CardFields({ value, onChange, includeStatus = true }: CardFieldsProps) {
  return (
    <>
      <input
        className="input"
        aria-label="German word"
        placeholder="German word"
        value={value.german}
        onChange={(event) => onChange({ ...value, german: event.target.value })}
      />
      <input
        className="input"
        aria-label="Translation"
        placeholder="Translation"
        value={value.translation}
        onChange={(event) => onChange({ ...value, translation: event.target.value })}
      />
      <div className="two-columns">
        <input
          className="input"
          aria-label="Article"
          placeholder="Article"
          value={value.article}
          onChange={(event) => onChange({ ...value, article: event.target.value })}
        />
        <select
          aria-label="German level"
          value={value.level}
          onChange={(event) => onChange({ ...value, level: event.target.value as GermanLevel })}
        >
          {GERMAN_LEVELS.map((level) => <option key={level}>{level}</option>)}
        </select>
      </div>
      <input
        className="input"
        aria-label="Plural"
        placeholder="Plural, optional"
        value={value.plural}
        onChange={(event) => onChange({ ...value, plural: event.target.value })}
      />
      <textarea
        aria-label="Example sentence"
        placeholder="Example sentence, optional"
        value={value.example}
        onChange={(event) => onChange({ ...value, example: event.target.value })}
      />
      {includeStatus && (
        <select
          aria-label="Destination deck"
          value={value.status}
          onChange={(event) => onChange({ ...value, status: event.target.value as CardStatus })}
        >
          {(Object.keys(STATUS_LABELS) as CardStatus[]).map((status) => (
            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
          ))}
        </select>
      )}
    </>
  );
}
