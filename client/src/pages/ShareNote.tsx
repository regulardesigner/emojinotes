import { Link, useLocation, useParams } from 'react-router';

import { Loader } from '../components/Loader';
import { NoteError } from '../components/NoteError';
import { noteUrl } from '../lib/api';
import { useNote } from '../lib/useNote';
import { ShareStep } from './NewNote/ShareStep';

// Last step of the creation flow. It has its own URL so a reload or the browser's
// back/forward buttons never lose the link to a note that was just saved.
export function ShareNote() {
  const { token = '' } = useParams();
  const justCreated = (useLocation().state as { created?: boolean } | null)?.created === true;
  const result = useNote(token);

  if (!result) {
    return <Loader />;
  }

  if (result.status !== 'success') {
    return (
      <>
        <NoteError status={result.status} />
        <Link className="btn" to="/new">
          Create an emoji-note
        </Link>
      </>
    );
  }

  return (
    <>
      <title>Share your emoji-note · Emoji-notes</title>
      <ShareStep
        emoji={result.note.emoji}
        message={result.note.note}
        url={noteUrl(token)}
        justCreated={justCreated}
      />
    </>
  );
}
