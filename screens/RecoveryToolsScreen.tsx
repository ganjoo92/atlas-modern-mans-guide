import React, { useEffect, useMemo, useState } from 'react';
import { evaluateRecoveryRedFlags, encodeState, decodeState, defaultRecoveryState, STORAGE_KEY, type AddictionType, type RecoveryAssessment, type CravingEntry } from '../utils/recoveryTools';
import { Shield, Target, SparklesIcon, Plus, Trash2, Download, CheckBadgeIcon } from '../components/Icons';
import { secureStorage } from '../utils/secureStorage';

interface RecoveryToolsScreenProps {
  onComplete: () => void;
}

const CONSENT_KEY = 'atlas_recovery_consent_v1';

const ADDICTION_INFO: Record<AddictionType, { title: string; overview: string; brainMechanism: string; evidenceNotes: string[] }> = {
  porn: {
    title: 'Pornography / Compulsive Sexual Content',
    overview: 'Frequent consumption shifts dopamine thresholds and reinforces cue-response loops. Habitual novelty seeking hijacks reward pathways, making partnered intimacy feel flat.',
    brainMechanism: 'Cycles of hyperstimulation cause downregulation of dopamine receptors and condition arousal to screens (cue-based habit loop). Over time, the brain craves novelty spikes rather than connection.',
    evidenceNotes: [
      'CBT reframes triggers and replaces catastrophic thinking with coping statements. [oai_citation:0‡Medbound Times]',
      'Mindfulness-Oriented Recovery Enhancement teaches savoring healthy rewards to compete with high arousal stimuli. [oai_citation:2‡Wikipedia]',
      'Contingency management: reward streaks and accountability to sustain change. [oai_citation:3‡evolveindy.com]',
    ],
  },
  nicotine: {
    title: 'Nicotine / Tobacco',
    overview: 'Nicotine rapidly reinforces use by releasing dopamine and adrenaline. Withdrawal symptoms (irritability, cravings) drive the next cigarette or vape hit.',
    brainMechanism: 'Nicotine binds to nicotinic receptors causing dopamine release. Short half-life triggers cravings quickly, forming tight habit loops linked to context cues (coffee, driving).',
    evidenceNotes: [
      'Motivational interviewing boosts readiness and highlights personal reasons to quit. [oai_citation:1‡Medbound Times]',
      'Contingency management with tangible rewards doubles quit rates. [oai_citation:3‡evolveindy.com]',
      'Mindfulness and urge-surfing reduce relapse by teaching craving tolerance. [oai_citation:2‡Wikipedia]',
    ],
  },
  substance: {
    title: 'Substance Use (alcohol / opioids / stimulants)',
    overview: 'Substances hijack dopamine, GABA, or opioid systems, causing tolerance, withdrawal, and cravings. Recovery needs medical and behavioral support.',
    brainMechanism: 'Repeated use sensitizes the reward system and weakens prefrontal control. High-risk cues trigger limbic responses before conscious choice catches up.',
    evidenceNotes: [
      'CBT + motivational enhancement remains gold standard for relapse prevention. [oai_citation:0‡Medbound Times]',
      'Contingency management with verified abstinence improves outcomes even for hard addictions. [oai_citation:3‡evolveindy.com]',
      'Guided self-change works for milder cases; professionals are critical for severe dependence. [oai_citation:5‡Wikipedia]',
    ],
  },
  'compulsive-tech': {
    title: 'Compulsive Tech / Gaming / Social Media',
    overview: 'Apps exploit intermittent rewards and novelty, triggering dopamine surges. Overuse impairs focus, mood regulation, and sleep.',
    brainMechanism: 'Variable ratio reward schedules (notifications, likes) train habitual checking. The brain craves short dopamine spikes, replacing meaningful tasks with quick hits.',
    evidenceNotes: [
      'CBT restructuring + time blocking addresses triggers and habit loops. [oai_citation:0‡Medbound Times]',
      'SMART Recovery style peer support builds accountability. [oai_citation:4‡Wikipedia]',
      'Mindfulness/urge surfing reduces craving reactivity. [oai_citation:2‡Wikipedia]',
    ],
  },
};

