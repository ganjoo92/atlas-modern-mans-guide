import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecoveryToolsScreen from '../screens/RecoveryToolsScreen';
import { secureStorage } from '../utils/secureStorage';

describe('RecoveryToolsScreen', () => {
  it('unlocks after consent and supports exporting a summary', async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();

    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<RecoveryToolsScreen onComplete={onComplete} />);

    const consentSpy = vi.spyOn(secureStorage, 'set');
    const enterButton = await screen.findByRole('button', { name: /Enter recovery tools/i });
    await user.click(enterButton);

    await waitFor(() => expect(screen.getByText(/Recovery tools/i)).toBeInTheDocument());
    expect(consentSpy).toHaveBeenCalledWith('atlas_recovery_consent_v1', true);

    const exportButton = screen.getByRole('button', { name: /Export summary/i });
    await user.click(exportButton);

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(anchorClickSpy).toHaveBeenCalled();

    consentSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    anchorClickSpy.mockRestore();
  });
});
