import React, { useMemo, useState } from 'react';
import {
  LightBulbIcon,
  BrainIcon,
  Calendar,
  Target,
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  Shield,
  Download,
} from '../components/Icons';

interface AnalogPresenceScreenProps {
  onComplete: () => void;
}

const ANALOG_WINDOWS = [
  {
    id: 'dawn-grounding',
    name: 'Dawn grounding (10-15 mins)',
    description: 'Step outside or sit near a window, notice light, scent, ambient sound before touching your phone.',
  },
  {
    id: 'midday-reset',
    name: 'Midday reset block (20 mins)',
    description: 'Go for a slow walk without audio. Track how many textures, colors, and sounds you observe.',
  },
  {
    id: 'evening-unwind',
    name: 'Analog wind-down (45 mins)',
    description: 'Swap screens for print, sketching, or stretching 60 minutes before bed.',
  },
  {
    id: 'weekend-sabbath',
    name: 'Half-day tech sabbath',
    description: 'One weekend morning with phone on airplane mode. Plan analog social or solo exploration.',
  },
];

const ANALOG_RITUALS = [
  {
    id: 'observation-journal',
    title: 'Observation journal',
    prompt: 'Carry a pocket notebook. Capture five sensory notes when boredom shows up.',
  },
  {
    id: 'slow-skill',
    title: 'Slow skill practice',
    prompt: 'Practice a manual skill (whittling, calligraphy, cooking) for 20+ minutes with no background media.',
  },
  {
    id: 'analog-social',
    title: 'Analog social micro-date',
    prompt: 'Invite someone to join a walk, cafe sit, or museum trip with phones tucked away.',
  },
  {
    id: 'unstructured-thinking',
    title: 'Unstructured thinking block',
    prompt: 'Sit with a single question and let your mind wander. Capture ideas only after five silent minutes.',
  },
];

const MICRO_MISSIONS = [
  {
    id: 'micro-commute',
    title: 'Commute without cues',
    detail: 'Travel a familiar route without headphones. Notice how often the urge to check appears—log the count.',
  },
  {
    id: 'queue-audit',
    title: 'Line wait audit',
    detail: 'During any wait, count three things you can smell, two you can hear, and one you can touch.',
  },
  {
    id: 'room-reset',
    title: 'Room reset drill',
    detail: 'Choose one room. Remove every screen. Sit for 10 minutes noting boredom waves and breathing through them.',
  },
  {
    id: 'analog-dopamine',
    title: 'Analog dopamine swap',
    detail: 'Replace one scroll session with a novelty-free task (fold laundry, stretch) and score mood on a 1-5 scale.',
  },
];

const RESEARCH_CALLOUTS = [
  {
    title: 'Harvard: Boredom unlocks divergent thinking',
    insight:
      'Harvard Business Review summarised lab findings showing that brief boredom boosts creative problem-solving by forcing the brain into default mode network engagement.',
    action: 'Protect at least one weekly block where you deliberately remove stimulation to let the mind wander.',
  },
  {
    title: 'Harvard Health: Digital breaks ease anxiety loops',
    insight:
      'Harvard Health Publishing notes that stepping away from notifications lowers sympathetic arousal, giving the nervous system a chance to recalibrate.',
    action: 'Trigger “airplane mode” during the final hour before sleep to improve sleep onset and mood.',
  },
  {
    title: 'McLean Hospital: Mindful awareness builds distress tolerance',
    insight:
      'Clinicians at Harvard-affiliated McLean Hospital use mindful boredom exposure to help patients ride out anxious urges without reacting.',
    action: 'Track boredom spikes with a simple 1-5 scale and pair each with a grounding cue (breath, senses, posture).',
  },
];

const REFLECTION_PROMPTS = [
  'When I get bored, my first impulse is…',
  'If I leave my phone behind, I worry that…',
  'My best ideas often show up when…',
  'The analog habit my future self will thank me for is…',
];

