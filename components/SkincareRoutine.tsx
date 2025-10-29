import React, { useMemo, useState } from 'react';

type SkinType = 'balanced' | 'oily' | 'dry' | 'combination' | 'sensitive';

const FOUNDATION_STEPS = {
  AM: [
    { id: 'am1', name: 'Cleanse', description: 'Gentle gel/cream cleanser to remove overnight oil and prep the skin.' },
    { id: 'am2', name: 'Target', description: 'Thin serums (vitamin C, niacinamide, azelaic acid) while skin is slightly damp.' },
    { id: 'am3', name: 'Moisturize', description: 'Hydrate and cushion the skin barrier with a lightweight moisturizer.' },
    { id: 'am4', name: 'Shield', description: 'Broad-spectrum SPF 30+ every day, even if working indoors.' }
  ],
  PM: [
    { id: 'pm1', name: 'Double Cleanse', description: 'Oil-based cleanser (if you wear SPF/makeup) followed by gentle water-based cleanse.' },
    { id: 'pm2', name: 'Treat', description: 'Retinoid, exfoliant, or hydrating serum depending on the night.' },
    { id: 'pm3', name: 'Moisturize / Seal', description: 'Barrier-supporting cream to lock hydration while you sleep.' }
  ]
};

const SKINCARE_PLAYBOOK: Record<SkinType, {
  title: string;
  vibe: string;
  morningAdjustments: string[];
  eveningAdjustments: string[];
  ingredientsToSeek: string[];
  watchouts: string[];
}> = {
  balanced: {
    title: 'Balanced',
    vibe: 'Maintain the wins and prevent dullness.',
    morningAdjustments: [
      'Use a gel or milk cleanser—avoid anything labeled “clarifying.”',
      'Vitamin C serum 3-4x per week keeps skin bright without overloading it.',
      'Rotate between a lightweight moisturizer and gel-cream based on weather.'
    ],
    eveningAdjustments: [
      'Retinoid or gentle resurfacing serum 2-3 nights per week.',
      'On off nights, swap treatments for a peptide or hyaluronic acid serum.',
      'Weekly: clay or enzyme mask for 10 minutes to reset texture.'
    ],
    ingredientsToSeek: ['Niacinamide', 'Vitamin C (L-ascorbic or derivatives)', 'Peptides', 'Ceramides'],
    watchouts: ['Over-exfoliating—stick to max two active nights back-to-back.', 'Skipping SPF on cloudy days.']
  },
  oily: {
    title: 'Oily / Acne-Prone',
    vibe: 'Control oil without nuking the barrier.',
    morningAdjustments: [
      'Foaming cleanser with salicylic acid keeps pores clear.',
      'Niacinamide or zinc serums regulate sebum.',
      'Use a gel moisturizer; if you dislike shine, pick a matte finish SPF.'
    ],
    eveningAdjustments: [
      'Retinoid (adapalene/retinol) 3-4 nights per week for cell turnover.',
      'Introduce BHA liquid exfoliant 1-2 nights, never on retinoid nights.',
      'Spot treat breakouts with benzoyl peroxide or sulfur paste as needed.'
    ],
    ingredientsToSeek: ['Salicylic Acid', 'Niacinamide', 'Adapalene/Retinol', 'Green Tea/EGCG'],
    watchouts: ['Harsh alcohol toners that strip the skin.', 'Skipping moisturizer—oil still needs hydration.']
  },
  dry: {
    title: 'Dry / Dehydrated',
    vibe: 'Feed the barrier and trap moisture.',
    morningAdjustments: [
      'Cream cleanser or micellar water—no foaming surfactants.',
      'Layer hydrating mist → hyaluronic acid serum → rich moisturizer.',
      'SPF with added ceramides or oils to prevent TEWL (transepidermal water loss).'
    ],
    eveningAdjustments: [
      'Use an oil cleanser followed by cream cleanser only if needed.',
      'Alternate between barrier serums (squalane, omega oils) and gentle retinoid 1-2 nights.',
      'Seal with occlusive like a few drops of squalane or a sleeping mask.'
    ],
    ingredientsToSeek: ['Ceramides', 'Squalane', 'Oat Extracts', 'Hyaluronic Acid', 'Glycerin'],
    watchouts: ['Hot showers on face—finish with lukewarm rinse.', 'Physical scrubs that create micro-tears.']
  },
  combination: {
    title: 'Combination',
    vibe: 'Zone-specific strategy to keep T-zone calm and cheeks comfortable.',
    morningAdjustments: [
      'Use gentle gel cleanser. Apply niacinamide to T-zone only if cheeks feel tight.',
      'Spot-apply mattifying primer/SPF on the forehead and nose; richer SPF on cheeks.'
    ],
    eveningAdjustments: [
      'Retinoid or BHA night 2-3x weekly, focusing on the T-zone.',
      'Hydrating essence on cheeks every night, followed by balancing moisturizer.',
      'Multi-mask: clay on T-zone, hydrating mask on cheeks for 10 minutes weekly.'
    ],
    ingredientsToSeek: ['Niacinamide', 'Betaine', 'Lactic Acid', 'Lightweight Ceramides'],
    watchouts: ['Blanket-applying strong actives—treat your face in zones.', 'Skipping moisturizer on oily spots (creates rebound oil).']
  },
  sensitive: {
    title: 'Sensitive / Reactive',
    vibe: 'Minimal, soothing, and fragrance-free.',
    morningAdjustments: [
      'Use only lukewarm water and a creamy, non-foaming cleanser.',
      'Stick to minimal actives—top choice is panthenol or centella serum.',
      'Mineral SPF (zinc/titanium) with calming ingredients.'
    ],
    eveningAdjustments: [
      'Skip double cleanse unless SPF or makeup is heavy—use micellar water instead.',
      'Barrier repair cream nightly; add azelaic acid 2-3x per week if tolerated.',
      'Weekly: apply colloidal oat or aloe gel mask for 10 minutes.'
    ],
    ingredientsToSeek: ['Panthenol', 'Centella Asiatica', 'Colloidal Oat', 'Azelaic Acid (low strength)'],
    watchouts: ['Fragrance, essential oils, and gritty exfoliants.', 'Introducing more than one new product every 2 weeks.']
  }
};

