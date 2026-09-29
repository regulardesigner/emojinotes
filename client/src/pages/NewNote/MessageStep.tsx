import type { Dispatch } from 'react';

import { Heading } from '../../components/Heading';
import { countChars, NOTE_MAX_LENGTH } from '../../lib/emojis';
import { isMessageValid, type DraftAction } from './draftReducer';

interface MessageStepProps {
  message: string;
  // False on the first visit, where the textarea takes focus instead.
  focusHeading: boolean;
  dispatch: Dispatch<DraftAction>;
}

export function MessageStep({ message, focusHeading, dispatch }: MessageStepProps) {
  const length = countChars(message);
  const tooLong = length > NOTE_MAX_LENGTH;

  return (
    <form
      className="step"
      onSubmit={(event) => {
        event.preventDefault();
        dispatch({ type: 'messageSubmitted' });
      }}
    >
      <Heading autoFocus={focusHeading}>
        <label htmlFor="message">Write your message</label>
      </Heading>
      <textarea
        id="message"
        className="message-textarea"
        value={message}
        onChange={(event) => dispatch({ type: 'messageChanged', message: event.target.value })}
        placeholder="Enter your message here"
        rows={6}
        aria-describedby="message-counter"
        aria-invalid={tooLong}
        autoFocus={!focusHeading}
      />
      <p id="message-counter" className={tooLong ? 'counter counter--error' : 'counter'}>
        {length}/{NOTE_MAX_LENGTH}
      </p>
      {tooLong && (
        <p className="error" role="alert">
          <span aria-hidden="true">🚨 </span>Your message is too long.
        </p>
      )}
      <button className="btn" type="submit" disabled={!isMessageValid(message)}>
        Next: pick an emoji
      </button>
    </form>
  );
}
