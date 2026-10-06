import { Heading } from './Heading';

export function NoteError({ status }: { status: 'not-found' | 'error' }) {
  return status === 'not-found' ? (
    <>
      <Heading>
        <span aria-hidden="true">🕵️ </span>This emoji-note doesn’t exist
      </Heading>
      <p className="baseline">Check that the link is complete.</p>
    </>
  ) : (
    <>
      <Heading>
        <span aria-hidden="true">😵 </span>Something went wrong
      </Heading>
      <p className="baseline">We couldn’t load this emoji-note. Please try again later.</p>
    </>
  );
}
