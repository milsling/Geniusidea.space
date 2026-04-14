export interface User {
  email: string;
  role: string;
  name: string;
  loggedInAt: string;
}

export interface Votes {
  good: string[];  // user emails
  bad: string[];
  genius: string[];
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: 'good' | 'bad' | 'genius';
  author: string;
  authorEmail: string;
  timestamp: string;
  postedAt: string;
  imageData?: string; // base64 sketch/image
  privacy: 'public' | 'private';
  votes: Votes;
  totalInteractions: number;
  dominantCategory: 'good' | 'bad' | 'genius' | null;
}

export interface UserVotes {
  [ideaId: string]: 'good' | 'bad' | 'genius' | null;
}

export type VoteType = 'good' | 'bad' | 'genius';
