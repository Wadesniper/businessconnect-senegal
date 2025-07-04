import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Space, Avatar, Row, Col, Tag, Spin, List, message, Modal, notification } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  EditOutlined,
  LogoutOutlined,
  CrownOutlined,
  BookOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { JobService } from '../services/jobService';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import type { JobData } from '../types/job';
import { paymentService } from '../services/paymentService';
import GlobalFetchError from '../components/GlobalFetchError';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

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
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [myJobs, setMyJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingPage(true);
    const timer = setTimeout(() => setLoadingPage(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const paymentToken = searchParams.get('token') || searchParams.get('transaction_id');
      if (paymentToken) {
        try {
          const response = await paymentService.verifyPayment({ token: paymentToken });
          if (response.success) {
            await refreshAuth();
          } else {
            console.error('La vérification du paiement a échoué:', response.message);
          }
        } catch (error: any) {
          console.error('Erreur lors de la vérification du paiement:', error.message);
        } finally {
          // Nettoyer l'URL pour éviter de relancer la vérification
          searchParams.delete('token');
          searchParams.delete('transaction_id');
          setSearchParams(searchParams, { replace: true });
        }
      }
    };

    checkPaymentStatus();
  }, []); // Exécuté une seule fois

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        JobService.getJobs().then(response => {
          setJobs(response.jobs || []);
        });

        if (user?.role === 'employeur') {
          JobService.getMyJobs().then(jobs => {
            setMyJobs(jobs || []);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        setFetchError('Erreur réseau ou serveur.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (jobId: string) => {
    confirm({
      title: 'Êtes-vous sûr ?',
      content: 'Cette action est irréversible.',
      okText: 'Oui, supprimer',
      okType: 'danger',
      onOk: async () => {
        try {
          await JobService.deleteJob(jobId);
          setMyJobs(prev => prev.filter(j => j.id !== jobId));
          message.success('Offre supprimée.');
        } catch {
          message.error('Erreur lors de la suppression.');
        }
      }
    });
  };

  if (loadingPage) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 24, fontSize: 18, color: '#1890ff' }}>Chargement du tableau de bord...</div>
      </div>
    );
  }

  if (!user) return null;

  if (loading) {
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement du tableau de bord..." /></div>;
  }

  if (fetchError) {
    return <GlobalFetchError onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Informations utilisateur */}
        <Col span={24}>
          <Card>
            <Row gutter={24} align="middle">
              <Col>
                <Avatar size={80} icon={<UserOutlined />} />
              </Col>
              <Col flex="1">
                <Title level={4} style={{ margin: 0 }}>{`${user.firstName} ${user.lastName}`}</Title>
                <Text type="secondary">{user.email}</Text>
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
        {/* Section Employeur */}
        {user.role === 'employeur' && (
          <Col span={24}>
            <Card title="Mes offres publiées">
              <Button type="primary" onClick={() => navigate('/jobs/publish')} style={{marginBottom: 16}}>
                Publier une nouvelle offre
              </Button>
              <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={myJobs}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => navigate(`/jobs/edit/${item.id}`)}>Modifier</Button>,
                      <Button type="link" danger onClick={() => handleDelete(item.id)}>Supprimer</Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<a onClick={() => navigate(`/jobs/${item.id}`)}>{item.title}</a>}
                      description={`${item.location} - ${item.type}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}
        {/* Section Admin */}
        {user.role === 'admin' && (
          <Col span={24}>
            <Card title="Administration" style={{ borderColor: '#ff4d4f', borderWidth: 2 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <div style={{
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    borderRadius: 18,
                    boxShadow: '0 2px 12px #ffe7e7',
                    background: '#fff2f0',
                    cursor: 'pointer',
                    padding: 18,
                    marginBottom: 8,
                    transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s',
                  }}
                    className="dashboard-quick-access-card"
                    onClick={() => navigate('/admin/marketplace/moderation')}
                  >
                    <span style={{ fontSize: 32, color: '#ff4d4f', marginBottom: 8 }}>
                      <AppstoreOutlined />
                    </span>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Modération Marketplace</div>
                    <Paragraph style={{ textAlign: 'center', margin: 0, color: '#555', fontSize: 15 }}>
                      Modérer les annonces et gérer le contenu
                    </Paragraph>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Dashboard; 