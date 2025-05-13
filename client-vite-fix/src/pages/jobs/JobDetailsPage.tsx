import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import {
  Container, Typography, Box, Button, Paper, Stack, IconButton, Tooltip, Chip, Avatar, Divider, useTheme, useMediaQuery, Grid, Fade, Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import PlaceIcon from '@mui/icons-material/Place';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (id) {
      JobService.getJobById(id).then(setJob);
    }
  }, [id]);

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
            <Grid item xs={12} md={8}>
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
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: '#f1f5f9', borderRadius: 3, p: 3, boxShadow: 0, mb: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">Coordonnées pour postuler</Typography>
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
              </Box>
              {copied && (
                <Fade in={!!copied} timeout={400}>
                  <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>Copié !</Alert>
                </Fade>
              )}
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: 3, fontWeight: 700 }} onClick={() => navigate(-1)}>
            Retour aux offres
          </Button>
        </Paper>
      </Fade>
    </Container>
  );
};

export default JobDetailsPage; 