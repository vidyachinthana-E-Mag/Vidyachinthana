export type Role = 'OWNER' | 'EDITOR' | 'AUTHOR' | 'READER';
export type Category = 'SCIENCE' | 'EDUCATION' | 'TECHNOLOGY' | 'SCI_FI';
export type ArticleStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export interface Author {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatar?: string | null;
  role?: Role | string;
  bio?: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | any;
  contentSi?: string | any | null;
  category: Category | string;
  status?: ArticleStatus | string;
  featuredImage?: string | null;
  imageUrl?: string | null;
  readTime?: string | null;
  date?: string | null;
  publishedAt?: string | Date | null;
  authorId?: string;
  author?: Author;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  issueArticles?: IssueArticle[];
  comments?: Comment[];
}

export interface Issue {
  id: string;
  number: string;
  volume?: string | null;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  articles?: IssueArticle[];
}

export interface IssueArticle {
  id: string;
  issueId: string;
  articleId: string;
  order: number;
  issue?: Issue;
  article?: Article;
}

export interface Comment {
  id: string;
  content: string;
  articleId: string;
  userId: string;
  user?: Author;
  createdAt: string | Date;
}

export interface AuthorRequest {
  id: string;
  userId: string;
  user?: Author;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  reviewedById?: string | null;
  reviewedBy?: Author | null;
  comment?: string | null;
  createdAt: string | Date;
}
