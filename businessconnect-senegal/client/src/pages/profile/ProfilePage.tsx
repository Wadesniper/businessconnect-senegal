import React from 'react';
import { Card, Avatar, Typography, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Title, Paragraph } = Typography;

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div style={{ textAlign: 'center', marginTop: '10vh' }}>Veuillez vous connecter pour accéder à votre profil.</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card style={{ width: 400, boxShadow: '0 2px 8px #f0f1f2' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar size={80} icon={<UserOutlined />} src={user.avatar} style={{ marginBottom: 16 }} />
          <Title level={3}>{user.fullName || user.firstName + ' ' + user.lastName}</Title>
          <Paragraph type="secondary">{user.email || user.phoneNumber}</Paragraph>
          <Paragraph>Rôle : <b>{user.role}</b></Paragraph>
          <Button type="primary" danger onClick={logout} style={{ marginTop: 16 }}>
            Déconnexion
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage; 