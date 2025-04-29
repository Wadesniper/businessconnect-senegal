import React from 'react';
import { Layout, Row, Col, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ background: '#001529', padding: '40px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>BusinessConnect Sénégal</Title>
            <Text style={{ color: '#ffffff99' }}>
              Votre plateforme de mise en relation professionnelle au Sénégal
            </Text>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Services</Title>
            <Space direction="vertical">
              <Link to="/marketplace" style={{ color: '#ffffff99' }}>Marketplace</Link>
              <Link to="/forum" style={{ color: '#ffffff99' }}>Forum</Link>
              <Link to="/jobs" style={{ color: '#ffffff99' }}>Emplois</Link>
              <Link to="/formations" style={{ color: '#ffffff99' }}>Formations</Link>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Informations légales</Title>
            <Space direction="vertical">
              <Link to="/legal/mentions-legales" style={{ color: '#ffffff99' }}>Mentions légales</Link>
              <Link to="/legal/cgv" style={{ color: '#ffffff99' }}>CGV</Link>
              <Link to="/legal/cgu" style={{ color: '#ffffff99' }}>CGU</Link>
              <Link to="/legal/privacy" style={{ color: '#ffffff99' }}>Politique de confidentialité</Link>
              <Link to="/legal/cookies" style={{ color: '#ffffff99' }}>Politique des cookies</Link>
            </Space>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white' }}>Contact</Title>
            <Space direction="vertical">
              <Link to="/contact" style={{ color: '#ffffff99' }}>Nous contacter</Link>
              <Text style={{ color: '#ffffff99' }}>contact@businessconnectsenegal.com</Text>
              <Text style={{ color: '#ffffff99' }}>+221 XX XXX XX XX</Text>
              <Text style={{ color: '#ffffff99' }}>Dakar, Sénégal</Text>
            </Space>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: 40, borderTop: '1px solid #ffffff33', paddingTop: 20 }}>
          <Col>
            <Text style={{ color: '#ffffff99' }}>
              © {new Date().getFullYear()} BusinessConnect Sénégal. Tous droits réservés.
            </Text>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer; 