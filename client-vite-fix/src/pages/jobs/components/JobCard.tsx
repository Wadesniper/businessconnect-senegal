import React from 'react';
import LockIcon from '@mui/icons-material/Lock';

interface JobCardProps {
  job: any;
  user: any;
  isSubscribed: boolean;
  onPostuler: (jobId: string) => void;
  onEdit: (jobId: string) => void;
  onDelete: (jobId: string) => void;
  onPublish: () => void;
  onViewDetails: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, user, isSubscribed, onPostuler, onEdit, onDelete, onPublish, onViewDetails }) => {
  // Sécurisation : si job est null ou undefined, on ne rend rien pour éviter les erreurs.
  if (!job) {
    return null;
  }

  const isAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employeur';
  const isOwner = user && job && job.createdBy === user.id;

  // Sécurisation des propriétés de l'objet job
  const title = job.title || 'Titre non disponible';
  const company = job.company || 'Entreprise non spécifiée';
  const location = job.location || 'Lieu non spécifié';
  const description = job.description || 'Pas de description.';
  const companyLogo = job.companyLogo;
  const jobType = job.type;
  const sector = job.sector;

  return (
    <div style={{
      border: '1px solid #e3e8f7',
      borderRadius: 16,
      boxShadow: '0 2px 12px #e3e8f7',
      padding: 24,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minHeight: 320,
      maxWidth: 340,
      justifyContent: 'space-between',
      height: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {companyLogo ? (
          <img src={companyLogo} alt="logo" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', background: '#f5f5f5' }} />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#aaa' }}>🏢</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#1d3557' }}>{title}</div>
          <div style={{ color: '#888', fontWeight: 500 }}>{company}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '8px 0' }}>
        <span style={{ background: '#e3e8f7', borderRadius: 8, padding: '2px 10px', fontSize: 14 }}>{location}</span>
        {jobType && <span style={{ background: '#fce4ec', borderRadius: 8, padding: '2px 10px', fontSize: 14 }}>{jobType}</span>}
        {sector && <span style={{ background: '#e8f5e9', borderRadius: 8, padding: '2px 10px', fontSize: 14 }}>{sector}</span>}
      </div>
      <div style={{ color: '#333', fontSize: 15, margin: '8px 0', flex: 1 }}>
        {description.length > 120 ? description.slice(0, 120) + '…' : description}
      </div>
      {/* BOUTON CONSULTER */}
      <button
        style={{
          background: isSubscribed ? '#1890ff' : '#f5f5f5',
          color: isSubscribed ? '#fff' : '#aaa',
          border: 'none',
          borderRadius: 8,
          padding: '12px 0',
          fontWeight: 700,
          fontSize: 15,
          cursor: isSubscribed ? 'pointer' : 'not-allowed',
          width: '100%',
          minHeight: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
        onClick={() => {
          if (isSubscribed) {
            onViewDetails(job.id);
          } else {
            window.location.href = '/subscription';
          }
        }}
        aria-label={isSubscribed ? 'Consulter cette offre' : 'Abonnement requis pour consulter'}
      >
        {!isSubscribed && <LockIcon style={{ fontSize: 18, color: '#aaa' }} />}
        Consulter
      </button>
      {/* BOUTONS ADMIN/EMPLOYEUR */}
      {(isAdmin || (isEmployer && isOwner)) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            style={{ background: '#fff', color: '#52c41a', border: '1px solid #52c41a', borderRadius: 8, padding: '8px 12px', fontWeight: 600, fontSize: 15, cursor: 'pointer', flex: 1 }}
            onClick={onEdit ? () => onEdit(job.id) : undefined}
          >
            Modifier
          </button>
          <button
            style={{ background: '#fff', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: 8, padding: '8px 12px', fontWeight: 600, fontSize: 15, cursor: 'pointer', flex: 1 }}
            onClick={onDelete ? () => onDelete(job.id) : undefined}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard; 