import { countChars, NOTE_MAX_LENGTH, type EmojiKey } from '../../lib/emojis';

export type Step = 'message' | 'emoji' | 'preview';

export interface DraftState {
  step: Step;
  message: string;
  emoji: EmojiKey | null;
  // True once the user has gone past the message step, e.g. to come back to it.
  messageSubmitted: boolean;
  saving: boolean;
  saveError: boolean;
}

export type DraftAction =
  | { type: 'messageChanged'; message: string }
  | { type: 'messageSubmitted' }
  | { type: 'emojiSubmitted'; emoji: EmojiKey }
  | { type: 'back' }
  | { type: 'saveStarted' }
  | { type: 'saveFailed' };

export const initialDraft: DraftState = {
  step: 'message',
  message: '',
  emoji: null,
  messageSubmitted: false,
  saving: false,
  saveError: false,
};

export const isMessageValid = (message: string) =>
  message.trim() !== '' && countChars(message) <= NOTE_MAX_LENGTH;

const previousStep: Partial<Record<Step, Step>> = { emoji: 'message', preview: 'emoji' };

export function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'messageChanged':
      return { ...state, message: action.message };
    case 'messageSubmitted':
      return isMessageValid(state.message) ? { ...state, step: 'emoji', messageSubmitted: true } : state;
    case 'emojiSubmitted':
      return { ...state, emoji: action.emoji, step: 'preview' };
    case 'back':
      return { ...state, step: previousStep[state.step] ?? state.step, saveError: false };
    case 'saveStarted':
      return { ...state, saving: true, saveError: false };
    case 'saveFailed':
      return { ...state, saving: false, saveError: true };
  }
}
