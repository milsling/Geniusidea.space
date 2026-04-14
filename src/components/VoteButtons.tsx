'use client';

import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { VoteType } from '@/types/idea';

interface VoteButtonsProps {
  votes: {
    good: string[];
    bad: string[];
    genius: string[];
  };
  userVote: VoteType | null;
  onVote: (type: VoteType | null) => void;
  size?: 'sm' | 'md' | 'lg';
  showCounts?: boolean;
}

export default function VoteButtons({ 
  votes, 
  userVote, 
  onVote, 
  size = 'md',
  showCounts = true 
}: VoteButtonsProps) {
  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-xs gap-1',
      icon: 'w-3 h-3',
      container: 'gap-1'
    },
    md: {
      button: 'px-3 py-1.5 text-sm gap-1.5',
      icon: 'w-4 h-4',
      container: 'gap-2'
    },
    lg: {
      button: 'px-4 py-2 text-sm gap-2',
      icon: 'w-5 h-5',
      container: 'gap-3'
    }
  };

  const s = sizeClasses[size];

  const handleVote = (type: VoteType) => {
    // Toggle vote off if already voted
    if (userVote === type) {
      onVote(null);
    } else {
      onVote(type);
    }
  };

  return (
    <div className={`flex items-center ${s.container}`}>
      {/* Good Idea Button */}
      <button
        onClick={() => handleVote('good')}
        className={`flex items-center ${s.button} rounded-full font-medium transition-all duration-200 ${
          userVote === 'good'
            ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-1'
            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
        }`}
      >
        <ThumbsUp className={s.icon} />
        {showCounts && <span>{votes.good.length}</span>}
        <span className="hidden sm:inline">{!showCounts && 'Good Idea'}</span>
      </button>

      {/* Bad Idea Button */}
      <button
        onClick={() => handleVote('bad')}
        className={`flex items-center ${s.button} rounded-full font-medium transition-all duration-200 ${
          userVote === 'bad'
            ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500 ring-offset-1'
            : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
        }`}
      >
        <ThumbsDown className={s.icon} />
        {showCounts && <span>{votes.bad.length}</span>}
        <span className="hidden sm:inline">{!showCounts && 'Bad Idea'}</span>
      </button>

      {/* Genius Idea Button */}
      <button
        onClick={() => handleVote('genius')}
        className={`flex items-center ${s.button} rounded-full font-medium transition-all duration-200 ${
          userVote === 'genius'
            ? 'bg-violet-100 text-violet-700 ring-2 ring-violet-500 ring-offset-1'
            : 'bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600'
        }`}
      >
        <Sparkles className={s.icon} />
        {showCounts && <span>{votes.genius.length}</span>}
        <span className="hidden sm:inline">{!showCounts && 'Genius Idea'}</span>
      </button>
    </div>
  );
}

// Vote Distribution Bar
interface VoteDistributionProps {
  votes: {
    good: string[];
    bad: string[];
    genius: string[];
  };
}

export function VoteDistribution({ votes }: VoteDistributionProps) {
  const total = votes.good.length + votes.bad.length + votes.genius.length;
  
  if (total === 0) return null;

  const goodPct = (votes.good.length / total) * 100;
  const badPct = (votes.bad.length / total) * 100;
  const geniusPct = (votes.genius.length / total) * 100;

  return (
    <div className="w-full">
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
        {goodPct > 0 && (
          <div 
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${goodPct}%` }}
          />
        )}
        {geniusPct > 0 && (
          <div 
            className="bg-violet-500 transition-all duration-300"
            style={{ width: `${geniusPct}%` }}
          />
        )}
        {badPct > 0 && (
          <div 
            className="bg-rose-500 transition-all duration-300"
            style={{ width: `${badPct}%` }}
          />
        )}
      </div>
      <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
        <span>{total} votes</span>
        <span>
          {geniusPct > goodPct && geniusPct > badPct ? '🔥 Mostly Genius' :
           goodPct > geniusPct && goodPct > badPct ? '👍 Mostly Good' :
           badPct > geniusPct && badPct > goodPct ? '🤔 Mostly Bad' :
           '⚖️ Split Decision'}
        </span>
      </div>
    </div>
  );
}

// Category Badge
interface CategoryBadgeProps {
  category: 'good' | 'bad' | 'genius' | null;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category) return null;

  const styles = {
    good: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    bad: 'bg-rose-100 text-rose-700 border-rose-200',
    genius: 'bg-violet-100 text-violet-700 border-violet-200'
  };

  const labels = {
    good: '👍 Good Idea',
    bad: '👎 Bad Idea',
    genius: '🔥 Genius Idea'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[category]}`}>
      {labels[category]}
    </span>
  );
}
