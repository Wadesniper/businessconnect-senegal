import React, { useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Rate, Tag, Carousel } from 'antd';
import { motion, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';
import Hero from '../components/Hero/index';
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
  RocketOutlined,
  RiseOutlined
} from '@ant-design/icons';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

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

const subscriptions = [
  {
    title: "Étudiant / Chercheur d'emploi",
    price: '1 000 FCFA/mois',
    features: [
      "Accès aux offres d'emploi",
      'Espace CV',
      'Forum',
      'Fiches métiers',
      'Formations',
      'Support standard'
    ],
    cta: "S'abonner",
    color: '#1890ff',
    popular: false
  },
  {
    title: 'Annonceur',
    price: '5 000 FCFA/mois',
    features: [
      "Publication d'offres",
      'Visibilité plateforme',
      'Statistiques de vues',
      'Support prioritaire',
      'Badge \"Annonceur Vérifié\"',
      'Outils de promotion'
    ],
    cta: "S'abonner",
    color: '#52c41a',
    popular: false
  },
  {
    title: 'Recruteur',
    price: '9 000 FCFA/mois',
    features: [
      'Accès CVthèque complète',
      'Contact direct candidats',
      'Publication offres illimitées',
      'Statistiques avancées',
      'Support dédié 24/7',
      'Outils de filtrage premium'
    ],
    cta: "S'abonner",
    color: '#faad14',
    popular: true
  }
];

const secteursCarousel = [
  { id: 'tech', nom: 'Technologies & Numérique', icone: '💻', couleur: '#1890ff' },
  { id: 'finance', nom: 'Finance & Banque', icone: '💰', couleur: '#52c41a' },
  { id: 'construction', nom: 'Construction & BTP', icone: '🏗️', couleur: '#faad14' },
  { id: 'tourisme', nom: 'Tourisme & Hôtellerie', icone: '🏨', couleur: '#13c2c2' },
  { id: 'agriculture', nom: 'Agriculture & Agroalimentaire', icone: '🌾', couleur: '#a0d911' },
  { id: 'medias', nom: 'Médias & Communication', icone: '📺', couleur: '#f759ab' },
  { id: 'industrie', nom: 'Industrie & Manufacturing', icone: '🏭', couleur: '#597ef7' },
  { id: 'commerce', nom: 'Commerce & Distribution', icone: '🏪', couleur: '#36cfc9' },
  { id: 'juridique', nom: 'Droit & Justice', icone: '⚖️', couleur: '#ffc53d' },
  { id: 'mode', nom: 'Mode & Luxe', icone: '👗', couleur: '#ff85c0' }
];

const carouselStyle: React.CSSProperties = {
  overflow: 'hidden',
  width: '100%',
  position: 'relative',
  paddingBottom: 16,
};
const trackStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  animation: 'marquee 20s linear infinite',
};

