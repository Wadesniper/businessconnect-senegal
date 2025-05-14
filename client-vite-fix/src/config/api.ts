const API_URL = process.env.REACT_APP_API_URL || 'https://api.businessconnectsenegal.com';
const PAYTECH_URL = process.env.REACT_APP_PAYTECH_URL || 'https://paytech.sn';

export const endpoints = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  verifyEmail: `${API_URL}/api/auth/verify`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: `${API_URL}/api/auth/reset-password`,

  // Subscriptions
  subscriptions: `${API_URL}/api/subscriptions`,
  payment: `${PAYTECH_URL}/payment`,
  paymentCallback: `${API_URL}/api/webhooks/payment`,

  // CV Generator
  cvs: `${API_URL}/api/cvs`,
  cvTemplates: `${API_URL}/api/cv-templates`,
  cvExport: `${API_URL}/api/cvs/export`,

  // Jobs
  jobs: `${API_URL}/api/jobs`,
  jobApplications: `${API_URL}/api/job-applications`,

  // Forum
  forum: `${API_URL}/api/forum`,
  forumPosts: `${API_URL}/api/forum/posts`,
  forumComments: `${API_URL}/api/forum/comments`,

  // Marketplace
  marketplace: `${API_URL}/api/marketplace`,
  marketplaceItems: `${API_URL}/api/marketplace/items`,
  marketplaceCategories: `${API_URL}/api/marketplace/categories`,

  // User
  profile: `${API_URL}/api/users/profile`,
  updateProfile: `${API_URL}/api/users/profile/update`,
  uploadAvatar: `${API_URL}/api/users/avatar/upload`,

  // Admin
  admin: {
    users: `${API_URL}/api/admin/users`,
    subscriptions: `${API_URL}/api/admin/subscriptions`,
    jobs: `${API_URL}/api/admin/jobs`,
    forum: `${API_URL}/api/admin/forum`,
    marketplace: `${API_URL}/api/admin/marketplace`,
    statistics: `${API_URL}/api/admin/statistics`
  }
}; 