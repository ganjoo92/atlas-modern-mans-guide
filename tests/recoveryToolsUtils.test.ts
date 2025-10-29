import { describe, it, expect } from 'vitest';
import { evaluateRecoveryRedFlags } from '../utils/recoveryTools';

describe('evaluateRecoveryRedFlags', () => {
  it('flags severe porn usage', () => {
    const result = evaluateRecoveryRedFlags('porn', {
      severity: 'severe',
      cravings: 'high',
      failedAttempts: 4,
      impact: 'major',
    });
    expect(result.triggered).toBe(true);
    expect(result.indicators.length).toBeGreaterThanOrEqual(1);
  });

  it('flags nicotine dependency with daily use', () => {
    const result = evaluateRecoveryRedFlags('nicotine', {
      frequency: 'daily',
      failedAttempts: 2,
      impact: 'noticeable',
    });
    expect(result.triggered).toBe(true);
    expect(result.indicators).toContain('Daily usage indicates physical dependence.');
  });

  it('returns no flags for mild tech overuse', () => {
    const result = evaluateRecoveryRedFlags('compulsive-tech', {
      severity: 'mild',
      failedAttempts: 0,
      impact: 'minimal',
    });
    expect(result.triggered).toBe(false);
  });
});
