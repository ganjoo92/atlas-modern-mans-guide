import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  getProfileReview,
  getConversationStarter,
  generateBioSuggestions,
  analyzePhotoSelection,
  getConversationStarterFromProfile,
  generatePersonalizedOpeners,
  reviewBioOnly,
  generateMsgForSpecificSituation,
} from '../services/geminiService';
import { MOCK_DATE_IDEAS, MOCK_ARTICLES } from '../constants';
import {
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  BookOpenIcon,
  SparklesIcon,
  HeartIcon,
  UserIcon,
  ChevronDown,
  ChevronUp,
  CheckBadgeIcon,
  Target,
  Calendar,
  Star,
} from '../components/Icons';
import GuideCard from '../components/GuideCard';
import type { Article } from '../types';

type StepId = 'profile' | 'bio' | 'conversation' | 'date';

interface EnrichedDateIdea {
  title: string;
  description: string;
  tags: string[];
}

const SparkleGlyph = SparklesIcon;

const STEP_META: Record<
  StepId,
  { title: string; description: string; icon: React.FC<React.ComponentProps<'svg'>> }
> = {
  profile: {
    title: 'Profile Upgrade',
    description: 'Audit photos + copy so you stand out instantly.',
    icon: ClipboardDocumentCheckIcon,
  },
  bio: {
    title: 'Bio Builder',
    description: 'Craft magnetic stories that frame your personality.',
    icon: SparklesIcon,
  },
  conversation: {
    title: 'Conversation Studio',
    description: 'Generate respectful openers and thoughtful follow ups.',
    icon: ChatBubbleLeftRightIcon,
  },
  date: {
    title: 'Date Playbook',
    description: 'Plan experiences with built-in chemistry.',
    icon: HeartIcon,
  },
};

const QUICK_TIPS = [
  {
    title: 'Message cadence',
    detail: 'Match energy. Respond within 12–24 hours, but skip the double-text if you just sent one.',
  },
  {
    title: 'Hook structure',
    detail: 'Lead with shared context, add curiosity, then invite their perspective. Avoid interview-style questions.',
  },
  {
    title: 'First-date frame',
    detail: 'Pick somewhere conversational (coffee, walk, gallery). Keep it 60–90 minutes so both of you can opt in for more.',
  },
  {
    title: 'Respectful boundaries',
    detail: 'No screenshots without consent. Be direct yet kind when you’re not feeling it—ghosting erodes confidence.',
  },
];

const DATE_TAGS = [
  { id: 'all', label: 'All ideas' },
  { id: 'first-date', label: 'First date' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'creative', label: 'Creative' },
  { id: 'food-drink', label: 'Food & drink' },
  { id: 'budget-friendly', label: 'Budget friendly' },
];

const annotateDateIdeas = (): EnrichedDateIdea[] => {
  return MOCK_DATE_IDEAS.map(idea => {
    const lower = `${idea.title} ${idea.description}`.toLowerCase();
    const tags = new Set<string>();

    if (lower.includes('first') || lower.includes('market') || lower.includes('coffee')) {
      tags.add('first-date');
    }
    if (lower.includes('hike') || lower.includes('stargazing') || lower.includes('out of the city')) {
      tags.add('outdoor');
    }
    if (lower.includes('cook') || lower.includes('bookstore') || lower.includes('challenge')) {
      tags.add('creative');
    }
    if (lower.includes('market') || lower.includes('cook') || lower.includes('home')) {
      tags.add('food-drink');
    }
    if (lower.includes('stargazing') || lower.includes('walk') || lower.includes('hike') || lower.includes('market')) {
      tags.add('budget-friendly');
    }

    if (!tags.size) {
      tags.add('first-date');
    }

    return {
      title: idea.title,
      description: idea.description,
      tags: Array.from(tags),
    };
  });
};

const scrollIntoView = (ref: React.RefObject<HTMLElement>) => {
  ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const copyToClipboard = async (text: string) => {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return false;
  }
};

