const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
if (!API_URL) {
  throw new Error('VITE_REACT_APP_API_URL n\'est pas définie dans les variables d\'environnement !');
}

export const endpoints = {
  // Auth
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  verifyEmail: `${API_URL}/api/auth/verify`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: `${API_URL}/api/auth/reset-password`,

  // Subscriptions
  subscriptions: `${API_URL}/api/subscriptions`,
  payment: `${API_URL}/api/payment/init`,
  paymentCallback: `${API_URL}/api/payment/callback`,

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