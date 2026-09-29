import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { ShareNote } from './ShareNote';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/share/:token" element={<ShareNote />} />
      </Routes>
    </MemoryRouter>,
  );

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('ShareNote', () => {
  it('restores the share page from its URL, e.g. after a reload', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ emoji: 'love letter', note: 'Hey' }));
    renderAt('/share/abc123XYZ');

    expect(await screen.findByText('Hey')).toBeInTheDocument();
    expect(screen.getByLabelText('Link to your emoji-note')).toHaveValue(
      `${window.location.origin}/n/abc123XYZ`,
    );
    // The "saved" toast is only for the navigation right after saving.
    expect(screen.queryByText(/is saved/)).not.toBeInTheDocument();
  });

  it('copies the link to the clipboard', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ emoji: 'love letter', note: 'Hey' }));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    renderAt('/share/abc123XYZ');

    (await screen.findByRole('button', { name: /copy link/i })).click();

    expect(await screen.findByText('📋 Link copied to clipboard!')).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/n/abc123XYZ`);
  });

  it('shows a not-found message for an unknown token', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ error: 'note not found' }, 404));
    renderAt('/share/unknown123');

    expect(await screen.findByRole('heading', { name: /doesn’t exist/i })).toBeInTheDocument();
  });
});
