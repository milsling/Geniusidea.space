'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lightbulb, Zap, Sparkles, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL ?? 'owner@thoughtcircus.space';
const OWNER_PASSWORD = process.env.NEXT_PUBLIC_OWNER_PASSWORD ?? 'owner123';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay for realism
    setTimeout(() => {
      if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
        // Store auth state
        localStorage.setItem('user', JSON.stringify({
          email: OWNER_EMAIL,
          role: 'owner',
          name: 'Owner',
          loggedInAt: new Date().toISOString()
        }));
        router.push('/ideas');
      } else {
        setError('Invalid email or password.');
        setIsLoading(false);
      }
    }, 500);
  };

  const fillOwnerCredentials = () => {
    setEmail(OWNER_EMAIL);
    setPassword(OWNER_PASSWORD);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[#F2F2F7] flex flex-col">
      {/* Nav */}
      <header className="glass">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#007AFF] rounded-[8px] flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-black">ThoughtCircus</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-[15px] font-medium text-[rgba(60,60,67,0.6)] hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Centered form */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">
          {/* Icon + title */}
          <div className="text-center mb-8">
            <div className="w-[72px] h-[72px] bg-[#007AFF] rounded-[22px] flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(0,122,255,0.3)]">
              <Zap className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-[28px] font-bold tracking-tight text-black">Sign in</h1>
            <p className="text-[15px] text-[rgba(60,60,67,0.5)] mt-1">to continue to ThoughtCircus</p>
          </div>

          {/* Dev banner */}
          <div className="mb-6 p-4 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[rgba(0,122,255,0.1)] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#007AFF]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-black">Dev Mode</p>
                <p className="text-[12px] text-[rgba(60,60,67,0.5)]">Use owner credentials below</p>
              </div>
            </div>
            <button
              onClick={fillOwnerCredentials}
              className="w-full py-2 bg-[rgba(0,122,255,0.1)] text-[#007AFF] text-[14px] font-semibold rounded-xl hover:bg-[rgba(0,122,255,0.16)] transition-colors"
            >
              Auto-fill credentials
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-[rgba(255,59,48,0.1)] rounded-xl text-[#C93B2D] text-[14px] font-medium">
              {error}
            </div>
          )}

          {/* Form — Apple-style grouped card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden mb-4">
            <form onSubmit={handleLogin}>
              {/* Email row */}
              <div className="px-4 py-3.5 flex items-center gap-3 border-b border-[rgba(60,60,67,0.1)]">
                <label className="text-[15px] font-medium text-black w-20 flex-shrink-0">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-[15px] text-black placeholder:text-[rgba(60,60,67,0.35)] border-none outline-none bg-transparent"
                  required
                />
              </div>

              {/* Password row */}
              <div className="px-4 py-3.5 flex items-center gap-3">
                <label className="text-[15px] font-medium text-black w-20 flex-shrink-0">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 text-[15px] text-black placeholder:text-[rgba(60,60,67,0.35)] border-none outline-none bg-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[rgba(60,60,67,0.35)] hover:text-[rgba(60,60,67,0.6)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>

          {/* Sign in button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#007AFF] text-white text-[17px] font-semibold rounded-2xl hover:bg-[#0062CC] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(0,122,255,0.35)] mb-6 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[rgba(60,60,67,0.12)]"></div>
            <span className="text-[13px] text-[rgba(60,60,67,0.4)] font-medium">or</span>
            <div className="flex-1 h-px bg-[rgba(60,60,67,0.12)]"></div>
          </div>

          {/* Social buttons */}
          <div className="space-y-2.5">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-[15px] font-semibold text-black rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-[15px] font-semibold text-white rounded-2xl hover:bg-zinc-900 active:scale-[0.98] transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-2.96 1.78-2.47 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <p className="text-center mt-8 text-[14px] text-[rgba(60,60,67,0.5)]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[#007AFF] font-medium hover:text-[#0062CC]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
