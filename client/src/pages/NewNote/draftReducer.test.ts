import { describe, expect, it } from 'vitest';

import { draftReducer, initialDraft, isMessageValid, type DraftState } from './draftReducer';

describe('isMessageValid', () => {
  it('rejects blank messages', () => {
    expect(isMessageValid('   ')).toBe(false);
  });

  it('accepts up to 150 characters, counting emoji as one', () => {
    expect(isMessageValid('💌'.repeat(150))).toBe(true);
    expect(isMessageValid('a'.repeat(151))).toBe(false);
  });
});

describe('draftReducer', () => {
  it('only moves to the emoji step with a valid message', () => {
    expect(draftReducer(initialDraft, { type: 'messageSubmitted' }).step).toBe('message');

    const withMessage = draftReducer(initialDraft, { type: 'messageChanged', message: 'Hi!' });
    expect(draftReducer(withMessage, { type: 'messageSubmitted' })).toMatchObject({
      step: 'emoji',
      messageSubmitted: true,
    });
  });

  it('goes back one step and keeps the draft', () => {
    const state: DraftState = { ...initialDraft, step: 'preview', message: 'Hi!', emoji: 'heart eyes' };
    const back = draftReducer(state, { type: 'back' });
    expect(back).toMatchObject({ step: 'emoji', message: 'Hi!', emoji: 'heart eyes' });
  });

  it('tracks the save lifecycle', () => {
    const preview: DraftState = { ...initialDraft, step: 'preview', message: 'Hi!', emoji: 'heart eyes' };
    const saving = draftReducer(preview, { type: 'saveStarted' });
    expect(saving.saving).toBe(true);

    const failed = draftReducer(saving, { type: 'saveFailed' });
    expect(failed).toMatchObject({ saving: false, saveError: true, step: 'preview' });
  });
});
