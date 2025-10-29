import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MentorScreen from '../screens/MentorScreen';
import type { OnboardingProfile } from '../types';

vi.mock('../services/geminiService', () => ({
  getMentorChat: vi.fn(() => ({})),
  getEnhancedMentorResponse: vi.fn(async () => ({
    response: 'Mock mentor insight.',
    followUpQuestions: [],
  })),
}));

const mockProfile: OnboardingProfile = {
  name: 'Alex',
  primaryGoal: 'career',
  focusArena: 'mind',
  challengeCadence: 'weekly',
  obstacle: 'Staying consistent',
  createdAt: new Date().toISOString(),
};

describe('MentorScreen saved threads', () => {
  it('persists a saved conversation and surfaces it in the modal', async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('Strategy session insights');

    render(
      <MentorScreen
        onboardingProfile={mockProfile}
        mentorGreetingSeen
        onMentorGreetingDelivered={vi.fn()}
        setView={vi.fn()}
      />
    );

    await screen.findByText(/Save Conversation/i);
    await waitFor(() => expect(screen.getByText(/How can I help you today\?/i)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /Save Conversation/i }));

    await screen.findByText(/Saved Threads/i);
    expect(screen.getByText(/Strategy session insights/i)).toBeInTheDocument();

    expect(promptSpy).toHaveBeenCalled();
    expect(setItemSpy).toHaveBeenCalled();
    const lastPersistCall = setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1];
    expect(lastPersistCall[0]).toBe('atlas_saved_threads');
    expect(lastPersistCall[1]).toContain('Strategy session insights');

    promptSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});
