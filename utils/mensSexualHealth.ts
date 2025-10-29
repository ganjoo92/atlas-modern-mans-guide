export type SexualHealthIssueId =
  | 'erectile-dysfunction'
  | 'premature-ejaculation'
  | 'low-libido'
  | 'delayed-ejaculation'
  | 'pain-sensation'
  | 'guilt-shame';

export interface IssueResponse {
  frequency?: 'rarely' | 'sometimes' | 'often' | 'always';
  duration?: 'under-1-month' | 'one-to-three-months' | 'three-plus-months';
  distress?: 'low' | 'moderate' | 'high';
  physicalPain?: 'none' | 'discomfort' | 'pain' | 'bleeding';
  partneredOnly?: 'never' | 'sometimes' | 'often';
  notes?: string;
}

export interface RedFlagResult {
  triggered: boolean;
  indicators: string[];
}

const RED_FLAG_RULES: Record<SexualHealthIssueId, (responses: IssueResponse) => string[]> = {
  'erectile-dysfunction': responses => {
    const indicators: string[] = [];
    if (responses.frequency === 'often' || responses.frequency === 'always') {
      indicators.push('Difficulty maintaining an erection more than 50% of attempts.');
    }
    if (responses.duration === 'three-plus-months') {
      indicators.push('Concern persisting for longer than 3 months.');
    }
    if (responses.physicalPain === 'pain' || responses.physicalPain === 'bleeding') {
      indicators.push('Physical pain, injury, or bleeding during erection.');
    }
    return indicators;
  },
  'premature-ejaculation': responses => {
    const indicators: string[] = [];
    if (responses.frequency === 'often' || responses.frequency === 'always') {
      indicators.push('Ejaculation within one minute of penetration over half the time.');
    }
    if (responses.duration === 'three-plus-months') {
      indicators.push('Issue persistent for longer than 3 months.');
    }
    if (responses.distress === 'high') {
      indicators.push('High distress or relationship impact.');
    }
    return indicators;
  },
  'low-libido': responses => {
    const indicators: string[] = [];
    if (responses.frequency === 'always') {
      indicators.push('Almost no sexual desire in most situations.');
    }
    if (responses.duration === 'three-plus-months') {
      indicators.push('Low desire persisting longer than 3 months.');
    }
    if (responses.distress === 'high') {
      indicators.push('Loss of desire causing significant distress.');
    }
    return indicators;
  },
  'delayed-ejaculation': responses => {
    const indicators: string[] = [];
    if (responses.frequency === 'often' || responses.frequency === 'always') {
      indicators.push('Difficulty ejaculating more than 50% of encounters.');
    }
    if (responses.duration === 'three-plus-months') {
      indicators.push('Delayed ejaculation lasting longer than 3 months.');
    }
    if (responses.partneredOnly === 'often') {
      indicators.push('Occurs during partnered sex but rarely when solo—consider psychogenic factors.');
    }
    return indicators;
  },
  'pain-sensation': responses => {
    const indicators: string[] = [];
    if (responses.physicalPain === 'pain' || responses.physicalPain === 'bleeding') {
      indicators.push('Pain or bleeding during sexual activity.');
    }
    if (responses.duration === 'three-plus-months') {
      indicators.push('Pain/diminished sensation lasting longer than 3 months.');
    }
    if (responses.frequency === 'often' || responses.frequency === 'always') {
      indicators.push('Symptoms present in most encounters—check for physical causes.');
    }
    return indicators;
  },
  'guilt-shame': responses => {
    const indicators: string[] = [];
    if (responses.distress === 'high') {
      indicators.push('High distress, shame, or intrusive guilt around masturbation or sexual expression.');
    }
    if (responses.duration === 'three-plus-months') {
      indicators.push('Emotional distress persisting beyond 3 months.');
    }
    return indicators;
  },
};

export const evaluateRedFlags = (issueId: SexualHealthIssueId, responses: IssueResponse): RedFlagResult => {
  const evaluator = RED_FLAG_RULES[issueId];
  if (!evaluator) {
    return { triggered: false, indicators: [] };
  }
  const indicators = evaluator(responses).filter(Boolean);
  return { triggered: indicators.length > 0, indicators };
};
