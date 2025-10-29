import React, { memo, useMemo, useState } from 'react';
import { MOCK_POSTS } from '../constants';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  TrendingUp,
  HeartIcon,
  Target,
  Shield,
  BookOpenIcon,
  CheckBadgeIcon,
} from '../components/Icons';

interface RoomConfig {
  id: RoomId;
  title: string;
  description: string;
  pinnedPrompts: string[];
  filter: (post: Post) => boolean;
  showCrisisBanner?: boolean;
}

type RoomId = 'wins' | 'mind' | 'dating' | 'career' | 'help';
const ROOM_CONFIG: RoomConfig[] = [
  {
    id: 'wins',
    title: 'Wins & Momentum',
    description: 'Share victories, progress, and keep the tribe fired up.',
    pinnedPrompts: [
      'Win: ________ (what changed, how you set it up, what you learned)',
      'Playbook: What tactic moved the needle for you this week?',
    ],
    filter: post => post.title.toLowerCase().includes('win') || post.content.toLowerCase().includes('progress'),
  },
  {
    id: 'mind',
    title: 'Mind & Emotional Fitness',
    description: 'Talk about stress, mental reps, therapy, or anything you’d usually bottle up.',
    pinnedPrompts: [
      'Check-in: “Today I’m at a __/10. What’s fueling it? What’s my next move?”',
      'Playbook: Share a breathing drill, journaling practice, or mindset shift that helped.',
    ],
    filter: post => {
      const topic = `${post.title} ${post.content}`.toLowerCase();
      return topic.includes('mind') || topic.includes('anxiety') || topic.includes('mental') || topic.includes('stress');
    },
    showCrisisBanner: true,
  },
  {
    id: 'dating',
    title: 'Dating & Brotherhood',
    description: 'Wins, lessons, and questions around dating, intimacy, and social confidence.',
    pinnedPrompts: [
      'Win: “Here’s what worked on a recent date and why.”',
      'Question: “I’m stuck on ______. What would you do differently?”',
    ],
    filter: post => {
      const topic = `${post.title} ${post.content}`.toLowerCase();
      return topic.includes('date') || topic.includes('relationship');
    },
  },
  {
    id: 'career',
    title: 'Career, Money & Leadership',
    description: 'Strategy, promotions, entrepreneurship, and sharpening your edge at work.',
    pinnedPrompts: [
      'Broken: “My roadblock right now is ______.”',
      'Build: “Here’s a framework or resource that helped me deliver.”',
    ],
    filter: post => {
      const topic = `${post.title} ${post.content}`.toLowerCase();
      return topic.includes('career') || topic.includes('work') || topic.includes('business') || topic.includes('job');
    },
  },
  {
    id: 'help',
    title: 'Ask for Backup',
    description: 'Need feedback? Post the context, what you’ve tried, and the decision you’re facing.',
    pinnedPrompts: [
      'Format: “Context / What I’ve tried / What I need from the crew.”',
      'Respect: “Give back—reply to another brother’s post before or after yours.”',
    ],
    filter: () => true,
  },
];

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<RoomId>('wins');
  const [sortBy, setSortBy] = useState<'latest' | 'most-loved'>('latest');

  const activeRoom = ROOM_CONFIG.find(room => room.id === activeRoomId) ?? ROOM_CONFIG[0];

  const filteredPosts = useMemo(() => {
    const roomFiltered = posts.filter(activeRoom.filter);
    if (sortBy === 'most-loved') {
      return [...roomFiltered].sort((a, b) => b.upvotes - a.upvotes);
    }
    return roomFiltered;
  }, [posts, activeRoom, sortBy]);

  const handlePostSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: 'You',
      timestamp: 'Just now',
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      comments: 0,
      upvotes: 1,
    };
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  return (
    <div className="animate-fade-in pb-16 md:pb-6 space-y-10">
      <Hero />

      <RoomsNav activeRoom={activeRoomId} onSelect={setActiveRoomId} />

      <CommunityComposer
        activeRoom={activeRoom}
        newPostTitle={newPostTitle}
        setNewPostTitle={setNewPostTitle}
        newPostContent={newPostContent}
        setNewPostContent={setNewPostContent}
        handlePostSubmit={handlePostSubmit}
      />

      <RoomHeader room={activeRoom} sortBy={sortBy} setSortBy={setSortBy} />

      {activeRoom.showCrisisBanner && <CrisisBanner />}

      <PinnedPrompts room={activeRoom} onPromptSelect={prompt => setNewPostContent(prev => (prev ? `${prev}\n${prompt}` : prompt))} />

      <RoomFeed posts={filteredPosts} />

      <GuidanceFooter />
    </div>
  );
};

