'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lightbulb, 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Lock, 
  Globe,
  ChevronDown,
  X,
  Check
} from 'lucide-react';
import SketchCanvas, { SketchCanvasRef } from '@/components/SketchCanvas';
import { addIdea } from '@/lib/storage';
import { Idea } from '@/types/idea';

interface User {
  email: string;
  role: string;
  name: string;
  loggedInAt: string;
}

type Category = 'good' | 'bad' | 'genius';

export default function PostIdeaPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [category, setCategory] = useState<Category>('good');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hasSketch, setHasSketch] = useState(false);
  const canvasRef = useRef<SketchCanvasRef>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  const handleSketchChange = (hasContent: boolean) => {
    setHasSketch(hasContent);
  };

  const getSketchImage = (): string | null => {
    if (!canvasRef.current || !hasSketch) return null;
    return canvasRef.current.getImageData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user) return;

    setIsSubmitting(true);

    // Get sketch image if exists
    const imageData = getSketchImage();

    // Create new idea
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      author: `@${user.email.split('@')[0]}`,
      authorEmail: user.email,
      timestamp: 'Just now',
      postedAt: new Date().toISOString(),
      privacy,
      imageData: imageData || undefined,
      votes: { good: [], bad: [], genius: [] },
      totalInteractions: 0,
      dominantCategory: null
    };

    // Save to localStorage
    addIdea(newIdea);

    // Show success
    setIsSubmitting(false);
    setShowSuccess(true);

    // Redirect after delay
    setTimeout(() => {
      router.push('/ideas');
    }, 1500);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 pt-24">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-[600px] bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Idea Posted!</h2>
            <p className="text-text-secondary">Your idea is now live on ThoughtCircus</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ideas" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </Link>
            <div className="w-px h-6 bg-gray-300 hidden sm:block" />
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-text-primary hidden sm:block">ThoughtCircus</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Selector */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setCategory('good')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  category === 'good' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Good Idea
              </button>
              <button
                type="button"
                onClick={() => setCategory('bad')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  category === 'bad' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Bad Idea
              </button>
              <button
                type="button"
                onClick={() => setCategory('genius')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  category === 'genius' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Genius Idea
              </button>
            </div>

            {/* Mobile Category Dropdown */}
            <div className="sm:hidden relative">
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  category === 'good' ? 'bg-emerald-100 text-emerald-700' :
                  category === 'bad' ? 'bg-rose-100 text-rose-700' :
                  'bg-violet-100 text-violet-700'
                }`}
                onClick={() => {
                  const categories: Category[] = ['good', 'bad', 'genius'];
                  const currentIndex = categories.indexOf(category);
                  setCategory(categories[(currentIndex + 1) % 3]);
                }}
              >
                {category === 'good' && <><ThumbsUp className="w-4 h-4" /> Good Idea</>}
                {category === 'bad' && <><ThumbsDown className="w-4 h-4" /> Bad Idea</>}
                {category === 'genius' && <><Sparkles className="w-4 h-4" /> Genius Idea</>}
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Privacy Toggle */}
            <button
              type="button"
              onClick={() => setPrivacy(privacy === 'public' ? 'private' : 'public')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                privacy === 'public' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              {privacy === 'public' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="hidden sm:inline">{privacy === 'public' ? 'Public' : 'Private'}</span>
            </button>

            <div className="w-px h-6 bg-gray-300" />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Check className="w-4 h-4" /> Post</>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Text Content */}
            <div className="lg:col-span-1 space-y-4">
              {/* Title Input */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Give your idea a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-lg font-semibold text-text-primary placeholder:text-gray-400 border-0 focus:ring-0 p-0 bg-transparent"
                />
              </div>

              {/* Description Input */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe your idea in detail... What's the concept? How does it work?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="w-full text-sm text-text-secondary placeholder:text-gray-400 border-0 focus:ring-0 p-0 bg-transparent resize-none"
                />
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">💡 Pro Tip</h4>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Use the sketch canvas to visualize your idea. A quick diagram or mockup can help others understand your concept better!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Sketch Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sketch & Visualize
                  </label>
                  {hasSketch && (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Sketch attached
                    </span>
                  )}
                </div>
                <div className="h-[500px] lg:h-[600px]">
                  <SketchCanvas 
                    ref={canvasRef}
                    width={800} 
                    height={600} 
                    onChange={handleSketchChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

