import React, { useEffect, useState } from 'react';
import { Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { JobService } from '../services/jobService';

const NotificationBell: React.FC = () => {
  const [newJobsCount, setNewJobsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewJobs = async () => {
      const lastVisit = localStorage.getItem('lastJobsVisit');
      const jobsResponse = await JobService.getJobs(1, 100); // Appel direct à la méthode statique
      if (!jobsResponse.jobs) return;
      let count = 0;
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        count = jobsResponse.jobs.filter((job: any) => new Date(job.createdAt) > lastDate).length;
      } else {
        count = jobsResponse.jobs.length;
      }
      setNewJobsCount(count);
    };
    fetchNewJobs();
  }, []);

  const handleClick = () => {
    localStorage.setItem('lastJobsVisit', new Date().toISOString());
    setNewJobsCount(0);
    navigate('/jobs');
  };

  return (
    <Badge count={newJobsCount} size="small" offset={[-2, 2]}>
      <span style={{ cursor: 'pointer', fontSize: 22, color: '#1890ff', marginRight: 18 }} onClick={handleClick} title="Nouvelles offres d'emploi">
        <BellOutlined />
      </span>
    </Badge>
  );
};

export default NotificationBell; 