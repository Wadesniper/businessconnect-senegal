import React from 'react';
import { Card, Typography, Button, Space, Avatar, Row, Col, Tag, Spin } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  EditOutlined,
  LogoutOutlined,
  CrownOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { JobService } from '../services/jobService';
import { useNavigate } from 'react-router-dom';
import type { Job } from '../types/job';

const { Title, Text, Paragraph } = Typography;

const quickAccessItems = [
  {
    title: "Emplois",
    icon: <FileTextOutlined />,
    path: '/jobs',
    description: "Consultez les dernières offres d'emploi",
    color: '#1890ff'
  },
  {
    title: 'Fiches métiers',
    icon: <CrownOutlined />,
    path: '/careers',
    description: 'Découvrez les métiers et secteurs',
    color: '#722ed1'
  },
  {
    title: 'Formations',
    icon: <BookOutlined />,
    path: '/formations',
    description: 'Développez vos compétences',
    color: '#fa8c16'
  },
  {
    title: 'CV',
    icon: <EditOutlined />,
    path: '/cv-generator',
    description: 'Créez ou modifiez votre CV',
    color: '#52c41a'
  },
  {
    title: 'Marketplace',
    icon: <ShopOutlined />,
    path: '/marketplace',
    description: 'Accédez au marketplace',
    color: '#40a9ff'
  }
];

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
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

  if (loading) {
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement du tableau de bord..." /></div>;
  }

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
                <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                  <Button type="default" onClick={() => navigate('/profile')} icon={<UserOutlined />}>Modifier mon profil</Button>
                  <Button type="primary" danger icon={<LogoutOutlined />} onClick={logout}>Déconnexion</Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        {/* Accès rapides avec animation dynamique */}
        <Col span={24}>
          <Card title="Accès rapides">
            <Row gutter={[16, 16]}>
              {quickAccessItems.map((item, idx) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.title}>
                  <div style={{
                    animation: `fadeInUp 0.7s ${0.1 + idx * 0.12}s both`,
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 18,
                    boxShadow: '0 2px 12px #e3e8f7',
                    background: '#f7faff',
                    cursor: 'pointer',
                    padding: 18,
                    marginBottom: 8,
                    transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s',
                  }}
                    className="dashboard-quick-access-card"
                    onClick={() => navigate(item.path)}
                  >
                    <span style={{ fontSize: 32, color: item.color, marginBottom: 8 }}>{item.icon}</span>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{item.title}</div>
                    <Paragraph style={{ textAlign: 'center', margin: 0, color: '#555', fontSize: 15 }}>{item.description}</Paragraph>
                  </div>
                </Col>
              ))}
            </Row>
            <style>{`
              @keyframes fadeInUp {
                0% { opacity: 0; transform: translateY(30px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              .dashboard-quick-access-card:hover {
                box-shadow: 0 8px 32px #b3d0f7, 0 2px 12px #e3e8f7;
                transform: translateY(-4px) scale(1.03);
                background: #eaf3ff;
              }
            `}</style>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 