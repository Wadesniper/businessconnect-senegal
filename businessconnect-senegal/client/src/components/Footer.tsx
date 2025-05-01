import React from 'react';
import { Layout, Row, Col, Typography, Space, Button, Input, Form, message } from 'antd';
import { Link } from 'react-router-dom';
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  SendOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer: React.FC = () => {
  const onNewsletterSubmit = async (values: { email: string }) => {
    try {
      // TODO: Implémenter l'inscription à la newsletter
      message.success('Merci de votre inscription à notre newsletter !');
    } catch (error) {
      message.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <AntFooter style={{ background: '#001529', padding: '60px 0 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[32, 48]}>
          {/* À propos */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              BusinessConnect Sénégal
            </Title>
            <Paragraph style={{ color: '#ffffff99' }}>
              Votre plateforme de mise en relation professionnelle au Sénégal. 
              Nous connectons les talents aux opportunités pour construire l'avenir 
              du marché du travail sénégalais.
            </Paragraph>
            <Space size="large">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookOutlined style={{ color: '#ffffff99', fontSize: '24px' }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterOutlined style={{ color: '#ffffff99', fontSize: '24px' }} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedinOutlined style={{ color: '#ffffff99', fontSize: '24px' }} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramOutlined style={{ color: '#ffffff99', fontSize: '24px' }} />
              </a>
            </Space>
          </Col>

          {/* Services */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              Nos Services
            </Title>
            <Space direction="vertical" size="middle">
              <Link to="/jobs" style={{ color: '#ffffff99' }}>
                Offres d'emploi
              </Link>
              <Link to="/companies" style={{ color: '#ffffff99' }}>
                Entreprises
              </Link>
              <Link to="/marketplace" style={{ color: '#ffffff99' }}>
                Marketplace
              </Link>
              <Link to="/forum" style={{ color: '#ffffff99' }}>
                Forum
              </Link>
              <Link to="/formations" style={{ color: '#ffffff99' }}>
                Formations
              </Link>
              <Link to="/cv-generator" style={{ color: '#ffffff99' }}>
                Générateur de CV
              </Link>
            </Space>
          </Col>

          {/* Informations */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              Informations
            </Title>
            <Space direction="vertical" size="middle">
              <Link to="/about" style={{ color: '#ffffff99' }}>
                À propos de nous
              </Link>
              <Link to="/legal/mentions-legales" style={{ color: '#ffffff99' }}>
                Mentions légales
              </Link>
              <Link to="/legal/privacy" style={{ color: '#ffffff99' }}>
                Politique de confidentialité
              </Link>
              <Link to="/legal/cgu" style={{ color: '#ffffff99' }}>
                Conditions d'utilisation
              </Link>
              <Link to="/legal/cookies" style={{ color: '#ffffff99' }}>
                Politique des cookies
              </Link>
              <Link to="/faq" style={{ color: '#ffffff99' }}>
                FAQ
              </Link>
            </Space>
          </Col>

          {/* Contact et Newsletter */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              Restez informé
            </Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Text style={{ color: '#ffffff99' }}>
                <PhoneOutlined style={{ marginRight: 8 }} />
                +221 XX XXX XX XX
              </Text>
              <Text style={{ color: '#ffffff99' }}>
                <MailOutlined style={{ marginRight: 8 }} />
                contact@businessconnectsenegal.com
              </Text>
              <Text style={{ color: '#ffffff99' }}>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                Dakar, Sénégal
              </Text>
              <Form onFinish={onNewsletterSubmit} style={{ marginTop: 16 }}>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Veuillez entrer votre email' },
                    { type: 'email', message: 'Email invalide' }
                  ]}
                >
                  <Input.Search
                    placeholder="Votre email"
                    enterButton={
                      <Button 
                        type="primary" 
                        icon={<SendOutlined />}
                      >
                        S'inscrire
                      </Button>
                    }
                  />
                </Form.Item>
              </Form>
            </Space>
          </Col>
        </Row>

        {/* Copyright */}
        <Row justify="center" style={{ marginTop: 48, borderTop: '1px solid #ffffff33', paddingTop: 20 }}>
          <Col>
            <Text style={{ color: '#ffffff99' }}>
              © {currentYear} BusinessConnect Sénégal. Tous droits réservés.
            </Text>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer; 