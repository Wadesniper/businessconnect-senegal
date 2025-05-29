import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import {
  Container, Typography, Box, Button, Paper, Stack, IconButton, Tooltip, Chip, Avatar, Divider, useTheme, useMediaQuery, Fade, Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import PlaceIcon from '@mui/icons-material/Place';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSubscription } from '../../hooks/useSubscription';
import Grid from '@mui/material/Grid';
import { useAuth } from '../../context/AuthContext';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      JobService.getJobById(id).then(setJob);
    }
  }, [id]);

  useEffect(() => {
    if (!loadingSub && !hasActiveSubscription && user?.role !== 'admin' && user?.role !== 'employeur') {
      navigate('/subscription');
    }
  }, [hasActiveSubscription, loadingSub, navigate, user]);

  if (!job) {
    return <Container><Typography>Chargement...</Typography></Container>;
  }

  // Préparation des liens et textes
  const mail = job.email;
  const phone = job.phone;
  const mailSubject = `Candidature au poste de ${job.title}`;
  const mailBody = `Bonjour,\n\nJe souhaite postuler à l'offre \"${job.title}\" publiée sur votre plateforme.\n\nVeuillez trouver ci-joint mon CV.\n\nCordialement,\n[Votre nom]`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const handlePostuler = () => {
    navigate(`/jobs/${id}/postuler`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Paper elevation={4} sx={{ p: isMobile ? 2 : 4, borderRadius: 4, bgcolor: '#f9fafb' }}>
          {/* Header visuel */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
            bgcolor: theme.palette.primary.light,
            borderRadius: 3,
            p: 2,
            boxShadow: 1
          }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: theme.palette.primary.main, fontSize: 36 }}>
              {job.companyLogo ? <img src={job.companyLogo} alt="logo" style={{ width: '100%' }} /> : <BusinessIcon fontSize="large" />}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} color="primary.dark">{job.title}</Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon fontSize="small" /> {job.company}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={isMobile ? 2 : 4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                <Chip icon={<PlaceIcon />} label={job.location} color="info" variant="outlined" />
                <Chip label={job.jobType} color="secondary" variant="outlined" />
                <Chip label={job.sector} color="success" variant="outlined" />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Typography sx={{ mb: 2 }}>{job.description}</Typography>
              <Typography variant="h6" gutterBottom>Prérequis</Typography>
              <Stack component="ul" sx={{ pl: 3, mb: 2 }}>
                {job.requirements && job.requirements.map((req: string, idx: number) => (
                  <li key={idx}><Typography>{req}</Typography></li>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              {/* SUPPRESSION de l'affichage des coordonnées ici */}
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 3, fontWeight: 700, position: 'relative', minWidth: 180 }}
            onClick={handlePostuler}
            disabled={loadingSub}
            startIcon={<CheckCircleIcon color="success" />}
          >
            Postuler
          </Button>
          <Button variant="outlined" color="secondary" size="large" sx={{ borderRadius: 3, fontWeight: 700, ml: 2 }} onClick={() => navigate(-1)}>
            Retour aux offres
          </Button>
        </Paper>
      </Fade>
    </Container>
  );
};

export default JobDetailsPage; 