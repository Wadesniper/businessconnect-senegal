import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';
import { User, Subscription } from '../types/user';
import { Card, Typography, Button, Space, Badge, Avatar, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  EditOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }

        setUser(currentUser);
        const userSubscription = await subscriptionService.getSubscription(currentUser.id);
        setSubscription(userSubscription);
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

  const quickAccessItems = [
    {
      title: 'Offres d\'emploi',
      icon: <FileTextOutlined />,
      path: '/jobs',
      description: 'Consultez les dernières offres d\'emploi'
    },
    {
      title: 'Marketplace',
      icon: <ShopOutlined />,
      path: '/marketplace',
      description: 'Accédez au marketplace'
    },
    {
      title: 'Forum',
      icon: <TeamOutlined />,
      path: '/forum',
      description: 'Participez aux discussions'
    },
    {
      title: 'Profil',
      icon: <EditOutlined />,
      path: '/profile',
      description: 'Modifiez votre profil'
    }
  ];

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Informations utilisateur */}
        <Col span={24}>
          <Card>
            <Space size="large">
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Title level={4}>{user.fullName}</Title>
                <Text type="secondary">{user.email}</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Statut de l'abonnement */}
        <Col span={24}>
          <Card title="Statut de l'abonnement">
            {subscription ? (
              <Space direction="vertical" size="large">
                <Badge
                  status={getSubscriptionStatusColor(subscription.status)}
                  text={`Statut: ${subscription.status}`}
                />
                <Text>Type: {subscription.type}</Text>
                <Text>
                  Valide jusqu'au: {new Date(subscription.endDate).toLocaleDateString()}
                </Text>
              </Space>
            ) : (
              <Text>Vous n'avez pas d'abonnement actif</Text>
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
                    {item.icon}
                    <Title level={5}>{item.title}</Title>
                    <Text type="secondary">{item.description}</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Actions rapides */}
        <Col span={24}>
          <Card title="Actions rapides">
            <Space>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => navigate('/profile/cv')}
              >
                Télécharger CV
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={() => navigate('/profile/edit')}
              >
                Modifier profil
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 