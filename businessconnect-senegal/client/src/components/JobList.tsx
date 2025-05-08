import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Space, Input, Select, message, Modal, Typography, Divider } from 'antd';
import { SearchOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { JobService } from '../services/jobService';
import { authService } from '../services/authService';
import { Job } from '../types/job';

const { Search } = Input;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const sectors = [
  'Informatique',
  'Marketing',
  'Finance',
  'Ressources Humaines',
  'Communication',
  'Santé',
  'Éducation'
];

const contractTypes = [
  'CDI',
  'CDD',
  'Stage',
  'Alternance',
  'Freelance'
];

export const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>();
  const [searchText, setSearchText] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [selectedSector, selectedType, searchText]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobs = await JobService.getJobs();
      setJobs(jobs as Job[]);
    } catch (error) {
      message.error('Erreur lors de la récupération des offres');
    }
    setLoading(false);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleApply = async (jobId: string) => {
    const user = authService.getCurrentUser();
    if (!user) {
      message.error('Veuillez vous connecter pour postuler');
      return;
    }

    // TODO: Implémenter la logique de téléchargement du CV
    message.info('Fonctionnalité de candidature à venir');
  };

  return (
    <div className="job-list">
      <div className="filters" style={{ marginBottom: 20 }}>
        <Space>
          <Select
            placeholder="Secteur"
            style={{ width: 200 }}
            onChange={setSelectedSector}
            allowClear
          >
            {sectors.map(sector => (
              <Option key={sector} value={sector}>{sector}</Option>
            ))}
          </Select>
          <Select
            placeholder="Type de contrat"
            style={{ width: 200 }}
            onChange={setSelectedType}
            allowClear
          >
            {contractTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          <Search
            placeholder="Rechercher une offre"
            onSearch={setSearchText}
            style={{ width: 300 }}
          />
        </Space>
      </div>

      <div className="jobs-grid">
        {jobs.map(job => (
          <Card
            key={job.id}
            title={job.title}
            extra={job.company && <Tag color="blue">{job.company}</Tag>}
            style={{ marginBottom: 16 }}
          >
            <p><strong>Lieu:</strong> {job.location}</p>
            <p><strong>Type:</strong> <Tag>{job.jobType}</Tag></p>
            <p><strong>Secteur:</strong> <Tag color="green">{job.sector}</Tag></p>
            <p>{job.description.substring(0, 150)}...</p>
            <div style={{ marginTop: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetails(job)}
                >
                  Voir détails
                </Button>
                <Button
                  icon={<SendOutlined />}
                  onClick={() => handleApply(job.id)}
                >
                  Postuler
                </Button>
              </Space>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title="Détails de l'offre"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Fermer
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => handleApply(selectedJob!.id)}
          >
            Postuler
          </Button>
        ]}
      >
        {selectedJob && (
          <div>
            <Title level={4}>{selectedJob.title}</Title>
            <Paragraph>
              <strong>Entreprise:</strong> {selectedJob.company}
            </Paragraph>
            <Paragraph>
              <strong>Lieu:</strong> {selectedJob.location}
            </Paragraph>
            <Paragraph>
              <strong>Type:</strong> {selectedJob.jobType}
            </Paragraph>
            <Title level={5}>Description</Title>
            <Paragraph>{selectedJob.description}</Paragraph>
            <Title level={5}>Prérequis</Title>
            <ul>
              {selectedJob.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}; 