import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { JOB_SECTORS, JOB_TYPES, type JobType } from '../../types/job';

const types: JobType[] = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance', 'Temps partiel'];

const PublishJobPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    sector: '',
    type: '',
    location: '',
    company: '',
    salary_min: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user || (user.role !== 'admin' && user.role !== 'employeur')) {
    return <Container><Alert severity="error">Accès réservé aux employeurs et admins.</Alert></Container>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await JobService.createJob({ 
        ...form, 
        type: form.type as JobType,
        salary_min: form.salary_min ? Number(form.salary_min) : undefined
      });
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
        <TextField label="Titre du poste" name="title" value={form.title} onChange={handleChange} required fullWidth />
        <TextField label="Entreprise" name="company" value={form.company} onChange={handleChange} required fullWidth />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} required fullWidth multiline minRows={3} />
        <TextField label="Secteur" name="sector" value={form.sector} onChange={handleChange} required select fullWidth>
          {JOB_SECTORS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField label="Type de contrat" name="type" value={form.type} onChange={handleChange} required select fullWidth>
          {types.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField label="Localisation" name="location" value={form.location} onChange={handleChange} required fullWidth />
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