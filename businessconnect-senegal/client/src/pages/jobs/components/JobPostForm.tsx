import React from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSubscription } from '../../../hooks/useSubscription';
import { useAuth } from '../../../hooks/useAuth';

interface JobPostFormProps {
  onSubmit: (values: JobFormValues) => void;
  sectors: string[];
  isLoading?: boolean;
}

export interface JobFormValues {
  title: string;
  company?: string;
  location: string;
  jobType: string;
  sector: string;
  description: string;
  requirements: string[];
  contactEmail?: string;
  contactPhone?: string;
  keywords: string[];
}

const validationSchema = Yup.object({
  title: Yup.string().required('Le titre est requis'),
  location: Yup.string().required('Le lieu est requis'),
  jobType: Yup.string().required('Le type de contrat est requis'),
  sector: Yup.string().required('Le secteur est requis'),
  description: Yup.string().required('La description est requise'),
  requirements: Yup.array().min(1, 'Au moins une exigence est requise'),
  contactEmail: Yup.string().email('Email invalide'),
  contactPhone: Yup.string().matches(/^[0-9+\s-]+$/, 'Numéro de téléphone invalide'),
  keywords: Yup.array().min(1, 'Au moins un mot-clé est requis')
});

const JobPostForm: React.FC<JobPostFormProps> = ({
  onSubmit,
  sectors,
  isLoading = false
}) => {
  const { user } = useAuth();
  const { hasActiveSubscription, loading: loadingSub, subscription } = useSubscription();
  if (loadingSub) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>Chargement...</div>;
  }
  if (!hasActiveSubscription || !subscription || (subscription.type !== 'recruteur' && subscription.type !== 'employeur')) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Seuls les recruteurs/employeurs abonnés peuvent publier une offre d'emploi.</div>;
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      company: '',
      location: '',
      jobType: '',
      sector: '',
      description: '',
      requirements: [''],
      contactEmail: '',
      contactPhone: '',
      keywords: []
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleAddRequirement = () => {
    formik.setFieldValue('requirements', [...formik.values.requirements, '']);
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = formik.values.requirements.filter((_, i) => i !== index);
    formik.setFieldValue('requirements', newRequirements);
  };

  const handleKeywordInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value) {
      event.preventDefault();
      const newKeyword = event.currentTarget.value.trim();
      if (newKeyword && !formik.values.keywords.includes(newKeyword)) {
        formik.setFieldValue('keywords', [...formik.values.keywords, newKeyword]);
        event.currentTarget.value = '';
      }
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    formik.setFieldValue(
      'keywords',
      formik.values.keywords.filter((k) => k !== keyword)
    );
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Publier une offre d'emploi
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Titre du poste"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nom de l'entreprise (optionnel)"
              name="company"
              value={formik.values.company}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Lieu"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Type de contrat</InputLabel>
              <Select
                name="jobType"
                value={formik.values.jobType}
                onChange={formik.handleChange}
                error={formik.touched.jobType && Boolean(formik.errors.jobType)}
              >
                <MenuItem value="CDI">CDI</MenuItem>
                <MenuItem value="CDD">CDD</MenuItem>
                <MenuItem value="Stage">Stage</MenuItem>
                <MenuItem value="Freelance">Freelance</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Secteur d'activité</InputLabel>
              <Select
                name="sector"
                value={formik.values.sector}
                onChange={formik.handleChange}
                error={formik.touched.sector && Boolean(formik.errors.sector)}
              >
                {sectors.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description du poste"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Exigences / Qualifications requises
            </Typography>
            {formik.values.requirements.map((req, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label={`Exigence ${index + 1}`}
                  value={req}
                  onChange={(e) => {
                    const newReqs = [...formik.values.requirements];
                    newReqs[index] = e.target.value;
                    formik.setFieldValue('requirements', newReqs);
                  }}
                />
                {index > 0 && (
                  <Button
                    color="error"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    Supprimer
                  </Button>
                )}
              </Box>
            ))}
            <Button onClick={handleAddRequirement}>
              Ajouter une exigence
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email de contact"
              name="contactEmail"
              type="email"
              value={formik.values.contactEmail}
              onChange={formik.handleChange}
              error={formik.touched.contactEmail && Boolean(formik.errors.contactEmail)}
              helperText={formik.touched.contactEmail && formik.errors.contactEmail}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Téléphone de contact"
              name="contactPhone"
              value={formik.values.contactPhone}
              onChange={formik.handleChange}
              error={formik.touched.contactPhone && Boolean(formik.errors.contactPhone)}
              helperText={formik.touched.contactPhone && formik.errors.contactPhone}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mots-clés (Appuyez sur Entrée pour ajouter)"
              onKeyPress={handleKeywordInput}
            />
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formik.values.keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Publication en cours...' : 'Publier l\'offre'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default JobPostForm; 