export interface ForumUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface Reply {
  id: string;
  content: string;
  author: ForumUser;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: ForumUser;
  category: ForumCategory;
  createdAt: string;
  updatedAt?: string;
  repliesCount: number;
  likesCount: number;
  isLiked?: boolean;
  replies: Reply[];
  tags?: string[];
  status: 'active' | 'closed' | 'deleted';
}

export type ForumCategory = 
  | 'emploi'
  | 'formation'
  | 'entrepreneuriat'
  | 'conseils'
  | 'networking'
  | 'financement';

export interface CreateDiscussionDto {
  title: string;
  content: string;
  category: ForumCategory;
  tags?: string[];
}

export interface CreateReplyDto {
  content: string;
  discussionId: string;
}

export interface ForumFilters {
  category?: ForumCategory;
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: 'recent' | 'popular';
} 