import React from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RedirectBanners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper 
          sx={{ 
            p: 3, 
            backgroundColor: '#2196f3',
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Créez votre CV professionnel
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Un CV bien structuré augmente vos chances d'être remarqué par les recruteurs.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/cv-generator')}
            sx={{ alignSelf: 'flex-start' }}
          >
            Créer mon CV
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper 
          sx={{ 
            p: 3, 
            backgroundColor: '#4caf50',
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Formations professionnelles
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Développez vos compétences avec nos formations certifiantes.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => navigate('/formations')}
            sx={{ alignSelf: 'flex-start' }}
          >
            Voir les formations
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RedirectBanners; 