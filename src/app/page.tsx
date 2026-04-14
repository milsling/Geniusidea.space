'use client';

import Head from 'next/head';
import Link from 'next/link';
import { Sparkles, Lightbulb, ArrowRight, Pencil, Home as HomeIcon, PlusCircle, User } from 'lucide-react';
import TopIdeasShowcase from '@/components/TopIdeasShowcase';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F2F2F7]">
      <Head>
        <title>ThoughtCircus</title>
        <meta name="description" content="Share ideas. Get voted on. Rise to the top." />
      </Head>

      {/* macOS-style Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#007AFF] rounded-[8px] flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-black">ThoughtCircus</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/ideas" className="px-3 py-1.5 rounded-lg text-[15px] font-medium text-[rgba(60,60,67,0.6)] hover:text-black hover:bg-black/5 transition-all">
              Explore
            </Link>
            <Link href="/auth/login" className="px-3 py-1.5 rounded-lg text-[15px] font-medium text-[rgba(60,60,67,0.6)] hover:text-black hover:bg-black/5 transition-all">
              Sign In
            </Link>
            <Link href="/auth/login" className="ml-2 px-4 py-1.5 bg-[#007AFF] text-white text-[15px] font-semibold rounded-lg hover:bg-[#0062CC] active:scale-95 transition-all">
              Post Idea
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(0,122,255,0.1)] rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
            <span className="text-[13px] font-semibold text-[#007AFF] tracking-wide uppercase">Now Live</span>
          </div>

          <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] font-bold tracking-tight text-black leading-[1.05] mb-5">
            Your ideas,
            <br />
            <span className="gradient-text">finally heard.</span>
          </h1>

          <p className="text-[19px] sm:text-[21px] text-[rgba(60,60,67,0.6)] max-w-xl mx-auto mb-10 leading-relaxed font-normal">
            Post your ideas — genius or terrible — and let the world vote. Sketch it, describe it, share it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/ideas" className="flex items-center gap-2 px-6 py-3 bg-[#007AFF] text-white text-[17px] font-semibold rounded-[14px] hover:bg-[#0062CC] active:scale-95 transition-all w-full sm:w-auto justify-center">
              Browse Ideas
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/auth/login" className="flex items-center gap-2 px-6 py-3 bg-white text-[17px] font-semibold rounded-[14px] text-[#007AFF] hover:bg-gray-50 active:scale-95 transition-all border border-[rgba(60,60,67,0.12)] w-full sm:w-auto justify-center shadow-sm">
              <Pencil className="w-4 h-4" />
              Post Your Idea
            </Link>
          </div>
        </div>
      </section>

      {/* Top Ideas Showcase */}
      <TopIdeasShowcase />

      {/* Trending Ideas */}
      <section className="py-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-bold tracking-tight text-black">Trending Ideas</h2>
            <Link href="/ideas" className="text-[15px] font-medium text-[#007AFF] hover:text-[#0062CC] flex items-center gap-1">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="card-modern p-5 sm:col-span-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="category-pill" style={{background:'rgba(175,82,222,0.12)',color:'#7B2D8B'}}>
                  <Sparkles className="w-3 h-3 mr-1" /> Genius Idea
                </span>
                <span className="text-[12px] text-[rgba(60,60,67,0.4)]">2h ago</span>
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-black mb-2">
                An app that turns terrible ideas into viable business models
              </h3>
              <p className="text-[14px] text-[rgba(60,60,67,0.6)] leading-relaxed mb-4">
                What if AI took your &quot;stupid&quot; ideas and transformed them into legitimate business proposals?
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full"></div>
                <span className="text-[13px] font-medium text-black">@innovator_alex</span>
              </div>
            </div>

            <div className="card-modern p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="category-pill" style={{background:'rgba(255,59,48,0.10)',color:'#C93B2D'}}>
                  Bad Idea
                </span>
                <span className="text-[12px] text-[rgba(60,60,67,0.4)]">5h ago</span>
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-black mb-2">
                A social network for houseplants
              </h3>
              <p className="text-[14px] text-[rgba(60,60,67,0.6)] leading-relaxed">
                Let your ficus make friends with a monstera across the world.
              </p>
            </div>

            <div className="card-modern p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-3">
                <span className="category-pill" style={{background:'rgba(52,199,89,0.12)',color:'#248A3D'}}>
                  Good Idea
                </span>
                <span className="text-[12px] text-[rgba(60,60,67,0.4)]">1d ago</span>
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-black mb-2">
                Coffee subscription based on your sleep schedule
              </h3>
              <p className="text-[14px] text-[rgba(60,60,67,0.6)] leading-relaxed">
                Syncs with your watch and delivers caffeine when you need it most.
              </p>
            </div>

            <div className="card-modern p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:col-span-2 lg:col-span-2">
              <div className="flex items-start justify-between mb-3">
                <span className="category-pill" style={{background:'rgba(255,59,48,0.10)',color:'#C93B2D'}}>
                  Bad Idea
                </span>
                <span className="text-[12px] text-[rgba(60,60,67,0.4)]">2d ago</span>
              </div>
              <h3 className="text-[17px] font-semibold tracking-tight text-black mb-2">
                Rent-a-goat for lawn mowing
              </h3>
              <p className="text-[14px] text-[rgba(60,60,67,0.6)] leading-relaxed">
                Uber but for goats that eat your grass. Eco-friendly landscaping?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl px-8 py-7 grid grid-cols-2 sm:grid-cols-4 gap-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {[['12.5K','Ideas Shared'],['8.2K','Active Thinkers'],['4.9★','Community Rating'],['156','Ideas Funded']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-[28px] font-bold tracking-tight gradient-text mb-0.5">{val}</div>
                <div className="text-[13px] text-[rgba(60,60,67,0.5)] font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#007AFF] rounded-3xl px-8 py-12 text-center">
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mb-3">
              Ready to share yours?
            </h2>
            <p className="text-white/75 text-[17px] mb-8 leading-relaxed">
              Genius or terrible — every idea deserves a stage.
            </p>
            <Link href="/auth/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#007AFF] text-[17px] font-bold rounded-[14px] hover:bg-gray-50 active:scale-95 transition-all">
              <Pencil className="w-4 h-4" />
              Post Your Idea
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 sm:px-8 border-t border-[rgba(60,60,67,0.12)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#007AFF] rounded-[6px] flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-black">ThoughtCircus</span>
          </div>
          <p className="text-[13px] text-[rgba(60,60,67,0.4)]">
            &copy; {new Date().getFullYear()} ThoughtCircus. All rights reserved.
          </p>
        </div>
      </footer>

      {/* iOS Tab Bar */}
      <nav className="bottom-nav safe-area-inset-bottom sm:hidden">
        <Link href="/" className="bottom-nav-item active">
          <HomeIcon className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/ideas" className="bottom-nav-item">
          <Sparkles className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Ideas</span>
        </Link>
        <Link href="/auth/login" className="bottom-nav-item">
          <PlusCircle className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Post</span>
        </Link>
        <Link href="/auth/login" className="bottom-nav-item">
          <User className="w-[26px] h-[26px]" strokeWidth={2} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </main>
  );
}
