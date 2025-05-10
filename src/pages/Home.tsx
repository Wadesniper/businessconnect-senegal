import React from 'react';
import { Layout, Typography } from 'antd';
import Hero from '../components/Hero';

const { Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <Content style={{ padding: '24px', minHeight: '80vh' }}>
        <Title level={2} style={{ textAlign: 'center', margin: '40px 0' }}>
          Bienvenue sur BusinessConnect Sénégal
        </Title>
        {/* Autres sections de la page d'accueil ici */}
      </Content>
    </Layout>
  );
};

export default Home; 