import type { EmojiKey } from './emojis';

export interface Note {
  emoji: EmojiKey;
  note: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(response.status, body?.error ?? response.statusText);
  }
  return (await response.json()) as T;
}

export const createNote = (note: Note) =>
  request<{ token: string }>('/api/notes', { method: 'POST', body: JSON.stringify(note) });

export const getNote = (token: string, signal?: AbortSignal) =>
  request<Note>(`/api/notes/${encodeURIComponent(token)}`, { signal });

export const noteUrl = (token: string) => `${window.location.origin}/n/${token}`;
