import type { Article, Issue } from '../types';

export const featuredArticle: Article = {
  id: '1',
  title: 'The Quantum Horizon: Computing Beyond Silicon',
  excerpt: 'As Moore\'s Law approaches its physical limits, a new era of quantum architecture promises to solve problems that would take classical computers millennia.',
  category: 'Technology',
  imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
  author: {
    name: 'Dr. Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
  date: 'August 18, 2026',
  readTime: '12 min'
};

export const latestArticles: Article[] = [
  {
    id: '2',
    title: 'Cognitive Plasticity in Adult Learners',
    excerpt: 'Recent neurological studies reveal that the adult brain remains highly adaptable, challenging long-held assumptions about early-life learning.',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2071&auto=format&fit=crop',
    author: {
      name: 'Prof. Michael Torres',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    },
    date: 'August 16, 2026',
    readTime: '8 min'
  },
  {
    id: '3',
    title: 'The Search for Exoplanetary Biosignatures',
    excerpt: 'How the next generation of space telescopes will identify potential signs of life in the atmospheres of distant worlds.',
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2011&auto=format&fit=crop',
    author: {
      name: 'Dr. Emily Vance',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    },
    date: 'August 14, 2026',
    readTime: '15 min'
  },
  {
    id: '4',
    title: 'Echoes of a Dying Star',
    excerpt: 'In the year 2142, a lonely outpost at the edge of the galaxy receives a signal that defies all known laws of physics.',
    category: 'Science Fiction',
    imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop',
    author: {
      name: 'Arthur J. Mercer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    },
    date: 'August 10, 2026',
    readTime: '22 min'
  },
  {
    id: '5',
    title: 'Synthetic Biology: Engineering Life',
    excerpt: 'The intersection of engineering and biology is producing programmable organisms capable of cleaning oil spills and producing medicine.',
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    },
    date: 'August 08, 2026',
    readTime: '10 min'
  }
];
