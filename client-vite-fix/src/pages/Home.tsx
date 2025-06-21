// Forçage de build Vercel - commit technique
import React, { useEffect, useState, useRef } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Carousel, Statistic, Spin, Tag } from 'antd';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import Hero from '../components/Hero';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
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
  EnvironmentOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { FaQuoteLeft } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { JobService } from '../services/jobService';
import type { Job, JobData } from '../types/job';
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

const services = [
  {
    icon: <TeamOutlined />,
    title: "Offres d'emploi",
    description: "Accédez à des milliers d'offres dans tous les secteurs.",
    link: '/jobs',
  },
  {
    icon: <BookOutlined />,
    title: 'Créateur de CV',
    description: 'Créez un CV professionnel et moderne avec notre générateur.',
    link: '/cv-generator',
  },
  {
    icon: <BulbOutlined />,
    title: 'Fiches métiers',
    description: 'Découvrez des informations détaillées sur différents métiers.',
    link: '/careers',
  },
  {
    icon: <CrownOutlined />,
    title: 'Formations',
    description: 'Développez vos compétences avec nos programmes de formation.',
    link: '/formations',
  },
  {
    icon: <ShoppingOutlined />,
    title: 'Marketplace',
    description: 'Achetez et vendez des produits et services professionnels.',
    link: '/marketplace',
  },
    {
    icon: <SearchOutlined />,
    title: 'Recherche Avancée',
    description: 'Trouvez précisément ce que vous cherchez avec nos filtres avancés.',
    link: '/jobs',
  },
];

const subscriptionPlans = [
    {
      title: 'Étudiant & Candidat',
      description: 'Idéal pour démarrer sa carrière.',
      features: [
        'Accès à toutes les offres',
        'Création de CV professionnels',
        'Accès aux formations',
        'Postuler en illimité'
      ],
      color: '#1ec773',
    },
    {
      title: 'Annonceur Marketplace',
      description: 'Pour les vendeurs et freelances.',
      features: [
        'Tous les avantages Étudiant',
        'Publier sur le Marketplace',
        'Visibilité accrue',
        'Messagerie professionnelle'
      ],
      color: '#1890ff',
    },
    {
      title: 'Employeur',
      description: 'Pour les entreprises qui recrutent.',
      features: [
        'Tous les avantages Annonceur',
        'Publier des offres d\'emploi',
        'Accès à la CVthèque',
        'Tableau de bord de suivi'
      ],
      color: '#8a2be2',
    },
];

const testimonials = [
    {
        avatar: manBeret,
        name: 'Mamadou Diop',
        title: 'Recruteur',
        quote: `Grâce à BusinessConnect, j'ai pu recruter rapidement des profils qualifiés pour mon entreprise. La plateforme facilite la mise en relation avec des candidats motivés et sérieux, ce qui a considérablement simplifié notre processus de recrutement.`
    },
    {
        avatar: manHeadphones,
        name: 'Cheikh Ndiaye',
        title: 'Chercheur d\'emploi',
        quote: `Après plusieurs mois de recherche, c'est sur BusinessConnect que j'ai enfin trouvé un emploi qui correspond à mes compétences. Les offres sont variées et la navigation sur le site est très intuitive. Je recommande vivement à tous les jeunes diplômés !`
    },
    {
        avatar: womanGlasses,
        name: 'Awa Sarr',
        title: 'Étudiante',
        quote: `En tant qu'étudiante, j'ai pu trouver un stage enrichissant grâce à BusinessConnect. J'ai aussi pu élargir mon réseau professionnel et découvrir de nombreuses opportunités adaptées à mon profil. C'est un vrai tremplin pour débuter sa carrière.`
    },
    {
        avatar: womanHijab,
        name: 'Fatou Bâ',
        title: 'Annonceuse',
        quote: `Publier mes offres sur BusinessConnect m'a permis de recevoir rapidement des candidatures pertinentes. J'apprécie la simplicité de la plateforme et la qualité des profils proposés. C'est devenu un outil indispensable pour mon activité.`
    }
];

