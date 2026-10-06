import { useEffect, useState } from 'react';

import { ApiError, getNote, type Note } from './api';

export type NoteResult = { status: 'success'; note: Note } | { status: 'not-found' } | { status: 'error' };

/** Fetches a note by token. Returns null while loading. */
export function useNote(token: string): NoteResult | null {
  // Results are tagged with their token, so navigating to another note shows the loader again.
  const [result, setResult] = useState<{ token: string; result: NoteResult } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    getNote(token, controller.signal)
      .then((note) => setResult({ token, result: { status: 'success', note } }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const notFound = error instanceof ApiError && [400, 404].includes(error.status);
        setResult({ token, result: { status: notFound ? 'not-found' : 'error' } });
      });
    return () => controller.abort();
  }, [token]);

  return result?.token === token ? result.result : null;
}
