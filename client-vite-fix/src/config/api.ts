// Configuration API pour production
const API_URL = 'https://businessconnect-senegal-api-production.up.railway.app';

export const endpoints = {
  // Auth (sans préfixe /api)
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  verifyEmail: `${API_URL}/auth/verify`,
  forgotPassword: `${API_URL}/auth/forgot-password`,
  resetPassword: `${API_URL}/auth/reset-password`,

  // Subscriptions (sans préfixe /api)
  subscriptions: `${API_URL}/subscriptions`,
  payment: `${API_URL}/payment/init`,
  paymentCallback: `${API_URL}/payment/callback`,

  // CV Generator (sans préfixe /api)
  cvs: `${API_URL}/cvs`,
  cvTemplates: `${API_URL}/cv-templates`,
  cvExport: `${API_URL}/cvs/export`,

  // Jobs (sans préfixe /api)
  jobs: `${API_URL}/jobs`,
  jobApplications: `${API_URL}/job-applications`,

  // Forum (sans préfixe /api)
  forum: `${API_URL}/forum`,
  forumPosts: `${API_URL}/forum/posts`,
  forumComments: `${API_URL}/forum/comments`,

  // Marketplace (sans préfixe /api)
  marketplace: `${API_URL}/marketplace`,
  marketplaceItems: `${API_URL}/marketplace/items`,
  marketplaceCategories: `${API_URL}/marketplace/categories`,

  // User (sans préfixe /api)
  profile: `${API_URL}/users/profile`,
  updateProfile: `${API_URL}/users/profile/update`,
  uploadAvatar: `${API_URL}/users/avatar/upload`,

  // Admin (sans préfixe /api)
  admin: {
    users: `${API_URL}/admin/users`,
    subscriptions: `${API_URL}/admin/subscriptions`,
    jobs: `${API_URL}/admin/jobs`,
    forum: `${API_URL}/admin/forum`,
    marketplace: `${API_URL}/admin/marketplace`,
    statistics: `${API_URL}/admin/statistics`
  }
}; 