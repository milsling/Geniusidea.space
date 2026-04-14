import { Idea, UserVotes, VoteType } from '@/types/idea';

const IDEAS_KEY = 'thoughtcircus_ideas';
const USER_VOTES_KEY = 'thoughtcircus_user_votes';

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  if (isNaN(diff) || diff < 0) return 'Just now';
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function isValidImageData(value: unknown): value is string {
  return typeof value === 'string' && /^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
}

// Get all ideas from localStorage
export function getIdeas(): Idea[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(IDEAS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save ideas to localStorage
export function saveIdeas(ideas: Idea[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
}

// Add a new idea
export function addIdea(idea: Idea): void {
  const ideas = getIdeas();
  ideas.unshift(idea);
  saveIdeas(ideas);
}

// Get user's votes
export function getUserVotes(): UserVotes {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(USER_VOTES_KEY);
  return stored ? JSON.parse(stored) : {};
}

// Save user's votes
export function saveUserVotes(votes: UserVotes): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
}

// Cast a vote
export function castVote(ideaId: string, voteType: VoteType | null, userEmail: string): Idea | null {
  const ideas = getIdeas();
  const ideaIndex = ideas.findIndex(i => i.id === ideaId);
  
  if (ideaIndex === -1) return null;
  
  const idea = ideas[ideaIndex];
  const userVotes = getUserVotes();
  const previousVote = userVotes[ideaId];
  
  // Remove previous vote if exists
  if (previousVote) {
    idea.votes[previousVote] = idea.votes[previousVote].filter(email => email !== userEmail);
  }
  
  // Add new vote if not null
  if (voteType) {
    idea.votes[voteType].push(userEmail);
    userVotes[ideaId] = voteType;
  } else {
    delete userVotes[ideaId];
  }
  
  // Recalculate stats
  idea.totalInteractions = idea.votes.good.length + idea.votes.bad.length + idea.votes.genius.length;
  idea.dominantCategory = calculateDominantCategory(idea.votes);
  
  // Save atomically — write both keys before returning
  ideas[ideaIndex] = idea;
  const serializedIdeas = JSON.stringify(ideas);
  const serializedVotes = JSON.stringify(userVotes);
  localStorage.setItem(IDEAS_KEY, serializedIdeas);
  localStorage.setItem(USER_VOTES_KEY, serializedVotes);
  
  return idea;
}

// Calculate dominant category
function calculateDominantCategory(votes: { good: string[]; bad: string[]; genius: string[] }): 'good' | 'bad' | 'genius' | null {
  const counts = {
    good: votes.good.length,
    bad: votes.bad.length,
    genius: votes.genius.length
  };
  
  const max = Math.max(counts.good, counts.bad, counts.genius);
  
  if (max === 0) return null;
  
  if (counts.genius === max) return 'genius';
  if (counts.good === max) return 'good';
  return 'bad';
}

// Get today's top ideas (one per category)
export function getTodaysTopIdeas(): { good: Idea | null; bad: Idea | null; genius: Idea | null } {
  const ideas = getIdeas();
  const today = new Date().toDateString();
  
  const todaysIdeas = ideas.filter(idea => 
    new Date(idea.postedAt).toDateString() === today && idea.privacy === 'public'
  );
  
  return {
    good: todaysIdeas
      .filter(i => i.dominantCategory === 'good')
      .sort((a, b) => b.totalInteractions - a.totalInteractions)[0] || null,
    bad: todaysIdeas
      .filter(i => i.dominantCategory === 'bad')
      .sort((a, b) => b.totalInteractions - a.totalInteractions)[0] || null,
    genius: todaysIdeas
      .filter(i => i.dominantCategory === 'genius')
      .sort((a, b) => b.totalInteractions - a.totalInteractions)[0] || null
  };
}

// Check if user has voted on an idea
export function hasUserVoted(ideaId: string): VoteType | null {
  const userVotes = getUserVotes();
  return userVotes[ideaId] || null;
}

// Seed with sample data if empty
export function seedSampleData(): void {
  const existing = getIdeas();
  if (existing.length > 0) return;
  
  const sampleIdeas: Idea[] = [
    {
      id: '1',
      title: 'An app that turns your terrible ideas into viable business models',
      description: 'What if we created an AI-powered platform that takes your "stupid" ideas and transforms them into legitimate business proposals?',
      category: 'genius',
      author: '@innovator_alex',
      authorEmail: 'alex@example.com',
      timestamp: '2 hours ago',
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      privacy: 'public',
      votes: { good: ['user1@example.com', 'user2@example.com'], bad: [], genius: ['user3@example.com', 'user4@example.com', 'user5@example.com'] },
      totalInteractions: 5,
      dominantCategory: 'genius'
    },
    {
      id: '2',
      title: 'A social network for houseplants',
      description: 'Let your ficus make friends with a monstera across the world. Complete with photosynthesis tracking.',
      category: 'bad',
      author: '@plantparent',
      authorEmail: 'plant@example.com',
      timestamp: '5 hours ago',
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      privacy: 'public',
      votes: { good: [], bad: ['user1@example.com', 'user2@example.com', 'user3@example.com'], genius: [] },
      totalInteractions: 3,
      dominantCategory: 'bad'
    },
    {
      id: '3',
      title: 'Coffee subscription based on your sleep schedule',
      description: 'Syncs with your smart watch and delivers caffeine when you need it most.',
      category: 'good',
      author: '@caffeineaddict',
      authorEmail: 'coffee@example.com',
      timestamp: '1 day ago',
      postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      privacy: 'public',
      votes: { good: ['user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com'], bad: [], genius: ['user5@example.com'] },
      totalInteractions: 5,
      dominantCategory: 'good'
    }
  ];
  
  saveIdeas(sampleIdeas);
}