const WEEKLY_BOOSTS = [
  { title: 'Exfoliate Intelligently', tip: 'Use liquid exfoliants (AHA/BHA) 1-2x weekly max. Follow with heavy moisture to avoid barrier damage.' },
  { title: 'Sheet Mask Sunday', tip: 'Hydrogel or bio-cellulose masks after cleansing lock in hydration before moisturizer.' },
  { title: 'Barber Facial Hack', tip: 'Schedule a steam + extraction facial every 6-8 weeks to deep clean without DIY damage.' }
];

const INSIDE_OUT_HABITS = [
  'Hydrate: aim for 2-3L water plus electrolytes if you train hard.',
  'Protein-first nutrition keeps skin resilient—think 30g protein within each meal.',
  'Supplement smart: consider omega-3s and vitamin D after consulting a professional.',
  'Sleep 7-9 hours. Skin repairs during deep sleep—phones out of the bedroom.'
];

const SkincareRoutine: React.FC = () => {
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>('balanced');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const playbook = SKINCARE_PLAYBOOK[selectedSkinType];
  const skinTypeOptions = useMemo(() => Object.keys(SKINCARE_PLAYBOOK) as SkinType[], []);

  return (
    <section className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50 space-y-8">
      <header className="space-y-3">
        <h2 className="text-3xl font-bold text-text-primary">Personalised Skin Playbook</h2>
        <p className="text-text-secondary">
          Dialed-in routines built around skin biology. Start with the universal foundation, then layer on the adjustments
          that match how your skin behaves today.
        </p>
      </header>

      <div className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-wide text-text-secondary">1 · Lock the Foundation</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoutineColumn
            title="Morning Game Plan"
            steps={FOUNDATION_STEPS.AM}
            completedSteps={completedSteps}
            toggleStep={toggleStep}
          />
          <RoutineColumn
            title="Evening Reset"
            steps={FOUNDATION_STEPS.PM}
            completedSteps={completedSteps}
            toggleStep={toggleStep}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm font-semibold uppercase tracking-wide text-text-secondary">2 · Match Your Skin Type</div>
        <div className="flex flex-wrap gap-2">
          {skinTypeOptions.map((type) => {
            const isActive = type === selectedSkinType;
            return (
              <button
                key={type}
                onClick={() => setSelectedSkinType(type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive ? 'bg-accent text-primary shadow-card' : 'bg-primary border border-gray-700 text-text-secondary hover:text-text-primary'
                }`}
              >
                {SKINCARE_PLAYBOOK[type].title}
              </button>
            );
          })}
        </div>

        <div className="bg-primary/40 border border-gray-700/60 rounded-lg p-5 space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-text-secondary">Focus</div>
            <h3 className="text-2xl font-semibold text-text-primary mt-1">{playbook.title}</h3>
            <p className="text-text-secondary mt-2">{playbook.vibe}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AdjustmentColumn heading="Morning Adjustments" items={playbook.morningAdjustments} />
            <AdjustmentColumn heading="Night Adjustments" items={playbook.eveningAdjustments} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoList heading="Ingredients to Look For" items={playbook.ingredientsToSeek} highlight />
            <InfoList heading="Common Watchouts" items={playbook.watchouts} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary/40 border border-gray-700/60 rounded-lg p-5 space-y-4">
          <div className="text-xs uppercase tracking-wide text-text-secondary">3 · Weekly Add-Ons</div>
          <ul className="space-y-3">
            {WEEKLY_BOOSTS.map(({ title, tip }) => (
              <li key={title}>
                <p className="font-semibold text-text-primary">{title}</p>
                <p className="text-sm text-text-secondary">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-primary/40 border border-gray-700/60 rounded-lg p-5 space-y-4">
          <div className="text-xs uppercase tracking-wide text-text-secondary">4 · Inside-Out Habits</div>
          <ul className="space-y-3 text-sm text-text-secondary">
            {INSIDE_OUT_HABITS.map((item) => (
              <li key={item} className="flex">
                <span className="text-accent mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-text-secondary/80">
            Pro tip: track reactions in your notes app. Log product name, time of day, and any redness/dryness within 48 hours.
            Tweak one variable at a time.
          </p>
        </div>
      </div>
    </section>
  );
};

interface RoutineColumnProps {
  title: string;
  steps: typeof FOUNDATION_STEPS.AM | typeof FOUNDATION_STEPS.PM;
  completedSteps: Set<string>;
  toggleStep: (id: string) => void;
}

const RoutineColumn: React.FC<RoutineColumnProps> = ({ title, steps, completedSteps, toggleStep }) => (
  <div className="bg-primary/30 border border-gray-700/60 rounded-lg p-5 space-y-3">
    <h3 className="text-xl font-semibold text-accent">{title}</h3>
    <ul className="space-y-3">
      {steps.map((step) => {
        const isDone = completedSteps.has(step.id);
        return (
          <li key={step.id} className="flex items-start">
            <button
              onClick={() => toggleStep(step.id)}
              className={`flex-shrink-0 h-6 w-6 rounded-md border-2 mr-3 mt-1 flex items-center justify-center transition-colors ${
                isDone ? 'border-accent bg-accent/90' : 'border-gray-600 hover:border-accent'
              }`}
            >
              {isDone && <div className="h-3 w-3 bg-primary rounded-sm" />}
            </button>
            <div>
              <p className={`font-semibold ${isDone ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{step.name}</p>
              <p className="text-sm text-text-secondary">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

const AdjustmentColumn: React.FC<{ heading: string; items: string[] }> = ({ heading, items }) => (
  <div className="bg-secondary/60 border border-gray-700/60 rounded-lg p-5 space-y-3">
    <h4 className="text-lg font-semibold text-text-primary">{heading}</h4>
    <ul className="space-y-2 text-sm text-text-secondary">
      {items.map((item) => (
        <li key={item} className="flex">
          <span className="text-accent mr-2">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const InfoList: React.FC<{ heading: string; items: string[]; highlight?: boolean }> = ({ heading, items, highlight }) => (
  <div className="bg-secondary/40 border border-gray-700/60 rounded-lg p-5 space-y-3">
    <h4 className="text-lg font-semibold text-text-primary">{heading}</h4>
    <ul className="space-y-2 text-sm text-text-secondary">
      {items.map((item) => (
        <li key={item} className="flex">
          <span className={`mr-2 ${highlight ? 'text-green-400' : 'text-red-400'}`}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default SkincareRoutine;
