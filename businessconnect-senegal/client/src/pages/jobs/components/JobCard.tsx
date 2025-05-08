import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  CardActions,
  Stack,
  Tooltip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company?: string;
    location: string;
    type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
    sector: string;
    description: string;
    createdAt: string;
    experienceLevel?: 'junior' | 'intermediaire' | 'senior' | 'expert';
    workLocation?: 'remote' | 'onsite' | 'hybrid';
  };
  isSubscribed: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSubscribed }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (isSubscribed) {
      navigate(`/jobs/${job.id}`);
    }
  };

  const handleApply = () => {
    if (isSubscribed) {
      navigate(`/jobs/${job.id}/apply`);
    }
  };

  const getWorkLocationLabel = (location?: string) => {
    switch (location) {
      case 'remote': return 'Télétravail';
      case 'onsite': return 'Sur site';
      case 'hybrid': return 'Hybride';
      default: return '';
    }
  };

  const getExperienceLevelLabel = (level?: string) => {
    switch (level) {
      case 'junior': return 'Junior';
      case 'intermediaire': return 'Intermédiaire';
      case 'senior': return 'Senior';
      case 'expert': return 'Expert';
      default: return '';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {job.title}
        </Typography>
        {job.company && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {job.company}
          </Typography>
        )}
        
        <Box sx={{ mb: 2 }}>
          <Tooltip title="Localisation">
            <Chip 
              label={job.location} 
              size="small" 
              sx={{ mr: 1, mb: 1 }} 
            />
          </Tooltip>
          <Tooltip title="Type de contrat">
            <Chip 
              label={job.type} 
              size="small" 
              sx={{ mr: 1, mb: 1 }} 
            />
          </Tooltip>
          <Tooltip title="Secteur">
            <Chip 
              label={job.sector} 
              size="small" 
              sx={{ mr: 1, mb: 1 }} 
            />
          </Tooltip>
          {job.workLocation && (
            <Tooltip title="Mode de travail">
              <Chip 
                label={getWorkLocationLabel(job.workLocation)}
                size="small" 
                sx={{ mr: 1, mb: 1 }} 
              />
            </Tooltip>
          )}
          {job.experienceLevel && (
            <Tooltip title="Niveau d'expérience">
              <Chip 
                label={getExperienceLevelLabel(job.experienceLevel)}
                size="small" 
                sx={{ mb: 1 }} 
              />
            </Tooltip>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {job.description.substring(0, 200)}...
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Publiée {formatDistance(new Date(job.createdAt), new Date(), { addSuffix: true, locale: fr })}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        {isSubscribed ? (
          <Stack direction="row" spacing={2}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={handleViewDetails}
            >
              Voir détails
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
            >
              Postuler
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/subscription')}
              endIcon={<LockIcon />}
            >
              Voir détails
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/subscription')}
              endIcon={<LockIcon />}
            >
              Postuler
            </Button>
          </Stack>
        )}
      </CardActions>
    </Card>
  );
};

export default JobCard; 