const sectors = [
  { name: 'Informatique', icon: <TeamOutlined /> },
  { name: 'Finance', icon: <ShoppingOutlined /> },
  { name: 'Santé', icon: <BulbOutlined /> },
  { name: 'Éducation', icon: <BookOutlined /> },
  { name: 'Marketing', icon: <ShoppingOutlined /> },
  { name: 'Industrie', icon: <BuildOutlined /> },
];

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const AnimatedStatistic = ({ value, suffix = '+', duration = 2000, color, startAnimation }: { value: number; suffix?: string; duration?: number; color?: string; startAnimation: boolean; }) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: startAnimation ? value : 0 },
    config: { duration, easing: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 },
    reset: true,
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

  const stats: { value?: number; label: string; textValue?: string }[] = [
    { value: 500, label: 'Entreprises' },
    { label: 'Des offres d\'emploi', textValue: 'Chaque jour' },
    { value: 10000, label: 'Utilisateurs' },
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
                valueRender={() => stat.textValue ? 
                    <span style={{ color: '#1ec773', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>{stat.textValue}</span> : 
                    <AnimatedStatistic value={stat.value!} color="#1ec773" startAnimation={inView} />
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const SECTEURS = [
  { id: 1, nom: 'Informatique', icone: <TeamOutlined />, couleur: '#1890ff', description: 'Secteur lié à l\'informatique et à la technologie' },
  { id: 2, nom: 'Finance', icone: <ShoppingOutlined />, couleur: '#52c41a', description: 'Secteur lié à la finance et à l\'économie' },
  { id: 3, nom: 'Santé', icone: <BulbOutlined />, couleur: '#faad14', description: 'Secteur lié à la santé et à la médecine' },
  { id: 4, nom: 'Éducation', icone: <BookOutlined />, couleur: '#ff4d4f', description: 'Secteur lié à l\'éducation et à la formation' },
  { id: 5, nom: 'Marketing', icone: <ShoppingOutlined />, couleur: '#b37feb', description: 'Secteur lié au marketing et à la communication' },
  { id: 6, nom: 'Industrie', icone: <BuildOutlined />, couleur: '#1890ff', description: 'Secteur lié à l\'industrie et à la production' },
  { id: 7, nom: 'Services', icone: <ShoppingOutlined />, couleur: '#52c41a', description: 'Secteur lié aux services et à la prestation de services' },
  { id: 8, nom: 'Agriculture', icone: <ShoppingOutlined />, couleur: '#faad14', description: 'Secteur lié à l\'agriculture et à l\'élevage' },
];

const TESTIMONIALS = [
    {
        img: manBeret,
        name: 'Mamadou Diop',
        role: 'Recruteur',
        text: `Grâce à BusinessConnect, j'ai pu recruter rapidement des profils qualifiés pour mon entreprise. La plateforme facilite la mise en relation avec des candidats motivés et sérieux, ce qui a considérablement simplifié notre processus de recrutement.`
    },
    {
        img: manHeadphones,
        name: 'Cheikh Ndiaye',
        role: 'Chercheur d\'emploi',
        text: `Après plusieurs mois de recherche, c'est sur BusinessConnect que j'ai enfin trouvé un emploi qui correspond à mes compétences. Les offres sont variées et la navigation sur le site est très intuitive. Je recommande vivement à tous les jeunes diplômés !`
    },
    {
        img: womanGlasses,
        name: 'Awa Sarr',
        role: 'Étudiante',
        text: `En tant qu'étudiante, j'ai pu trouver un stage enrichissant grâce à BusinessConnect. J'ai aussi pu élargir mon réseau professionnel et découvrir de nombreuses opportunités adaptées à mon profil. C'est un vrai tremplin pour débuter sa carrière.`
    },
    {
        img: womanHijab,
        name: 'Fatou Bâ',
        role: 'Annonceuse',
        text: `Publier mes offres sur BusinessConnect m'a permis de recevoir rapidement des candidatures pertinentes. J'apprécie la simplicité de la plateforme et la qualité des profils proposés. C'est devenu un outil indispensable pour mon activité.`
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
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [jobsData, itemsData] = await Promise.all([
          JobService.getJobs(),
          marketplaceService.getItems()
        ]);
        setJobs(jobsData || []);
        setMarketplaceItems(itemsData || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleScrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const latestJobs = jobs
    .filter(job => job?.id && job.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 3);
  
  const MarketplacePreview = () => {
    if (isLoading || marketplaceItems.length === 0) {
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
        <div style={{ padding: '4rem 2rem', background: '#f8f9fa' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem', color: '#002766', fontWeight: 700 }}>Derniers ajouts sur le Marketplace</Title>
            <Row gutter={[24, 24]}>
                {marketplaceItems.slice(0, 3).map((item) => {
                    if (!item?.id) return null;
                    return (
                        <Col xs={24} sm={12} md={8} key={item.id} style={{ display: 'flex' }}>
                            <Card
                                hoverable
                                style={{
                                    width: '100%',
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                cover={
                                  <div style={{ overflow: 'hidden', height: 220, borderRadius: '16px 16px 0 0' }}>
                                    <LazyImage
                                        alt={item.title}
                                        src={item.images?.[0] || '/placeholder.png'}
                                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                    />
                                  </div>
                                }
                                bodyStyle={{ flex: 1, padding: '1.5rem', textAlign: 'center' }}
                                onClick={() => navigate(`/marketplace/${item.id}`)}
                            >
                                <Card.Meta
                                    title={<Title level={5} style={{ marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</Title>}
                                    description={<Text style={{ color: '#1ec773', fontWeight: 'bold', fontSize: '1rem' }}>{formatPrice(item)}</Text>}
                                />
                            </Card>
                        </Col>
                    );
                })}
            </Row>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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
        <StatsSection />
        {/* Section Nos Services */}
        <div ref={servicesRef} style={{ padding: '4rem 2rem' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Nos Services Professionnels</Title>
          </motion.div>
          <Row gutter={[24, 24]} justify="center">
            {services.map((service, index) => (
              <Col xs={24} sm={12} md={8} key={index} style={{ display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ width: '100%' }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <Card
                    hoverable
                    style={{ borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
                    bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                    onClick={() => navigate(service.link)}
                  >
                    <div style={{ fontSize: '2.5rem', color: '#1ec773', marginBottom: '1rem' }}>{service.icon}</div>
                    <Title level={4}>{service.title}</Title>
                    <Paragraph style={{ flexGrow: 1 }}>{service.description}</Paragraph>
                    <Button type="primary" ghost style={{ marginTop: 'auto', borderColor: '#1ec773', color: '#1ec773' }}>En savoir plus <ArrowRightOutlined /></Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section Nos abonnements */}
        <div style={{ padding: '4rem 2rem', background: '#f8f9fa' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '1rem' }}>Nos Abonnements</Title>
            <Paragraph style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Choisissez le plan qui correspond le mieux à vos besoins et débloquez des fonctionnalités exclusives pour accélérer votre carrière ou vos recrutements.
            </Paragraph>
          </motion.div>
          <Row gutter={[24, 24]} justify="center">
            {subscriptionPlans.map((plan, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ height: '100%' }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <Card
                    hoverable
                    style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '100%', borderTop: `4px solid ${plan.color}` }}
                    bodyStyle={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    <Title level={3} style={{ color: plan.color }}>{plan.title}</Title>
                    <Paragraph>{plan.description}</Paragraph>
                    <div style={{ margin: '1rem 0', flexGrow: 1 }}>
                      {plan.features.map((feature, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <CheckCircleOutlined style={{ color: '#1ec773', marginRight: '8px' }} />
                          <Text>{feature}</Text>
                        </div>
                      ))}
                    </div>
                    <Button type="primary" size="large" block onClick={() => navigate('/subscription')} style={{ background: plan.color, borderColor: plan.color, marginTop: 'auto' }}>
                      Choisir ce plan
                    </Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
        
        {/* Section Créateur de CV */}
        <div style={{ padding: '4rem 2rem', background: '#fff' }}>
            <Row justify="center" align="middle" gutter={[32, 32]}>
                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
                        <LazyImage src="/images/cv-hero.jpg" alt="Créateur de CV" style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }} />
                    </motion.div>
                </Col>
                <Col xs={24} md={12}>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }}>
                        <Title level={2}>Créez un CV qui se démarque</Title>
                        <Paragraph>Notre outil intuitif vous permet de créer des CV professionnels et modernes en quelques clics. Choisissez parmi plusieurs modèles, personnalisez-le et téléchargez-le en PDF.</Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate('/cv-generator')} style={{ background: '#1ec773', borderColor: '#1ec773' }}>Créer un CV</Button>
                    </motion.div>
                </Col>
            </Row>
        </div>

        {/* Section Offres d'emploi récentes */}
        <div style={{ padding: '4rem 2rem', background: '#f8f9fa' }}>
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

        {/* Section Témoignages */}
        <div style={{ padding: '4rem 2rem', backgroundColor: '#fff' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Ils nous font confiance</Title>
          </motion.div>
          <Row gutter={[24, 24]} justify="center" style={{ alignItems: 'stretch' }}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} sm={12} md={8} key={index} style={{ display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ width: '100%' }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      border: '1px solid #f0f0f0'
                    }}
                    bodyStyle={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ fontSize: '2rem', color: '#1ec773', marginBottom: '1rem', opacity: 0.6 }}>
                      <FaQuoteLeft />
                    </div>
                    <Paragraph style={{ fontStyle: 'italic', flexGrow: 1 }}>"{testimonial.quote}"</Paragraph>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                      <Avatar src={testimonial.avatar} size={50} style={{ marginRight: '1rem', border: '3px solid #1ec773' }} />
                      <div>
                        <Text strong>{testimonial.name}</Text>
                        <br />
                        <Text type="secondary">{testimonial.title}</Text>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section Secteurs d'activité */}
        <div style={{ padding: '4rem 2rem', background: '#f8f9fa' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Secteurs d'activité</Title>
          </motion.div>
          <Row gutter={[16, 16]}>
            {sectors.map((sector, index) => (
              <Col xs={12} sm={8} md={6} lg={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <Card
                    hoverable
                    style={{ textAlign: 'center', borderRadius: '12px' }}
                    bodyStyle={{ padding: '1rem 0.5rem' }}
                    onClick={() => navigate(`/jobs?sector=${sector.name}`)}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{sector.icon}</div>
                    <Text>{sector.name}</Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

      </Content>
    </Layout>
  );
};

export default Home; 