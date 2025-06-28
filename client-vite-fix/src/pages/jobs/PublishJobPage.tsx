import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { JOB_SECTORS, JOB_TYPES, type JobType } from '../../types/job';

const types: JobType[] = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance', 'Temps partiel'];

const initialForm = {
    title: '',
    description: '',
    sector: '',
    type: '',
    location: '',
    company: '',
    salary_min: '',
  contactEmail: '',
  contactPhone: '',
  requirements: '',
  keywords: '',
  missions: '',
  salary_currency: '',
  isActive: true,
  jobTypeDetail: '',
};

const PublishJobPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user || (user.role !== 'admin' && user.role !== 'recruteur')) {
    return <Container><Alert severity="error">Accès réservé aux recruteurs et admins.</Alert></Container>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Mapping des types de contrat frontend -> backend (Prisma)
  const mapJobType = (type: string): string => {
    switch (type) {
      case 'CDI': return 'full_time';
      case 'CDD': return 'contract';
      case 'Stage': return 'internship';
      case 'Temps partiel': return 'part_time';
      case 'Freelance': return 'contract';
      case 'Alternance': return 'internship';
      default: return 'full_time';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    // Validation des champs obligatoires
    if (!form.title.trim() || !form.company.trim() || !form.sector.trim() || !form.type.trim() || !form.location.trim() || !form.description.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setLoading(false);
      return;
    }
    // Validation coordonnées : au moins un des deux
    if (!form.contactEmail && !form.contactPhone) {
      setError('Veuillez renseigner au moins un email ou un téléphone de contact.');
      setLoading(false);
      return;
    }
    if (form.contactEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.contactEmail)) {
      setError('Veuillez saisir un email de contact valide.');
      setLoading(false);
      return;
    }
    if (form.contactPhone && form.contactPhone.length < 6) {
      setError('Veuillez saisir un numéro de téléphone valide.');
      setLoading(false);
      return;
    }
    try {
      // Construction de l'objet à envoyer, nettoyage des champs vides
      const jobPayload: any = {
        ...form, 
        type: mapJobType(form.type),
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
        requirements: form.requirements ? form.requirements.split('\n').map(s => s.trim()).filter(Boolean) : [],
        keywords: form.keywords ? form.keywords.split(',').map(s => s.trim()).filter(Boolean) : [],
        missions: form.missions ? form.missions.split('\n').map(s => s.trim()).filter(Boolean) : [],
        salary_currency: form.salary_currency || 'XOF',
        isActive: true,
      };
      // Suppression des champs vides ou inutiles
      Object.keys(jobPayload).forEach(key => {
        if (jobPayload[key] === '' || jobPayload[key] === undefined) {
          delete jobPayload[key];
        }
      });
      await JobService.createJob(jobPayload);
      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 1200);
    } catch (err: any) {
      setError('Erreur lors de la publication de l\'offre.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>Publier une offre d'emploi</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#fff', p: 4, borderRadius: 3, boxShadow: 2 }}>
        <TextField label="Titre du poste *" name="title" value={form.title} onChange={handleChange} required fullWidth />
        <TextField label="Entreprise *" name="company" value={form.company} onChange={handleChange} required fullWidth />
        <TextField label="Description *" name="description" value={form.description} onChange={handleChange} required fullWidth multiline minRows={3} />
        <TextField label="Secteur *" name="sector" value={form.sector} onChange={handleChange} required select fullWidth>
          {JOB_SECTORS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField label="Type de contrat *" name="type" value={form.type} onChange={handleChange} required select fullWidth>
          {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField label="Localisation *" name="location" value={form.location} onChange={handleChange} required fullWidth />
        <TextField 
          label="Email de contact" 
          name="contactEmail" 
          value={form.contactEmail} 
          onChange={handleChange} 
          fullWidth 
          type="email"
        />
        <TextField 
          label="Téléphone de contact" 
          name="contactPhone" 
          value={form.contactPhone} 
          onChange={handleChange} 
          fullWidth 
          type="tel"
        />
        <TextField 
          label="Exigences / Qualifications requises (une par ligne)" 
          name="requirements" 
          value={form.requirements} 
          onChange={handleChange} 
          fullWidth 
          multiline 
          minRows={3}
        />
        <TextField 
          label="Mots-clés (séparés par des virgules)" 
          name="keywords" 
          value={form.keywords} 
          onChange={handleChange} 
          fullWidth 
        />
        <TextField 
          label="Missions principales (une par ligne)" 
          name="missions" 
          value={form.missions} 
          onChange={handleChange} 
          fullWidth 
          multiline 
          minRows={2}
        />
        <TextField 
          label="Salaire minimum (optionnel)" 
          name="salary_min" 
          value={form.salary_min} 
          onChange={handleChange} 
          type="number" 
          fullWidth 
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Offre publiée avec succès !</Alert>}
        <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ fontWeight: 700, borderRadius: 2 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Publier'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/jobs')} sx={{ borderRadius: 2 }}>
          Annuler
        </Button>
      </Box>
    </Container>
  );
};

export default PublishJobPage; 