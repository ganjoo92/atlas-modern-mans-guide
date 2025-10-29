import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MensSexualHealthScreen from '../screens/MensSexualHealthScreen';

describe('MensSexualHealthScreen', () => {
  it('highlights red flags when concerning responses are logged', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(<MensSexualHealthScreen onComplete={onComplete} />);

    const enterButton = await screen.findByRole('button', { name: /Enter module/i });
    await user.click(enterButton);

    await screen.findByText(/Men’s sexual health toolkit/i);

    const erectileSectionToggle = screen.getByRole('button', { name: /Erectile Dysfunction/i });
    await user.click(erectileSectionToggle);

    await user.selectOptions(
      screen.getByLabelText(/How often do you have difficulty keeping an erection/i),
      'often'
    );
    await user.selectOptions(
      screen.getByLabelText(/How long has this been happening/i),
      'three-plus-months'
    );

    await waitFor(() => expect(screen.getByText(/Red flags detected:/i)).toBeInTheDocument());
  });
});
