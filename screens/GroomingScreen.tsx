import React, { useMemo, useState } from 'react';
import SkincareRoutine from '../components/SkincareRoutine';
import WardrobeChecklist from '../components/WardrobeChecklist';
import HygieneChecklist from '../components/HygieneChecklist';
import WorkoutGenerator from '../components/WorkoutGenerator';
import { SparklesIcon, ScissorsIcon, DumbbellIcon, Crown, Gem, Shield as ShieldIcon } from '../components/Icons';

type SectionId = 'skin' | 'style' | 'hygiene' | 'training';

const SECTION_NAV = [
  {
    id: 'skin' as const,
    label: 'Skin Rituals',
    description: 'Personalised routines for every skin type.',
    icon: SparklesIcon
  },
  {
    id: 'style' as const,
    label: 'Style System',
    description: 'Build a repeatable wardrobe you trust.',
    icon: ScissorsIcon
  },
  {
    id: 'hygiene' as const,
    label: 'Grooming Cadence',
    description: 'Dialed habits that keep you fresh daily.',
    icon: ShieldIcon
  },
  {
    id: 'training' as const,
    label: 'Body & Performance',
    description: 'Stronger frame. Better posture. More energy.',
    icon: DumbbellIcon
  }
];

const STYLE_PLAYBOOK = [
  {
    title: 'Curate a Capsule',
    description: 'Pick 10-12 mix-and-match pieces per season. Focus on neutral base layers + one accent color you love.',
    tips: ['Anchor outfits with navy, charcoal, khaki, or olive.', 'Add one statement piece (leather jacket, textured overshirt) for edge.']
  },
  {
    title: 'Fit Audit',
    description: 'Great style starts with tailoring. Spend one afternoon dialing hemlines, sleeve lengths, and taper.',
    tips: ['Jeans: slight break at the ankle. No pooling.', 'Shirts: shoulder seam should hit at the edge of your shoulder.']
  },
  {
    title: 'Style Signatures',
    description: 'Define 2-3 things people associate with you—a signature scent, watch, or a consistent boot style.',
    tips: ['Rotate between daytime (fresh) and evening (warm) fragrances.', 'Invest in one high-quality leather accessory (belt, brief).']
  }
];

const BARBER_PLAYBOOK = [
  { cadence: 'Every 3-4 Weeks', focus: 'Haircut + neckline clean-up, discuss growth plan if changing styles.' },
  { cadence: 'Daily', focus: 'Use a matte paste or cream; avoid over-washing—2-3 shampoos/week is plenty.' },
  { cadence: 'Weekly', focus: 'Scalp exfoliation or clarifying shampoo to remove product build-up.' }
];

const HYGIENE_RITUALS = [
  { title: 'Oral Care Stack', detail: 'Brush x2 daily, floss nightly, tongue scrape AM. Book a dentist check-up every 6 months.' },
  { title: 'Body Maintenance', detail: 'Trim body hair every 2-3 weeks. Exfoliate with a gentle scrub once weekly to prevent ingrowns.' },
  { title: 'Fragrance Layering', detail: 'Apply an unscented moisturizer before cologne—it helps the scent stick and stay subtle.' }
];

const HYGIENE_CADENCE = [
  { item: 'Skincare restock', frequency: 'Every 3 months', note: 'Swap products seasonally—lighter in summer, richer in winter.' },
  { item: 'Towel / Sheets', frequency: 'Face towel daily, sheets weekly', note: 'Bacteria transfers fast—fresh linens keep skin clear.' },
  { item: 'Gym gear', frequency: 'Immediately after use', note: 'Hang-dry shoes and gloves; spray with antibacterial mist.' }
];

const TRAINING_PILLARS = [
  {
    title: 'Warm-Up Blueprint',
    description: '5 minutes cardio → dynamic mobility → activation. Example: jump rope, world’s greatest stretch, band pull-aparts.',
    icon: Gem
  },
  {
    title: 'Posture Reset',
    description: 'Add face pulls or band pull-aparts at the end of push days. Counterbalances desk slouching.',
    icon: Crown
  },
  {
    title: 'Recovery Stack',
    description: 'Contrast shower or sauna + magnesium glycinate before bed keeps nervous system calm.',
    icon: ShieldIcon
  }
];

const GroomingScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('skin');
  const sections = useMemo(() => SECTION_NAV, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'skin':
        return <SkinSection />;
      case 'style':
        return <StyleSection />;
      case 'hygiene':
        return <HygieneSection />;
      case 'training':
        return <TrainingSection />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in pb-16 md:pb-6 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Style & Body Hub</h1>
        <p className="text-lg md:text-xl text-text-secondary">
          Systems, not guesswork. Dial your grooming, style, and training so the outside matches the man you are becoming.
        </p>
        <nav className="flex flex-wrap gap-3 pt-2">
          {sections.map(({ id, label, description, icon: Icon }) => {
            const isActive = id === activeSection;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-accent bg-accent/10 text-text-primary shadow-card'
                    : 'border-gray-700 bg-secondary/40 text-text-secondary hover:border-accent/50 hover:text-text-primary'
                }`}
              >
                <Icon className={`h-5 w-5 mt-1 ${isActive ? 'text-accent' : 'text-text-secondary'}`} />
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wide">{label}</div>
                  <p className="text-xs mt-1 max-w-[220px] leading-relaxed">{description}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </header>

      {renderSection()}
    </div>
  );
};

const SkinSection: React.FC = () => (
  <div className="space-y-8">
    <SkincareRoutine />
  </div>
);

const StyleSection: React.FC = () => (
  <div className="space-y-8">
    <section className="bg-secondary p-6 rounded-lg border border-gray-700/60 shadow-lg space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-text-primary">Style Operating System</h2>
        <p className="text-text-secondary">
          Build a closet that works on autopilot. Start with the essentials, then layer personality with textures, accessories,
          and color stories that suit your environment.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STYLE_PLAYBOOK.map((card) => (
          <div key={card.title} className="bg-primary/40 border border-gray-700/60 rounded-lg p-5 space-y-3">
            <h3 className="text-xl font-semibold text-text-primary">{card.title}</h3>
            <p className="text-sm text-text-secondary">{card.description}</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              {card.tips.map((tip) => (
                <li key={tip} className="flex">
                  <span className="text-accent mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <WardrobeChecklist />

    <section className="bg-secondary p-6 rounded-lg border border-gray-700/60 shadow-lg space-y-4">
      <header>
        <h3 className="text-2xl font-semibold text-text-primary">Barber Playbook</h3>
        <p className="text-text-secondary">Maintain clean lines and communicate with your barber like a pro.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
        {BARBER_PLAYBOOK.map(({ cadence, focus }) => (
          <div key={cadence} className="bg-primary/40 border border-gray-700/60 rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-text-secondary">{cadence}</div>
            <p className="font-semibold text-text-primary mt-1">{focus}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-text-secondary/80">
        Tip: Save reference photos in your phone. Show angle shots (front / side / back) and note clipper guard numbers.
      </p>
    </section>
  </div>
);

const HygieneSection: React.FC = () => (
  <div className="space-y-8">
    <HygieneChecklist />

    <section className="bg-secondary p-6 rounded-lg border border-gray-700/60 shadow-lg space-y-4">
      <header>
        <h3 className="text-2xl font-semibold text-text-primary">Daily Grooming Rituals</h3>
        <p className="text-text-secondary">Stack micro-habits so you never second-guess your freshness.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {HYGIENE_RITUALS.map(({ title, detail }) => (
          <div key={title} className="bg-primary/40 border border-gray-700/60 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-text-primary">{title}</h4>
            <p className="text-sm text-text-secondary mt-1">{detail}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-secondary p-6 rounded-lg border border-gray-700/60 shadow-lg space-y-4">
      <header>
        <h3 className="text-2xl font-semibold text-text-primary">Care Cadence</h3>
        <p className="text-text-secondary">Set reminders in your calendar so these non-negotiables never slip.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
        {HYGIENE_CADENCE.map(({ item, frequency, note }) => (
          <div key={item} className="bg-primary/40 border border-gray-700/60 rounded-lg p-4">
            <div className="text-xs uppercase tracking-wide text-text-secondary">{frequency}</div>
            <p className="font-semibold text-text-primary mt-1">{item}</p>
            <p className="mt-2 text-text-secondary">{note}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const TrainingSection: React.FC = () => (
  <div className="space-y-8">
    <WorkoutGenerator />

    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TRAINING_PILLARS.map(({ title, description, icon: Icon }) => (
        <div key={title} className="bg-secondary p-5 rounded-lg border border-gray-700/60 shadow-lg space-y-3">
          <Icon className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      ))}
    </section>
  </div>
);

export default GroomingScreen;
