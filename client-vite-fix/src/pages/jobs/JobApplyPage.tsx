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
import { useAuth } from '../../context/AuthContext';

const JobApplyPage: React.FC = () => {
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
      if (!user) {
        navigate('/auth');
      } else {
        navigate('/subscription');
      }
    }
  }, [hasActiveSubscription, loadingSub, navigate, user]);

  if (!job) {
    return <Container><Typography>Chargement...</Typography></Container>;
  }

  // Mapping robuste : fallback sur contactEmail/contactPhone
  const mail = job.email || job.contactEmail;
  const phone = job.phone || job.contactPhone;
  const mailSubject = `Candidature au poste de ${job.title}`;
  const mailBody = `Bonjour,\n\nJe me permets de vous adresser ma candidature pour le poste de ${job.title}. Vous trouverez ci-joint mon CV pour plus de détails sur mon parcours et mes compétences.\n\nJe reste à votre disposition pour toute information complémentaire ou un entretien à votre convenance.\n\nCordialement,\n[Votre nom]`;
  const mailtoLink = mail ? `mailto:${mail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}` : '';

  const handleCopy = (text: string, type: string) => {
    if (!text) return;
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
          {/* Message pédagogique dynamique */}
          {(mail && phone) && (
            <Alert severity="info" icon={false} sx={{ mb: 3, borderRadius: 2, bgcolor: '#e6f7ff', color: '#096dd9', fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span role="img" aria-label="Conseil">💡</span>
              Copiez l'objet et le corps du mail ci-dessous, ouvrez votre boîte mail, joignez votre CV, puis envoyez votre candidature directement au recruteur à l'adresse indiquée.<br />
              <span role="img" aria-label="Téléphone">📞</span> Vous pouvez aussi contacter le recruteur par téléphone.
            </Alert>
          )}
          {(!mail && phone) && (
            <Alert severity="info" icon={false} sx={{ mb: 3, borderRadius: 2, bgcolor: '#fffbe6', color: '#ad8b00', fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span role="img" aria-label="Téléphone">📞</span>
              <b>Cliquez sur le numéro de téléphone ci-dessous</b> pour appeler et contactez directement le recruteur pour postuler à cette offre.
            </Alert>
          )}
          {(mail && !phone) && (
            <Alert severity="info" icon={false} sx={{ mb: 3, borderRadius: 2, bgcolor: '#e6f7ff', color: '#096dd9', fontSize: 16, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span role="img" aria-label="Conseil">💡</span>
              Copiez l'objet et le corps du mail ci-dessous, ouvrez votre boîte mail, joignez votre CV, puis envoyez votre candidature directement au recruteur à l'adresse indiquée.
            </Alert>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom color="primary">Coordonnées de contact</Typography>
          <Stack spacing={2}>
            {/* Email */}
            <Box>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon color="action" /> <b>Email :</b> {mail || <span style={{color:'#aaa'}}>Aucun email</span>}
                {mail && (
                  <>
                    <Tooltip title="Copier l'email"><IconButton onClick={() => handleCopy(mail, 'mail')} size="small"><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Ouvrir le client mail"><IconButton component="a" href={mailtoLink} size="small" target="_blank" rel="noopener"><EmailIcon color="primary" /></IconButton></Tooltip>
                  </>
                )}
              </Typography>
              {mail && (
                <Stack direction="column" spacing={2} mt={2}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <EmailIcon color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" color="primary" fontWeight={700} gutterBottom>Objet du mail</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{mailSubject}</Typography>
                        <Tooltip title="Copier l'objet"><IconButton onClick={() => handleCopy(mailSubject, 'subject')} size="small"><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: '#fff', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <WorkIcon color="secondary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" color="secondary" fontWeight={700} gutterBottom>Corps du mail</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'pre-line' }}>{mailBody}</Typography>
                        <Tooltip title="Copier le corps"><IconButton onClick={() => handleCopy(mailBody, 'body')} size="small"><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </Stack>
              )}
            </Box>
            {/* Téléphone */}
            <Box>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon color="action" /> <b>Téléphone :</b>
              </Typography>
              {phone ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PhoneIcon />}
                  href={`tel:${phone}`}
                  sx={{
                    fontWeight: 700,
                    fontSize: 18,
                    borderRadius: 3,
                    my: 2,
                    px: 3,
                    py: 1.5,
                    boxShadow: 2,
                    textTransform: 'none',
                    letterSpacing: 1
                  }}
                >
                  {phone}
                </Button>
              ) : (
                <span style={{color:'#aaa'}}>Aucun téléphone</span>
              )}
            </Box>
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