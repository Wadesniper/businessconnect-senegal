import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import JobAdviceBanner from './components/JobAdviceBanner';
import RedirectBanners from './components/RedirectBanners';
import JobFilters from './components/JobFilters';
import JobCard from './components/JobCard';
import { useAuth } from '../../hooks/useAuth';
import { useJobs } from '../../hooks/useJobs';
import { JobType } from '../../types/job';

const JobsPage: React.FC = () => {
  const { isSubscribed } = useAuth();
  const { jobs, isLoading, sectors } = useJobs();

  // États des filtres
  const [selectedSector, setSelectedSector] = React.useState<string | null>(null);
  const [selectedType, setSelectedType] = React.useState<JobType | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<string | null>(null);
  const [salaryRange, setSalaryRange] = React.useState<[number, number]>([0, 5000000]);
  const [experienceLevel, setExperienceLevel] = React.useState<string | null>(null);
  const [workLocation, setWorkLocation] = React.useState<string | null>(null);

  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      // Filtre par secteur
      if (selectedSector && job.sector !== selectedSector) return false;
      
      // Filtre par type de contrat
      if (selectedType && job.type !== selectedType) return false;
      
      // Filtre par localisation
      if (selectedLocation && !job.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      
      // Filtre par salaire
      if (job.salary) {
        const jobMaxSalary = job.salary.max;
        if (jobMaxSalary < salaryRange[0] || jobMaxSalary > salaryRange[1]) return false;
      }
      
      // Filtre par niveau d'expérience
      if (experienceLevel && job.experienceLevel !== experienceLevel) return false;
      
      // Filtre par mode de travail
      if (workLocation && job.workLocation !== workLocation) return false;
      
      return true;
    });
  }, [
    jobs,
    selectedSector,
    selectedType,
    selectedLocation,
    salaryRange,
    experienceLevel,
    workLocation
  ]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Bannière de conseils */}
      <JobAdviceBanner />

      {/* Bannières de redirection (CV et Formation) */}
      <RedirectBanners />

      <Grid container spacing={4}>
        {/* Filtres */}
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

        {/* Liste des offres */}
        <Grid item xs={12} md={9}>
          {isLoading ? (
            <Typography>Chargement des offres...</Typography>
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
                {filteredJobs.map((job) => (
                  <Grid item xs={12} md={6} key={job.id}>
                    <JobCard job={job} isSubscribed={isSubscribed} />
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