import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  MessageOutlined,
  ShopOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserManagement from './components/UserManagement';
import SubscriptionManagement from './components/SubscriptionManagement';
import JobManagement from './components/JobManagement';
import ForumModeration from './components/ForumModeration';
import MarketplaceModeration from './components/MarketplaceModeration';
import Statistics from './components/Statistics';

const { Content, Sider } = Layout;

const AdminPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Utilisateurs',
      onClick: () => navigate('/admin/users'),
    },
    {
      key: 'subscriptions',
      icon: <CreditCardOutlined />,
      label: 'Abonnements',
      onClick: () => navigate('/admin/subscriptions'),
    },
    {
      key: 'jobs',
      icon: <ShoppingOutlined />,
      label: 'Offres d\'emploi',
      onClick: () => navigate('/admin/jobs'),
    },
    {
      key: 'forum',
      icon: <MessageOutlined />,
      label: 'Forum',
      onClick: () => navigate('/admin/forum'),
    },
    {
      key: 'marketplace',
      icon: <ShopOutlined />,
      label: 'Marketplace',
      onClick: () => navigate('/admin/marketplace'),
    },
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: 'Statistiques',
      onClick: () => navigate('/admin/statistics'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={['users']}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Routes>
              <Route path="/users" element={<UserManagement />} />
              <Route path="/subscriptions" element={<SubscriptionManagement />} />
              <Route path="/jobs" element={<JobManagement />} />
              <Route path="/forum" element={<ForumModeration />} />
              <Route path="/marketplace" element={<MarketplaceModeration />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/" element={<Statistics />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage; 