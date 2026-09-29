import { useState, type Dispatch } from 'react';

import { Heading } from '../../components/Heading';
import { EMOJIS, type EmojiKey } from '../../lib/emojis';
import type { DraftAction } from './draftReducer';

interface EmojiStepProps {
  initialEmoji: EmojiKey | null;
  dispatch: Dispatch<DraftAction>;
}

export function EmojiStep({ initialEmoji, dispatch }: EmojiStepProps) {
  const [selected, setSelected] = useState<EmojiKey | null>(initialEmoji);

  return (
    <form
      className="step"
      onSubmit={(event) => {
        event.preventDefault();
        if (selected) dispatch({ type: 'emojiSubmitted', emoji: selected });
      }}
    >
      <fieldset className="emoji-picker">
        <legend>
          <Heading>Choose your emoji wisely</Heading>
        </legend>
        {EMOJIS.map((emoji) => (
          <label key={emoji.key} className="emoji-option">
            <input
              type="radio"
              name="emoji"
              value={emoji.key}
              checked={selected === emoji.key}
              onChange={() => setSelected(emoji.key)}
              className="visually-hidden"
            />
            <span aria-hidden="true">{emoji.char}</span>
            <span className="visually-hidden">{emoji.label}</span>
          </label>
        ))}
      </fieldset>
      <button className="btn" type="submit" disabled={!selected}>
        Preview your emoji-note
      </button>
      <button className="btn btn--secondary" type="button" onClick={() => dispatch({ type: 'back' })}>
        Back
      </button>
    </form>
  );
}
