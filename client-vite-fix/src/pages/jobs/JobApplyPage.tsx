import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import { Container, Typography, Box, Button, Paper, Stack, IconButton, Tooltip, Avatar, Divider, useTheme, useMediaQuery, Fade, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useSubscription } from '../../hooks/useSubscription';

const JobApplyPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();

  useEffect(() => {
    if (id) {
      JobService.getJobById(id).then(setJob);
    }
  }, [id]);

  useEffect(() => {
    if (!loadingSub && !hasActiveSubscription) {
      navigate('/subscription');
    }
  }, [hasActiveSubscription, loadingSub, navigate]);

  if (!job) {
    return <Container><Typography>Chargement...</Typography></Container>;
  }

  const mail = job.email;
  const phone = job.phone;
  const mailSubject = `Candidature au poste de ${job.title}`;
  const mailBody = `Bonjour,\n\nJe souhaite postuler à l'offre \"${job.title}\" publiée sur votre plateforme.\n\nVeuillez trouver ci-joint mon CV.\n\nCordialement,\n[Votre nom]`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Paper elevation={4} sx={{ p: isMobile ? 2 : 4, borderRadius: 4, bgcolor: '#f9fafb' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: theme.palette.primary.main, fontSize: 32 }}>
              {job.companyLogo ? <img src={job.companyLogo} alt="logo" style={{ width: '100%' }} /> : <BusinessIcon fontSize="large" />}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} color="primary.dark">{job.title}</Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon fontSize="small" /> {job.company}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom color="primary">Coordonnées de contact</Typography>
          <Stack spacing={2}>
            {mail && (
              <Box>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="action" /> <b>Email :</b> {mail}
                  <Tooltip title="Copier">
                    <IconButton onClick={() => handleCopy(mail, 'mail')} size="small"><ContentCopyIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<EmailIcon />}
                  href={`mailto:${mail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}
                  target="_blank"
                  sx={{ mt: 1, borderRadius: 2, fontWeight: 600 }}
                >
                  Envoyer un mail
                </Button>
                <Box mt={1}>
                  <Typography variant="caption">Objet à copier :</Typography>
                  <Paper sx={{ p: 1, display: 'inline-block', mr: 1, bgcolor: '#fff' }}>{mailSubject}</Paper>
                  <Tooltip title="Copier"><IconButton onClick={() => handleCopy(mailSubject, 'subject')} size="small"><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                </Box>
                <Box mt={1}>
                  <Typography variant="caption">Corps du mail à copier :</Typography>
                  <Paper sx={{ p: 1, display: 'inline-block', mr: 1, bgcolor: '#fff', whiteSpace: 'pre-line' }}>{mailBody}</Paper>
                  <Tooltip title="Copier"><IconButton onClick={() => handleCopy(mailBody, 'body')} size="small"><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                </Box>
              </Box>
            )}
            {phone && (
              <Box>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="action" /> <b>Téléphone :</b> {phone}
                  <Tooltip title="Copier">
                    <IconButton onClick={() => handleCopy(phone, 'phone')} size="small"><ContentCopyIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<PhoneIcon />}
                  href={`tel:${phone}`}
                  target="_blank"
                  sx={{ mt: 1, borderRadius: 2, fontWeight: 600 }}
                >
                  Appeler
                </Button>
              </Box>
            )}
          </Stack>
          {copied && (
            <Fade in={!!copied} timeout={400}>
              <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>Copié !</Alert>
            </Fade>
          )}
          <Divider sx={{ my: 3 }} />
          <Button variant="outlined" color="secondary" size="large" sx={{ borderRadius: 3, fontWeight: 700 }} onClick={() => navigate(-1)}>
            Retour aux détails
          </Button>
        </Paper>
      </Fade>
    </Container>
  );
};

export default JobApplyPage; 