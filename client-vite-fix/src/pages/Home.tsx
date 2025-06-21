// Forçage de build Vercel - commit technique
import React, { useEffect, useState, useRef } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Carousel, Statistic, Spin, Tag, Rate } from 'antd';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import Hero from '../components/Hero';
import {
  TeamOutlined,
  ShoppingOutlined,
  BookOutlined,
  BulbOutlined,
  ArrowRightOutlined,
  BuildOutlined,
  SearchOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  RiseOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { JobService } from '../services/jobService';
import type { Job } from '../types/job';
import { marketplaceService } from '../services/marketplaceService';
import type { MarketplaceItem } from '../services/marketplaceService';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import JobCard from './jobs/components/JobCard';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { hasPremiumAccess } from '../utils/premiumAccess';
import manBeret from '../assets/testimonials/man-beret.png';
import manHeadphones from '../assets/testimonials/man-headphones.png';
import womanGlasses from '../assets/testimonials/woman-glasses.png';
import womanHijab from '../assets/testimonials/woman-hijab.png';
import LazyImage from '../components/LazyImage';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const AnimatedStatistic = ({ value, suffix = '+', duration = 2000, color, startAnimation }: { value: number; suffix?: string; duration?: number; color?: string; startAnimation: boolean; }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: startAnimation ? value : 0 },
    config: { duration, easing: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 },
    reset: true, // Reset animation to play again
  });

  return (
    <animated.span style={{ color, fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>
      {number.to((n: number) => `${Math.floor(n)}${suffix}`)}
    </animated.span>
  );
};

const StatsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const stats = [
    { value: 500, label: 'Entreprises' },
    { value: 1000, label: 'Offres d\'emploi' },
    { value: 2500, label: 'Candidats' },
    { value: 50, label: 'Partenaires' },
  ];

  return (
    <div ref={ref} style={{ padding: '4rem 1rem', background: '#f8f9fa' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem', color: '#002766', fontWeight: 700 }}>
        BusinessConnect en chiffres
      </Title>
      <Row gutter={[16, 32]} justify="center">
        {stats.map((stat, index) => (
          <Col xs={12} sm={12} md={6} key={index} style={{ textAlign: 'center' }}>
             <Card
                bordered={false}
                style={{
                  background: 'transparent',
                  boxShadow: 'none',
                }}
              >
              <Statistic
                title={<span style={{fontSize: 'clamp(1rem, 4vw, 1.1rem)', color: '#555', fontWeight: 500}}>{stat.label}</span>}
                valueRender={() => <AnimatedStatistic value={stat.value} color="#1ec773" startAnimation={inView} />}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const SECTEURS = [
    { id: 1, nom: 'Informatique', icone: <TeamOutlined />, couleur: '#1890ff' },
    { id: 2, nom: 'Finance', icone: <ShoppingOutlined />, couleur: '#52c41a' },
    { id: 3, nom: 'Santé', icone: <BulbOutlined />, couleur: '#faad14' },
    { id: 4, nom: 'Éducation', icone: <BookOutlined />, couleur: '#ff4d4f' },
    { id: 5, nom: 'Marketing', icone: <ShoppingOutlined />, couleur: '#b37feb' },
    { id: 6, nom: 'Industrie', icone: <BuildOutlined />, couleur: '#1890ff' },
    { id: 7, nom: 'Services', icone: <ShoppingOutlined />, couleur: '#52c41a' },
    { id: 8, nom: 'Agriculture', icone: <ShoppingOutlined />, couleur: '#faad14' },
];

const TESTIMONIALS = [
    {
        img: manBeret,
        name: 'Mamadou Diop',
        role: 'Recruteur',
        text: `Grâce à BusinessConnect, j'ai pu recruter rapidement des profils qualifiés. La plateforme a simplifié notre processus de recrutement.`
    },
    {
        img: manHeadphones,
        name: 'Cheikh Ndiaye',
        role: 'Chercheur d\'emploi',
        text: `J'ai trouvé un emploi correspondant à mes compétences. Les offres sont variées et le site très intuitif. Je recommande !`
    },
    {
        img: womanGlasses,
        name: 'Awa Sarr',
        role: 'Étudiante',
        text: `J'ai trouvé un stage enrichissant, élargi mon réseau et découvert de nombreuses opportunités. Un vrai tremplin pour ma carrière.`
    },
    {
        img: womanHijab,
        name: 'Fatou Bâ',
        role: 'Annonceuse',
        text: `Publier mes offres m'a permis de recevoir rapidement des candidatures pertinentes. Un outil simple et indispensable.`
    }
];

const SectorCard = styled.div<{ color: string }>`
  width: 100%;
  max-width: 320px;
  min-height: 220px;
  border-radius: 40px;
  background: linear-gradient(135deg, rgba(255,255,255,0.96) 60%, ${props => props.color}11 100%);
  box-shadow: 0 8px 32px 0 ${props => props.color}18, 0 2px 8px #0001;
  border: 2.5px solid #d1d5db;
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 36px 24px;
  margin: 0 auto;
  transition: transform 0.28s cubic-bezier(.4,2,.6,1), box-shadow 0.28s, border 0.28s;
  cursor: pointer;
  opacity: 1;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
    min-height: 200px;
    border-radius: 32px;
  }
  
  &:hover {
    transform: scale(1.07) translateY(-6px);
    box-shadow: 0 24px 64px 0 ${props => props.color}44, 0 2px 16px #0002;
    border: 2.5px solid ${props => props.color};
    z-index: 2;
  }
`;

const IconCircle = styled.div<{ color: string }>`
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.color} 60%, #fff 120%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 0 0 8px ${props => props.color}22, 0 8px 32px ${props => props.color}33;
  position: relative;
  transition: box-shadow 0.3s, filter 0.3s;
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: 16px;
  }
  
  ${SectorCard}:hover & {
    box-shadow: 0 0 0 16px ${props => props.color}33, 0 12px 48px ${props => props.color}55;
    filter: brightness(1.15) drop-shadow(0 2px 12px ${props => props.color}99);
  }
  & > span {
    font-size: 40px;
    color: #fff;
    filter: drop-shadow(0 2px 8px ${props => props.color}88);
    transition: transform 0.3s;
    
    @media (max-width: 768px) {
      font-size: 32px;
    }
    
    ${SectorCard}:hover & {
      transform: scale(1.13) rotate(-6deg);
    }
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const servicesRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await JobService.getJobs();
        setJobs(fetchedJobs || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des offres d'emploi:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMarketplaceItems = async () => {
      try {
        const items = await marketplaceService.getItems();
        setMarketplaceItems(items || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles du marketplace:", error);
        setMarketplaceItems([]);
      }
    };

    fetchJobs();
    fetchMarketplaceItems();
  }, []);

  const handleScrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const latestJobs = jobs
    .filter(job => job?.id && job.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 3);
  
  const MarketplacePreview = () => {
    if (marketplaceItems.length === 0) {
      return null;
    }

    const formatPrice = (item: MarketplaceItem) => {
      if (!item) return 'Prix non disponible';
      switch (item.priceType) {
        case 'fixed': return item.price ? `${item.price.toLocaleString()} FCFA` : 'Prix fixe non spécifié';
        case 'range': return item.minPrice && item.maxPrice ? `${item.minPrice.toLocaleString()} - ${item.maxPrice.toLocaleString()} FCFA` : 'Fourchette non définie';
        case 'negotiable': return 'Prix négociable';
        default: return 'Contacter pour prix';
      }
    };

    return (
        <div style={{ padding: '4rem 2rem', background: '#fff' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Marketplace</Title>
            <Row gutter={[16, 16]}>
                {marketplaceItems.slice(0, 3).map((item) => {
                    if (!item?.id) return null;
                    return (
                        <Col xs={24} sm={12} md={8} key={item.id}>
                            <Card
                                hoverable
                                cover={
                                    <LazyImage
                                        alt={item.title}
                                        src={item.images?.[0] || '/placeholder.png'}
                                        style={{ height: 200, objectFit: 'cover' }}
                                    />
                                }
                                onClick={() => navigate(`/marketplace/${item.id}`)}
                            >
                                <Card.Meta
                                    title={item.title}
                                    description={formatPrice(item)}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Button type="primary" size="large" onClick={() => navigate('/marketplace')} style={{ background: '#1ec773', borderColor: '#1ec773' }}>
                    Explorer le Marketplace
                </Button>
            </div>
        </div>
    );
  };

  return (
    <Layout>
      <Hero onDiscoverServicesClick={handleScrollToServices} />
      <Content>
        {/* Section Nos Services */}
        <div ref={servicesRef} style={{ padding: '4rem 2rem', background: '#ffffff' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem', color: '#002766', fontWeight: 700 }}>
            Nos Services
          </Title>
          <Row gutter={[32, 32]} justify="center">
            {[
              { title: "Offres d'Emploi", icon: <SearchOutlined />, desc: "Trouvez le job de vos rêves parmi des centaines d'offres.", link: "/jobs", color: "#1ec773" },
              { title: "Créateur de CV", icon: <BuildOutlined />, desc: "Créez un CV professionnel en quelques minutes.", link: "/cv-generator", color: "#1ec773" },
              { title: "Marketplace", icon: <ShoppingOutlined />, desc: "Vendez et achetez des services et produits.", link: "/marketplace", color: "#1ec773" },
            ].map(service => (
              <Col xs={24} sm={12} md={8} key={service.title}>
                 <Card hoverable style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', height: '100%' }} onClick={() => navigate(service.link)}>
                    <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                        <Avatar size={64} icon={service.icon} style={{ backgroundColor: service.color, marginBottom: '1rem' }} />
                        <Title level={4}>{service.title}</Title>
                        <Paragraph>{service.desc}</Paragraph>
                    </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section Créateur de CV */}
        <div style={{ padding: '4rem 2rem', background: '#f8f9fa' }}>
            <Row justify="center" align="middle" gutter={[32, 32]}>
                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
                        <LazyImage src="/images/cv-creator-showcase.png" alt="Créateur de CV" style={{ maxWidth: '100%', borderRadius: '16px' }} />
                    </motion.div>
                </Col>
                <Col xs={24} md={12}>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
                        <Title level={2}>Créez un CV qui se démarque</Title>
                        <Paragraph>Notre outil intuitif vous permet de créer des CV professionnels et modernes en quelques clics. Choisissez parmi plusieurs modèles, personnalisez-le et téléchargez-le en PDF.</Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate('/cv-generator')} style={{ background: '#1ec773', borderColor: '#1ec773' }}>Commencer gratuitement</Button>
                    </motion.div>
                </Col>
            </Row>
        </div>

        {/* Section Offres d'emploi récentes */}
        <div style={{ padding: '4rem 2rem' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Offres d'emploi récentes</Title>
          {isLoading ? <div style={{textAlign: 'center'}}><Spin size="large" /></div> :
            <Row gutter={[16, 16]}>
              {latestJobs.map(job => (
                <Col xs={24} sm={12} md={8} key={job.id}>
                  <JobCard job={job} isPremium={isPremium} />
                </Col>
              ))}
            </Row>
          }
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button type="primary" size="large" onClick={() => navigate('/jobs')} style={{ background: '#1ec773', borderColor: '#1ec773' }}>Voir toutes les offres</Button>
          </div>
        </div>

        <MarketplacePreview />

        <StatsSection />
        
        {/* Section Témoignages */}
        <div style={{ padding: '4rem 2rem', backgroundColor: '#fff' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Ils nous font confiance</Title>
          <Row gutter={[16, 16]} justify="center">
            {TESTIMONIALS.map((testimonial, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card style={{ borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', height: '100%', padding: '1rem' }}>
                  <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                      <Avatar size={80} src={testimonial.img} />
                      <Title level={5} style={{ marginTop: '1rem' }}>{testimonial.name}</Title>
                      <Text type="secondary">{testimonial.role}</Text>
                      <Paragraph style={{ fontStyle: 'italic', marginTop: '1rem' }}>"{testimonial.text}"</Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

      </Content>
    </Layout>
  );
};

export default Home; 