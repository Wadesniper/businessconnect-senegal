import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  TextField,
  Stack,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById } = useJobs();
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();
  const [job, setJob] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [copySuccess, setCopySuccess] = React.useState<string>('');

  React.useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const jobData = await getJobById(id);
        if (!jobData) {
          setError('Offre non trouvée');
          return;
        }
        setJob(jobData);
      } catch (err) {
        setError('Erreur lors du chargement de l\'offre');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, getJobById]);

  React.useEffect(() => {
    if (!loadingSub && !hasActiveSubscription) {
      navigate('/subscription', { replace: true });
    }
  }, [loadingSub, hasActiveSubscription, navigate]);

  if (loading || loadingSub) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) return null;

  const handleCopyEmail = () => {
    if (job.contactEmail) {
      navigator.clipboard.writeText(job.contactEmail);
      setCopySuccess('Email copié !');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleCopyPhone = () => {
    if (job.contactPhone) {
      navigator.clipboard.writeText(job.contactPhone);
      setCopySuccess('Numéro copié !');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleEmailClick = () => {
    if (!job.contactEmail) return;
    
    const emailSubject = `Candidature : ${job.title}${job.company ? ` - ${job.company}` : ''}`;
    const emailBody = `Bonjour,\n\nJe souhaite postuler au poste de ${job.title}${job.company ? ` chez ${job.company}` : ''}.\n\nVous trouverez mon CV en pièce jointe.\n\nCordialement,`;
    
    window.location.href = `mailto:${job.contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handlePhoneClick = () => {
    if (!job.contactPhone) return;
    window.location.href = `tel:${job.contactPhone}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {job.title}
          </Typography>
          {job.company && (
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {job.company}
            </Typography>
          )}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={job.location} />
            <Chip label={job.jobType} color="primary" />
            <Chip label={job.sector} color="secondary" />
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Description du poste
          </Typography>
          <Typography variant="body1" paragraph>
            {job.description}
          </Typography>
        </Box>

        {job.missions && job.missions.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Missions
            </Typography>
            <ul>
              {job.missions.map((mission: string, index: number) => (
                <li key={index}>
                  <Typography variant="body1">{mission}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Prérequis
            </Typography>
            <ul>
              {job.requirements.map((requirement: string, index: number) => (
                <li key={index}>
                  <Typography variant="body1">{requirement}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Contact
          </Typography>
          <Stack direction="row" spacing={2}>
            {job.contactEmail && (
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={handleEmailClick}
              >
                Envoyer un email
              </Button>
            )}
            {job.contactPhone && (
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={handlePhoneClick}
              >
                Appeler
              </Button>
            )}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {job.contactEmail && (
              <Tooltip title="Copier l'email">
                <IconButton onClick={handleCopyEmail}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            )}
            {job.contactPhone && (
              <Tooltip title="Copier le numéro">
                <IconButton onClick={handleCopyPhone}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {copySuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {copySuccess}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetailsPage; 