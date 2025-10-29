import React, { useEffect, useMemo, useState } from 'react';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
} from '../components/Icons';
import type { SexualHealthIssueId, IssueResponse } from '../utils/mensSexualHealth';
import { evaluateRedFlags } from '../utils/mensSexualHealth';
import { secureStorage } from '../utils/secureStorage';

interface MensSexualHealthScreenProps {
  onComplete: () => void;
}

interface IssueConfig {
  id: SexualHealthIssueId;
  title: string;
  explanation: string;
  causes: string[];
  questions: Array<{ id: keyof IssueResponse; label: string; helper?: string; type: 'select' | 'textarea'; options?: { value: any; label: string }[] }>;
  redFlagsSummary: string[];
  recommendations: {
    education: { label: string; url?: string }[];
    exercises: string[];
    specialists: string[];
  };
}

const CONSENT_KEY = 'atlas_msh_consent_v1';
const STORAGE_KEY = 'atlas_msh_responses_v1';

const ISSUE_CONFIG: IssueConfig[] = [
  {
    id: 'erectile-dysfunction',
    title: 'Erectile Dysfunction',
    explanation: 'Trouble getting or keeping an erection firm enough for sex. Common causes include cardiovascular issues, stress, and medication side-effects. Estimates suggest up to 40% of men experience it by age 40 in some capacity.',
    causes: ['Blood flow challenges', 'Performance pressure or anxiety', 'Hormonal imbalance', 'Medication or substance side-effects'],
    questions: [
      {
        id: 'frequency',
        label: 'How often do you have difficulty keeping an erection?',
        type: 'select',
        options: [
          { value: 'rarely', label: 'Rarely (less than 10% of the time)' },
          { value: 'sometimes', label: 'Sometimes (10-50%)' },
          { value: 'often', label: 'Often (more than half the time)' },
          { value: 'always', label: 'Almost always' },
        ],
      },
      {
        id: 'duration',
        label: 'How long has this been happening?',
        type: 'select',
        options: [
          { value: 'under-1-month', label: 'Less than 1 month' },
          { value: 'one-to-three-months', label: '1-3 months' },
          { value: 'three-plus-months', label: 'More than 3 months' },
        ],
      },
      {
        id: 'physicalPain',
        label: 'Do you experience any pain, numbness, or injury?',
        type: 'select',
        options: [
          { value: 'none', label: 'No physical discomfort' },
          { value: 'discomfort', label: 'Mild discomfort or numbness' },
          { value: 'pain', label: 'Pain during erections' },
          { value: 'bleeding', label: 'Bleeding or noticeable injury' },
        ],
      },
      {
        id: 'notes',
        label: 'Anything else you want to note?',
        type: 'textarea',
      },
    ],
    redFlagsSummary: [
      'Difficulty maintaining an erection more than 50% of attempts.',
      'Issue lasting longer than three months.',
      'Physical pain, numbness, or injury.',
    ],
    recommendations: {
      education: [
        { label: 'Article: How erectile health works (Harvard Health)', url: 'https://www.health.harvard.edu/mens-health/erectile-dysfunction-what-you-need-to-know' },
        { label: 'Book: “The Penis Book” by Dr. Aaron Spitz' },
      ],
      exercises: ['5 minutes of 4-7-8 breathing before arousal to regulate nervous system.', 'Pelvic floor contractions (Kegels) 3 sets of 10 reps, 3x/week.', 'Limit alcohol and ensure 7+ hours of sleep.'],
      specialists: ['Primary care physician or urologist if red flags present.', 'Sex therapist for performance anxiety patterns.'],
    },
  },
  {
    id: 'premature-ejaculation',
    title: 'Premature Ejaculation',
    explanation: 'Ejaculation that happens sooner than desired—usually within one minute of penetration. It affects up to 1 in 3 men at some point and often has psychological and physiological components.',
    causes: ['Performance anxiety', 'Novelty or extended abstinence', 'Pelvic floor tension'],
    questions: [
      {
        id: 'frequency',
        label: 'How often do you ejaculate before you intend to?',
        type: 'select',
        options: [
          { value: 'rarely', label: 'Rarely' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'often', label: 'Often' },
          { value: 'always', label: 'Almost every encounter' },
        ],
      },
      {
        id: 'duration',
        label: 'How long has this been a concern?',
        type: 'select',
        options: [
          { value: 'under-1-month', label: 'Less than 1 month' },
          { value: 'one-to-three-months', label: '1-3 months' },
          { value: 'three-plus-months', label: 'More than 3 months' },
        ],
      },
      {
        id: 'distress',
        label: 'How much distress does this cause you or your partner?',
        type: 'select',
        options: [
          { value: 'low', label: 'Minimal distress' },
          { value: 'moderate', label: 'Noticeable frustration' },
          { value: 'high', label: 'Serious distress or conflict' },
        ],
      },
      {
        id: 'notes',
        label: 'Notes or context (e.g., partner, solo, specific triggers)',
        type: 'textarea',
      },
    ],
    redFlagsSummary: [
      'Happens more than half the time.',
      'Ongoing for more than three months.',
      'Causes significant distress or relationship strain.',
    ],
    recommendations: {
      education: [
        { label: 'Guide: Premature ejaculation overview (Mayo Clinic)', url: 'https://www.mayoclinic.org/diseases-conditions/premature-ejaculation/symptoms-causes/syc-20354900' },
      ],
      exercises: ['Start-Stop or Squeeze technique practiced solo first.', 'Breathing drills to slow arousal build-up.', 'Use of thicker condoms or topical desensitisers (under guidance).'],
      specialists: ['Pelvic floor physiotherapist.', 'Sex therapist for anxiety and communication skills.'],
    },
  },
  {
    id: 'low-libido',
    title: 'Low Libido',
    explanation: 'Reduced interest in sexual activity. Common causes include stress, low testosterone, sleep deprivation, or unresolved relationship issues.',
    causes: ['Prolonged stress or burnout', 'Hormonal imbalance', 'Depression, SSRIs, or alcohol use'],
    questions: [
      {
        id: 'frequency',
        label: 'How often do you feel disinterested in sex?',
        type: 'select',
        options: [
          { value: 'rarely', label: 'Rarely' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'often', label: 'Most times' },
          { value: 'always', label: 'Nearly always' },
        ],
      },
      {
        id: 'duration',
        label: 'How long has libido been lower than usual?',
        type: 'select',
        options: [
          { value: 'under-1-month', label: 'Less than 1 month' },
          { value: 'one-to-three-months', label: '1-3 months' },
          { value: 'three-plus-months', label: 'More than 3 months' },
        ],
      },
      {
        id: 'distress',
        label: 'How much does this concern you?',
        type: 'select',
        options: [
          { value: 'low', label: 'Not much' },
          { value: 'moderate', label: 'Noticeable frustration' },
          { value: 'high', label: 'High distress' },
        ],
      },
      {
        id: 'notes',
        label: 'Any patterns? (e.g., fatigue, medication, relationship context)',
        type: 'textarea',
      },
    ],
    redFlagsSummary: ['Consistent lack of desire across contexts.', 'Low desire lasting longer than three months.', 'High distress or relationship impact.'],
    recommendations: {
      education: [{ label: 'Article: Understanding low libido (Cleveland Clinic)', url: 'https://my.clevelandclinic.org/health/diseases/14349-low-libido' }],
      exercises: ['Audit sleep, stress, alcohol, and medication changes.', 'Schedule “desire dates” with zero performance goal—just connection.', 'Full blood panel discussion with physician if energy is low.'],
      specialists: ['Primary care physician or endocrinologist to evaluate hormones.', 'Therapist to assess depression or relationship factors.'],
    },
  },
  {
    id: 'delayed-ejaculation',
    title: 'Delayed Ejaculation / Anorgasmia',
    explanation: 'Difficulty or inability to climax. Can be situational (partnered only) or global. Causes include medication, porn conditioning, anxiety, or nerve issues.',
    causes: ['SSRI or medication side-effects', 'High porn/stimulation threshold', 'Anxiety or trauma'],
    questions: [
      {
        id: 'frequency',
        label: 'How often do you struggle to climax when you want to?',
        type: 'select',
        options: [
          { value: 'rarely', label: 'Rarely' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'often', label: 'Often' },
          { value: 'always', label: 'Almost always' },
        ],
      },
      {
        id: 'duration',
        label: 'How long has this been an issue?',
        type: 'select',
        options: [
          { value: 'under-1-month', label: 'Less than 1 month' },
          { value: 'one-to-three-months', label: '1-3 months' },
          { value: 'three-plus-months', label: 'More than 3 months' },
        ],
      },
      {
        id: 'partneredOnly',
        label: 'Does this mainly happen during partnered sex?',
        type: 'select',
        options: [
          { value: 'never', label: 'No, it happens solo too' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'often', label: 'Mostly during partnered sex' },
        ],
      },
      {
        id: 'notes',
        label: 'Context or triggers you’ve noticed',
        type: 'textarea',
      },
    ],
    redFlagsSummary: ['Difficulty climaxing in most encounters.', 'Issue lasting longer than three months.', 'Happens during partnered sex but not solo (may need coaching/therapy).'],
    recommendations: {
      education: [{ label: 'Article: Delayed ejaculation overview (Verywell Health)', url: 'https://www.verywellhealth.com/delayed-ejaculation-2329084' }],
      exercises: ['Reduce porn intensity/frequency for 2-4 weeks and use mindful arousal.', 'Sensate focus exercises with partner (non-goal oriented touch).', 'Discuss SSRI dosage or meds with prescribing physician.'],
      specialists: ['Sex therapist experienced with delayed ejaculation.', 'Urologist if nerve damage, diabetes, or pelvic surgery history.'],
    },
  },
  {
    id: 'pain-sensation',
    title: 'Painful / Diminished Sensation',
    explanation: 'Pain, numbness, or reduced pleasure during sexual activity. Can stem from dermatological issues, nerve compression, pelvic floor tension, or circulatory challenges.',
    causes: ['Skin irritation, STI, or Peyronie’s disease', 'Pelvic floor hypertonicity', 'Excessive masturbation technique or grip'],
    questions: [
      {
        id: 'frequency',
        label: 'How often does pain or diminished sensation occur?',
        type: 'select',
        options: [
          { value: 'rarely', label: 'Rarely' },
          { value: 'sometimes', label: 'Sometimes' },
          { value: 'often', label: 'Often' },
          { value: 'always', label: 'Almost always' },
        ],
      },
      {
        id: 'duration',
        label: 'How long has this been happening?',
        type: 'select',
        options: [
          { value: 'under-1-month', label: 'Less than 1 month' },
          { value: 'one-to-three-months', label: '1-3 months' },
          { value: 'three-plus-months', label: 'More than 3 months' },
        ],
      },
      {
        id: 'physicalPain',
        label: 'Describe the sensation',
        type: 'select',
        options: [
          { value: 'none', label: 'No pain, just less sensation' },
          { value: 'discomfort', label: 'Mild discomfort or numbness' },
          { value: 'pain', label: 'Noticeable pain' },
          { value: 'bleeding', label: 'Bleeding, tearing, or lesions' },
        ],
      },
      {
        id: 'notes',
        label: 'Notes about triggers, partners, or techniques',
        type: 'textarea',
      },
    ],
    redFlagsSummary: ['Physical pain or bleeding.', 'Symptoms lasting beyond three months.', 'Significant loss of sensation.'],
    recommendations: {
      education: [{ label: 'Resource: Sexual pain overview (Cleveland Clinic)', url: 'https://my.clevelandclinic.org/health/diseases/15237-penile-pain' }],
      exercises: ['See a doctor immediately if bleeding or lesions are present.', 'Warm-up massage and lubrication adjustments.', 'Pelvic floor relaxation stretches (deep squats, happy baby).'],
      specialists: ['Urologist or dermatologist for physical causes.', 'Pelvic floor physiotherapist.'],
    },
  },
  {
    id: 'guilt-shame',
    title: 'Guilt / Shame around Masturbation & Technique',
    explanation: 'Persistent guilt, shame, or secrecy around self-pleasure that creates distress or sexual mismatch. Often rooted in upbringing, religious messaging, or technique differences.',
    causes: ['Religious/cultural conditioning', 'Lack of comprehensive sex education', 'Technique difference vs. partnered sex'],
    questions: [
      {
        id: 'distress',
        label: 'How intense is the shame or guilt you feel?',
        type: 'select',
        options: [
          { value: 'low', label: 'Low — it’s there but manageable' },
          { value: 'moderate', label: 'Moderate — it affects my confidence' },
          { value: 'high', label: 'High — it affects relationships or wellbeing' },
        ],
      },
      {
        id: 'duration',
        label: 'How long have these feelings been present?',
        type: 'select',
        options: [
          { value: 'under-1-month', label: 'Less than 1 month' },
          { value: 'one-to-three-months', label: '1-3 months' },
          { value: 'three-plus-months', label: 'More than 3 months' },
        ],
      },
      {
        id: 'notes',
        label: 'Anything specific triggering the guilt/shame?',
        type: 'textarea',
      },
    ],
    redFlagsSummary: ['High levels of shame or guilt causing avoidance or relationship problems.', 'Feelings persisting longer than three months.'],
    recommendations: {
      education: [{ label: 'Resource: Understanding sexual shame (AAA Sex Therapy)', url: 'https://aasect.org/' }],
      exercises: ['Normalize the conversation—write down the beliefs you inherited and question their source.', 'Use graded exposure with compassionate self-talk.', 'Discuss technique differences openly with partner sans judgement.'],
      specialists: ['Sex therapist trained in shame resilience and embodiment work.'],
    },
  },
];

