import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Select,
  Input,
  Form,
  Modal,
  Tag,
  Divider,
  Alert
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
  BookOutlined
} from '@ant-design/icons';
import { authService } from '../../services/authService';
import { subscriptionService } from '../../services/subscriptionService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface JobOffer {
  id: string;
  title: string;
  company?: string;
  location: string;
  type: string;
  sector: string;
  description: string;
  requirements: string[];
  contactEmail?: string;
  contactPhone?: string;
  keywords: string[];
  createdAt: string;
}

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  const sectors = [
    'Informatique',
    'Marketing',
    'Finance',
    'Ressources Humaines',
    'Santé',
    'Éducation',
    'Commerce',
    'Industrie'
  ];

  const contractTypes = [
    'CDI',
    'CDD',
    'Stage',
    'Alternance',
    'Freelance',
    'Temps partiel'
  ];

  const handleSearch = () => {
    // Implémenter la logique de recherche
  };

  const handleSubmitJob = async (values: any) => {
    try {
      // Implémenter la soumission de l'offre
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleApply = (job: JobOffer) => {
    setSelectedJob(job);
    // Rediriger vers la page de postulation
  };

  const handleViewDetails = (job: JobOffer) => {
    setSelectedJob(job);
    // Afficher les détails complets
  };

  return (
    <Layout style={{ padding: '24px' }}>
      {/* Bannières */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => navigate('/cv-builder')}
            style={{ background: '#f0f2f5' }}
          >
            <Space>
              <FileTextOutlined style={{ fontSize: '24px' }} />
              <div>
                <Title level={4}>Créer votre CV</Title>
                <Text>Créez un CV professionnel en quelques minutes</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            hoverable
            onClick={() => navigate('/formations')}
            style={{ background: '#f0f2f5' }}
          >
            <Space>
              <BookOutlined style={{ fontSize: '24px' }} />
              <div>
                <Title level={4}>Formations</Title>
                <Text>Développez vos compétences avec nos formations</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Filtres et recherche */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Secteur d'activité"
              onChange={setSelectedSector}
              allowClear
            >
              {sectors.map(sector => (
                <Option key={sector} value={sector}>{sector}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Type de contrat"
              onChange={setSelectedType}
              allowClear
            >
              {contractTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Input
              placeholder="Rechercher..."
              prefix={<SearchOutlined />}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Col>
        </Row>
      </Card>

      {/* Liste des offres */}
      <Row gutter={[24, 24]}>
        {jobOffers.map(job => (
          <Col span={24} key={job.id}>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>{job.title}</Title>
                {job.company && <Text strong>{job.company}</Text>}
                <Text>{job.location}</Text>
                <Space>
                  <Tag color="blue">{job.type}</Tag>
                  <Tag color="green">{job.sector}</Tag>
                </Space>
                <Text>{job.description.substring(0, 200)}...</Text>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => handleApply(job)}
                  >
                    Postuler
                  </Button>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => handleViewDetails(job)}
                  >
                    Voir détails
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de soumission d'offre */}
      <Modal
        title="Publier une offre d'emploi"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmitJob}>
          <Form.Item
            name="title"
            label="Titre du poste"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Nom de l'entreprise">
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Lieu"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type d'emploi"
            rules={[{ required: true }]}
          >
            <Select>
              {contractTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="sector"
            label="Secteur"
            rules={[{ required: true }]}
          >
            <Select>
              {sectors.map(sector => (
                <Option key={sector} value={sector}>{sector}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description du poste"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="requirements"
            label="Exigences / Qualifications"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="contactEmail" label="Email de contact">
            <Input />
          </Form.Item>
          <Form.Item name="contactPhone" label="Téléphone de contact">
            <Input />
          </Form.Item>
          <Form.Item
            name="keywords"
            label="Mots-clés"
            rules={[{ required: true }]}
          >
            <Select mode="tags" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Publier l'offre
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de détails de l'offre */}
      <Modal
        title="Détails de l'offre"
        visible={!!selectedJob}
        onCancel={() => setSelectedJob(null)}
        footer={null}
      >
        {selectedJob && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>{selectedJob.title}</Title>
            {selectedJob.company && <Text strong>{selectedJob.company}</Text>}
            <Text>{selectedJob.location}</Text>
            <Space>
              <Tag color="blue">{selectedJob.type}</Tag>
              <Tag color="green">{selectedJob.sector}</Tag>
            </Space>
            <Divider />
            <Title level={5}>Description</Title>
            <Text>{selectedJob.description}</Text>
            <Divider />
            <Title level={5}>Exigences</Title>
            <ul>
              {selectedJob.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            <Divider />
            <Title level={5}>Contact</Title>
            <Space>
              {selectedJob.contactEmail && (
                <Button
                  icon={<MailOutlined />}
                  onClick={() => window.location.href = `mailto:${selectedJob?.contactEmail}`}
                >
                  {selectedJob.contactEmail}
                </Button>
              )}
              {selectedJob.contactPhone && (
                <Button
                  icon={<PhoneOutlined />}
                  onClick={() => window.location.href = `tel:${selectedJob?.contactPhone}`}
                >
                  {selectedJob.contactPhone}
                </Button>
              )}
            </Space>
          </Space>
        )}
      </Modal>
    </Layout>
  );
};

export default JobsPage; 