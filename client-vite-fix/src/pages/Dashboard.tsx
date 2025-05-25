import React from 'react';
import { Card, Typography, Button, Space, Avatar, Row, Col, Tag } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { JobService } from '../services/jobService';
import { useNavigate } from 'react-router-dom';
import type { Job } from '../types/job';

const { Title, Text, Paragraph } = Typography;

const quickAccessItems = [
  {
    title: "Offres d'emploi",
    icon: <FileTextOutlined />,
    path: '/jobs',
    description: "Consultez les dernières offres d'emploi",
    color: '#1890ff'
  },
  {
    title: 'Marketplace',
    icon: <ShopOutlined />,
    path: '/marketplace',
    description: 'Accédez au marketplace',
    color: '#52c41a'
  },
  {
    title: 'Forum',
    icon: <TeamOutlined />,
    path: '/forum',
    description: 'Participez aux discussions',
    color: '#722ed1'
  },
  {
    title: 'CV',
    icon: <EditOutlined />,
    path: '/cv-generator',
    description: 'Créez ou modifiez votre CV',
    color: '#fa8c16'
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    JobService.getJobs().then(jobs => {
      setJobs(jobs || []);
      setLoading(false);
    });
  }, []);

  if (!user) return null;

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Informations utilisateur */}
        <Col span={24}>
          <Card>
            <Row gutter={24} align="middle">
              <Col>
                <Avatar size={80} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
              </Col>
              <Col flex="1">
                <Title level={4} style={{ margin: 0 }}>{user.fullName || `${user.firstName} ${user.lastName}` || user.email}</Title>
                <Text type="secondary">{user.email}</Text>
                {user.subscription && user.subscription.status === 'active' && (
                  <Tag color="cyan">Membre Premium</Tag>
                )}
                <div style={{ marginTop: 8 }}>
                  <Button type="default" onClick={() => navigate('/profile')} icon={<UserOutlined />}>Modifier mon profil</Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Accès rapides */}
        <Col span={24}>
          <Card title="Accès rapides">
            <Row gutter={[16, 16]}>
              {quickAccessItems.map(item => (
                <Col xs={24} sm={12} md={6} key={item.title}>
                  <Button
                    type="primary"
                    icon={item.icon}
                    block
                    size="large"
                    style={{ background: item.color, border: 'none', marginBottom: 8 }}
                    onClick={() => navigate(item.path)}
                  >
                    {item.title}
                  </Button>
                  <Paragraph style={{ textAlign: 'center', margin: 0 }}>{item.description}</Paragraph>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Offres d'emploi */}
        <Col span={24}>
          <Card title="Dernières offres d'emploi" style={{ textAlign: 'center' }}>
            {loading ? (
              <Paragraph>Chargement des offres...</Paragraph>
            ) : jobs.length === 0 ? (
              <Paragraph>Aucune offre d'emploi disponible pour le moment.</Paragraph>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                {jobs.slice(0, 3).map((job: any) => (
                  <Card key={job.id} type="inner" title={job.title} extra={<Button type="link" onClick={() => navigate(`/jobs/${job.id}`)}>Voir</Button>}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Text strong>{job.company}</Text>
                      <Text type="secondary">{job.location}</Text>
                      <Text>{job.sector}</Text>
                    </div>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        {/* Statistiques ou autres sections premium (placeholders) */}
        <Col span={24}>
          <Card title="Statistiques personnelles" style={{ textAlign: 'center' }}>
            <Paragraph>
              Cette section affichera vos statistiques d'utilisation dès qu'elles seront disponibles.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 