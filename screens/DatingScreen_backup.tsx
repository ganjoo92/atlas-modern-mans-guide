import React, { useState, useMemo } from 'react';
import { getProfileReview, getConversationStarter, generateBioSuggestions, analyzePhotoSelection } from '../services/geminiService';
import { MOCK_DATE_IDEAS, MOCK_ARTICLES } from '../constants';
import { ClipboardDocumentCheckIcon, ChatBubbleLeftRightIcon, LightBulbIcon, BookOpenIcon, SparklesIcon, HeartIcon, UserIcon } from '../components/Icons';
import GuideCard from '../components/GuideCard';
import type { Article } from '../types';

type TabType = 'guides' | 'ai-tools' | 'quick-tips' | 'date-ideas';

const DatingScreen: React.FC<{ onSelectArticle?: (article: Article) => void }> = ({ onSelectArticle }) => {
    // Main tab state
    const [activeTab, setActiveTab] = useState<TabType>('guides');
    
    // State for Profile Reviewer
    const [bio, setBio] = useState('');
    const [photos, setPhotos] = useState('');
    const [review, setReview] = useState('');
    const [isReviewLoading, setIsReviewLoading] = useState(false);
    const [reviewType, setReviewType] = useState<'full' | 'photos' | 'bio'>('full');

    // State for Bio Generator
    const [interests, setInterests] = useState('');
    const [personality, setPersonality] = useState('');
    const [job, setJob] = useState('');
    const [bioSuggestions, setBioSuggestions] = useState('');
    const [isBioLoading, setIsBioLoading] = useState(false);

    // State for Photo Analysis
    const [photoAnalysis, setPhotoAnalysis] = useState('');
    const [isPhotoLoading, setIsPhotoLoading] = useState(false);

    // State for Conversation Starter
    const [context, setContext] = useState('');
    const [starters, setStarters] = useState<string[]>([]);
    const [isStartersLoading, setIsStartersLoading] = useState(false);

    // State for Date Idea Generator
    const [dateIdea, setDateIdea] = useState(MOCK_DATE_IDEAS[0]);

    // Filter dating-related articles
    const datingArticles = MOCK_ARTICLES.filter(article => 
        article.category.includes('Dating') || 
        article.category.includes('Social Skills') || 
        article.category.includes('Relationship')
    );

    const handleProfileReview = async () => {
        if (reviewType === 'full' && (!bio.trim() && !photos.trim())) return;
        if (reviewType === 'bio' && !bio.trim()) return;
        if (reviewType === 'photos' && !photos.trim()) return;
        
        setIsReviewLoading(true);
        setReview('');
        try {
            let result = '';
            if (reviewType === 'full') {
                result = await getProfileReview(bio, photos);
            } else if (reviewType === 'photos') {
                result = await analyzePhotoSelection(photos);
            } else if (reviewType === 'bio') {
                result = await getProfileReview(bio, '');
            }
            setReview(result);
        } catch (error) {
            console.error(error);
            setReview("Sorry, something went wrong. Please try again.");
        } finally {
            setIsReviewLoading(false);
        }
    };

    const handleBioGeneration = async () => {
        if (!interests.trim() || !personality.trim()) return;
        setIsBioLoading(true);
        setBioSuggestions('');
        try {
            const result = await generateBioSuggestions(interests, personality, job);
            setBioSuggestions(result);
        } catch (error) {
            console.error(error);
            setBioSuggestions("Sorry, something went wrong. Please try again.");
        } finally {
            setIsBioLoading(false);
        }
    };

    const handlePhotoAnalysis = async () => {
        if (!photos.trim()) return;
        setIsPhotoLoading(true);
        setPhotoAnalysis('');
        try {
            const result = await analyzePhotoSelection(photos);
            setPhotoAnalysis(result);
        } catch (error) {
            console.error(error);
            setPhotoAnalysis("Sorry, something went wrong. Please try again.");
        } finally {
            setIsPhotoLoading(false);
        }
    };

    const handleConversationStarter = async () => {
        if (!context.trim()) return;
        setIsStartersLoading(true);
        setStarters([]);
        try {
            const result = await getConversationStarter(context);
            setStarters(result.split('\n').filter(s => s.startsWith('- ')));
        } catch (error) {
            console.error(error);
            setStarters(['- Sorry, something went wrong. Please try again.']);
        } finally {
            setIsStartersLoading(false);
        }
    };
    
    const getNewDateIdea = () => {
        const newIdea = MOCK_DATE_IDEAS[Math.floor(Math.random() * MOCK_DATE_IDEAS.length)];
        setDateIdea(newIdea);
    };

    const formattedReview = useMemo(() => {
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

    return (
        <div className="animate-fade-in space-y-8 pb-16 md:pb-0">
            <header>
                <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-2">Dating Toolkit</h1>
                <p className="text-lg md:text-xl text-text-secondary">
                    Actionable tools and guides to navigate the modern dating landscape.
                </p>
            </header>

            {/* Dating Guides Section */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
                <div className="flex items-center mb-6">
                    <BookOpenIcon className="h-7 w-7 text-accent mr-3" />
                    <h2 className="text-2xl font-bold">Dating & Relationship Guides</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datingArticles.map((article) => (
                        <GuideCard 
                            key={article.id} 
                            article={article} 
                            onClick={() => onSelectArticle?.(article)} 
                        />
                    ))}
                </div>
            </div>

            {/* Enhanced AI Profile Reviewer */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
                <div className="flex items-center mb-6">
                    <ClipboardDocumentCheckIcon className="h-7 w-7 text-accent mr-3" />
                    <h2 className="text-2xl font-bold">AI Profile Reviewer</h2>
                </div>
                
                {/* Review Type Tabs */}
                <div className="flex space-x-2 mb-6">
                    <button 
                        onClick={() => setReviewType('full')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            reviewType === 'full' 
                                ? 'bg-accent text-primary' 
                                : 'bg-gray-700 text-text-secondary hover:bg-gray-600'
                        }`}
                    >
                        Full Review
                    </button>
                    <button 
                        onClick={() => setReviewType('photos')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            reviewType === 'photos' 
                                ? 'bg-accent text-primary' 
                                : 'bg-gray-700 text-text-secondary hover:bg-gray-600'
                        }`}
                    >
                        Photos Only
                    </button>
                    <button 
                        onClick={() => setReviewType('bio')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            reviewType === 'bio' 
                                ? 'bg-accent text-primary' 
                                : 'bg-gray-700 text-text-secondary hover:bg-gray-600'
                        }`}
                    >
                        Bio Only
                    </button>
                </div>

                <p className="text-text-secondary mb-4">
                    {reviewType === 'full' && "Get comprehensive feedback on your entire dating profile with scoring and detailed analysis."}
                    {reviewType === 'photos' && "Analyze your photo selection for variety, appeal, and red flags to avoid."}
                    {reviewType === 'bio' && "Get targeted feedback on your bio content, flow, and engagement factor."}
                </p>

                {(reviewType === 'full' || reviewType === 'bio') && (
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Paste your profile bio here..."
                        rows={4}
                        className="w-full bg-gray-700 text-text-primary p-3 rounded-md mb-4 focus:ring-2 focus:ring-accent focus:outline-none"
                    />
                )}
                
                {(reviewType === 'full' || reviewType === 'photos') && (
                    <textarea
                        value={photos}
                        onChange={(e) => setPhotos(e.target.value)}
                        placeholder="Describe your photos in detail (e.g., 'Main photo: Close-up smile in good lighting', 'Photo 2: Full body shot hiking', 'Photo 3: Group photo with friends at dinner')..."
                        rows={4}
                        className="w-full bg-gray-700 text-text-primary p-3 rounded-md mb-4 focus:ring-2 focus:ring-accent focus:outline-none"
                    />
                )}

                <button 
                    onClick={handleProfileReview} 
                    disabled={isReviewLoading} 
                    className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-lg hover:bg-sky-300 transition-colors duration-300 disabled:opacity-50"
                >
                    {isReviewLoading ? 'Analyzing...' : `Get ${reviewType === 'full' ? 'Complete' : reviewType === 'photos' ? 'Photo' : 'Bio'} Review`}
                </button>

                {review && (
                    <div className="mt-6 bg-primary/50 p-4 rounded-md">
                        {formattedReview}
                    </div>
                )}
            </div>

            {/* Bio Generator */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
                <div className="flex items-center mb-4">
                    <SparklesIcon className="h-7 w-7 text-accent mr-3" />
                    <h2 className="text-2xl font-bold">AI Bio Generator</h2>
                </div>
                <p className="text-text-secondary mb-4">Generate fresh bio ideas based on your personality and interests.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        placeholder="Your interests (e.g., hiking, cooking, photography)"
                        className="bg-gray-700 text-text-primary p-3 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                    />
                    <input
                        type="text"
                        value={job}
                        onChange={(e) => setJob(e.target.value)}
                        placeholder="Your job/career (optional)"
                        className="bg-gray-700 text-text-primary p-3 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                    />
                </div>
                
                <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder="Describe your personality (e.g., witty, laid-back, adventurous, creative)"
                    rows={2}
                    className="w-full bg-gray-700 text-text-primary p-3 rounded-md mb-4 focus:ring-2 focus:ring-accent focus:outline-none"
                />

                <button 
                    onClick={handleBioGeneration} 
                    disabled={isBioLoading} 
                    className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-lg hover:bg-sky-300 transition-colors duration-300 disabled:opacity-50"
                >
                    {isBioLoading ? 'Generating...' : 'Generate Bio Ideas'}
                </button>

                {bioSuggestions && (
                    <div className="mt-6 bg-primary/50 p-4 rounded-md">
                        <div className="prose prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap text-text-secondary">{bioSuggestions}</pre>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Conversation Starter */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
                <div className="flex items-center mb-4">
                    <ChatBubbleLeftRightIcon className="h-7 w-7 text-accent mr-3" />
                    <h2 className="text-2xl font-bold">Conversation Starter</h2>
                </div>
                <p className="text-text-secondary mb-4">Never send a boring "hey" again. Give some context from her profile.</p>
                <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., 'Her profile says she loves hiking and dogs'"
                    className="w-full bg-gray-700 text-text-primary p-3 rounded-md mb-4 focus:ring-2 focus:ring-accent focus:outline-none"
                />
                <button onClick={handleConversationStarter} disabled={isStartersLoading} className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-lg hover:bg-sky-300 transition-colors duration-300 disabled:opacity-50">
                    {isStartersLoading ? 'Generating...' : 'Generate Openers'}
                </button>
                 {starters.length > 0 && (
                    <div className="mt-6 bg-primary/50 p-4 rounded-md">
                        <ul className="space-y-2">
                           {starters.map((starter, i) => <li key={i} className="text-text-secondary">{starter}</li>)}
                        </ul>
                    </div>
                )}
            </div>

             {/* Date Idea Generator */}
            <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
                <div className="flex items-center mb-4">
                    <LightBulbIcon className="h-7 w-7 text-accent mr-3" />
                    <h2 className="text-2xl font-bold">Date Idea Generator</h2>
                </div>
                 <div className="bg-primary/50 p-4 rounded-md mb-4 min-h-[80px]">
                    <h4 className="font-bold text-text-primary">{dateIdea.title}</h4>
                    <p className="text-text-secondary">{dateIdea.description}</p>
                 </div>
                <button onClick={getNewDateIdea} className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-lg hover:bg-sky-300 transition-colors duration-300">
                    Suggest a New Date
                </button>
            </div>
        </div>
    );
};

export default DatingScreen;
