// Forçage de build Vercel - commit technique
import React, { useEffect, useState, useRef } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Carousel, Statistic, Spin } from 'antd';
// import { motion } from 'framer-motion'; // SUPPRIMÉ - trop lourd
import styled from '@emotion/styled';
import Hero from '../components/Hero';
import {
  TeamOutlined,
  ShoppingOutlined,
  BookOutlined,
  BulbOutlined,
  ArrowRightOutlined,
  CrownOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { FaQuoteLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { JobService } from '../services/jobService';
import type { JobData } from '../types/job';
import { marketplaceService } from '../services/marketplaceService';
import type { MarketplaceItem } from '../services/marketplaceService';
// import { useSpring, animated } from 'react-spring'; // SUPPRIMÉ - trop lourd
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
import { JOB_SECTORS } from '../types/job';
import { subscriptionOffers } from '../data/subscriptionOffers';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// Composant Statistic natif pour remplacer Ant Design Statistic (plus léger)
const NativeStatistic = styled.div`
  text-align: center;
  
  .ant-statistic-title {
    font-size: clamp(1rem, 4vw, 1.1rem);
    color: #555;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    font-size: clamp(2rem, 5vw, 2.5rem);
    font-weight: 800;
    color: #1ec773;
  }
`;

// Animation CSS native pour remplacer react-spring
const AnimatedStatistic = ({ value, suffix = '+', duration = 2000, color, startAnimation }: { value: number; suffix?: string; duration?: number; color?: string; startAnimation: boolean; }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (startAnimation) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(value * progress);
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [startAnimation, value, duration]);

  return (
    <span style={{ color, fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 2.5rem)' }}>
      {displayValue}{suffix}
    </span>
  );
};

// Composants CSS natifs pour remplacer framer-motion
const FadeInUp = styled.div`
  opacity: 0;
  transform: translateY(50px);
  animation: fadeInUp 0.7s ease-out forwards;
  
  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FadeInLeft = styled.div`
  opacity: 0;
  transform: translateX(-50px);
  animation: fadeInLeft 0.7s ease-out forwards;
  
  @keyframes fadeInLeft {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const FadeInRight = styled.div`
  opacity: 0;
  transform: translateX(50px);
  animation: fadeInRight 0.7s ease-out forwards;
  
  @keyframes fadeInRight {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

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
              <NativeStatistic>
                <div className="ant-statistic-title">{stat.label}</div>
                {stat.textValue ? 
                    <div className="ant-statistic-content">{stat.textValue}</div> : 
                    <AnimatedStatistic value={stat.value!} color="#1ec773" startAnimation={inView} />
                }
              </NativeStatistic>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

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

const ServiceCard = styled(Card)`
  border-radius: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-card-body {
    padding: 2.5rem 1.5rem;
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const ServiceIconWrapper = styled.div<{color: string}>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin: 0 auto 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color}1a;
  
  .anticon {
    font-size: 32px;
    color: ${props => props.color};
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
        const [jobsResponse, itemsData] = await Promise.all([
          JobService.getJobs(),
          marketplaceService.getItems()
        ]);

        // On s'assure que jobsResponse et jobsResponse.jobs existent et que c'est bien un tableau
        const validJobs = (jobsResponse && Array.isArray(jobsResponse.jobs)) ? jobsResponse.jobs : [];
        setJobs(validJobs);
        
        // On s'assure que itemsData est bien un tableau
        const validItems = Array.isArray(itemsData) ? itemsData : [];
        setMarketplaceItems(validItems);

      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        // En cas d'erreur, on initialise avec des tableaux vides pour éviter un crash
        setJobs([]);
        setMarketplaceItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleScrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const services = [
    { title: "Offres d'emploi", icon: <TeamOutlined/>, text: "Accédez à des milliers d'offres dans tous les secteurs.", link: '/jobs', color: '#1890ff' },
    { title: "Créateur de CV", icon: <BookOutlined/>, text: "Créez un CV professionnel et moderne avec notre générateur.", link: '/cv-generator', color: '#1ec773' },
    { title: "Fiches métiers", icon: <BulbOutlined/>, text: "Découvrez des informations détaillées sur différents métiers.", link: '/careers', color: '#faad14' },
    { title: "Formations", icon: <CrownOutlined/>, text: "Développez vos compétences avec nos programmes de formation.", link: '/formations', color: '#ff4d4f' },
    { title: "Marketplace", icon: <ShoppingOutlined/>, text: "Achetez et vendez des produits et services professionnels.", link: '/marketplace', color: '#b37feb' },
    { title: "Recherche Avancée", icon: <SearchOutlined/>, text: "Trouvez précisément ce que vous cherchez avec nos filtres avancés.", link: '/jobs', color: '#3b5998' },
  ];

  const testimonials = [
      {
          img: manBeret,
          name: 'Mamadou Diop',
          role: 'Recruteur',
          text: `Grâce à BusinessConnect, j'ai pu recruter rapidement des profils qualifiés pour mon entreprise. La plateforme facilite la mise en relation avec des candidats motivés et sérieux, ce qui a considérablement simplifié notre processus de recrutement.`
      },
      {
          img: womanGlasses,
          name: 'Aïssatou Gueye',
          role: 'Étudiante',
          text: `Le générateur de CV de BusinessConnect est incroyable ! J'ai créé un CV moderne et professionnel en quelques minutes seulement. Cela m'a vraiment aidée à me démarquer auprès des employeurs.`
      },
      {
          img: manHeadphones,
          name: 'Ibrahima Fall',
          role: 'Entrepreneur',
          text: `Le marketplace de BusinessConnect est une excellente initiative. J'y ai trouvé des prestataires de services fiables pour mon entreprise et j'ai même pu y proposer mes propres services. C'est un écosystème très dynamique.`
      },
      {
          img: womanHijab,
        name: 'Fatima Sow',
        role: 'Professionnelle en reconversion',
        text: `Les fiches métiers sont une mine d'or d'informations. Elles m'ont permis de mieux comprendre les opportunités de carrière et de choisir une voie qui me correspond vraiment. Un grand merci à BusinessConnect pour cette ressource précieuse.`
      }
  ];
  
  const sectors = JOB_SECTORS.map((sector, index) => {
    const icons = ['💻', '🛒', '🏭', '❤️', '💰', '🤝', '🎓', '✈️', '🏢', '📦', '⚙️', '⚖️', '🔧'];
    const colors = ['#2db7f5', '#87d068', '#f50', '#ff4d4f', '#ffd700', '#b37feb', '#3b5998', '#1ec773', '#722ed1', '#13c2c2', '#fa8c16', '#eb2f96', '#52c41a'];
    return {
      name: sector,
      icon: icons[index % icons.length],
      color: colors[index % colors.length]
    };
  });

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
          <FadeInUp>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Nos Services Professionnels</Title>
          </FadeInUp>
          <Row gutter={[24, 24]} justify="center">
            {services.map((service, index) => (
              <Col xs={24} sm={12} md={8} key={index} style={{ display: 'flex' }}>
                <FadeInUp style={{ width: '100%' }}>
                 <ServiceCard hoverable onClick={() => navigate(service.link)}>
                   <div>
                      <ServiceIconWrapper color={service.color}>
                     {service.icon}
                      </ServiceIconWrapper>
                      <Title level={4} style={{ marginBottom: '0.5rem' }}>{service.title}</Title>
                      <Paragraph type="secondary" style={{ minHeight: '44px' }}>{service.text}</Paragraph>
                   </div>
                    <Button
                      type="link"
                      style={{ fontWeight: '600', padding: '0', marginTop: '1rem', color: service.color }}
                    >
                      Découvrir <ArrowRightOutlined />
                    </Button>
                 </ServiceCard>
                </FadeInUp>
               </Col>
             ))}
           </Row>
        </div>

        {/* Section Nos abonnements */}
         <div style={{ padding: '64px 24px', background: '#f8f9fa' }}>
          <FadeInUp>
           <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Nos Abonnements</Title>
          </FadeInUp>
           <Row gutter={[32, 32]} justify="center">
             {subscriptionOffers.map((offer, idx) => (
               <Col xs={24} sm={12} md={8} key={offer.key}>
                <FadeInUp>
                  <Card bordered style={{ borderRadius: 16, border: `2px solid ${offer.color}`, minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <Title level={3} style={{ textAlign: 'center', color: '#222', marginBottom: 0 }}>{offer.title}</Title>
                      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 34, color: offer.color, margin: '12px 0 0 0' }}>{offer.price.toLocaleString()} F CFA<small style={{ fontSize: 16, color: '#888' }}>/mois</small></div>
                      <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>{idx === 0 ? 'Idéal pour démarrer sa carrière.' : idx === 1 ? 'Pour les vendeurs et freelances.' : 'Pour les entreprises qui recrutent.'}</Paragraph>
                      <ul style={{ fontSize: 16, color: '#222', marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
                        {offer.features.map((feature, i) => (
                          <li key={i} style={{ color: feature.included ? undefined : '#bbb', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {feature.included ? <CheckOutlined style={{ color: offer.color, marginRight: 6 }} /> : <CloseOutlined style={{ color: '#ff4d4f', marginRight: 6 }} />}
                            <span style={{ textDecoration: feature.included ? undefined : 'line-through' }}>{feature.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button type="primary" block style={{ borderRadius: 8, fontWeight: 600, background: offer.color, borderColor: offer.color }} onClick={() => navigate('/subscription')}>S'abonner</Button>
                  </Card>
                </FadeInUp>
               </Col>
             ))}
           </Row>
         </div>

        {/* Section Créateur de CV */}
        <div style={{ padding: '4rem 2rem', background: '#fff' }}>
            <Row justify="center" align="middle" gutter={[32, 32]}>
                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                    <FadeInLeft>
                        <LazyImage src="/images/cv-hero.jpg" alt="Créateur de CV" style={{ maxWidth: '100%', borderRadius: '16px', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }} />
                    </FadeInLeft>
                </Col>
                <Col xs={24} md={12}>
                    <FadeInRight>
                        <Title level={2}>Créez un CV qui se démarque</Title>
                        <Paragraph>Notre outil intuitif vous permet de créer des CV professionnels et modernes en quelques clics. Choisissez parmi plusieurs modèles, personnalisez-le et téléchargez-le en PDF.</Paragraph>
                        <Button type="primary" size="large" onClick={() => navigate('/cv-generator')} style={{ background: '#1ec773', borderColor: '#1ec773' }}>Créer un CV</Button>
                    </FadeInRight>
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

        {/* Section Secteurs d'activité */}
        <div style={{ padding: '64px 24px', background: '#f8f9fa' }}>
          <FadeInUp>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Secteurs d'activité</Title>
          </FadeInUp>
          <Carousel autoplay autoplaySpeed={4000} dots={false} responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }, { breakpoint: 1200, settings: { slidesToShow: 3 } }]} slidesToShow={4} style={{ paddingBottom: '32px' }}>
            {sectors.map((sector, index) => (
              <FadeInUp key={index} style={{padding: '10px'}}>
                <div style={{ padding: '0 16px' }}>
                  <SectorCard color={sector.color} onClick={() => navigate('/careers')}>
                    <IconCircle color={sector.color}><span>{sector.icon}</span></IconCircle>
                    <Title level={4}>{sector.name}</Title>
                  </SectorCard>
                </div>
              </FadeInUp>
            ))}
          </Carousel>
        </div>
        
        {/* Section Témoignages */}
        <div style={{ padding: '4rem 2rem', backgroundColor: '#fff' }}>
          <FadeInUp>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Ils nous font confiance</Title>
          </FadeInUp>
          <Row gutter={[24, 24]} justify="center">
            {testimonials.map((testimonial, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index} style={{ display: 'flex' }}>
                <FadeInUp style={{ width: '100%', height: '100%' }}>
                  <Card
                    style={{
                      borderRadius: '20px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      height: '100%',
                    }}
                    bodyStyle={{
                      padding: '2rem',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                  <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                       <div style={{ fontSize: '2rem', color: '#1ec773', marginBottom: '1rem', opacity: 0.6 }}>
                        <FaQuoteLeft />
                      </div>
                      <Paragraph style={{ fontStyle: 'italic', color: '#555', fontSize: '0.95rem', flexGrow: 1, marginBottom: '1.5rem' }}>
                        "{testimonial.text}"
                      </Paragraph>
                      <Space direction="vertical" align="center">
                        <Avatar size={80} src={testimonial.img} style={{ border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Title level={4} style={{ marginTop: '1rem', marginBottom: 0, fontSize: '1.1rem' }}>{testimonial.name}</Title>
                      <Text type="secondary">{testimonial.role}</Text>
                      </Space>
                  </Space>
                </Card>
                </FadeInUp>
              </Col>
            ))}
          </Row>
         </div>

      </Content>
    </Layout>
  );
};

export default Home; 