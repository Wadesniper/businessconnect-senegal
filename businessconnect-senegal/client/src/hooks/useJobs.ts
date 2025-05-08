import { useState, useEffect } from 'react';
import { JobService } from '../services/jobService';
import { Job } from '../types/job';

interface UseJobsReturn {
  jobs: Job[];
  isLoading: boolean;
  error: Error | null;
  sectors: string[];
  refreshJobs: () => Promise<void>;
  getJobById: (id: string) => Promise<Job | null>;
  createJob: (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Job>;
  updateJob: (id: string, jobData: Partial<Job>) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
}

export const useJobs = (): UseJobsReturn => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const jobsFromApi = await JobService.getJobs();
      setJobs(jobsFromApi);
      // Extraire dynamiquement les secteurs uniques
      const uniqueSectors = Array.from(new Set(jobsFromApi.map(job => job.sector).filter(Boolean)));
      setSectors(uniqueSectors);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des offres'));
    } finally {
      setIsLoading(false);
    }
  };

  const getJobById = async (id: string): Promise<Job | null> => {
    try {
      const jobsFromApi = await JobService.getJobs();
      const job = jobsFromApi.find(j => j.id === id);
      return job || null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'offre:', err);
      return null;
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> => {
    try {
      const newJob: Job = {
        ...jobData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setJobs(prev => [...prev, newJob]);
      return newJob;
    } catch (err) {
      throw new Error('Erreur lors de la création de l\'offre');
    }
  };

  const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
    try {
      const updatedJobs = jobs.map(job => 
        job.id === id 
          ? { ...job, ...jobData, updatedAt: new Date().toISOString() }
          : job
      );
      setJobs(updatedJobs);
      const updatedJob = updatedJobs.find(j => j.id === id);
      if (!updatedJob) throw new Error('Offre non trouvée');
      return updatedJob;
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour de l\'offre');
    }
  };

  const deleteJob = async (id: string): Promise<void> => {
    try {
      setJobs(prev => prev.filter(job => job.id !== id));
    } catch (err) {
      throw new Error('Erreur lors de la suppression de l\'offre');
    }
  };

  const refreshJobs = async () => {
    await fetchJobs();
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    isLoading,
    error,
    sectors,
    refreshJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
  };
};

export default useJobs; 