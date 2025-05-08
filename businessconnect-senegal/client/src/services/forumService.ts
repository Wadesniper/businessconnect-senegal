import { Discussion, defaultDiscussions } from '../pages/forum/data/defaultDiscussions';

interface GetDiscussionsParams {
  page?: number;
  limit?: number;
  category?: string;
  searchTerm?: string;
}

interface GetDiscussionsResponse {
  discussions: Discussion[];
  total: number;
  page: number;
  totalPages: number;
}

class ForumService {
  private discussions: Discussion[] = [...defaultDiscussions];

  async getDiscussions(params: GetDiscussionsParams = {}): Promise<GetDiscussionsResponse> {
    const { page = 1, limit = 10, category, searchTerm } = params;
    
    let filteredDiscussions = [...this.discussions];

    if (category) {
      filteredDiscussions = filteredDiscussions.filter(d => d.category === category);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filteredDiscussions = filteredDiscussions.filter(d => 
        d.title.toLowerCase().includes(search) || 
        d.content.toLowerCase().includes(search)
      );
    }

    const total = filteredDiscussions.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      discussions: filteredDiscussions.slice(start, end),
      total,
      page,
      totalPages
    };
  }

  async getDiscussionById(id: string): Promise<Discussion | null> {
    return this.discussions.find(d => d.id === id) || null;
  }

  async createDiscussion(discussion: Omit<Discussion, 'id' | 'createdAt' | 'repliesCount' | 'likesCount' | 'status' | 'replies'>): Promise<Discussion> {
    const newDiscussion: Discussion = {
      id: (this.discussions.length + 1).toString(),
      createdAt: new Date().toISOString(),
      repliesCount: 0,
      likesCount: 0,
      status: 'active',
      replies: [],
      ...discussion
    };

    this.discussions.unshift(newDiscussion);
    return newDiscussion;
  }

  async addReply(discussionId: string, reply: Omit<Reply, 'id' | 'createdAt' | 'likesCount'>): Promise<Reply> {
    const discussion = await this.getDiscussionById(discussionId);
    if (!discussion) {
      throw new Error('Discussion not found');
    }

    const newReply = {
      id: (discussion.replies.length + 1).toString(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      ...reply
    };

    discussion.replies.push(newReply);
    discussion.repliesCount += 1;

    return newReply;
  }

  async likeDiscussion(discussionId: string): Promise<void> {
    const discussion = await this.getDiscussionById(discussionId);
    if (!discussion) {
      throw new Error('Discussion not found');
    }
    discussion.likesCount += 1;
  }

  async likeReply(discussionId: string, replyId: string): Promise<void> {
    const discussion = await this.getDiscussionById(discussionId);
    if (!discussion) {
      throw new Error('Discussion not found');
    }

    const reply = discussion.replies.find(r => r.id === replyId);
    if (!reply) {
      throw new Error('Reply not found');
    }

    reply.likesCount += 1;
  }
}

export const forumService = new ForumService(); 