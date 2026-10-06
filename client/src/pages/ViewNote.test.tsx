import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { ViewNote } from './ViewNote';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/n/:token" element={<ViewNote />} />
      </Routes>
    </MemoryRouter>,
  );

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('ViewNote', () => {
  it('shows a loader then the note', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ emoji: 'heart eyes', note: 'You rock' }));
    renderAt('/n/abc123XYZ');

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
    expect(await screen.findByText('You rock')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Smiling face with heart-eyes' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/notes/abc123XYZ', expect.anything());
  });

  it('shows a not-found message for an unknown token', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ error: 'note not found' }, 404));
    renderAt('/n/unknown123');

    expect(await screen.findByRole('heading', { name: /doesn’t exist/i })).toBeInTheDocument();
  });

  it('shows a generic error when the API is down', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    renderAt('/n/abc123XYZ');

    expect(await screen.findByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
  });

  it('renders message text as text, never as HTML', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ emoji: 'love letter', note: '<img src=x onerror=alert(1)>' }),
    );
    const { container } = renderAt('/n/abc123XYZ');

    expect(await screen.findByText('<img src=x onerror=alert(1)>')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });
});
