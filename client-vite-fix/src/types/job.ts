export interface JobData {
  id: string;
  title: string;
  company?: string;
  location: string;
  type?: 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Alternance' | 'Temps partiel';
  jobType?: string;
  sector?: string;
  description: string;
  requirements: string[];
  responsibilities?: string[];
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  benefits?: string[];
  skills?: string[];
  status?: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  applicationsCount?: number;
  experienceLevel?: 'junior' | 'intermediaire' | 'senior' | 'expert';
  workLocation?: 'remote' | 'onsite' | 'hybrid';
  companyLogo?: string;
  contactEmail?: string;
  contactPhone?: string;
  missions?: string[];
  employerId?: string;
  isActive?: boolean;
  category?: string;
  keywords?: string[];
  postedById?: string;
  _id?: string;
}

export interface Job {
  id: string;
  _id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  createdBy?: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  jobTitle: string;
  company?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview';
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
  interviewDate?: string;
  feedback?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  cvUrl?: string;
}

export interface SavedJob {
  jobId: string;
  savedAt: string;
}

export interface JobFilter {
  type?: string[];
  location?: string[];
  skills?: string[];
  salary?: {
    min?: number;
    max?: number;
  };
  status?: 'active' | 'inactive';
  category?: string[];
  sector?: string[];
  experienceLevel?: string[];
  workLocation?: string[];
  postedWithin?: number; // en jours
}

export interface JobSearchParams {
  page: number;
  limit: number;
  search?: string;
  filters?: JobFilter;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

export interface JobsResponse {
  jobs: JobData[];
  total: number;
  page: number;
  limit: number;
  filters?: {
    categories: string[];
    sectors: string[];
    locations: string[];
    types: string[];
  };
}

export interface JobApplicationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  interview: number;
}

export interface JobAlert {
  id: string;
  keywords: string[];
  location?: string;
  type?: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
}

export const JOB_TYPES = [
  'CDI',
  'CDD',
  'Stage',
  'Freelance',
  'Alternance',
  'Temps partiel'
] as const;

export const JOB_SECTORS = [
  'Ressources Humaines',
  'Informatique',
  'Marketing',
  'Finance',
  'Commercial',
  'Communication',
  'Administration',
  'Logistique',
  'Production',
  'Juridique',
  'Autre'
] as const;

export type JobType = typeof JOB_TYPES[number];
export type JobSector = typeof JOB_SECTORS[number]; 