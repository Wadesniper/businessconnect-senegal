import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  renderAction?: React.ReactNode;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  sectors,
  selectedSector,
  onSectorChange,
  selectedType,
  onTypeChange,
  selectedLocation,
  onLocationChange,
  workLocation,
  onWorkLocationChange,
  searchQuery = '',
  onSearchChange,
  renderAction
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 18, marginBottom: 24, flexWrap: 'nowrap' }}>
      <div style={{ fontWeight: 800, color: '#1d3557', fontSize: 20, marginRight: 24, minWidth: 90, marginBottom: 0, whiteSpace: 'nowrap' }}>Filtres</div>
      <div
        className="job-filters-row"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 18,
          alignItems: 'flex-end',
          flexWrap: 'nowrap',
          background: '#fff',
          boxShadow: '0 2px 12px #e3e8f7',
          borderRadius: 18,
          padding: '18px 18px 8px 18px',
          marginBottom: 0,
          flex: 1,
        }}
      >
        <Input
          placeholder="Rechercher par titre, compétence..."
          value={searchQuery}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          style={{ minWidth: 200, flex: 1 }}
          allowClear
        />
        <label style={{ minWidth: 180, maxWidth: 260 }}>
          <span style={{ fontWeight: 600 }}>Secteur</span>
          <select
            value={selectedSector || ''}
            onChange={e => onSectorChange(e.target.value || null)}
            style={{
              width: '100%',
              maxWidth: 260,
              padding: 8,
              borderRadius: 8,
              marginTop: 4,
              background: '#fff',
              color: '#222',
              border: '1.5px solid #e3e8f7',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <option value="">Tous secteurs</option>
            {sectors.map((s) => (
              <option key={s} value={s} style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.length > 38 ? s.slice(0, 35) + '…' : s}
              </option>
            ))}
          </select>
        </label>
        <label style={{ minWidth: 180 }}>
          <span style={{ fontWeight: 600 }}>Type de contrat</span>
          <select
            value={selectedType || ''}
            onChange={e => onTypeChange(e.target.value || null)}
            style={{ width: '100%', padding: 8, borderRadius: 8, marginTop: 4, background: '#fff', color: '#222', border: '1.5px solid #e3e8f7' }}
          >
            <option value="">Tous types</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
            <option value="Alternance">Alternance</option>
            <option value="Temps partiel">Temps partiel</option>
          </select>
        </label>
        <label style={{ minWidth: 180 }}>
          <span style={{ fontWeight: 600 }}>Localisation</span>
          <input
            type="text"
            value={selectedLocation || ''}
            onChange={e => onLocationChange(e.target.value || null)}
            placeholder="Ville, région..."
            style={{ width: '100%', padding: 8, borderRadius: 8, marginTop: 4, background: '#fff', color: '#222', border: '1.5px solid #e3e8f7' }}
          />
        </label>
        {renderAction && <div style={{ marginLeft: 'auto' }}>{renderAction}</div>}
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .job-filters-row { flex-wrap: wrap !important; gap: 12px !important; }
        }
        @media (max-width: 700px) {
          .job-filters-row { flex-direction: column !important; gap: 12px !important; }
          .job-filters-row label { min-width: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default JobFilters; 