import type { Dispatch } from 'react';

import { EmojiCard } from '../../components/EmojiCard';
import { Heading } from '../../components/Heading';
import type { DraftAction } from './draftReducer';

interface PreviewStepProps {
  emoji: string;
  message: string;
  saving: boolean;
  saveError: boolean;
  onSave: () => void;
  dispatch: Dispatch<DraftAction>;
}

export function PreviewStep({ emoji, message, saving, saveError, onSave, dispatch }: PreviewStepProps) {
  return (
    <div className="step">
      <Heading>Looks good?</Heading>
      <EmojiCard emoji={emoji} message={message} />
      {saveError && (
        <p className="error" role="alert">
          We couldn’t save your emoji-note. Please try again.
        </p>
      )}
      <button className="btn" type="button" onClick={onSave} disabled={saving} aria-busy={saving}>
        {saving ? 'Saving…' : 'Save and share'}
      </button>
      <button
        className="btn btn--secondary"
        type="button"
        onClick={() => dispatch({ type: 'back' })}
        disabled={saving}
      >
        Back
      </button>
    </div>
  );
}
