import { Document } from 'mongoose';

export enum TopicStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  PINNED = 'pinned',
  ARCHIVED = 'archived'
}

export enum TopicCategory {
  GENERAL = 'general',
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  CAREER = 'career',
  EDUCATION = 'education',
  HELP = 'help'
}

export interface IPost {
  content: string;
  author: string;
  likes: number;
  attachments?: string[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopic {
  title: string;
  content: string;
  author: string;
  category: TopicCategory;
  tags: string[];
  status: TopicStatus;
  views: number;
  likes: number;
  posts: IPost[];
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopicDocument extends ITopic, Document {
  id: string;
}

export interface ITopicCreationDTO extends Omit<ITopic, 'views' | 'likes' | 'posts' | 'lastActivity' | 'createdAt' | 'updatedAt'> {}

export interface ITopicUpdateDTO extends Partial<ITopicCreationDTO> {}

export interface IPostCreationDTO extends Omit<IPost, 'likes' | 'isEdited' | 'createdAt' | 'updatedAt'> {}

export interface IForumStats {
  totalTopics: number;
  totalPosts: number;
  activeUsers: number;
  popularCategories: {
    category: TopicCategory;
    count: number;
  }[];
  topContributors: {
    userId: string;
    posts: number;
    likes: number;
  }[];
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  createdAt: Date;
  likes: number;
  replies: number;
}

export interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  likes: number;
} 