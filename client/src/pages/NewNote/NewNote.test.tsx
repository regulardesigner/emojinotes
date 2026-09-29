import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { ShareNote } from '../ShareNote';
import { NewNote } from './NewNote';

const renderNewNote = () =>
  render(
    <MemoryRouter initialEntries={['/new']}>
      <Routes>
        <Route path="/new" element={<NewNote />} />
        <Route path="/share/:token" element={<ShareNote />} />
      </Routes>
    </MemoryRouter>,
  );

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

async function goToPreview(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Write your message'), 'See you soon!');
  await user.click(screen.getByRole('button', { name: /pick an emoji/i }));
  await user.click(screen.getByRole('radio', { name: 'Christmas tree' }));
  await user.click(screen.getByRole('button', { name: /preview/i }));
}

describe('NewNote', () => {
  it('creates a note and shows a shareable link', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({ token: 'tok_123' }, 201))
      .mockResolvedValueOnce(jsonResponse({ emoji: 'christmas tree', note: 'See you soon!' }));
    const user = userEvent.setup();
    renderNewNote();

    await goToPreview(user);
    expect(screen.getByText('See you soon!')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save and share' }));

    const heading = await screen.findByRole('heading', { name: 'Share your emoji-note!' });
    expect(heading).toHaveFocus();
    expect(await screen.findByText('💾 Your emoji-note is saved!')).toBeInTheDocument();
    expect(screen.getByLabelText('Link to your emoji-note')).toHaveValue(
      `${window.location.origin}/n/tok_123`,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/notes',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ emoji: 'christmas tree', note: 'See you soon!' }),
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Show QR code' }));
    expect(screen.getByRole('dialog', { name: 'Scan to open your emoji-note' })).toBeVisible();
  });

  it('shows an error and lets the user retry when saving fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ error: 'boom' }, 500));
    const user = userEvent.setup();
    renderNewNote();

    await goToPreview(user);
    await user.click(screen.getByRole('button', { name: 'Save and share' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn’t save/i);
    expect(screen.getByRole('button', { name: 'Save and share' })).toBeEnabled();
  });

  it('blocks messages over 150 characters', async () => {
    const user = userEvent.setup();
    renderNewNote();

    await user.click(screen.getByLabelText('Write your message'));
    await user.paste('a'.repeat(151));

    expect(screen.getByRole('alert')).toHaveTextContent('Your message is too long.');
    expect(screen.getByText('151/150')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pick an emoji/i })).toBeDisabled();
  });

  it('moves focus to the heading of each new step without stealing it while typing', async () => {
    const user = userEvent.setup();
    renderNewNote();

    const textarea = screen.getByLabelText('Write your message');
    expect(textarea).toHaveFocus();
    await user.type(textarea, 'Hi');
    expect(textarea).toHaveFocus();

    await user.click(screen.getByRole('button', { name: /pick an emoji/i }));
    expect(screen.getByRole('heading', { name: 'Choose your emoji wisely' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { name: 'Write your message' })).toHaveFocus();
    expect(screen.getByLabelText('Write your message')).toHaveValue('Hi');
  });

  it('requires an emoji before previewing', async () => {
    const user = userEvent.setup();
    renderNewNote();

    await user.type(screen.getByLabelText('Write your message'), 'Hi');
    await user.click(screen.getByRole('button', { name: /pick an emoji/i }));

    expect(screen.getByRole('button', { name: /preview/i })).toBeDisabled();
  });
});