const ASSESSMENT_QUESTIONS: Array<{ key: keyof RecoveryAssessment; label: string; options?: Array<{ value: any; label: string }>; helper?: string }> = [
  {
    key: 'frequency',
    label: 'How frequently are you using or acting on the behavior?',
    options: [
      { value: 'daily', label: 'Daily / multiple times per day' },
      { value: 'several-week', label: 'Several times per week' },
      { value: 'weekly', label: 'About once per week' },
      { value: 'monthly', label: 'A few times per month' },
    ],
  },
  {
    key: 'severity',
    label: 'How severe does the addiction feel right now?',
    options: [
      { value: 'mild', label: 'Mild – manageable with effort' },
      { value: 'moderate', label: 'Moderate – noticeable loss of control' },
      { value: 'severe', label: 'Severe – dominates my decisions' },
    ],
  },
  {
    key: 'cravings',
    label: 'How intense are the cravings?',
    options: [
      { value: 'low', label: 'Low – easy to resist' },
      { value: 'medium', label: 'Medium – distracting but manageable' },
      { value: 'high', label: 'High – consumes focus and emotions' },
    ],
  },
  {
    key: 'impact',
    label: 'Impact on daily life',
    options: [
      { value: 'minimal', label: 'Minimal impact' },
      { value: 'noticeable', label: 'Noticeable impact on mood or focus' },
      { value: 'major', label: 'Major impact—relationships, finances, work' },
    ],
  },
  {
    key: 'failedAttempts',
    label: 'How many serious attempts have you made to cut down in the last year?',
    helper: 'Include attempts longer than one week.',
  },
  {
    key: 'notes',
    label: 'Context or trigger notes',
  },
];

