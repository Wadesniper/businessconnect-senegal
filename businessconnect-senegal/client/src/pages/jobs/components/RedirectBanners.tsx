import React from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SchoolIcon from '@mui/icons-material/School';

const RedirectBanners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper 
          sx={{ 
            p: 3, 
            background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AssignmentIndIcon sx={{ fontSize: 40, color: 'white' }} />
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Créez votre CV professionnel
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Un CV bien structuré augmente vos chances d'être remarqué par les recruteurs.
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/cv-generator')}
            sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
          >
            Créer mon CV
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper 
          sx={{ 
            p: 3, 
            background: 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: 'white' }} />
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Formations professionnelles
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Développez vos compétences avec nos formations certifiantes.
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/formations')}
            sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
          >
            Voir les formations
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RedirectBanners; 