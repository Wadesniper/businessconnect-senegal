export interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  benefits?: string[];
  skills: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  applicationsCount?: number;
  category?: string;
  sector?: string;
  experienceLevel?: 'junior' | 'intermediaire' | 'senior' | 'expert';
  workLocation?: 'remote' | 'onsite' | 'hybrid';
  companyLogo?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  jobTitle: string;
  company: string;
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

export interface SavedJob {
  id: string;
  jobId: string;
  userId: string;
  savedAt: string;
  job: JobData;
}

export interface JobAlert {
  id: string;
  userId: string;
  keywords: string[];
  locations?: string[];
  jobTypes?: string[];
  salary?: {
    min?: number;
    max?: number;
  };
  frequency: 'daily' | 'weekly';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company?: string;
  location: string;
  jobType: string;
  sector: string;
  description: string;
  missions?: string[];
  requirements: string[];
  contactEmail?: string;
  contactPhone?: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
  employerId?: string;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company?: string;
  status: 'pending' | 'accepted' | 'rejected';
  cvUrl?: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  savedAt: string;
}

export interface JobAlert {
  id: string;
  userId: string;
  keywords: string[];
  locations: string[];
  jobTypes: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  frequency: 'daily' | 'weekly';
  active: boolean;
  createdAt: string;
  updatedAt: string;
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