const MarqueeKeyframes = () => (
  <style>
    {`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}
  </style>
);

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <Layout>
      <Hero />
      {/* Section Secteurs défilants avec animation améliorée */}
      <StyledSection $background="#fff">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
              Explorez les secteurs qui recrutent
            </Title>
          </motion.div>
          <Carousel
            slidesToShow={4}
            autoplay
            autoplaySpeed={2500}
            dots={false}
            responsive={[
              { breakpoint: 1200, settings: { slidesToShow: 3 } },
              { breakpoint: 900, settings: { slidesToShow: 2 } },
              { breakpoint: 600, settings: { slidesToShow: 1 } }
            ]}
            style={{ marginBottom: 32 }}
          >
            {secteursCarousel.map((secteur, index) => (
              <motion.div
                key={secteur.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ padding: 12 }}
              >
                <div
                  style={{
                    background: secteur.couleur,
                    color: '#fff',
                    borderRadius: 20,
                    padding: '32px 24px',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    fontSize: 24,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => navigate(`/careers?secteur=${secteur.id}`)}
                  className={styles.sectorCard}
                >
                  <div className={styles.sectorCardOverlay} />
                  <span style={{ fontSize: 48, marginBottom: 12 }}>{secteur.icone}</span>
                  <div style={{ fontWeight: 600, fontSize: 20, marginTop: 8 }}>{secteur.nom}</div>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </Container>
      </StyledSection>
      {/* Section Abonnements */}
      <StyledSection $background="#f6f8fa">
        <Container>
          <GradientTitle level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
            Nos abonnements
          </GradientTitle>
          <Row gutter={[32, 32]} justify="center">
            {subscriptions.map((sub, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * idx }}
                >
                  <Card
                    bordered={false}
                    style={{
                      borderRadius: 20,
                      boxShadow: sub.popular ? '0 8px 32px rgba(24,144,255,0.15)' : '0 4px 16px rgba(0,0,0,0.08)',
                      border: sub.popular ? `2px solid ${sub.color}` : '1px solid #f0f0f0',
                      background: sub.popular ? 'linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)' : 'white',
                      minHeight: 400
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <Title level={3} style={{ color: sub.color, marginBottom: 0 }}>{sub.title}</Title>
                      <Text style={{ fontSize: 32, fontWeight: 700, color: sub.color }}>{sub.price}</Text>
                      {sub.popular && <Tag color="gold" style={{ marginLeft: 8 }}>Populaire</Tag>}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
                      {sub.features.map((f, i) => (
                        <li key={i} style={{ marginBottom: 12, fontSize: 16 }}>
                          <span style={{ color: sub.color, marginRight: 8 }}>✔</span>{f}
                        </li>
                      ))}
                    </ul>
                    <Button type="primary" size="large" block style={{ background: sub.color, borderColor: sub.color, borderRadius: 25 }}>
                      {sub.cta}
                    </Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </StyledSection>
      
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

          {/* Section Statistiques avec parallax */}
          <motion.div
            style={{
              scale: scaleProgress,
              opacity: opacityProgress
            }}
          >
            <Row gutter={[32, 32]} justify="center" style={{ margin: '60px 0' }}>
              <Col xs={24} md={8}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card 
                    hoverable 
                    className={`${styles.statCard} ${styles.blueGradient}`}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      <TeamOutlined className={styles.bounceAnimation} />
                    </div>
                    <Title level={2} style={{ color: '#fff', marginBottom: '8px' }}>+500</Title>
                    <Text style={{ fontSize: '18px', color: '#fff' }}>entreprises partenaires</Text>
                    <div style={{ marginTop: '16px', fontSize: '14px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                        Rejoignez notre réseau d'entreprises
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card 
                    hoverable 
                    className={`${styles.statCard} ${styles.greenGradient}`}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      <RiseOutlined className={styles.pulseAnimation} />
                    </div>
                    <Title level={2} style={{ color: '#fff', marginBottom: '8px' }}>24/7</Title>
                    <Text style={{ fontSize: '18px', color: '#fff' }}>Nouvelles offres</Text>
                    <div style={{ marginTop: '16px', fontSize: '14px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                        Mises à jour quotidiennes
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card 
                    hoverable 
                    className={`${styles.statCard} ${styles.orangeGradient}`}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      <UserOutlined className={styles.scaleAnimation} />
                    </div>
                    <Title level={2} style={{ color: '#fff', marginBottom: '8px' }}>10K+</Title>
                    <Text style={{ fontSize: '18px', color: '#fff' }}>Membres actifs</Text>
                    <div style={{ marginTop: '16px', fontSize: '14px' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                        Une communauté grandissante
                      </Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>

          {/* Section CTA améliorée */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={styles.ctaSection}
          >
            <Row justify="center" align="middle" style={{ textAlign: 'center' }}>
              <Col xs={24} md={16}>
                <Title level={2} className={styles.ctaTitle}>
                  Prêt à développer votre carrière ?
                </Title>
                <Paragraph className={styles.ctaSubtitle}>
                  Rejoignez notre communauté de professionnels et accédez à des opportunités exclusives.
                </Paragraph>
                <Space size="large">
                  <Button 
                    type="primary" 
                    size="large"
                    className={styles.ctaButton}
                  >
                    S'inscrire gratuitement
                  </Button>
                  <Button 
                    type="default" 
                    size="large" 
                    icon={<CrownOutlined />}
                    className={styles.ctaPremiumButton}
                  >
                    Devenir Premium
                  </Button>
                </Space>
              </Col>
            </Row>
          </motion.div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home; 