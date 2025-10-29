export type AddictionType = 'porn' | 'nicotine' | 'substance' | 'compulsive-tech';

export interface RecoveryAssessment {
  frequency?: 'daily' | 'several-week' | 'weekly' | 'monthly';
  severity?: 'mild' | 'moderate' | 'severe';
  cravings?: 'low' | 'medium' | 'high';
  triggers?: string[];
  impact?: 'minimal' | 'noticeable' | 'major';
  failedAttempts?: number;
  notes?: string;
}

export interface RedFlagAssessment {
  triggered: boolean;
  indicators: string[];
}

export interface CravingEntry {
  id: string;
  date: string;
  addiction: AddictionType;
  cravingLevel: 1 | 2 | 3 | 4 | 5;
  slip?: boolean;
  notes?: string;
}

const RED_FLAG_MAP: Record<AddictionType, (assessment: RecoveryAssessment) => string[]> = {
  porn: assessment => {
    const flags: string[] = [];
    if (assessment.severity === 'severe' || assessment.impact === 'major') {
      flags.push('High impact on relationships, self-esteem, or daily functioning.');
    }
    if ((assessment.failedAttempts ?? 0) >= 3) {
      flags.push('Multiple failed attempts to cut down—consider professional support.');
    }
    if (assessment.cravings === 'high') {
      flags.push('High cravings reported daily.');
    }
    return flags;
  },
  nicotine: assessment => {
    const flags: string[] = [];
    if (assessment.frequency === 'daily') {
      flags.push('Daily usage indicates physical dependence.');
    }
    if ((assessment.failedAttempts ?? 0) >= 3) {
      flags.push('Repeated quit attempts without support.');
    }
    if (assessment.impact === 'major') {
      flags.push('Usage interfering with health, finances, or relationships.');
    }
    return flags;
  },
  substance: assessment => {
    const flags: string[] = [];
    if (assessment.severity === 'moderate' || assessment.severity === 'severe') {
      flags.push('Moderate to severe withdrawal or tolerance noted.');
    }
    if (assessment.impact === 'major') {
      flags.push('Substance is impacting work, legal status, or safety.');
    }
    if (assessment.cravings === 'high') {
      flags.push('Daily cravings or loss of control episodes.');
    }
    return flags;
  },
  'compulsive-tech': assessment => {
    const flags: string[] = [];
    if (assessment.severity === 'severe') {
      flags.push('Tech usage displaces important responsibilities.');
    }
    if (assessment.impact === 'major') {
      flags.push('Major impact on relationships, finances, or sleep.');
    }
    if ((assessment.failedAttempts ?? 0) >= 3) {
      flags.push('Multiple failed digital detox attempts—structured plan recommended.');
    }
    return flags;
  },
};

export const evaluateRecoveryRedFlags = (type: AddictionType, assessment: RecoveryAssessment): RedFlagAssessment => {
  const evaluate = RED_FLAG_MAP[type];
  const indicators = evaluate ? evaluate(assessment).filter(Boolean) : [];
  return {
    triggered: indicators.length > 0,
    indicators,
  };
};

export const STORAGE_KEY = 'atlas_recovery_tools_v1';

export interface RecoveryModuleState {
  assessments: Record<AddictionType, RecoveryAssessment>;
  logs: CravingEntry[];
}

export const defaultRecoveryState: RecoveryModuleState = {
  assessments: {
    porn: {},
    nicotine: {},
    substance: {},
    'compulsive-tech': {},
  },
  logs: [],
};

export const encodeState = (state: RecoveryModuleState): string => {
  // Placeholder obfuscation. Replace with AES-GCM encryption for synced storage.
  return JSON.stringify(state);
};

export const decodeState = (payload: string): RecoveryModuleState | null => {
  try {
    return JSON.parse(payload) as RecoveryModuleState;
  } catch (error) {
    console.error('Failed to decode recovery state', error);
    return null;
  }
};
