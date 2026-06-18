import { GERMAN_LEVELS, STATUS_LABELS } from "../constants";
import type { CardDraft, CardStatus, GermanLevel } from "../types";
import { SelectMenu } from "./SelectMenu";

type CardFieldsProps = {
  value: CardDraft;
  onChange: (value: CardDraft) => void;
  includeStatus?: boolean;
};

const LEVEL_OPTIONS = GERMAN_LEVELS.map((level) => ({
  value: level,
  label: level,
}));

const STATUS_OPTIONS = (
  Object.keys(STATUS_LABELS) as CardStatus[]
).map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

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
        <SelectMenu
          ariaLabel="German level"
          value={value.level}
          options={LEVEL_OPTIONS}
          onChange={(level: GermanLevel) =>
            onChange({
              ...value,
              level,
            })
          }
        />
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
        <SelectMenu
          ariaLabel="Destination deck"
          value={value.status}
          options={STATUS_OPTIONS}
          onChange={(status: CardStatus) =>
            onChange({
              ...value,
              status,
            })
          }
        />
      )}
    </>
  );
}
