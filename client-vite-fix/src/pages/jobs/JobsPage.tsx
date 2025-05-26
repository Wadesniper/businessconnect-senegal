import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import JobAdviceBanner from './components/JobAdviceBanner';
import RedirectBanners from './components/RedirectBanners';
import JobFilters from './components/JobFilters';
import JobCard from './components/JobCard';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { hasPremiumAccess } from '../../utils/premiumAccess';
import type { JobType } from '../../types/job';
import { useNavigate } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import CircularProgress from '@mui/material/CircularProgress';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);
  const navigate = useNavigate();

  // États des filtres
  const [selectedSector, setSelectedSector] = React.useState<string | null>(null);
  const [selectedType, setSelectedType] = React.useState<JobType | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<string | null>(null);
  const [salaryRange, setSalaryRange] = React.useState<[number, number]>([0, 5000000]);
  const [experienceLevel, setExperienceLevel] = React.useState<string | null>(null);
  const [workLocation, setWorkLocation] = React.useState<string | null>(null);

  // Récupération des offres et secteurs
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [sectors, setSectors] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsLoading(true);
    JobService.getJobs()
      .then(jobs => {
        console.log('Réponse API /api/jobs :', jobs);
        setJobs(jobs || []);
        // Extraire les secteurs uniques
        const uniqueSectors = Array.from(new Set((jobs || []).map((j: any) => j.sector).filter(Boolean)));
        setSectors(uniqueSectors);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des offres d'emploi");
        setIsLoading(false);
      });
  }, []);

  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      if (selectedSector && job.sector !== selectedSector) return false;
      if (selectedType && job.type !== selectedType) return false;
      if (selectedLocation && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      if (job.salary) {
        const jobMaxSalary = job.salary.max;
        if (jobMaxSalary < salaryRange[0] || jobMaxSalary > salaryRange[1]) return false;
      }
      if (experienceLevel && job.experienceLevel !== experienceLevel) return false;
      if (workLocation && job.workLocation !== workLocation) return false;
      return true;
    });
  }, [jobs, selectedSector, selectedType, selectedLocation, salaryRange, experienceLevel, workLocation]);

  // Tri des offres filtrées par date décroissante
  const sortedJobs = React.useMemo(() => {
    return [...filteredJobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filteredJobs]);

  const handlePostuler = (jobId: string) => {
    if (!isPremium) {
      navigate('/subscription');
    } else {
      navigate(`/jobs/${jobId}`);
    }
  };

  const handleEdit = (jobId: string) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  const handleDelete = (jobId: string) => {
    navigate(`/jobs/${jobId}/delete`);
  };

  const handlePublish = () => {
    navigate('/jobs/publish');
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (isLoading) {
    return <Box sx={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={48} color="primary" /></Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <JobAdviceBanner />
      <RedirectBanners />
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <JobFilters
            sectors={sectors}
            selectedSector={selectedSector}
            onSectorChange={setSelectedSector}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            salaryRange={salaryRange}
            onSalaryRangeChange={setSalaryRange}
            experienceLevel={experienceLevel}
            onExperienceLevelChange={setExperienceLevel}
            workLocation={workLocation}
            onWorkLocationChange={setWorkLocation}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          {error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                {error}
              </Typography>
              <Typography color="text.secondary">
                Essayez de rafraîchir la page.
              </Typography>
            </Box>
          ) : filteredJobs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Aucune offre ne correspond à vos critères de recherche.
              </Typography>
              <Typography color="text.secondary">
                Essayez de modifier vos filtres pour voir plus de résultats.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
              </Typography>
              <Grid container spacing={3}>
                {sortedJobs.map((job, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
                    <JobCard
                      job={job}
                      user={user}
                      isSubscribed={isPremium}
                      onPostuler={handlePostuler}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPublish={handlePublish}
                      onViewDetails={handleViewDetails}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobsPage; 