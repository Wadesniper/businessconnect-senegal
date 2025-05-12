import React from 'react';

interface JobCardProps {
  job: any;
  isSubscribed: boolean;
  onPostuler: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSubscribed, onPostuler }) => {
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
      minHeight: 220,
      height: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {job.companyLogo ? (
          <img src={job.companyLogo} alt="logo" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', background: '#f5f5f5' }} />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#aaa' }}>🏢</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#1d3557' }}>{job.title}</div>
          <div style={{ color: '#888', fontWeight: 500 }}>{job.company}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '8px 0' }}>
        <span style={{ background: '#e3e8f7', borderRadius: 8, padding: '2px 10px', fontSize: 14 }}>{job.location}</span>
        {job.type && <span style={{ background: '#fce4ec', borderRadius: 8, padding: '2px 10px', fontSize: 14 }}>{job.type}</span>}
        {job.sector && <span style={{ background: '#e8f5e9', borderRadius: 8, padding: '2px 10px', fontSize: 14 }}>{job.sector}</span>}
      </div>
      <div style={{ color: '#333', fontSize: 15, margin: '8px 0', flex: 1 }}>
        {job.description?.length > 120 ? job.description.slice(0, 120) + '…' : job.description}
      </div>
      <button
        style={{
          marginTop: 'auto',
          background: isSubscribed ? '#1890ff' : '#aaa',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 0',
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          transition: 'background 0.2s',
          width: '100%'
        }}
        onClick={() => onPostuler(job.id)}
        disabled={!isSubscribed}
        aria-label={isSubscribed ? 'Postuler à cette offre' : 'Abonnement requis pour postuler'}
      >
        {isSubscribed ? 'Postuler' : 'Abonnement requis'}
      </button>
    </div>
  );
};

export default JobCard; 