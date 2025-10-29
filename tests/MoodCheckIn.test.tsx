import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoodCheckIn, { type MoodEntry } from '../components/MoodCheckIn';

describe('MoodCheckIn', () => {
  it('logs the selected mood with an optional note', async () => {
    const onLog = vi.fn();
    const user = userEvent.setup();

    render(<MoodCheckIn onLog={onLog} recentEntries={[]} />);

    await user.click(screen.getByRole('button', { name: /Charged/i }));
    const noteField = screen.getByLabelText(/Optional note/i);
    await user.type(noteField, 'Feeling locked in');

    const submitButton = screen.getByRole('button', { name: /Log today’s mood/i });
    await user.click(submitButton);

    await waitFor(() => expect(onLog).toHaveBeenCalledTimes(1));
    const loggedEntry = onLog.mock.calls[0][0] as MoodEntry;
    expect(loggedEntry.value).toBe('charged');
    expect(loggedEntry.note).toBe('Feeling locked in');
    expect(new Date(loggedEntry.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('locks the CTA once today’s mood has already been logged', () => {
    const todayEntry: MoodEntry = {
      value: 'steady',
      timestamp: new Date().toISOString(),
    };

    render(<MoodCheckIn onLog={vi.fn()} recentEntries={[todayEntry]} />);

    const lockedButton = screen.getByRole('button', { name: /Logged/i });
    expect(lockedButton).toBeDisabled();
  });
});
