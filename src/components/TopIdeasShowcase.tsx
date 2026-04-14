'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, TrendingUp, ThumbsUp, ThumbsDown, Sparkles, ArrowRight } from 'lucide-react';
import { getTodaysTopIdeas, seedSampleData } from '@/lib/storage';
import { Idea } from '@/types/idea';

interface TopIdeas {
  good: Idea | null;
  bad: Idea | null;
  genius: Idea | null;
}

export default function TopIdeasShowcase() {
  const [topIdeas, setTopIdeas] = useState<TopIdeas>({ good: null, bad: null, genius: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    seedSampleData();
    
    const ideas = getTodaysTopIdeas();
    setTopIdeas(ideas);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-40 bg-gray-100 rounded-xl"></div>
            <div className="h-40 bg-gray-100 rounded-xl"></div>
            <div className="h-40 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const hasAnyTopIdeas = topIdeas.good || topIdeas.bad || topIdeas.genius;

  if (!hasAnyTopIdeas) {
    return null; // Don't show section if no top ideas yet
  }

  const categoryConfig = {
    genius: {
      label: 'Top Genius Idea',
      icon: Sparkles,
      gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
      border: 'border-violet-200',
      badge: 'bg-violet-100 text-violet-700',
      iconBg: 'bg-violet-500'
    },
    good: {
      label: 'Top Good Idea',
      icon: ThumbsUp,
      gradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
      iconBg: 'bg-emerald-500'
    },
    bad: {
      label: 'Top Bad Idea',
      icon: ThumbsDown,
      gradient: 'from-rose-500/10 via-red-500/5 to-transparent',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-700',
      iconBg: 'bg-rose-500'
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Today's Top Ideas</h2>
            <p className="text-sm text-[var(--text-muted)]">The most voted ideas in each category</p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(categoryConfig) as Array<keyof TopIdeas>).map((key) => {
            const idea = topIdeas[key];
            const config = categoryConfig[key];
            const Icon = config.icon;

            if (!idea) {
              return (
                <div key={key} className={`bg-gradient-to-br ${config.gradient} border-2 border-dashed ${config.border} rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[180px]`}>
                  <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center mb-3 opacity-50`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-500">No {key} ideas yet today</p>
                  <p className="text-xs text-gray-400 mt-1">Be the first to post!</p>
                </div>
              );
            }

            const totalVotes = idea.votes.good.length + idea.votes.bad.length + idea.votes.genius.length;

            return (
              <Link 
                key={idea.id}
                href={`/ideas?id=${idea.id}`}
                className={`group bg-gradient-to-br ${config.gradient} border ${config.border} hover:border-opacity-100 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badge}`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    {totalVotes} votes
                  </div>
                </div>

                {/* Idea Content */}
                <h3 className="font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                  {idea.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                  {idea.description}
                </p>

                {/* Author & CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 ${config.iconBg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                      {(idea.author.startsWith('@') ? idea.author.slice(1) : idea.author).charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="text-xs font-medium text-gray-600">{idea.author}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="flex justify-center mt-6">
          <Link 
            href="/ideas"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--primary)] font-medium transition-colors"
          >
            View all ideas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
