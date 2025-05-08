import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Rate, Tag } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Hero from '../components/Hero';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
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
import styles from './Home.module.css';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface IconProps extends Partial<CustomIconComponentProps> {
  className?: string;
  style?: React.CSSProperties;
}

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

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  isPremium?: boolean;
}

interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  rating: number;
  text: string;
}

const StyledIcon = (IconComponent: React.FC<IconProps>) => {
  return <IconComponent style={{ fontSize: 24 }} className={styles.featureIcon} />;
};

const features: Feature[] = [
  {
    icon: StyledIcon(TeamOutlined),
    title: 'Recrutement',
    description: 'Trouvez les meilleurs talents ou l\'emploi de vos rêves dans divers secteurs d\'activité.',
    isPremium: false
  },
  {
    icon: StyledIcon(ShoppingOutlined),
    title: 'Marketplace B2B',
    description: 'Connectez-vous avec des entreprises et développez votre réseau professionnel.',
    isPremium: false
  },
  {
    icon: StyledIcon(BookOutlined),
    title: 'Fiches Métiers',
    description: 'Accédez à notre base de données complète de fiches métiers détaillées.',
    isPremium: true
  },
  {
    icon: StyledIcon(BulbOutlined),
    title: 'Innovation',
    description: 'Découvrez les dernières tendances et innovations dans votre secteur.',
    isPremium: false
  }
];

const premiumFeatures: Feature[] = [
  {
    icon: StyledIcon(SafetyCertificateOutlined),
    title: 'Fiches Métiers Détaillées',
    description: 'Accédez à plus de 200 fiches métiers avec salaires, compétences requises et perspectives d\'évolution.'
  },
  {
    icon: StyledIcon(RocketOutlined),
    title: 'Candidature Prioritaire',
    description: 'Vos candidatures sont mises en avant auprès des recruteurs premium.'
  },
  {
    icon: StyledIcon(CrownOutlined),
    title: 'Accompagnement Personnalisé',
    description: 'Bénéficiez d\'un suivi personnalisé et de conseils d\'experts pour votre carrière.'
  }
];

const testimonials: Testimonial[] = [
  {
    avatar: '/images/testimonials/woman-glasses.jpg',
    name: 'Aïda Diop',
    role: 'Développeuse Full Stack',
    rating: 5,
    text: 'BusinessConnect m\'a permis de trouver des opportunités passionnantes dans le développement web. La plateforme est vraiment adaptée aux professionnels tech sénégalais.'
  },
  {
    avatar: '/images/testimonials/woman-hijab.jpg',
    name: 'Fatima Ndiaye',
    role: 'Médecin Spécialiste',
    rating: 5,
    text: 'Grâce à BusinessConnect, j\'ai pu développer mon réseau professionnel dans le secteur médical et trouver des opportunités de collaboration enrichissantes.'
  },
  {
    avatar: '/images/testimonials/man-beret.jpg',
    name: 'Moussa Sall',
    role: 'Entrepreneur Tech',
    rating: 5,
    text: 'La plateforme m\'a aidé à recruter les meilleurs talents pour ma startup. L\'interface est intuitive et la qualité des profils est exceptionnelle.'
  },
  {
    avatar: '/images/testimonials/man-headphones.jpg',
    name: 'Abdou Kane',
    role: 'Ingénieur DevOps',
    rating: 5,
    text: 'BusinessConnect est une vraie révolution pour le marché de l\'emploi tech au Sénégal. J\'ai trouvé mon poste actuel grâce à la plateforme.'
  }
];

const Home: React.FC = () => {
  return (
    <Layout>
      <Hero />
      
      <Content>
        <div className={styles.container}>
          {/* Section Caractéristiques */}
          <div className={styles.section}>
            <Title level={2} className={styles.sectionTitle}>
              Pourquoi choisir BusinessConnect Sénégal ?
            </Title>
            
            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card className={styles.featureCard} bordered={false}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    <Title level={4}>
                      {feature.title}
                      {feature.isPremium && (
                        <Tag color="gold" style={{ marginLeft: 8 }}>
                          <CrownOutlined /> Premium
                        </Tag>
                      )}
                    </Title>
                    <Paragraph>{feature.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Section Premium */}
          <div className={styles.premiumSection}>
            <Row justify="center" style={{ marginBottom: 60 }}>
              <Col xs={24} md={16} style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="large">
                  <CrownOutlined className={styles.premiumIcon} />
                  <Title level={2}>Fonctionnalités Premium</Title>
                  <Paragraph className={styles.sectionSubtitle}>
                    Débloquez tout le potentiel de BusinessConnect avec notre abonnement Premium
                  </Paragraph>
                </Space>
              </Col>
            </Row>
            
            <Row gutter={[32, 32]}>
              {premiumFeatures.map((feature, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className={styles.premiumCard} bordered={false}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph>{feature.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Section Témoignages */}
          <div className={styles.section}>
            <Title level={2} className={styles.sectionTitle}>
              Ils nous font confiance
            </Title>
            
            <Row gutter={[32, 32]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className={styles.testimonialCard} bordered={false}>
                      <Space direction="vertical" align="center" style={{ width: '100%' }}>
                        <Avatar
                          src={testimonial.avatar}
                          size={100}
                          icon={<UserOutlined className={styles.testimonialAvatar} />}
                          className={styles.testimonialAvatar}
                        />
                        <Title level={4} className={styles.testimonialName}>
                          {testimonial.name}
                        </Title>
                        <Text type="secondary" className={styles.testimonialRole}>
                          {testimonial.role}
                        </Text>
                        <Rate 
                          disabled 
                          defaultValue={testimonial.rating} 
                          className={styles.testimonialRating}
                        />
                        <Paragraph className={styles.testimonialText}>
                          {testimonial.text}
                        </Paragraph>
                      </Space>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Section CTA */}
          <div className={styles.ctaSection}>
            <Row justify="center" align="middle" style={{ textAlign: 'center' }}>
              <Col xs={24} md={16}>
                <Title level={2} className={styles.ctaTitle}>
                  Prêt à développer votre carrière ?
                </Title>
                <Paragraph className={styles.ctaSubtitle}>
                  Rejoignez notre communauté de professionnels et accédez à des opportunités exclusives.
                </Paragraph>
                <Space size="large">
                  <Button type="primary" size="large">
                    S'inscrire gratuitement
                  </Button>
                  <Button 
                    type="default" 
                    size="large" 
                    icon={<CrownOutlined />}
                    style={{ background: '#ffd700', borderColor: '#ffd700' }}
                  >
                    Devenir Premium
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home; 