const Hero = () => {
  const stats = [
    { label: 'Members Active', value: '240', icon: UserIcon },
    { label: 'Monthly Wins', value: '87', icon: TrendingUp },
    { label: 'Mentor Threads', value: '42', icon: SparklesIcon },
  ];

  return (
    <header className="bg-secondary/70 border border-gray-700/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-primary/40 border border-gray-700/60 text-xs uppercase tracking-wide text-accent px-3 py-1 rounded-full">
          <HeartIcon className="w-4 h-4" />
          <span>Community Hub</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Atlas is a brotherhood, not a message board.</h1>
        <p className="text-lg text-text-secondary">
          Show up with respect, bring value, and leave better than you arrived. Every post should help a brother move forward.
        </p>
      </div>

      <div className="bg-primary/40 border border-gray-700/60 rounded-2xl px-6 py-6 grid grid-cols-1 gap-3 w-full md:w-80">
        {stats.map(stat => (
          <div key={stat.label} className="bg-secondary/60 border border-gray-700/60 rounded-xl p-4 flex items-center gap-3">
            <stat.icon className="w-5 h-5 text-accent" />
            <div>
              <p className="text-lg font-semibold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary uppercase tracking-wide">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};

const RoomsNav: React.FC<{ activeRoom: RoomId; onSelect: (room: RoomId) => void }> = ({ activeRoom, onSelect }) => (
  <nav className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-4 flex flex-wrap gap-2">
    {ROOM_CONFIG.map(room => (
      <button
        key={room.id}
        onClick={() => onSelect(room.id)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
          activeRoom === room.id ? 'bg-accent text-primary shadow-card' : 'bg-primary/40 text-text-secondary hover:bg-primary/60 hover:text-text-primary'
        }`}
      >
        {room.title}
      </button>
    ))}
  </nav>
);

const CommunityComposer: React.FC<{
  activeRoom: RoomConfig;
  newPostTitle: string;
  setNewPostTitle: (value: string) => void;
  newPostContent: string;
  setNewPostContent: (value: string) => void;
  handlePostSubmit: (event: React.FormEvent) => void;
}> = ({ activeRoom, newPostTitle, setNewPostTitle, newPostContent, setNewPostContent, handlePostSubmit }) => (
  <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
    <div className="flex items-center gap-3">
      <ChatBubbleLeftRightIcon className="w-5 h-5 text-accent" />
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Post to {activeRoom.title}</h2>
        <p className="text-xs text-text-secondary">Start with “Win:”, “Question:”, or “Playbook:” and make it actionable.</p>
      </div>
    </div>
    <form onSubmit={handlePostSubmit} className="space-y-4">
      <input
        type="text"
        value={newPostTitle}
        onChange={event => setNewPostTitle(event.target.value)}
        placeholder="Headline the post (e.g., Win: Landed a salary bump after 2 weeks of prep)"
        className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <textarea
        value={newPostContent}
        onChange={event => setNewPostContent(event.target.value)}
        placeholder="Give context, what you tried, and what you’re asking for. Specific beats vague."
        rows={4}
        className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-text-secondary">Respect time: deliver value in your post, reply to someone else, then ask for help.</div>
        <button
          type="submit"
          className="bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          disabled={!newPostTitle.trim() || !newPostContent.trim()}
        >
          Post to the room
        </button>
      </div>
    </form>
  </section>
);

const RoomHeader: React.FC<{ room: RoomConfig; sortBy: 'latest' | 'most-loved'; setSortBy: (option: 'latest' | 'most-loved') => void }> = ({ room, sortBy, setSortBy }) => (
  <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h3 className="text-2xl font-semibold text-text-primary">{room.title}</h3>
      <p className="text-sm text-text-secondary">{room.description}</p>
    </div>
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      Sort by:
      <select
        value={sortBy}
        onChange={event => setSortBy(event.target.value as 'latest' | 'most-loved')}
        className="bg-primary border border-gray-600 rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
      >
        <option value="latest">Latest activity</option>
        <option value="most-loved">Most loved</option>
      </select>
    </div>
  </section>
);

const CrisisBanner = () => (
  <section className="bg-red-500/10 border border-red-500/40 rounded-2xl p-6 space-y-2">
    <div className="flex items-center gap-3">
      <Shield className="w-5 h-5 text-red-300" />
      <h3 className="text-lg font-semibold text-text-primary">If it feels heavy, reach out now.</h3>
    </div>
    <p className="text-sm text-text-secondary">
      Talk to the mentor, message a friend, or use the crisis hotline in Tools. Strong men ask for backup before the load breaks them.
    </p>
  </section>
);

const PinnedPrompts: React.FC<{ room: RoomConfig; onPromptSelect: (prompt: string) => void }> = ({ room, onPromptSelect }) => (
  <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-3">
    <div className="flex items-center gap-3">
      <BookOpenIcon className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-text-primary">Pinned prompts</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {room.pinnedPrompts.map(prompt => (
        <button
          key={prompt}
          onClick={() => onPromptSelect(prompt)}
          className="px-3 py-2 text-xs rounded-lg border border-gray-700/60 text-text-secondary hover:border-accent/40 hover:text-text-primary transition-colors"
        >
          {prompt}
        </button>
      ))}
    </div>
  </section>
);

const RoomFeed = memo(({ posts }: { posts: Post[] }) => (
  <section className="space-y-4">
    {posts.length ? (
      posts.map(post => <PostCard key={post.id} post={post} />)
    ) : (
      <p className="text-sm text-text-secondary">
        No posts yet. Be the first to start the conversation—share the context, what you tried, and what you need.
      </p>
    )}
  </section>
));

RoomFeed.displayName = 'RoomFeed';

const GuidanceFooter = () => (
  <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-3 text-sm text-text-secondary">
    <div className="flex items-center gap-3">
      <CheckBadgeIcon className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-text-primary">House rules</h3>
    </div>
    <ul className="space-y-2 list-disc list-inside">
      <li>Lead with respect. Attack ideas, not people. No politics, bigotry, or personal attacks—ever.</li>
      <li>Confidentiality is non-negotiable. What’s shared here stays here.</li>
      <li>Deliver value before you ask for it. Reply to at least one post for every post you create.</li>
      <li>If a post crosses the line, flag it. Moderators and Atlas staff will step in fast.</li>
    </ul>
  </section>
);

export default CommunityScreen;