const encodeData = (payload: Record<string, IssueResponse>): string => {
  // Placeholder: replace with strong encryption if syncing to a server in future.
  return JSON.stringify(payload);
};

const decodeData = (payload: string): Record<string, IssueResponse> | null => {
  try {
    return JSON.parse(payload) as Record<string, IssueResponse>;
  } catch (error) {
    console.error('Failed to parse mens sexual health data', error);
    return null;
  }
};

const createDefaultResponses = (): Record<SexualHealthIssueId, IssueResponse> =>
  ISSUE_CONFIG.reduce((acc, issue) => {
    acc[issue.id] = {};
    return acc;
  }, {} as Record<SexualHealthIssueId, IssueResponse>);

const MensSexualHealthScreen: React.FC<MensSexualHealthScreenProps> = ({ onComplete }) => {
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [responses, setResponses] = useState<Record<SexualHealthIssueId, IssueResponse>>(() => createDefaultResponses());
  const [expandedIssue, setExpandedIssue] = useState<SexualHealthIssueId | null>('erectile-dysfunction');
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        const [storedConsent, storedResponses] = await Promise.all([
          secureStorage.get<boolean>(CONSENT_KEY),
          secureStorage.get<string>(STORAGE_KEY),
        ]);
        if (!isMounted) return;
        if (storedConsent === true) {
          setHasConsented(true);
        }
        if (storedResponses) {
          const decoded = decodeData(storedResponses);
          if (decoded) {
            setResponses({ ...createDefaultResponses(), ...decoded });
          }
        }
      } catch (error) {
        console.error('Failed to load men\'s sexual health responses', error);
        if (isMounted) {
          setStorageError('We could not load your saved responses. Continue, but consider re-entering key details.');
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

  const handleConsent = async () => {
    try {
      await secureStorage.set(CONSENT_KEY, true);
      setHasConsented(true);
      setStorageError(null);
    } catch (error) {
      console.error('Failed to persist consent for men’s sexual health module', error);
      setHasConsented(true);
      setStorageError('Consent saved using fallback storage. Refresh if the module does not stay unlocked.');
    }
  };

  const handleResponseChange = (issueId: SexualHealthIssueId, field: keyof IssueResponse, value: any) => {
    setResponses(prev => ({
      ...prev,
      [issueId]: {
        ...prev[issueId],
        [field]: value,
      },
    }));
  };

  const handleSaveAll = async () => {
    try {
      const encoded = encodeData(responses);
      await secureStorage.set(STORAGE_KEY, encoded);
      setSaveState('saved');
      setStorageError(null);
      onComplete();
      window.setTimeout(() => setSaveState('idle'), 2500);
    } catch (error) {
      console.error('Failed to persist responses', error);
      setSaveState('error');
      setStorageError('We could not save your entries. Retry in a moment.');
      window.setTimeout(() => setSaveState('idle'), 2500);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset and delete all saved responses?')) return;
    try {
      await secureStorage.remove(STORAGE_KEY);
      setResponses(createDefaultResponses());
      setSaveState('idle');
      setStorageError(null);
    } catch (error) {
      console.error('Failed to reset men’s sexual health module', error);
      setStorageError('We could not fully clear your responses. Refresh and try again.');
    }
  };

  const handleExport = () => {
    const summaryLines: string[] = ['Atlas Men\'s Sexual Health Summary', `Generated: ${new Date().toLocaleString()}`, ''];
    ISSUE_CONFIG.forEach(issue => {
      const res = responses[issue.id];
      const redFlags = evaluateRedFlags(issue.id, res ?? {});
      summaryLines.push(`## ${issue.title}`);
      summaryLines.push(`Frequency: ${res?.frequency ?? 'n/a'}`);
      summaryLines.push(`Duration: ${res?.duration ?? 'n/a'}`);
      if (res?.distress) summaryLines.push(`Distress: ${res.distress}`);
      if (res?.physicalPain) summaryLines.push(`Physical sensation: ${res.physicalPain}`);
      if (res?.partneredOnly) summaryLines.push(`Partnered only: ${res.partneredOnly}`);
      if (res?.notes) summaryLines.push(`Notes: ${res.notes}`);
      if (redFlags.triggered) {
        summaryLines.push('Red flags identified:');
        redFlags.indicators.forEach(flag => summaryLines.push(`- ${flag}`));
      }
      summaryLines.push('');
    });

    const blob = new Blob([summaryLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas-sexual-health-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const redFlagStatuses = useMemo(() => {
    return ISSUE_CONFIG.reduce<Record<SexualHealthIssueId, ReturnType<typeof evaluateRedFlags>>>((acc, issue) => {
      acc[issue.id] = evaluateRedFlags(issue.id, responses[issue.id] ?? {});
      return acc;
    }, {} as Record<SexualHealthIssueId, ReturnType<typeof evaluateRedFlags>>);
  }, [responses]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-sm w-full bg-secondary/70 border border-gray-700/60 rounded-3xl px-6 py-8 text-center space-y-3 animate-pulse">
          <h2 className="text-xl font-semibold text-text-primary">Loading private module…</h2>
          <p className="text-sm text-text-secondary">
            Your saved responses are being decrypted locally.
          </p>
        </div>
      </div>
    );
  }

  if (!hasConsented) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-secondary/70 border border-gray-700/60 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
          <Lock className="w-10 h-10 text-accent mx-auto" />
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Private health module</h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Everything you record here stays on your device. Atlas does not upload or analyze these entries.
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-text-secondary text-left bg-primary/30 border border-gray-700/60 rounded-2xl p-3 sm:p-4">
            <p className="font-semibold text-text-primary">What to know:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No cloud sync or analytics logging.</li>
              <li>Optional export so you can share with a clinician.</li>
              <li>You can wipe everything at any time.</li>
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
            Enter module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {storageError && (
        <div className="bg-red-500/10 border border-red-500/40 text-xs sm:text-sm text-red-200 rounded-2xl px-4 py-3">
          {storageError}
        </div>
      )}
      <header className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-accent">
          <Shield className="w-4 h-4" />
          Men’s sexual health toolkit
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">Track, understand, and act with confidence.</h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          These self-checks help organize your observations before speaking to a clinician. They are not a diagnosis. If red flags show up, make the call.
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors"
          >
            {saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Retry save' : 'Save responses'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-gray-700/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
          >
            <Trash2 className="w-4 h-4 inline mr-2" /> Reset module
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border border-gray-700/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
          >
            <Download className="w-4 h-4 inline mr-2" /> Export for clinician
          </button>
        </div>
      </header>

      <div className="space-y-3 sm:space-y-4">
        {ISSUE_CONFIG.map(issue => {
          const isExpanded = expandedIssue === issue.id;
          const responsesForIssue = responses[issue.id] ?? {};
          const redFlag = redFlagStatuses[issue.id];
          return (
            <section key={issue.id} className="bg-secondary/60 border border-gray-700/60 rounded-2xl">
              <button
                onClick={() => setExpandedIssue(prev => (prev === issue.id ? null : issue.id))}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-text-primary">{issue.title}</h2>
                  <p className="text-xs text-text-secondary mt-1">{issue.explanation}</p>
                </div>
                {redFlag?.triggered ? (
                  <span className="text-xs text-red-300">Red flags noted</span>
                ) : null}
                {isExpanded ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
              </button>
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-5 sm:space-y-6">
                  <div className="text-xs sm:text-sm text-text-secondary space-y-2">
                    <p className="font-semibold text-text-primary">Possible contributing factors</p>
                    <ul className="list-disc list-inside space-y-1">
                      {issue.causes.map(cause => (
                        <li key={cause}>{cause}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {issue.questions.map(question => (
                      <div key={String(question.id)} className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary" htmlFor={`${issue.id}-${String(question.id)}`}>
                          {question.label}
                        </label>
                        {question.type === 'select' ? (
                          <select
                            id={`${issue.id}-${String(question.id)}`}
                            value={(responsesForIssue[question.id] as string) ?? ''}
                            onChange={event => handleResponseChange(issue.id, question.id, event.target.value || undefined)}
                            className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                          >
                            <option value="">Select an option</option>
                            {question.options?.map(option => (
                              <option key={String(option.value)} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <textarea
                            id={`${issue.id}-${String(question.id)}`}
                            value={(responsesForIssue[question.id] as string) ?? ''}
                            onChange={event => handleResponseChange(issue.id, question.id, event.target.value || undefined)}
                            rows={3}
                            className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-text-primary">When to contact a specialist</p>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-text-secondary space-y-1">
                      {issue.redFlagsSummary.map(flag => (
                        <li key={flag}>{flag}</li>
                      ))}
                    </ul>
                    {redFlag?.triggered && (
                      <div className="text-xs sm:text-sm text-red-300 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3">
                        <p className="font-semibold">Red flags detected:</p>
                        <ul className="list-disc list-inside">
                          {redFlag.indicators.map(flag => (
                            <li key={flag}>{flag}</li>
                          ))}
                        </ul>
                        <p className="mt-2">Book an appointment with a qualified specialist. Bring your export summary to accelerate diagnosis.</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2">
                      <p className="text-sm font-semibold text-text-primary">Learn</p>
                      <ul className="text-xs sm:text-sm text-text-secondary space-y-1">
                        {issue.recommendations.education.map(resource => (
                          <li key={resource.label}>
                            {resource.url ? (
                              <a href={resource.url} className="text-accent hover:text-accent-light underline" target="_blank" rel="noreferrer">
                                {resource.label}
                              </a>
                            ) : (
                              resource.label
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2">
                      <p className="text-sm font-semibold text-text-primary">Drills</p>
                      <ul className="text-xs sm:text-sm text-text-secondary space-y-1">
                        {issue.recommendations.exercises.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 space-y-2">
                      <p className="text-sm font-semibold text-text-primary">Specialist support</p>
                      <ul className="text-xs sm:text-sm text-text-secondary space-y-1">
                        {issue.recommendations.specialists.map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default MensSexualHealthScreen;
