import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Rate, Tag } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Hero from '../components/Hero';
import {
  TeamOutlined,
  ShoppingOutlined,
  BookOutlined,
  BulbOutlined,
  ArrowRightOutlined,
  UserOutlined,
  BuildOutlined,
  SearchOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface StyledSectionProps {
  $background?: string;
}

const StyledSection = styled.section<StyledSectionProps>`
  padding: 80px 0;
  background: ${props => props.$background || 'white'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const StyledIcon = styled.div`
  font-size: 36px;
  color: #1890ff;
  margin-bottom: 20px;
`;

const TestimonialCard = styled(Card)`
  text-align: center;
  height: 100%;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const PremiumFeatureCard = styled(Card)`
  height: 100%;
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border-color: #1890ff;
  }
`;

const GradientTitle = styled(Title)`
  background: linear-gradient(120deg, #1890ff, #003366);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const features = [
  {
    icon: <TeamOutlined />,
    title: 'Recrutement',
    description: 'Trouvez les meilleurs talents ou l\'emploi de vos rêves dans divers secteurs d\'activité.',
    isPremium: false
  },
  {
    icon: <ShoppingOutlined />,
    title: 'Marketplace B2B',
    description: 'Connectez-vous avec des entreprises et développez votre réseau professionnel.',
    isPremium: false
  },
  {
    icon: <BookOutlined />,
    title: 'Fiches Métiers',
    description: 'Accédez à notre base de données complète de fiches métiers détaillées.',
    isPremium: true
  },
  {
    icon: <BulbOutlined />,
    title: 'Innovation',
    description: 'Découvrez les dernières tendances et innovations dans votre secteur.',
    isPremium: false
  }
];

const premiumFeatures = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Fiches Métiers Détaillées',
    description: 'Accédez à plus de 200 fiches métiers avec salaires, compétences requises et perspectives d\'évolution.'
  },
  {
    icon: <RocketOutlined />,
    title: 'Candidature Prioritaire',
    description: 'Vos candidatures sont mises en avant auprès des recruteurs premium.'
  },
  {
    icon: <CrownOutlined />,
    title: 'Accompagnement Personnalisé',
    description: 'Bénéficiez d\'un suivi personnalisé et de conseils d\'experts pour votre carrière.'
  }
];

const testimonials = [
  {
    avatar: '/images/testimonials/student-profile.jpg',
    name: 'Aminata Diallo',
    role: 'Étudiante en fin de cycle',
    rating: 5,
    text: 'Grâce à BusinessConnect, j\'ai trouvé mon premier emploi dans l\'informatique ! La plateforme m\'a permis de mettre en valeur mes compétences et d\'entrer en contact avec des entreprises de premier plan.'
  },
  {
    avatar: '/images/testimonials/job-seeker-profile.jpg',
    name: 'Fatima Ndiaye',
    role: 'Chercheuse d\'emploi en Finance',
    rating: 5,
    text: 'BusinessConnect m\'a permis de me reconvertir professionnellement. Les formations disponibles et les opportunités d\'emploi sont parfaitement adaptées au marché sénégalais.'
  },
  {
    avatar: '/images/testimonials/recruiter-profile.jpg',
    name: 'Omar Sow',
    role: 'Directeur des Ressources Humaines',
    rating: 5,
    text: 'En tant que recruteur, BusinessConnect nous permet d\'identifier rapidement les meilleurs talents. L\'interface est intuitive et les candidats sont de grande qualité.'
  },
  {
    avatar: '/images/testimonials/entrepreneur-profile.jpg',
    name: 'Ibrahima Ndiaye',
    role: 'Entrepreneur Tech',
    rating: 5,
    text: 'La marketplace B2B de BusinessConnect a transformé notre façon de faire des affaires. Nous avons développé notre réseau professionnel et trouvé de nouveaux partenaires commerciaux.'
  }
];

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      
      <Content>
        {/* Section Caractéristiques */}
        <StyledSection>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <GradientTitle level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
                Pourquoi choisir BusinessConnect Sénégal ?
              </GradientTitle>
              
              <Row gutter={[32, 32]}>
                {features.map((feature, index) => (
                  <Col xs={24} sm={12} lg={6} key={index}>
                    <FeatureCard bordered={false}>
                      <StyledIcon>{feature.icon}</StyledIcon>
                      <Title level={4}>
                        {feature.title}
                        {feature.isPremium && (
                          <Tag color="gold" style={{ marginLeft: 8 }}>
                            <CrownOutlined /> Premium
                          </Tag>
                        )}
                      </Title>
                      <Paragraph>{feature.description}</Paragraph>
                    </FeatureCard>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Container>
        </StyledSection>

        {/* Section Premium */}
        <StyledSection $background="linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%)">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Row justify="center" style={{ marginBottom: 60 }}>
                <Col xs={24} md={16} style={{ textAlign: 'center' }}>
                  <Space direction="vertical" size="large">
                    <CrownOutlined style={{ fontSize: 48, color: '#ffd700' }} />
                    <GradientTitle level={2}>Fonctionnalités Premium</GradientTitle>
                    <Paragraph style={{ fontSize: '18px' }}>
                      Débloquez tout le potentiel de BusinessConnect avec notre abonnement Premium
                    </Paragraph>
                  </Space>
                </Col>
              </Row>
              
              <Row gutter={[32, 32]}>
                {premiumFeatures.map((feature, index) => (
                  <Col xs={24} md={8} key={index}>
                    <PremiumFeatureCard bordered={false}>
                      <Space direction="vertical" size="large">
                        <StyledIcon style={{ color: '#ffd700' }}>{feature.icon}</StyledIcon>
                        <Title level={4}>{feature.title}</Title>
                        <Paragraph>{feature.description}</Paragraph>
                      </Space>
                    </PremiumFeatureCard>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Container>
        </StyledSection>

        {/* Section Statistiques */}
        <StyledSection $background="#f0f2f5">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Row gutter={[32, 32]} justify="center">
                <Col xs={24} sm={8}>
                  <Card bordered={false} style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#1890ff' }}>5000+</Title>
                    <Paragraph>Professionnels inscrits</Paragraph>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card bordered={false} style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#1890ff' }}>1000+</Title>
                    <Paragraph>Entreprises partenaires</Paragraph>
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card bordered={false} style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#1890ff' }}>500+</Title>
                    <Paragraph>Formations disponibles</Paragraph>
                  </Card>
                </Col>
              </Row>
            </motion.div>
          </Container>
        </StyledSection>

        {/* Section Témoignages */}
        <StyledSection>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
                Ils nous font confiance
              </Title>
              
              <Row gutter={[32, 32]}>
                {testimonials.map((testimonial, index) => (
                  <Col xs={24} sm={12} md={6} key={index}>
                    <TestimonialCard bordered={false}>
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Avatar
                          src={testimonial.avatar}
                          size={100}
                          icon={<UserOutlined />}
                          style={{ marginBottom: 16 }}
                        />
                        <Title level={4} style={{ margin: 0 }}>{testimonial.name}</Title>
                        <Text type="secondary">{testimonial.role}</Text>
                        <Rate disabled defaultValue={testimonial.rating} style={{ color: '#1890ff' }} />
                        <Paragraph style={{ fontSize: '16px', marginTop: 16 }}>
                          "{testimonial.text}"
                        </Paragraph>
                      </Space>
                    </TestimonialCard>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </Container>
        </StyledSection>

        {/* Section CTA mise à jour */}
        <StyledSection $background="linear-gradient(135deg, #001529 0%, #003366 100%)">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Row justify="center" align="middle" style={{ textAlign: 'center' }}>
                <Col xs={24} md={16}>
                  <Title level={2} style={{ color: 'white' }}>
                    Prêt à développer votre carrière ?
                  </Title>
                  <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: '30px' }}>
                    Rejoignez notre communauté de professionnels et accédez à des opportunités exclusives.
                  </Paragraph>
                  <Space size="large">
                    <Button type="primary" size="large" style={{ height: '50px', padding: '0 30px' }}>
                      S'inscrire gratuitement
                    </Button>
                    <Button 
                      style={{ 
                        height: '50px', 
                        padding: '0 30px',
                        background: 'linear-gradient(135deg, #ffd700 0%, #ffb900 100%)',
                        border: 'none',
                        color: '#000'
                      }}
                    >
                      <CrownOutlined /> Devenir Premium
                    </Button>
                  </Space>
                </Col>
              </Row>
            </motion.div>
          </Container>
        </StyledSection>
      </Content>
    </Layout>
  );
};

export default Home; 