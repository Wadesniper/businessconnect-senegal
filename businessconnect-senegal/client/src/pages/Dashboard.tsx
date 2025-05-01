import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Badge, 
  Avatar, 
  Row, 
  Col, 
  Statistic, 
  Progress,
  List,
  Tag,
  Alert,
  Skeleton
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  EditOutlined,
  DownloadOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';
import { jobService } from '../services/jobService';
import { User, Subscription } from '../types/user';
import { JobApplication } from '../types/job';

const { Title, Text, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    viewedProfile: 0,
    savedJobs: 0,
    applications: 0,
    interviews: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        setUser(currentUser);
        const [userSubscription, userApplications] = await Promise.all([
          subscriptionService.getSubscription(currentUser.id),
          jobService.getUserApplications(currentUser.id)
        ]);
        
        setSubscription(userSubscription);
        setApplications(userApplications);
        
        // TODO: Remplacer par de vraies données
        setStats({
          viewedProfile: 45,
          savedJobs: 12,
          applications: userApplications.length,
          interviews: 3
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'processing';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const quickAccessItems = [
    {
      title: 'Offres d\'emploi',
      icon: <FileTextOutlined />,
      path: '/jobs',
      description: 'Consultez les dernières offres d\'emploi',
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

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          </Col>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              {[1, 2, 3, 4].map(i => (
                <Col xs={24} sm={12} md={6} key={i}>
                  <Card>
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const daysUntilExpiration = subscription?.endDate 
    ? Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : 0;

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
                <Title level={4} style={{ margin: 0 }}>{user.fullName}</Title>
                <Text type="secondary">{user.email}</Text>
                {user.company && (
                  <div style={{ marginTop: 8 }}>
                    <Tag color="blue">{user.company.name}</Tag>
                    <Tag color="cyan">{user.company.role}</Tag>
          </div>
                )}
              </Col>
              <Col>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => navigate('/profile/edit')}
                  >
                    Modifier profil
                  </Button>
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={() => navigate('/cv-generator')}
                  >
                    Voir mon CV
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Statistiques */}
        <Col xs={24} lg={16}>
          <Card title="Aperçu de votre activité">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic 
                  title="Vues du profil" 
                  value={stats.viewedProfile}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic 
                  title="Offres sauvegardées" 
                  value={stats.savedJobs}
                  prefix={<FileTextOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic 
                  title="Candidatures" 
                  value={stats.applications}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic 
                  title="Entretiens" 
                  value={stats.interviews}
                  prefix={<TrophyOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Statut de l'abonnement */}
        <Col xs={24} lg={8}>
          <Card 
            title="Statut de l'abonnement"
            extra={
              <Button type="link" onClick={() => navigate('/subscription')}>
                Gérer
              </Button>
            }
          >
            {subscription ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Badge
                  status={getSubscriptionStatusColor(subscription.status)}
                  text={`Statut: ${subscription.status}`}
                />
                <Text>Type: {subscription.type}</Text>
                <Progress
                  percent={Math.max(0, Math.min(100, (daysUntilExpiration / 30) * 100))}
                  status={daysUntilExpiration < 7 ? "exception" : "active"}
                  format={() => `${daysUntilExpiration} jours restants`}
                />
                {daysUntilExpiration < 7 && (
                  <Alert
                    message="Abonnement bientôt expiré"
                    description="Renouvelez votre abonnement pour continuer à profiter de tous les avantages."
                    type="warning"
                    showIcon
                  />
                )}
              </Space>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>Vous n'avez pas d'abonnement actif</Text>
                <Button 
                  type="primary" 
                  onClick={() => navigate('/pricing')}
                >
                  Voir les offres
                </Button>
              </Space>
            )}
          </Card>
        </Col>

      {/* Accès rapide */}
        <Col span={24}>
          <Title level={4}>Accès rapide</Title>
          <Row gutter={[16, 16]}>
            {quickAccessItems.map((item) => (
              <Col xs={24} sm={12} md={6} key={item.path}>
                <Card
                  hoverable
                  onClick={() => navigate(item.path)}
                  style={{ height: '100%' }}
                >
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <div style={{ 
                      fontSize: '24px', 
                      color: item.color,
                      backgroundColor: `${item.color}15`,
                      padding: '16px',
                      borderRadius: '50%'
                    }}>
                {item.icon}
              </div>
                    <Title level={5} style={{ margin: '12px 0', textAlign: 'center' }}>
                  {item.title}
                    </Title>
                    <Text type="secondary" style={{ textAlign: 'center' }}>
                  {item.description}
                    </Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Candidatures récentes */}
        <Col span={24}>
          <Card 
            title="Candidatures récentes"
            extra={
              <Button type="link" onClick={() => navigate('/applications')}>
                Voir tout
              </Button>
            }
          >
            <List
              dataSource={applications.slice(0, 5)}
              renderItem={application => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      onClick={() => navigate(`/jobs/${application.jobId}`)}
                    >
                      Voir l'offre
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={application.jobTitle}
                    description={application.company}
                  />
                  <Badge 
                    status={getApplicationStatusColor(application.status)} 
                    text={application.status}
                  />
                </List.Item>
              )}
              locale={{
                emptyText: 'Aucune candidature récente'
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 