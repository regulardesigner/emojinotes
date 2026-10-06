import { useReducer } from 'react';
import { useNavigate } from 'react-router';

import { createNote } from '../../lib/api';
import { draftReducer, initialDraft } from './draftReducer';
import { EmojiStep } from './EmojiStep';
import { MessageStep } from './MessageStep';
import { PreviewStep } from './PreviewStep';

export function NewNote() {
  const [draft, dispatch] = useReducer(draftReducer, initialDraft);
  const { step, message, emoji, saving, saveError } = draft;
  const navigate = useNavigate();

  const save = async () => {
    if (!emoji || saving) return;
    dispatch({ type: 'saveStarted' });
    try {
      const { token } = await createNote({ emoji, note: message });
      navigate(`/share/${token}`, { state: { created: true } });
    } catch {
      dispatch({ type: 'saveFailed' });
    }
  };

  return (
    <>
      <title>Create an emoji-note · Emoji-notes</title>
      {step === 'message' && (
        <MessageStep message={message} focusHeading={draft.messageSubmitted} dispatch={dispatch} />
      )}
      {step === 'emoji' && <EmojiStep initialEmoji={emoji} dispatch={dispatch} />}
      {step === 'preview' && emoji && (
        <PreviewStep
          emoji={emoji}
          message={message}
          saving={saving}
          saveError={saveError}
          onSave={save}
          dispatch={dispatch}
        />
      )}
    </>
  );
}
