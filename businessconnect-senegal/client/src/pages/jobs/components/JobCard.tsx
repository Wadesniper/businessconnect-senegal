import React from 'react';

interface JobCardProps {
  job: any;
  isSubscribed: boolean;
  onPostuler: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSubscribed, onPostuler }) => {
  return (
    <div>
      JobCard (à compléter)
      <button onClick={() => onPostuler(job.id)}>Postuler</button>
    </div>
  );
};

export default JobCard; 