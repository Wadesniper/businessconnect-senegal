import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Formation } from '../../../types/formation';
import { api } from '../../../services/api';
import CircularProgress from '@mui/material/CircularProgress';

const categories = ['développement', 'business', 'marketing', 'design', 'langues', 'soft-skills'];

const AdminFormationsPage = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Partial<Formation> | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchFormations();
  }, []);

  const fetchFormations = async () => {
    try {
      const response = await api.get('/formations');
      setFormations(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (formation?: Formation) => {
    setEditingFormation(formation || {});
    setOpenDialog(true);
    setFormError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFormation(null);
  };

  const validateForm = () => {
    if (!editingFormation?.title || !editingFormation?.description || !editingFormation?.cursaUrl || 
        !editingFormation?.category || !editingFormation?.price || !editingFormation?.thumbnail) {
      setFormError('Tous les champs sont obligatoires');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !editingFormation) return;

    try {
      if (editingFormation._id) {
        await api.put(`/formations/${editingFormation._id}`, editingFormation);
      } else {
        await api.post('/formations', editingFormation);
      }
      fetchFormations();
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setFormError('Erreur lors de la sauvegarde de la formation');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;

    try {
      await api.delete(`/formations/${id}`);
      fetchFormations();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (loading) {
    return <Box sx={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={48} color="primary" /></Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestion des Formations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Ajouter une formation
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>URL Cursa</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formations.map((formation) => (
              <TableRow key={formation._id}>
                <TableCell>{formation.title}</TableCell>
                <TableCell>{formation.category}</TableCell>
                <TableCell>{formation.price} FCFA</TableCell>
                <TableCell>{formation.cursaUrl}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(formation)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(formation._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingFormation?._id ? 'Modifier la formation' : 'Ajouter une formation'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Titre"
              value={editingFormation?.title || ''}
              onChange={(e) => setEditingFormation({ ...editingFormation, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={editingFormation?.description || ''}
              onChange={(e) => setEditingFormation({ ...editingFormation, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={editingFormation?.category || ''}
                onChange={(e) => setEditingFormation({ ...editingFormation, category: e.target.value as Formation['category'] })}
                label="Catégorie"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="URL Cursa"
              value={editingFormation?.cursaUrl || ''}
              onChange={(e) => setEditingFormation({ ...editingFormation, cursaUrl: e.target.value })}
              fullWidth
            />
            <TextField
              label="Prix (FCFA)"
              type="number"
              value={editingFormation?.price || ''}
              onChange={(e) => setEditingFormation({ ...editingFormation, price: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="URL de la vignette"
              value={editingFormation?.thumbnail || ''}
              onChange={(e) => setEditingFormation({ ...editingFormation, thumbnail: e.target.value })}
              fullWidth
            />
            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingFormation?._id ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminFormationsPage; 