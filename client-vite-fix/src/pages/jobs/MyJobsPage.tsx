import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Typography, Spin, Button, Modal, message } from 'antd';
import JobCard from './components/JobCard';
import { useAuth } from '../../context/AuthContext';
import { JobService } from '../../services/jobService';
import { useNavigate } from 'react-router-dom';
import type { JobData } from '../../types/job';

const { Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;

const MyJobsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    JobService.getMyJobs()
      .then((data) => setJobs(data || []))
      .catch(() => setError("Erreur lors du chargement de vos offres."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleEdit = (jobId: string) => navigate(`/jobs/edit/${jobId}`);
  const handleDelete = (jobId: string) => {
    confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cette offre ?',
      content: 'Cette action est irréversible.',
      okText: 'Oui, supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: async () => {
        try {
          await JobService.deleteJob(jobId);
          setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
          message.success('Offre supprimée avec succès !');
        } catch (error) {
          message.error('Erreur lors de la suppression de l\'offre.');
        }
      },
    });
  };

  if (!user || (user.role !== 'admin' && user.role !== 'recruteur')) {
    return <Content style={{ padding: '24px' }}><Title level={4}>Accès réservé aux recruteurs et admins.</Title></Content>;
  }

  if (isLoading) {
    return <div style={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>;
  }

  return (
    <Content style={{ padding: '24px' }}>
      <Title level={3} style={{ marginBottom: 24, marginTop: 40, paddingTop: 16 }}>Mes offres publiées</Title>
      {/* Debug temporaire */}
      <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>
        Utilisateur connecté : {user?.id} | Offres récupérées : {jobs.length}
      </div>
      {error ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <Title level={4}>{error}</Title>
          <Text type="secondary">Essayez de rafraîchir la page.</Text>
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <Title level={4}>Aucune offre publiée pour le moment.</Title>
          <Button type="primary" onClick={() => navigate('/jobs/publish')}>Publier une offre</Button>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {jobs.map((job) => (
            <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
              <JobCard
                job={job}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isPremium={true}
              />
            </Col>
          ))}
        </Row>
      )}
    </Content>
  );
};

export default MyJobsPage; 