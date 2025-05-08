import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Slider,
  Chip,
  Stack
} from '@mui/material';
import { JOB_TYPES, JobType } from '../../../types/job';

interface JobFiltersProps {
  sectors: string[];
  selectedSector: string | null;
  onSectorChange: (sector: string | null) => void;
  selectedType: JobType | null;
  onTypeChange: (type: JobType | null) => void;
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  experienceLevel: string | null;
  onExperienceLevelChange: (level: string | null) => void;
  workLocation: string | null;
  onWorkLocationChange: (location: string | null) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  sectors,
  selectedSector,
  onSectorChange,
  selectedType,
  onTypeChange,
  selectedLocation,
  onLocationChange,
  salaryRange,
  onSalaryRangeChange,
  experienceLevel,
  onExperienceLevelChange,
  workLocation,
  onWorkLocationChange
}) => {
  const handleSalaryChange = (event: Event, newValue: number | number[]) => {
    onSalaryRangeChange(newValue as [number, number]);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filtres
      </Typography>

      <Stack spacing={3}>
        {/* Secteur */}
        <FormControl fullWidth>
          <InputLabel>Secteur</InputLabel>
          <Select
            value={selectedSector || ''}
            label="Secteur"
            onChange={(e) => onSectorChange(e.target.value || null)}
          >
            <MenuItem value="">Tous les secteurs</MenuItem>
            {sectors.map((sector) => (
              <MenuItem key={sector} value={sector}>
                {sector}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Type de contrat */}
        <FormControl fullWidth>
          <InputLabel>Type de contrat</InputLabel>
          <Select
            value={selectedType || ''}
            label="Type de contrat"
            onChange={(e) => onTypeChange(e.target.value as JobType || null)}
          >
            <MenuItem value="">Tous les types</MenuItem>
            {JOB_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Localisation */}
        <FormControl fullWidth>
          <TextField
            label="Localisation"
            value={selectedLocation || ''}
            onChange={(e) => onLocationChange(e.target.value || null)}
            placeholder="Ex: Dakar, Saint-Louis..."
          />
        </FormControl>

        {/* Salaire */}
        <Box>
          <Typography gutterBottom>
            Salaire (FCFA)
          </Typography>
          <Slider
            value={salaryRange}
            onChange={handleSalaryChange}
            valueLabelDisplay="auto"
            min={0}
            max={5000000}
            step={100000}
            valueLabelFormat={(value) => `${value.toLocaleString()} FCFA`}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {salaryRange[0].toLocaleString()} FCFA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {salaryRange[1].toLocaleString()} FCFA
            </Typography>
          </Box>
        </Box>

        {/* Niveau d'expérience */}
        <FormControl fullWidth>
          <InputLabel>Niveau d'expérience</InputLabel>
          <Select
            value={experienceLevel || ''}
            label="Niveau d'expérience"
            onChange={(e) => onExperienceLevelChange(e.target.value || null)}
          >
            <MenuItem value="">Tous les niveaux</MenuItem>
            <MenuItem value="junior">Junior</MenuItem>
            <MenuItem value="intermediaire">Intermédiaire</MenuItem>
            <MenuItem value="senior">Senior</MenuItem>
            <MenuItem value="expert">Expert</MenuItem>
          </Select>
        </FormControl>

        {/* Mode de travail */}
        <FormControl fullWidth>
          <InputLabel>Mode de travail</InputLabel>
          <Select
            value={workLocation || ''}
            label="Mode de travail"
            onChange={(e) => onWorkLocationChange(e.target.value || null)}
          >
            <MenuItem value="">Tous les modes</MenuItem>
            <MenuItem value="remote">Télétravail</MenuItem>
            <MenuItem value="onsite">Sur site</MenuItem>
            <MenuItem value="hybrid">Hybride</MenuItem>
          </Select>
        </FormControl>

        {/* Filtres actifs */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedSector && (
            <Chip
              label={selectedSector}
              onDelete={() => onSectorChange(null)}
              size="small"
            />
          )}
          {selectedType && (
            <Chip
              label={selectedType}
              onDelete={() => onTypeChange(null)}
              size="small"
            />
          )}
          {selectedLocation && (
            <Chip
              label={selectedLocation}
              onDelete={() => onLocationChange(null)}
              size="small"
            />
          )}
          {experienceLevel && (
            <Chip
              label={experienceLevel}
              onDelete={() => onExperienceLevelChange(null)}
              size="small"
            />
          )}
          {workLocation && (
            <Chip
              label={workLocation === 'remote' ? 'Télétravail' : workLocation === 'onsite' ? 'Sur site' : 'Hybride'}
              onDelete={() => onWorkLocationChange(null)}
              size="small"
            />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default JobFilters; 