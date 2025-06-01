// Configuration API pour production
const API_URL = 'https://businessconnect-senegal-api-production.up.railway.app';

export const endpoints = {
  // Auth (avec préfixe /api comme sur le serveur)
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  verifyEmail: `${API_URL}/api/auth/verify`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: `${API_URL}/api/auth/reset-password`,

  // Subscriptions (avec préfixe /api comme sur le serveur)
  subscriptions: `${API_URL}/api/subscriptions`,
  payment: `${API_URL}/api/payment/init`,
  paymentCallback: `${API_URL}/api/payment/callback`,

  // CV Generator (avec préfixe /api)
  cvs: `${API_URL}/api/cvs`,
  cvTemplates: `${API_URL}/api/cv-templates`,
  cvExport: `${API_URL}/api/cvs/export`,

  // Jobs (avec préfixe /api)
  jobs: `${API_URL}/api/jobs`,
  jobApplications: `${API_URL}/api/job-applications`,

  // Forum (avec préfixe /api)
  forum: `${API_URL}/api/forum`,
  forumPosts: `${API_URL}/api/forum/posts`,
  forumComments: `${API_URL}/api/forum/comments`,

  // Marketplace (avec préfixe /api)
  marketplace: `${API_URL}/api/marketplace`,
  marketplaceItems: `${API_URL}/api/marketplace/items`,
  marketplaceCategories: `${API_URL}/api/marketplace/categories`,

  // User (avec préfixe /api)
  profile: `${API_URL}/api/users/profile`,
  updateProfile: `${API_URL}/api/users/profile/update`,
  uploadAvatar: `${API_URL}/api/users/avatar/upload`,

  // Admin (avec préfixe /api)
  admin: {
    users: `${API_URL}/api/admin/users`,
    subscriptions: `${API_URL}/api/admin/subscriptions`,
    jobs: `${API_URL}/api/admin/jobs`,
    forum: `${API_URL}/api/admin/forum`,
    marketplace: `${API_URL}/api/admin/marketplace`,
    statistics: `${API_URL}/api/admin/statistics`
  }
}; 