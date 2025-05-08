import React from 'react';
import { Card, Typography, Button, Space, Avatar, Row, Col, Tag } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  EditOutlined
} from '@ant-design/icons';

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
  // Exemple de données statiques pour l'utilisateur
  const user = {
    fullName: 'Prénom Nom',
    email: 'utilisateur@email.com',
    avatar: '',
    company: { name: 'BusinessConnect Sénégal', role: 'Membre Premium' }
  };

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
                    onClick={() => window.location.href = item.path}
                  >
                  {item.title}
                  </Button>
                  <Paragraph style={{ textAlign: 'center', margin: 0 }}>{item.description}</Paragraph>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Placeholder pour les offres d'emploi */}
        <Col span={24}>
          <Card title="Offres d'emploi à venir" style={{ textAlign: 'center' }}>
            <Paragraph>
              Les offres d'emploi seront affichées ici dès qu'elles seront disponibles.<br />
              (Contactez l'administrateur pour ajouter vos offres)
            </Paragraph>
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