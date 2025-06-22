import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Typography, Spin, Button, Input, Modal, message } from 'antd';
import JobAdviceBanner from './components/JobAdviceBanner';
import RedirectBanners from './components/RedirectBanners';
import JobFilters from './components/JobFilters';
import JobCard from './components/JobCard';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { hasPremiumAccess } from '../../utils/premiumAccess';
import type { JobData, JobType } from '../../types/job';
import { useNavigate } from 'react-router-dom';
import { JobService } from '../../services/jobService';
import { useDebounce } from '../../hooks/useDebounce';

const { Content } = Layout;
const { Title, Text } = Typography;
const { confirm } = Modal;

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [sectors, setSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<JobType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setIsLoading(true);
    JobService.getJobs(1, 20, debouncedSearchQuery, selectedSector, selectedType, selectedLocation)
      .then(response => {
        setJobs(response.jobs || []);
        setTotalJobs(response.total || 0);
        if (sectors.length === 0) {
          const uniqueSectors = Array.from(new Set((response.jobs || []).map((j: any) => j.sector).filter(Boolean)));
          setSectors(uniqueSectors);
        }
      })
      .catch(() => setError("Erreur lors du chargement des offres d'emploi"))
      .finally(() => setIsLoading(false));
  }, [debouncedSearchQuery, selectedSector, selectedType, selectedLocation]);

  const sortedJobs = React.useMemo(() => {
    return [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs]);

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

  const handlePublish = () => navigate('/jobs/publish');

  if (isLoading && jobs.length === 0) {
    return <div style={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>;
  }

  return (
    <Content style={{ padding: '24px' }}>
      <JobAdviceBanner />
      <RedirectBanners />
      <div style={{ marginBottom: 16 }}>
        <JobFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sectors={sectors}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          salaryRange={[0,0]}
          onSalaryRangeChange={() => {}}
          experienceLevel={null}
          onExperienceLevelChange={() => {}}
          workLocation={null}
          onWorkLocationChange={() => {}}
          renderAction={
            (user?.role === 'admin' || user?.role === 'employeur') ? (
              <Button type="primary" style={{ marginLeft: 16 }} onClick={handlePublish}>
                Publier une offre
              </Button>
            ) : null
          }
        />
      </div>
      {error ? (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <Title level={4}>{error}</Title>
          <Text type="secondary">Essayez de rafraîchir la page.</Text>
        </div>
      ) : (
        <>
          <Text style={{ marginBottom: 16, display: 'block' }}>
            {totalJobs} offre{totalJobs > 1 ? 's' : ''} trouvée{totalJobs > 1 ? 's' : ''}
          </Text>
          <Row gutter={[24, 24]}>
            {sortedJobs.length > 0 ? (
              sortedJobs.map((job) => (
                <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                  <JobCard
                    job={job as JobData}
                    isPremium={isPremium}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Col>
              ))
            ) : (
              <Col span={24} style={{ textAlign: 'center', padding: '32px 0' }}>
                <Title level={4}>Aucune offre ne correspond à vos critères.</Title>
                <Text type="secondary">Essayez de modifier vos filtres.</Text>
              </Col>
            )}
          </Row>
        </>
      )}
    </Content>
  );
};

export default JobsPage; 