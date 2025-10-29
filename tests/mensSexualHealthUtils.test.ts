import { describe, it, expect } from 'vitest';
import { evaluateRedFlags } from '../utils/mensSexualHealth';

describe('evaluateRedFlags', () => {
  it('flags erectile dysfunction red indicators when frequent and persistent', () => {
    const result = evaluateRedFlags('erectile-dysfunction', {
      frequency: 'often',
      duration: 'three-plus-months',
      physicalPain: 'none',
    });
    expect(result.triggered).toBe(true);
    expect(result.indicators).toContain('Difficulty maintaining an erection more than 50% of attempts.');
    expect(result.indicators).toContain('Concern persisting for longer than 3 months.');
  });

  it('does not flag when answers are occasional and recent', () => {
    const result = evaluateRedFlags('premature-ejaculation', {
      frequency: 'sometimes',
      duration: 'under-1-month',
      distress: 'low',
    });
    expect(result.triggered).toBe(false);
  });

  it('flags painful sensation as urgent', () => {
    const result = evaluateRedFlags('pain-sensation', {
      frequency: 'sometimes',
      duration: 'one-to-three-months',
      physicalPain: 'bleeding',
    });
    expect(result.triggered).toBe(true);
    expect(result.indicators).toContain('Pain or bleeding during sexual activity.');
  });
});
