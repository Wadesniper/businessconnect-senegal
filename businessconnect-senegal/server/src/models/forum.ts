import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'emploi', 'formation', 'entrepreneuriat', 'technique']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'emploi', 'formation', 'entrepreneuriat', 'technique']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    minlength: 1
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['post', 'comment']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'rejected'],
    default: 'pending'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date
}, {
  timestamps: true
});

// Virtuals
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId'
});

// Indexes
topicSchema.index({ title: 'text', description: 'text' });
topicSchema.index({ category: 1, createdAt: -1 });
topicSchema.index({ userId: 1 });
topicSchema.index({ lastActivityAt: -1 });

postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ userId: 1 });

commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ userId: 1 });

reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ targetId: 1 });
reportSchema.index({ userId: 1 });

// Hooks
topicSchema.pre('save', function(next) {
  this.lastActivityAt = new Date();
  next();
});

postSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.isEdited = true;
  }
  next();
});

postSchema.post('save', async function() {
  await mongoose.model('Topic').findByIdAndUpdate(
    this.topicId,
    { lastActivityAt: new Date() }
  );
});

// Models
export const Topic = mongoose.model('Topic', topicSchema);
export const Post = mongoose.model('Post', postSchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const Report = mongoose.model('Report', reportSchema); 