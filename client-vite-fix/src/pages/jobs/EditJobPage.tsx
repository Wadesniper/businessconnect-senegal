import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { JOB_SECTORS, type JobType } from '../../types/job';

const types: JobType[] = ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance', 'Temps partiel'];

const EditJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    sector: '',
    type: null as JobType | null,
    location: '',
    company: '',
    salary_min: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      JobService.getJobById(id)
        .then(job => {
          if (job) {
            // Vérifier si l'utilisateur est le propriétaire ou un admin
            if (user?.id === job.employerId || user?.role === 'admin') {
              setForm({
                title: job.title || '',
                description: job.description || '',
                sector: job.sector || '',
                type: job.type || null,
                location: job.location || '',
                company: job.company || '',
                salary_min: job.salary_min?.toString() || '',
              });
            } else {
              setError('Vous n\'êtes pas autorisé à modifier cette offre.');
            }
          } else {
            setError('Offre non trouvée.');
          }
        })
        .catch(() => setError('Erreur lors du chargement de l\'offre.'))
        .finally(() => setLoading(false));
    }
  }, [id, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    setForm({ ...form, [e.target.name as string]: e.target.value });
  };

  const handleTypeChange = (value: JobType | null) => {
    setForm({ ...form, type: value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form.type) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const dataToUpdate = {
        ...form,
        type: form.type,
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
      };
      await JobService.updateJob(id, dataToUpdate);
      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 1200);
    } catch (err: any) {
      setError('Erreur lors de la mise à jour de l\'offre.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.title) {
      return <Container sx={{py: 4, textAlign: 'center'}}><CircularProgress /></Container>
  }
  
  if (error) {
    return <Container><Alert severity="error">{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>Modifier l'offre d'emploi</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, bgcolor: '#fff', p: 4, borderRadius: 3, boxShadow: 2 }}>
        <TextField label="Titre du poste" name="title" value={form.title} onChange={handleChange} required fullWidth />
        <TextField label="Entreprise" name="company" value={form.company} onChange={handleChange} required fullWidth />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} required fullWidth multiline minRows={3} />
        <TextField label="Secteur" name="sector" value={form.sector} onChange={handleChange} required select fullWidth>
          {JOB_SECTORS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField label="Type de contrat" name="type" value={form.type || ''} onChange={(e) => handleTypeChange(e.target.value as JobType)} required select fullWidth>
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
        {success && <Alert severity="success">Offre mise à jour avec succès !</Alert>}
        <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ fontWeight: 700, borderRadius: 2 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Mettre à jour'}
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/jobs')} sx={{ borderRadius: 2 }}>
          Annuler
        </Button>
      </Box>
    </Container>
  );
};

export default EditJobPage; 