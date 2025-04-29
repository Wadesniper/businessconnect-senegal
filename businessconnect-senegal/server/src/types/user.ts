export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'recruiter' | 'admin';
  createdAt: Date;
  updatedAt: Date;
} 