const RecoveryToolsScreen: React.FC<RecoveryToolsScreenProps> = ({ onComplete }) => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [state, setState] = useState(defaultRecoveryState);
  const [activeAddiction, setActiveAddiction] = useState<AddictionType>('porn');
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        const [storedConsent, storedState] = await Promise.all([
          secureStorage.get<boolean>(CONSENT_KEY),
          secureStorage.get<string>(STORAGE_KEY),
        ]);
        if (!isMounted) return;
        if (storedConsent === true) {
          setHasConsented(true);
        }
        if (storedState) {
          const decoded = decodeState(storedState);
          if (decoded) {
            setState(decoded);
          }
        }
      } catch (error) {
        console.error('Failed to load recovery module state', error);
        if (isMounted) {
          setStorageError('We could not load your saved recovery data. You can continue, but recent entries may be missing.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const assessments = state.assessments;
  const logs = state.logs;

  const currentAssessment = assessments[activeAddiction] ?? {};
  const redFlags = useMemo(() => evaluateRecoveryRedFlags(activeAddiction, currentAssessment), [activeAddiction, currentAssessment]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-sm w-full bg-secondary/70 border border-gray-700/60 rounded-3xl px-6 py-8 text-center space-y-3 animate-pulse">
          <h2 className="text-xl font-semibold text-text-primary">Loading recovery workspace…</h2>
          <p className="text-sm text-text-secondary">
            We’re securing your previous logs and assessments.
          </p>
        </div>
      </div>
    );
  }

  const handleConsent = async () => {
    try {
      await secureStorage.set(CONSENT_KEY, true);
      setHasConsented(true);
      setStorageError(null);
    } catch (error) {
      console.error('Failed to persist recovery consent', error);
      setHasConsented(true);
      setStorageError('We saved your consent using fallback storage. Refresh if you notice missing data.');
    }
  };

  const updateAssessment = (field: keyof RecoveryAssessment, value: any) => {
    setState(prev => ({
      ...prev,
      assessments: {
        ...prev.assessments,
        [activeAddiction]: {
          ...prev.assessments[activeAddiction],
          [field]: value,
        },
      },
    }));
  };

  const saveModule = async () => {
    try {
      const encoded = encodeState(state);
      await secureStorage.set(STORAGE_KEY, encoded);
      setSaveState('saved');
      setStorageError(null);
      onComplete();
      window.setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error('Failed to save recovery state', error);
      setSaveState('error');
      setStorageError('We hit a problem saving your recovery data. Retry in a moment.');
      window.setTimeout(() => setSaveState('idle'), 2000);
    }
  };

  const resetModule = async () => {
    if (!window.confirm('This will delete all recovery assessments and logs on this device. Continue?')) return;
    try {
      await secureStorage.remove(STORAGE_KEY);
      setState(defaultRecoveryState);
      setSaveState('idle');
      setStorageError(null);
    } catch (error) {
      console.error('Failed to reset recovery module', error);
      setStorageError('We could not fully clear your saved recovery data. Please refresh and try again.');
    }
  };

  const addCravingEntry = (entry: Omit<CravingEntry, 'id' | 'date'>) => {
    const newEntry: CravingEntry = {
      ...entry,
      id: `${Date.now()}`,
      date: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      logs: [newEntry, ...prev.logs].slice(0, 100),
    }));
  };

  const exportSummary = () => {
    const lines: string[] = ['Atlas Recovery Summary', `Generated: ${new Date().toLocaleString()}`, ''];
    (Object.keys(assessments) as AddictionType[]).forEach(type => {
      const info = ADDICTION_INFO[type];
      const assessment = assessments[type];
      const issueFlags = evaluateRecoveryRedFlags(type, assessment);
      lines.push(`## ${info.title}`);
      lines.push(`Frequency: ${assessment.frequency ?? 'n/a'}`);
      lines.push(`Severity: ${assessment.severity ?? 'n/a'}`);
      lines.push(`Cravings: ${assessment.cravings ?? 'n/a'}`);
      lines.push(`Impact: ${assessment.impact ?? 'n/a'}`);
      lines.push(`Failed attempts: ${assessment.failedAttempts ?? 0}`);
      if (assessment.notes) lines.push(`Notes: ${assessment.notes}`);
      if (issueFlags.triggered) {
        lines.push('Red flags:');
        issueFlags.indicators.forEach(flag => lines.push(`- ${flag}`));
      }
      lines.push('');
    });
    lines.push('Recent craving log:');
    state.logs.slice(0, 10).forEach(entry => {
      lines.push(`${new Date(entry.date).toLocaleString()} | ${ADDICTION_INFO[entry.addiction].title} | Level ${entry.cravingLevel}${entry.slip ? ' | Slip' : ''}`);
      if (entry.notes) lines.push(`  Notes: ${entry.notes}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas-recovery-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!hasConsented) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-secondary/70 border border-gray-700/60 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
          <Shield className="w-10 h-10 text-accent mx-auto" />
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Private recovery workspace</h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Everything you log here stays on this device. Use it to prepare for coaching or professional treatment.
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-text-secondary text-left bg-primary/30 border border-gray-700/60 rounded-2xl p-3 sm:p-4">
            <p className="font-semibold text-text-primary">Highlights</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No cloud uploads, no analytics.</li>
              <li>Export summary when you choose to involve a clinician.</li>
              <li>Reset anytime—ownership stays with you.</li>
            </ul>
          </div>
          {storageError && (
            <p className="text-xs text-red-200 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
              {storageError}
            </p>
          )}
          <button
            onClick={handleConsent}
            className="bg-accent text-primary px-5 py-3 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Enter recovery tools
          </button>
        </div>
      </div>
    );
  }

  const info = ADDICTION_INFO[activeAddiction];

  return (
    <div className="space-y-6 sm:space-y-8">
      {storageError && (
        <div className="bg-red-500/10 border border-red-500/40 text-xs sm:text-sm text-red-200 rounded-2xl px-4 py-3">
          {storageError}
        </div>
      )}
      <header className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-accent">
          <CheckBadgeIcon className="w-4 h-4" />
          Recovery tools
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">Build self-control with evidence-based reps.</h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Log cravings, run mental drills, and plan for high-risk moments. If red flags show up, escalate to professional support immediately.
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={saveModule}
            className="px-4 py-2 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors"
          >
            {saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Retry save' : 'Save responses'}
          </button>
          <button
            onClick={resetModule}
            className="px-4 py-2 rounded-lg border border-gray-700/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
          >
            <Trash2 className="w-4 h-4 inline mr-2" /> Reset module
          </button>
          <button
            onClick={exportSummary}
            className="px-4 py-2 rounded-lg border border-gray-700/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" /> Export summary
          </button>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2">
        {(Object.keys(ADDICTION_INFO) as AddictionType[]).map(type => (
          <button
            key={type}
            onClick={() => setActiveAddiction(type)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeAddiction === type ? 'bg-accent text-primary shadow-card' : 'bg-primary/40 text-text-secondary hover:bg-primary/60 hover:text-text-primary'
            }`}
          >
            {ADDICTION_INFO[type].title}
          </button>
        ))}
      </nav>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">{info.title}</h2>
        <p className="text-xs sm:text-sm text-text-secondary">{info.overview}</p>
        <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-text-secondary space-y-1">
          <p className="font-semibold text-text-primary">What happens in the brain</p>
          <p>{info.brainMechanism}</p>
        </div>
        <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-text-secondary space-y-1">
          <p className="font-semibold text-text-primary">Evidence-backed approaches</p>
          <ul className="list-disc list-inside space-y-1">
            {info.evidenceNotes.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-accent" />
          <h3 className="text-base sm:text-lg font-semibold text-text-primary">Self-assessment</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {ASSESSMENT_QUESTIONS.map(question => (
            <div key={question.key} className="space-y-2">
              <label className="text-sm font-semibold text-text-primary" htmlFor={`${activeAddiction}-${String(question.key)}`}>
                {question.label}
              </label>
              {question.helper && <p className="text-xs text-text-secondary">{question.helper}</p>}
              {question.options ? (
                <select
                  id={`${activeAddiction}-${String(question.key)}`}
                  value={(currentAssessment[question.key] as string) ?? ''}
                  onChange={event => updateAssessment(question.key, event.target.value || undefined)}
                  className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select</option>
                  {question.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  id={`${activeAddiction}-${String(question.key)}`}
                  rows={3}
                  value={(currentAssessment[question.key] as string) ?? ''}
                  onChange={event => updateAssessment(question.key, event.target.value || undefined)}
                  className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              )}
            </div>
          ))}
        </div>
        {redFlags.triggered && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-red-200 space-y-2">
            <p className="font-semibold">Red flags detected</p>
            <ul className="list-disc list-inside">
              {redFlags.indicators.map(flag => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
            <p className="text-xs text-red-200">
              Connect with a licensed professional (addiction specialist, therapist, or physician). Bring your export summary to accelerate help.
            </p>
          </div>
        )}
      </section>

      <RecoveryExercises />

      <CravingTracker logs={logs} onAdd={addCravingEntry} />
    </div>
  );
};

const RecoveryExercises: React.FC = () => (
  <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 sm:p-6 space-y-4">
    <div className="flex items-center gap-3">
      <SparklesIcon className="w-5 h-5 text-accent" />
      <h3 className="text-base sm:text-lg font-semibold text-text-primary">Evidence-based playbook</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">CBT trigger mapping</p>
        <p>Identify the trigger → automatic thought → emotion → behavior chain. Challenge distorted thoughts and choose a coping statement.</p>
      </div>
      <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Motivational check</p>
        <p>Why does recovery matter today? Rate importance (1-10). What small win can you execute in the next hour?</p>
      </div>
      <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Mindfulness / urge surfing</p>
        <p>Notice craving sensations, label them, breathe, and ride the urge like a wave for 3 minutes. Cravings peak and fade.</p>
      </div>
      <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Contingency management</p>
        <p>Set rewards for hitting milestones (7-day streak, therapy session attended). Stack positive reinforcement.</p>
      </div>
      <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Peer support</p>
        <p>Join SMART Recovery style meetings or Atlas circles. Accountability keeps relapse risk lower.</p>
      </div>
      <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2 text-xs sm:text-sm text-text-secondary">
        <p className="font-semibold text-text-primary">Relapse plan</p>
        <p>List high-risk situations, coping actions, and emergency contacts. Review weekly.</p>
      </div>
    </div>
  </section>
);

const CravingTracker: React.FC<{ logs: CravingEntry[]; onAdd: (entry: Omit<CravingEntry, 'id' | 'date'>) => void }> = ({ logs, onAdd }) => {
  const [addiction, setAddiction] = useState<AddictionType>('porn');
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [slip, setSlip] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAdd({ addiction, cravingLevel: level, slip, notes: notes.trim() || undefined });
    setNotes('');
    setSlip(false);
  };

  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3">
        <Plus className="w-5 h-5 text-accent" />
        <h3 className="text-base sm:text-lg font-semibold text-text-primary">Daily craving log</h3>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3">
        <select
          value={addiction}
          onChange={event => setAddiction(event.target.value as AddictionType)}
          className="bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="porn">Pornography / compulsive sexual content</option>
          <option value="nicotine">Nicotine / tobacco</option>
          <option value="substance">Substance use</option>
          <option value="compulsive-tech">Compulsive tech / gaming / social</option>
        </select>
        <select
          value={level}
          onChange={event => setLevel(Number(event.target.value) as 1 | 2 | 3 | 4 | 5)}
          className="bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {[1, 2, 3, 4, 5].map(value => (
            <option key={value} value={value}>
              Craving level {value}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={slip}
            onChange={event => setSlip(event.target.checked)}
            className="accent-accent"
          />
          Slip / relapse occurred
        </label>
        <div className="md:col-span-4">
          <textarea
            value={notes}
            onChange={event => setNotes(event.target.value)}
            placeholder="Notes (trigger, response, coping tactic used)"
            rows={2}
            className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>
        <div className="md:col-span-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors"
          >
            Log entry
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-text-primary">Recent entries</h4>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-text-secondary max-h-64 overflow-y-auto">
          {logs.length ? (
            logs.map(entry => (
              <div key={entry.id} className="bg-primary/30 border border-gray-700/60 rounded-xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center justify-between">
                  <span>{new Date(entry.date).toLocaleString()}</span>
                  <span className="text-[11px] sm:text-xs text-text-secondary">Level {entry.cravingLevel}{entry.slip ? ' • Slip' : ''}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-text-secondary">
                  {entry.notes ?? 'No notes recorded.'}
                </p>
              </div>
            ))
          ) : (
            <p>No entries yet—log cravings to measure your streaks.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecoveryToolsScreen;