const DatingScreen: React.FC<{ onSelectArticle?: (article: Article) => void }> = ({ onSelectArticle }) => {
  const [expandedSection, setExpandedSection] = useState<StepId>('profile');
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [mentorNotice, setMentorNotice] = useState<string | null>(null);

  const sectionRefs: Record<StepId, React.RefObject<HTMLDivElement>> = {
    profile: useRef<HTMLDivElement>(null),
    bio: useRef<HTMLDivElement>(null),
    conversation: useRef<HTMLDivElement>(null),
    date: useRef<HTMLDivElement>(null),
  };

  // Profile reviewer states
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState('');
  const [review, setReview] = useState('');
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reviewType, setReviewType] = useState<'full' | 'photos' | 'bio'>('full');

  // Bio generator states
  const [interests, setInterests] = useState('');
  const [personality, setPersonality] = useState('');
  const [job, setJob] = useState('');
  const [bioSuggestions, setBioSuggestions] = useState('');
  const [isBioLoading, setIsBioLoading] = useState(false);

  // Conversation states
  const [context, setContext] = useState('');
  const [starters, setStarters] = useState<string[]>([]);
  const [isStartersLoading, setIsStartersLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState('');
  const [yourInterests, setYourInterests] = useState('');
  const [situationContext, setSituationContext] = useState('');
  const [situationType, setSituationType] = useState('');
  const [customStarters, setCustomStarters] = useState('');
  const [isCustomLoading, setIsCustomLoading] = useState(false);

  // Date ideas
  const [activeDateTag, setActiveDateTag] = useState('all');
  const [favoriteIdeas, setFavoriteIdeas] = useState<Set<number>>(new Set());
  const [spotlightIdeaIndex, setSpotlightIdeaIndex] = useState(0);

  const enrichedDateIdeas = useMemo(() => annotateDateIdeas(), []);

  const datingArticles = useMemo(() => {
    return MOCK_ARTICLES.filter(article => {
      const category = article.category.toLowerCase();
      return (
        category.includes('dating') ||
        category.includes('social') ||
        category.includes('relationship') ||
        category.includes('confidence')
      );
    });
  }, []);

  const filteredDateIdeas = useMemo(() => {
    if (activeDateTag === 'all') return enrichedDateIdeas;
    return enrichedDateIdeas.filter(idea => idea.tags.includes(activeDateTag));
  }, [activeDateTag, enrichedDateIdeas]);

  useEffect(() => {
    const updated = new Set<StepId>();
    if (review) updated.add('profile');
    if (bioSuggestions) updated.add('bio');
    if (customStarters.trim() || starters.length) updated.add('conversation');
    if (favoriteIdeas.size || spotlightIdeaIndex) updated.add('date');
    setCompletedSteps(updated);
  }, [review, bioSuggestions, starters, customStarters, favoriteIdeas, spotlightIdeaIndex]);

  const completionPercent = Math.round((completedSteps.size / Object.keys(STEP_META).length) * 100);

  const handleProfileReview = async () => {
    if (reviewType !== 'photos' && !bio.trim()) return;
    if ((reviewType === 'full' || reviewType === 'photos') && !photos.trim()) return;

    setIsReviewLoading(true);
    try {
      let result = '';
      if (reviewType === 'bio') {
        result = await reviewBioOnly(bio);
      } else if (reviewType === 'photos') {
        result = await analyzePhotoSelection(photos);
      } else {
        result = await getProfileReview(bio, photos);
      }
      setReview(result);
    } catch (error) {
      console.error('Error getting profile review:', error);
      setReview('Sorry, there was an error analyzing your profile. Please try again.');
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleBioGeneration = async () => {
    if (!interests.trim() || !personality.trim()) return;
    setIsBioLoading(true);
    try {
      const result = await generateBioSuggestions(interests, personality, job);
      setBioSuggestions(result);
    } catch (error) {
      console.error('Error generating bio:', error);
      setBioSuggestions('Sorry, there was an error generating bio suggestions. Please try again.');
    } finally {
      setIsBioLoading(false);
    }
  };

  const handleConversationStarters = async () => {
    if (!context.trim()) return;
    setIsStartersLoading(true);
    try {
      const result = await getConversationStarter(context);
      setStarters(result.split('\n').filter(line => line.trim()));
    } catch (error) {
      console.error('Error generating conversation starters:', error);
      setStarters(['Sorry, there was an error generating conversation starters. Please try again.']);
    } finally {
      setIsStartersLoading(false);
    }
  };

  const runProfileBasedStarters = async () => {
    if (!profileDetails.trim()) return;
    setIsCustomLoading(true);
    try {
      const result = await getConversationStarterFromProfile(profileDetails);
      setCustomStarters(result);
    } catch (error) {
      console.error('Error generating profile-based starters:', error);
      setCustomStarters('Sorry, there was an error generating conversation starters. Please try again.');
    } finally {
      setIsCustomLoading(false);
    }
  };

  const runPersonalizedOpeners = async () => {
    if (!profileDetails.trim() || !yourInterests.trim()) return;
    setIsCustomLoading(true);
    try {
      const result = await generatePersonalizedOpeners(profileDetails, yourInterests);
      setCustomStarters(result);
    } catch (error) {
      console.error('Error generating personalized openers:', error);
      setCustomStarters('Sorry, there was an error generating personalized openers. Please try again.');
    } finally {
      setIsCustomLoading(false);
    }
  };

  const runSituationalMessage = async () => {
    if (!situationType.trim() || !situationContext.trim()) return;
    setIsCustomLoading(true);
    try {
      const result = await generateMsgForSpecificSituation(situationType, situationContext);
      setCustomStarters(result);
    } catch (error) {
      console.error('Error generating situational message:', error);
      setCustomStarters('Sorry, there was an error generating the message. Please try again.');
    } finally {
      setIsCustomLoading(false);
    }
  };

  const formattedReview = useMemo(() => {
    if (!review) return null;
    return review.split('### ').map((section, index) => {
      if (!section.trim()) return null;
      const [title, ...content] = section.split('\n');
      return (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-bold text-accent">{title.replace(/[*#]/g, '')}</h4>
          <p className="text-text-secondary whitespace-pre-wrap">{content.join('\n')}</p>
        </div>
      );
    });
  }, [review]);

  const handleSendToMentor = async (payload: string) => {
    const ok = await copyToClipboard(payload);
    setMentorNotice(ok ? 'Copied! Paste into the AI Mentor to keep the coaching loop going.' : 'Copy failed. Please copy manually.');
    window.setTimeout(() => setMentorNotice(null), 3500);
  };

  const toggleFavoriteIdea = (index: number) => {
    setFavoriteIdeas(prev => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  const cycleSpotlightIdea = () => {
    setSpotlightIdeaIndex(prev => (prev + 1) % enrichedDateIdeas.length);
  };

  const heroActions = Object.entries(STEP_META) as [StepId, typeof STEP_META[StepId]][];

  return (
    <div className="animate-fade-in pb-16 md:pb-6 space-y-10">
      <header className="bg-secondary/70 border border-gray-700/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-3 bg-primary/40 border border-gray-700/60 rounded-full px-3 py-1 text-xs uppercase tracking-wide text-accent">
            <Target className="w-4 h-4" />
            <span>Dating Toolkit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Build Chemistry On Purpose</h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            Work the playbook: sharpen your profile, ship respectful openers, then lock in meaningful dates. Track your momentum at every step.
          </p>
          {mentorNotice && (
            <div className="text-sm text-accent flex items-center gap-2">
              <SparkleGlyph className="w-4 h-4" />
              <span>{mentorNotice}</span>
            </div>
          )}
        </div>

        <div className="bg-primary/40 border border-gray-700/60 rounded-2xl px-6 py-6 flex flex-col items-center w-full md:w-72">
          <div className="relative h-32 w-32 flex items-center justify-center mb-3">
            <svg className="absolute inset-0" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" stroke="currentColor" className="text-gray-700" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                className="text-accent"
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={(2 * Math.PI * 54) * (1 - completionPercent / 100)}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <div className="relative text-3xl font-extrabold text-text-primary">{completionPercent}%</div>
          </div>
          <p className="text-sm text-text-secondary text-center">
            {completedSteps.size < heroActions.length
              ? `${heroActions.length - completedSteps.size} step${heroActions.length - completedSteps.size === 1 ? '' : 's'} to finish this week`
              : 'Toolkit complete — keep iterating as you progress'}
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {heroActions.map(([id, meta]) => {
          const Icon = meta.icon;
          const isComplete = completedSteps.has(id);
          return (
            <button
              key={id}
              onClick={() => {
                setExpandedSection(id);
                scrollIntoView(sectionRefs[id]);
              }}
              className={`text-left rounded-2xl border transition-all duration-200 p-4 flex flex-col gap-2 ${
                isComplete
                  ? 'border-green-500/60 bg-green-500/10 text-text-primary shadow-card'
                  : 'border-gray-700/60 bg-secondary/60 text-text-secondary hover:border-accent/50 hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isComplete ? 'text-green-300' : 'text-accent'}`} />
                <span className="text-sm font-semibold uppercase tracking-wide text-text-primary">{meta.title}</span>
              </div>
              <p className="text-xs text-text-secondary">{meta.description}</p>
            </button>
          );
        })}
      </section>

      <CollapsibleSection
        id="profile"
        title={STEP_META.profile.title}
        description={STEP_META.profile.description}
        icon={STEP_META.profile.icon}
        isExpanded={expandedSection === 'profile'}
        onToggle={setExpandedSection}
        sectionRef={sectionRefs.profile}
        complete={completedSteps.has('profile')}
      >
        <div className="flex flex-wrap gap-3 mb-6">
          {(['full', 'photos', 'bio'] as const).map(option => (
            <button
              key={option}
              onClick={() => setReviewType(option)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                reviewType === option
                  ? 'bg-accent text-primary shadow-card'
                  : 'bg-primary text-text-secondary hover:bg-primary/60 hover:text-text-primary'
              }`}
            >
              {option === 'full'
                ? '🎯 Full Review'
                : option === 'photos'
                ? '📸 Photos Only'
                : '📝 Bio Only'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {reviewType !== 'photos' && (
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  Your Current Bio
                  {reviewType !== 'photos' && <span className="text-red-400 ml-1">*</span>}
                </label>
                <textarea
                  value={bio}
                  onChange={event => setBio(event.target.value)}
                  placeholder={
                    reviewType === 'photos'
                      ? 'Bio not needed.'
                      : 'Paste your current bio here so the coach can dissect tone, clarity, and intrigue.'
                  }
                  disabled={reviewType === 'photos'}
                  className="w-full h-32 bg-primary text-text-primary border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
            )}

            {(reviewType === 'full' || reviewType === 'photos') && (
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  Describe Each Photo <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={photos}
                  onChange={event => setPhotos(event.target.value)}
                  placeholder="Photo 1: Close-up, natural light, smiling • Photo 2: Hiking full body shot • Photo 3: With friends at rooftop bar..."
                  className="w-full h-32 bg-primary text-text-primary border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <p className="text-xs text-text-secondary mt-2">
                  💡 Specific details = better recommendations. Mention outfits, settings, expressions, and who is in frame.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-4 text-sm text-text-secondary space-y-2">
              <p className="font-semibold text-text-primary">Profile line-up checklist</p>
              <ul className="space-y-1">
                <li>• Lead with a smiling solo shot (waist up).</li>
                <li>• Show lifestyle: full-body, hobby, social, travel.</li>
                <li>• Avoid sunglasses or group-only photos.</li>
                <li>• Keep captions simple; let the images carry the story.</li>
              </ul>
            </div>

            <button
              onClick={handleProfileReview}
              disabled={
                isReviewLoading ||
                (reviewType !== 'photos' && !bio.trim()) ||
                ((reviewType === 'full' || reviewType === 'photos') && !photos.trim())
              }
              className="w-full bg-gradient-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-500/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-primary font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isReviewLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                  Analyzing your profile...
                </div>
              ) : (
                `Get ${reviewType === 'full' ? 'Complete' : reviewType === 'photos' ? 'Photo' : 'Bio'} Analysis`
              )}
            </button>

            {review && (
              <div className="bg-primary border border-gray-700/60 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-accent">Your Profile Analysis</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReview('')}
                      className="text-xs text-text-secondary hover:text-text-primary underline"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => handleSendToMentor(review)}
                      className="text-xs text-accent hover:text-accent-light underline"
                    >
                      Send to Mentor
                    </button>
                  </div>
                </div>
                <div className="text-text-secondary space-y-4">{formattedReview}</div>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="bio"
        title={STEP_META.bio.title}
        description={STEP_META.bio.description}
        icon={STEP_META.bio.icon}
        isExpanded={expandedSection === 'bio'}
        onToggle={setExpandedSection}
        sectionRef={sectionRefs.bio}
        complete={completedSteps.has('bio')}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Interests</label>
                <input
                  value={interests}
                  onChange={event => setInterests(event.target.value)}
                  placeholder="Salsa, analog photography, running, coffee nerd..."
                  className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Personality vibe</label>
                <input
                  value={personality}
                  onChange={event => setPersonality(event.target.value)}
                  placeholder="Playful, curious, intro-extro, adventurous..."
                  className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Role / day job (optional)</label>
              <input
                value={job}
                onChange={event => setJob(event.target.value)}
                placeholder="Product designer, firefighter, grad student..."
                className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              onClick={handleBioGeneration}
              disabled={isBioLoading || !interests.trim() || !personality.trim()}
              className="w-full bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-primary font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isBioLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                  Crafting bio concepts...
                </div>
              ) : (
                'Generate Bio Concepts'
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-4 text-sm text-text-secondary space-y-2">
              <p className="font-semibold text-text-primary">Bio cheat codes</p>
              <ul className="space-y-1">
                <li>• Hook (line one) + intrigue (line two) + invite (line three).</li>
                <li>• Show, don’t list. Paint a quick scene or mini-story.</li>
                <li>• Avoid negativity (“No drama”, “Don’t message if...” ).</li>
              </ul>
            </div>

            {bioSuggestions && (
              <div className="bg-primary border border-gray-700/60 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-accent">Bio ideas ready to test</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBioSuggestions('')}
                      className="text-xs text-text-secondary hover:text-text-primary underline"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => handleSendToMentor(bioSuggestions)}
                      className="text-xs text-accent hover:text-accent-light underline"
                    >
                      Send to Mentor
                    </button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-text-secondary text-sm">{bioSuggestions}</pre>
              </div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="conversation"
        title={STEP_META.conversation.title}
        description={STEP_META.conversation.description}
        icon={STEP_META.conversation.icon}
        isExpanded={expandedSection === 'conversation'}
        onToggle={setExpandedSection}
        sectionRef={sectionRefs.conversation}
        complete={completedSteps.has('conversation')}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-secondary/60 border border-gray-700/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-accent" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Baseline Openers</h3>
                  <p className="text-sm text-text-secondary">
                    Drop the match context here. The AI will craft three respectful openers.
                  </p>
                </div>
              </div>
              <textarea
                value={context}
                onChange={event => setContext(event.target.value)}
                placeholder="We matched on Hinge. She mentioned training for a half marathon and loving farmer's markets..."
                className="w-full h-28 bg-primary text-text-primary border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <button
                onClick={handleConversationStarters}
                disabled={isStartersLoading || !context.trim()}
                className="w-full bg-gradient-to-r from-accent to-blue-500 hover:from-accent/90 hover:to-blue-500/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-primary font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {isStartersLoading ? 'Generating openers...' : 'Get Conversation Starters'}
              </button>
            </div>

            <div className="bg-secondary/60 border border-gray-700/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-accent" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Profile Deep-Dive</h3>
                  <p className="text-sm text-text-secondary">
                    Paste their prompts / key details. Layer in your angle or interests to receive purposeful openers.
                  </p>
                </div>
              </div>
              <textarea
                value={profileDetails}
                onChange={event => setProfileDetails(event.target.value)}
                placeholder="Prompt: The way to my heart... /Likes: climbing, sushi tastings, indie films./ Shared interest: travel to Japan last year..."
                className="w-full h-28 bg-primary text-text-primary border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <textarea
                value={yourInterests}
                onChange={event => setYourInterests(event.target.value)}
                placeholder="What about you connects? e.g. 'I climb weekly and host ramen nights with friends.'"
                className="w-full h-24 bg-primary text-text-primary border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={runProfileBasedStarters}
                  disabled={isCustomLoading || !profileDetails.trim()}
                  className="bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-primary font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isCustomLoading ? 'Working...' : 'Tailor to their profile'}
                </button>
                <button
                  onClick={runPersonalizedOpeners}
                  disabled={isCustomLoading || !profileDetails.trim() || !yourInterests.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-500/90 hover:to-purple-500/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-primary font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isCustomLoading ? 'Working...' : 'Blend both personalities'}
                </button>
              </div>
            </div>

            <div className="bg-secondary/60 border border-gray-700/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <LightBulbIcon className="w-6 h-6 text-accent" />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Situational Backup</h3>
                  <p className="text-sm text-text-secondary">
                    Need to break the ice after silence or pivot gracefully? Describe the situation.
                  </p>
                </div>
              </div>
              <input
                value={situationType}
                onChange={event => setSituationType(event.target.value)}
                placeholder="e.g. She hasn’t replied in 2 days / We rescheduled twice..."
                className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <textarea
                value={situationContext}
                onChange={event => setSituationContext(event.target.value)}
                placeholder="Add context: what you said last, relevant details, tone you want (playful, sincere, etc.)"
                className="w-full h-24 bg-primary text-text-primary border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <button
                onClick={runSituationalMessage}
                disabled={isCustomLoading || !situationType.trim() || !situationContext.trim()}
                className="w-full bg-gradient-to-r from-accent to-teal-500 hover:from-accent/90 hover:to-teal-500/90 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-primary font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                {isCustomLoading ? 'Working...' : 'Draft a situational message'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {!!starters.length && (
              <div className="bg-primary border border-gray-700/60 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-accent">Conversation starters</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setStarters([])} className="text-xs text-text-secondary hover:text-text-primary underline">
                      Clear
                    </button>
                    <button
                      onClick={() => handleSendToMentor(starters.join('\n'))}
                      className="text-xs text-accent hover:text-accent-light underline"
                    >
                      Send to Mentor
                    </button>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-text-secondary">
                  {starters.map((line, index) => (
                    <li key={`${line}-${index}`} className="bg-secondary/60 border border-gray-700/60 rounded-lg p-3">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {customStarters && (
              <div className="bg-primary border border-gray-700/60 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-accent">Tailored messages</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setCustomStarters('')} className="text-xs text-text-secondary hover:text-text-primary underline">
                      Clear
                    </button>
                    <button
                      onClick={() => handleSendToMentor(customStarters)}
                      className="text-xs text-accent hover:text-accent-light underline"
                    >
                      Send to Mentor
                    </button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-text-secondary">{customStarters}</pre>
              </div>
            )}

            <div className="bg-secondary/60 border border-gray-700/60 rounded-xl p-5 space-y-3 text-sm text-text-secondary">
              <p className="font-semibold text-text-primary">Before you hit send</p>
              <ul className="space-y-1">
                <li>• Read the message out loud. Does it sound like you?</li>
                <li>• Keep consent central—no assumptions, no pressure.</li>
                <li>• Mention specific details so it doesn’t feel copy/paste.</li>
                <li>• If they don’t respond, step back gracefully. Confidence is quiet.</li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="date"
        title={STEP_META.date.title}
        description={STEP_META.date.description}
        icon={STEP_META.date.icon}
        isExpanded={expandedSection === 'date'}
        onToggle={setExpandedSection}
        sectionRef={sectionRefs.date}
        complete={completedSteps.has('date')}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {DATE_TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => setActiveDateTag(tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeDateTag === tag.id
                    ? 'bg-accent text-primary shadow-card'
                    : 'bg-primary text-text-secondary hover:bg-primary/60 hover:text-text-primary'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDateIdeas.map((idea, index) => {
              const globalIndex = enrichedDateIdeas.findIndex(
                base => base.title === idea.title && base.description === idea.description
              );
              const isFavorite = favoriteIdeas.has(globalIndex);
              return (
                <div
                  key={`${idea.title}-${index}`}
                  className="bg-secondary/60 border border-gray-700/60 rounded-xl p-5 flex flex-col space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{idea.title}</h3>
                      <p className="text-sm text-text-secondary mt-1">{idea.description}</p>
                    </div>
                    <button onClick={() => toggleFavoriteIdea(globalIndex)} aria-label="Toggle favorite">
                      <Star className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-text-secondary'}`} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-primary/50 text-xs text-text-secondary border border-gray-700/60 rounded-full px-3 py-1"
                      >
                        #{tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      onClick={() =>
                        handleSendToMentor(`Date idea: ${idea.title}\n\nPlan: ${idea.description}\n\nLet's build the script.`)
                      }
                      className="flex-1 text-xs text-accent hover:text-accent-light underline"
                    >
                      Workshop with Mentor
                    </button>
                    <button
                      onClick={async () => {
                        const copied = await copyToClipboard(`${idea.title}\n\n${idea.description}`);
                        setMentorNotice(
                          copied ? 'Copied! Share with your date or drop into Notes.' : 'Copy failed. Please copy manually.'
                        );
                        window.setTimeout(() => setMentorNotice(null), 3000);
                      }}
                      className="text-xs text-text-secondary hover:text-text-primary underline"
                    >
                      Copy plan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Spotlight idea
              </h3>
              <p className="text-sm text-text-secondary">
                {enrichedDateIdeas[spotlightIdeaIndex]?.title}: {enrichedDateIdeas[spotlightIdeaIndex]?.description}
              </p>
            </div>
            <button
              onClick={cycleSpotlightIdea}
              className="px-4 py-2 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors"
            >
              Shuffle another
            </button>
          </div>
        </div>
      </CollapsibleSection>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-secondary/60 border border-gray-700/60 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <LightBulbIcon className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-semibold text-text-primary">Quick Wins & Reminders</h2>
          </div>
          <ul className="space-y-3 text-sm text-text-secondary">
            {QUICK_TIPS.map((tip, index) => (
              <li key={tip.title} className="bg-primary/40 border border-gray-700/60 rounded-lg p-4">
                <p className="font-semibold text-text-primary flex items-center gap-2 mb-1">
                  <CheckBadgeIcon className="w-4 h-4 text-accent" />
                  {tip.title}
                </p>
                <p>{tip.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-secondary/60 border border-gray-700/60 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <BookOpenIcon className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-semibold text-text-primary">Recommended Guides</h2>
          </div>
          <p className="text-sm text-text-secondary">
            Want deeper dives? These guides layer mindset, communication, and confidence training on top of the toolkit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datingArticles.slice(0, 4).map(article => (
              <GuideCard key={article.id} article={article} onClick={() => onSelectArticle?.(article)} />
            ))}
          </div>
          {datingArticles.length > 4 && (
            <button
              onClick={() => scrollIntoView(sectionRefs.profile)}
              className="text-sm text-accent hover:text-accent-light underline"
            >
              Browse the full Guides Library →
            </button>
          )}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <UserIcon className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-semibold text-text-primary">How to keep momentum</h2>
        </div>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>• Log completed actions in Challenges to watch your streak grow.</li>
          <li>• After each outing, journal what clicked (or didn’t) in the AI Mentor to tighten your feedback loop.</li>
          <li>• Revisit the toolkit monthly—small tweaks compound faster than full rewrites every six months.</li>
        </ul>
      </section>
    </div>
  );
};

interface CollapsibleSectionProps {
  id: StepId;
  title: string;
  description: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
  isExpanded: boolean;
  onToggle: (id: StepId) => void;
  sectionRef: React.RefObject<HTMLDivElement>;
  complete?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  description,
  icon: Icon,
  isExpanded,
  onToggle,
  sectionRef,
  complete,
  children,
}) => {
  return (
    <section ref={sectionRef} className="bg-secondary/60 border border-gray-700/60 rounded-2xl overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
              complete ? 'bg-green-500/20 border border-green-500/40' : 'bg-primary/40 border border-gray-700/60'
            }`}
          >
            <Icon className={`w-6 h-6 ${complete ? 'text-green-300' : 'text-accent'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-secondary" />
        )}
      </button>
      {isExpanded && <div className="px-6 pb-6 pt-2 space-y-6">{children}</div>}
    </section>
  );
};

export default DatingScreen;
