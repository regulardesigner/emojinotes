import { Link, useParams } from 'react-router';

import { EmojiCard } from '../components/EmojiCard';
import { Heading } from '../components/Heading';
import { Loader } from '../components/Loader';
import { NoteError } from '../components/NoteError';
import { useNote } from '../lib/useNote';

export function ViewNote() {
  const { token = '' } = useParams();
  const result = useNote(token);

  if (!result) {
    return <Loader label="Loading your emoji-note…" />;
  }

  return (
    <>
      <title>You received an emoji-note!</title>
      {result.status === 'success' ? (
        <>
          <Heading>You received an emoji-note!</Heading>
          <EmojiCard emoji={result.note.emoji} message={result.note.note} />
        </>
      ) : (
        <NoteError status={result.status} />
      )}
      <Link className="btn" to="/new">
        Create your own emoji-note
      </Link>
    </>
  );
}
