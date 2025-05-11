import React from 'react';

interface JobFiltersProps {
  sectors: string[];
  selectedSector: string | null;
  onSectorChange: (sector: string | null) => void;
  selectedType: any;
  onTypeChange: (type: any) => void;
  selectedLocation: string | null;
  onLocationChange: (location: string | null) => void;
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  experienceLevel: string | null;
  onExperienceLevelChange: (level: string | null) => void;
  workLocation: string | null;
  onWorkLocationChange: (location: string | null) => void;
}

const JobFilters: React.FC<JobFiltersProps> = () => {
  return (
    <div>JobFilters (à compléter)</div>
  );
};

export default JobFilters; 