const AnalogPresenceScreen: React.FC<AnalogPresenceScreenProps> = ({ onComplete }) => {
  const [selectedWindows, setSelectedWindows] = useState<string[]>([]);
  const [selectedRituals, setSelectedRituals] = useState<string[]>([]);
  const [selectedMissions, setSelectedMissions] = useState<string[]>([]);
  const [phoneParkingSpot, setPhoneParkingSpot] = useState('');
  const [accountabilityPartner, setAccountabilityPartner] = useState('');
  const [reflection, setReflection] = useState('');
  const [downloadHintShown, setDownloadHintShown] = useState(false);

  const planStrength = useMemo(() => {
    const scoreParts = [
      selectedWindows.length > 0,
      selectedRituals.length > 0,
      selectedMissions.length > 0,
      phoneParkingSpot.trim().length > 0,
      accountabilityPartner.trim().length > 0,
      reflection.trim().length > 0,
    ];
    const numerator = scoreParts.filter(Boolean).length;
    if (numerator <= 2) return { level: 'Baseline forming', detail: 'Lock at least one window and ritual to get momentum.' };
    if (numerator <= 4) return { level: 'Momentum building', detail: 'You have structure—stack accountability and reflection next.' };
    return { level: 'Analog lifestyle engaged', detail: 'You have the core pillars dialed. Run the plan and iterate weekly.' };
  }, [selectedWindows, selectedRituals, selectedMissions, phoneParkingSpot, accountabilityPartner, reflection]);

  const toggleSelection = (value: string, collection: string[], setter: (values: string[]) => void) => {
    setter(collection.includes(value) ? collection.filter(item => item !== value) : [...collection, value]);
  };

  return (
    <div className="space-y-10">
      <header className="bg-secondary/70 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/40 border border-gray-700/60 text-xs uppercase tracking-wide text-accent px-3 py-1 rounded-full">
          <LightBulbIcon className="w-4 h-4" />
          <span>Analog Presence Lab</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">Boredom Reboots Your Nervous System</h1>
          <p className="text-base md:text-lg text-text-secondary">
            Build tolerance for quiet moments, lower anxiety loops, and reintroduce the offline rituals our grandfathers relied on. You will
            create a weekly tech-free cadence, analog micro-challenges, and track the calm that follows.
          </p>
        </div>
        <div className="bg-primary/30 border border-gray-700/60 rounded-2xl p-4 md:p-5 space-y-3">
          <div className="flex items-center gap-3">
            <BrainIcon className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm text-text-primary font-semibold">Why we train boredom tolerance</p>
              <p className="text-sm text-text-secondary">
                The default mode network (your brain’s “strategic autopilot”) needs uninterrupted stretches. Without them, anxious loops stay stuck on the same script.
              </p>
            </div>
          </div>
          <p className="text-xs text-text-secondary/80">
            Suggested cadence: 2-3 analog blocks per week, minimum 20 minutes each. Track mood before and after to see the compounding effect.
          </p>
        </div>
      </header>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Evidence Snapshot</h2>
            <p className="text-sm text-text-secondary">Ground your ritual in science-backed cues from Harvard researchers.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RESEARCH_CALLOUTS.map(card => (
            <article
              key={card.title}
              className="bg-primary/30 border border-gray-700/60 rounded-2xl p-4 space-y-3"
            >
              <h3 className="text-lg font-semibold text-text-primary">{card.title}</h3>
              <p className="text-sm text-text-secondary">{card.insight}</p>
              <p className="text-xs text-accent/90">{card.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-7">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Design Your Analog Windows</h2>
            <p className="text-sm text-text-secondary">Pick the tech-free blocks that will anchor your nervous system reset each week.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ANALOG_WINDOWS.map(window => {
            const isSelected = selectedWindows.includes(window.id);
            return (
              <button
                key={window.id}
                onClick={() => toggleSelection(window.id, selectedWindows, setSelectedWindows)}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? 'border-accent/70 bg-accent/10 text-text-primary'
                    : 'border-gray-700/60 bg-primary/20 text-text-secondary hover:border-accent/30 hover:text-text-primary'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-base">{window.name}</span>
                  <span
                    className={`text-xs uppercase tracking-wide ${
                      isSelected ? 'text-accent' : 'text-text-secondary/60'
                    }`}
                  >
                    {isSelected ? 'Locked in' : 'Tap to add'}
                  </span>
                </div>
                <p className="mt-2 text-sm">{window.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-7">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Analog Ritual Stack</h2>
            <p className="text-sm text-text-secondary">
              Choose the boredom workouts that rewire reward pathways away from constant stimulation.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ANALOG_RITUALS.map(ritual => {
            const isSelected = selectedRituals.includes(ritual.id);
            return (
              <button
                key={ritual.id}
                onClick={() => toggleSelection(ritual.id, selectedRituals, setSelectedRituals)}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? 'border-accent/70 bg-accent/10 text-text-primary'
                    : 'border-gray-700/60 bg-primary/20 text-text-secondary hover:border-accent/30 hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <SparklesIcon className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-text-secondary/60'}`} />
                  <span className="font-semibold text-base">{ritual.title}</span>
                </div>
                <p className="mt-2 text-sm">{ritual.prompt}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <ClockIcon className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Micro Missions</h2>
            <p className="text-sm text-text-secondary">
              Deploy these during idle pockets—queues, commutes, breaks—to reinforce presence and curb reflexive phone grabs.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MICRO_MISSIONS.map(mission => {
            const isSelected = selectedMissions.includes(mission.id);
            return (
              <button
                key={mission.id}
                onClick={() => toggleSelection(mission.id, selectedMissions, setSelectedMissions)}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  isSelected
                    ? 'border-accent/70 bg-accent/10 text-text-primary'
                    : 'border-gray-700/60 bg-primary/20 text-text-secondary hover:border-accent/30 hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckBadgeIcon className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-text-secondary/60'}`} />
                  <span className="font-semibold text-base">{mission.title}</span>
                </div>
                <p className="mt-2 text-sm">{mission.detail}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Create Your Accountability Loop</h2>
            <p className="text-sm text-text-secondary">
              Anchor analog time by telling your environment what will happen when boredom arrives.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 bg-primary/20 border border-gray-700/60 rounded-2xl p-4">
            <span className="text-sm font-semibold text-text-primary">Phone lives here when you unplug</span>
            <input
              value={phoneParkingSpot}
              onChange={event => setPhoneParkingSpot(event.target.value)}
              placeholder="Example: Charger drawer in the kitchen"
              className="bg-primary/30 border border-gray-700/60 rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/60"
            />
            <span className="text-xs text-text-secondary">
              Physical distance breaks the muscle memory of reach-and-refresh.
            </span>
          </label>
          <label className="flex flex-col gap-2 bg-primary/20 border border-gray-700/60 rounded-2xl p-4">
            <span className="text-sm font-semibold text-text-primary">Accountability partner or check-in</span>
            <input
              value={accountabilityPartner}
              onChange={event => setAccountabilityPartner(event.target.value)}
              placeholder="Example: Text brother Sunday night with boredom streak"
              className="bg-primary/30 border border-gray-700/60 rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent/60"
            />
            <span className="text-xs text-text-secondary">
              Share the plan so someone can ask, “How did the analog block feel?”
            </span>
          </label>
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <BrainIcon className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">Reflection Primer</h2>
            <p className="text-sm text-text-secondary">Pick one prompt and write a quick response after each analog session.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REFLECTION_PROMPTS.map(prompt => (
            <div key={prompt} className="bg-primary/20 border border-gray-700/60 rounded-2xl p-4">
              <p className="text-sm text-text-secondary">{prompt}</p>
            </div>
          ))}
        </div>
        <textarea
          value={reflection}
          onChange={event => setReflection(event.target.value)}
          placeholder="Capture your current relationship with boredom. Keep it messy—this is where the insights start."
          className="w-full h-28 bg-primary/30 border border-gray-700/60 rounded-2xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent/60"
        />
      </section>

      <section className="bg-secondary/70 border border-gray-700/60 rounded-3xl p-6 md:p-8 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-text-primary">Plan Strength: {planStrength.level}</h2>
            <p className="text-sm text-text-secondary">{planStrength.detail}</p>
            <p className="text-xs text-text-secondary/80">
              Keep iterating. Harvard research shows that even 20 minutes of device-free wandering per day can improve problem solving within two weeks.
            </p>
          </div>
          <button
            onClick={() => {
              if (!downloadHintShown) {
                setDownloadHintShown(true);
              }
              onComplete();
            }}
            className="bg-accent text-primary px-6 py-3 rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Mark session complete
          </button>
        </div>
        <div className="bg-primary/20 border border-dashed border-accent/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Export tip</p>
              <p className="text-xs text-text-secondary">
                Drop these picks into your calendar or print a single-page ritual sheet and keep it near your phone parking spot.
              </p>
            </div>
          </div>
          {downloadHintShown && (
            <span className="text-xs text-accent/80">
              Bonus: Share the ritual sheet with your accountability partner for a shared analog streak.
            </span>
          )}
        </div>
      </section>
    </div>
  );
};

export default AnalogPresenceScreen;
