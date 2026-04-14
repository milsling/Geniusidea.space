'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lightbulb, 
  Sparkles, 
  ThumbsUp,
  ThumbsDown,
  Home, 
  PlusCircle, 
  User as UserIcon, 
  Search,
  TrendingUp,
  Clock,
  MessageCircle,
  Share2,
  Crown,
  Image as ImageIcon
} from 'lucide-react';
import VoteButtons, { VoteDistribution, CategoryBadge } from '@/components/VoteButtons';
import { getIdeas, castVote, hasUserVoted, seedSampleData, getTodaysTopIdeas, isValidImageData, formatRelativeTime } from '@/lib/storage';
import { Idea, VoteType, User } from '@/types/idea';

export default function IdeasPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'good' | 'bad' | 'genius'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, VoteType | null>>({});
  const [topIdeas, setTopIdeas] = useState<{ good: Idea | null; bad: Idea | null; genius: Idea | null }>({ good: null, bad: null, genius: null });
  const router = useRouter();

  useEffect(() => {
    // Seed sample data on first load
    seedSampleData();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    // Load ideas from storage
    const storedIdeas = getIdeas();
    setIdeas(storedIdeas);
    
    // Load top ideas
    setTopIdeas(getTodaysTopIdeas());
    
    // Load user votes
    const votes: Record<string, VoteType | null> = {};
    storedIdeas.forEach((idea: Idea) => {
      votes[idea.id] = hasUserVoted(idea.id);
    });
    setUserVotes(votes);
    
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  const handleVote = (ideaId: string, voteType: VoteType | null) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    const updatedIdea = castVote(ideaId, voteType, user.email);
    if (updatedIdea) {
      setIdeas(prev => prev.map(idea => idea.id === ideaId ? updatedIdea : idea));
      setUserVotes(prev => ({ ...prev, [ideaId]: voteType }));
      // Update top ideas
      setTopIdeas(getTodaysTopIdeas());
    }
  };

  const isTopIdea = (ideaId: string) => {
    return topIdeas.good?.id === ideaId || 
           topIdeas.bad?.id === ideaId || 
           topIdeas.genius?.id === ideaId;
  };

  const getTopIdeaBadge = (ideaId: string) => {
    if (topIdeas.genius?.id === ideaId) return { text: 'Top Genius', color: 'bg-violet-100 text-violet-700' };
    if (topIdeas.good?.id === ideaId) return { text: 'Top Good Idea', color: 'bg-emerald-100 text-emerald-700' };
    if (topIdeas.bad?.id === ideaId) return { text: 'Top Bad Idea', color: 'bg-rose-100 text-rose-700' };
    return null;
  };

  const filteredIdeas = ideas.filter(idea => {
    if (idea.privacy === 'private') return false; // Don't show private ideas in feed
    if (activeFilter === 'all') return true;
    const effectiveCategory = idea.dominantCategory ?? idea.category;
    return effectiveCategory === activeFilter;
  }).filter(idea => 
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    // Sort by total interactions (trending)
    return b.totalInteractions - a.totalInteractions;
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F2F2F7]">
        <div className="max-w-2xl mx-auto px-5 pt-24">
          <div className="animate-pulse space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)]"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2F2F7] pb-24 sm:pb-0">
      {/* macOS Nav Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3.5 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#007AFF] rounded-[8px] flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-black hidden sm:block">ThoughtCircus</span>
          </Link>

          {/* Search — center */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(60,60,67,0.4)]" />
              <input
                type="text"
                placeholder="Search ideas…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[rgba(120,120,128,0.12)] rounded-[10px] text-[15px] placeholder:text-[rgba(60,60,67,0.4)] border-none focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <>
                <span className="hidden sm:flex items-center gap-1.5 text-[13px] text-[rgba(60,60,67,0.5)]">
                  <span className="w-1.5 h-1.5 bg-[#34C759] rounded-full"></span>
                  {user.email.split('@')[0]}
                </span>
                <button onClick={handleLogout} className="text-[15px] font-medium text-[#007AFF] hover:text-[#0062CC] px-2">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="text-[15px] font-semibold text-white bg-[#007AFF] px-4 py-1.5 rounded-lg hover:bg-[#0062CC] transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-20 sm:pt-20">
        {/* Page header */}
        <div className="flex items-center justify-between py-5">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-black">Ideas</h1>
            <p className="text-[14px] text-[rgba(60,60,67,0.5)] mt-0.5">Vote on what matters</p>
          </div>
          {user && (
            <Link
              href="/ideas/post"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#007AFF] text-white text-[15px] font-semibold rounded-[10px] hover:bg-[#0062CC] active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Post
            </Link>
          )}
        </div>

        {/* Filter chips — iOS Segmented-style */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[
            { key: 'all', label: 'All' },
            { key: 'genius', label: '🔥 Genius' },
            { key: 'good', label: '👍 Good' },
            { key: 'bad', label: '👎 Bad' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key as typeof activeFilter)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[14px] font-medium transition-all ${
                activeFilter === key
                  ? 'bg-[#007AFF] text-white shadow-sm'
                  : 'bg-white text-[rgba(60,60,67,0.7)] hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium bg-[#007AFF] text-white">
              <TrendingUp className="w-3.5 h-3.5" /> Trending
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium bg-white text-[rgba(60,60,67,0.6)]">
              <Clock className="w-3.5 h-3.5" /> Recent
            </button>
          </div>
        </div>

        {/* Top Ideas Banner */}
        {filteredIdeas.some(idea => isTopIdea(idea.id)) && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-[13px] font-medium text-amber-700">Today&apos;s top ideas are highlighted</span>
          </div>
        )}

        {/* Ideas Feed */}
        <div className="space-y-3 pb-8">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Sparkles className="w-8 h-8 text-[rgba(60,60,67,0.3)]" />
              </div>
              <h3 className="text-[17px] font-semibold text-black mb-1">No ideas yet</h3>
              <p className="text-[14px] text-[rgba(60,60,67,0.5)]">Be the first to share one</p>
            </div>
          ) : (
            filteredIdeas.map((idea) => {
              const topBadge = getTopIdeaBadge(idea.id);
              const catColor = {
                genius: { bg: 'rgba(175,82,222,0.12)', text: '#7B2D8B' },
                good:   { bg: 'rgba(52,199,89,0.12)',  text: '#248A3D' },
                bad:    { bg: 'rgba(255,59,48,0.10)',   text: '#C93B2D' },
              };
              const cat = idea.dominantCategory || idea.category;
              const colors = catColor[cat] || catColor.good;
              return (
                <article
                  key={idea.id}
                  className={`bg-white rounded-2xl p-5 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                    isTopIdea(idea.id) ? 'ring-2 ring-amber-400/40' : ''
                  }`}
                >
                  {/* Top badge */}
                  {topBadge && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold ${topBadge.color}`}>
                        <Crown className="w-3 h-3" />
                        {topBadge.text}
                      </span>
                    </div>
                  )}

                  {/* Author row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        cat === 'genius' ? 'bg-gradient-to-br from-purple-400 to-indigo-500' :
                        cat === 'good'   ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                        'bg-gradient-to-br from-rose-400 to-pink-500'
                      }`}>
                        {cat === 'genius' ? <Sparkles className="w-4 h-4 text-white" /> :
                         cat === 'good'   ? <ThumbsUp className="w-4 h-4 text-white" /> :
                         <ThumbsDown className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <span className="text-[14px] font-semibold text-black">{idea.author}</span>
                        <p className="text-[12px] text-[rgba(60,60,67,0.4)]">{formatRelativeTime(idea.postedAt)}</p>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-[17px] font-semibold tracking-tight text-black mb-1.5 leading-snug">{idea.title}</h3>
                  <p className="text-[14px] text-[rgba(60,60,67,0.6)] leading-relaxed mb-3">{idea.description}</p>

                  {/* Sketch */}
                  {isValidImageData(idea.imageData) && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-[rgba(60,60,67,0.08)]">
                      <img src={idea.imageData} alt="Sketch" className="w-full max-h-64 object-contain bg-[#F2F2F7]" />
                    </div>
                  )}

                  {/* Vote bar */}
                  <div className="mb-3">
                    <VoteDistribution votes={idea.votes} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(60,60,67,0.08)]">
                    <VoteButtons
                      votes={idea.votes}
                      userVote={userVotes[idea.id] || null}
                      onVote={(type) => handleVote(idea.id, type)}
                      size="sm"
                      showCounts={true}
                    />
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-[rgba(60,60,67,0.4)] hover:text-[#007AFF] transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-[13px]">0</span>
                      </button>
                      <button className="text-[rgba(60,60,67,0.4)] hover:text-[#007AFF] transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {/* iOS Tab Bar */}
      <nav className="bottom-nav safe-area-inset-bottom sm:hidden">
        <Link href="/" className="bottom-nav-item">
          <Home className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/ideas" className="bottom-nav-item active">
          <Sparkles className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Ideas</span>
        </Link>
        <Link href={user ? '/ideas/post' : '/auth/login'} className="bottom-nav-item">
          <PlusCircle className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Post</span>
        </Link>
        <Link href={user ? '/profile' : '/auth/login'} className="bottom-nav-item">
          <UserIcon className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </main>
  );
}
