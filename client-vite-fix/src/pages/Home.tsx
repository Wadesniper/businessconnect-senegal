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
  EnvironmentOutlined
} from '@ant-design/icons';
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
        <StatsSection />
        {/* Section Nos Services */}
        <div ref={servicesRef} style={{ padding: '64px 24px', background: '#fff' }}>
            <Row justify="center" style={{ marginBottom: 48, textAlign: 'center' }}>
                <Col xs={24} md={20} lg={16}>
                    <Title level={2} style={{ color: '#002766', fontWeight: 700, marginBottom: 8 }}>Nos Services</Title>
                    <Paragraph style={{ fontSize: 18, color: '#333' }}>
                        BusinessConnect Sénégal vous offre une gamme complète de services innovants pour propulser votre carrière.
                    </Paragraph>
                </Col>
            </Row>
            <Row gutter={[32, 32]} justify="center">
             {[
               { title: "Offres d'emploi", icon: <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />, text: "Accédez à des milliers d'offres dans tous les secteurs.", link: '/jobs' },
               { title: "Créateur de CV", icon: <BookOutlined style={{ fontSize: 32, color: '#1ec773' }} />, text: "Créez un CV professionnel et moderne avec notre générateur.", link: '/cv-generator' },
               { title: "Fiches métiers", icon: <BulbOutlined style={{ fontSize: 32, color: '#faad14' }} />, text: "Découvrez des informations détaillées sur différents métiers.", link: '/careers' },
               { title: "Formations", icon: <CrownOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />, text: "Développez vos compétences avec nos programmes de formation.", link: '/formations' },
               { title: "Marketplace", icon: <ShoppingOutlined style={{ fontSize: 32, color: '#b37feb' }} />, text: "Achetez et vendez des produits et services professionnels.", link: '/marketplace' },
             ].map(service => (
               <Col key={service.title} xs={24} sm={12} md={8} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                 <Card 
                   hoverable
                   style={{ 
                     borderRadius: 16, 
                     border: '1px solid #f0f0f0', 
                     boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                     width: '100%',
                     display: 'flex',
                     flexDirection: 'column'
                   }}
                   bodyStyle={{
                     flex: 1,
                     display: 'flex',
                     flexDirection: 'column',
                     justifyContent: 'space-between',
                     textAlign: 'center',
                     padding: '24px 16px'
                   }}
                 >
                   <div>
                     {service.icon}
                     <Title level={4} style={{ margin: '16px 0 8px 0' }}>{service.title}</Title>
                     <Paragraph style={{ minHeight: 44 }}>{service.text}</Paragraph>
                   </div>
                   <Button type="link" onClick={() => navigate(service.link)} style={{fontWeight: 'bold'}}>Découvrir <ArrowRightOutlined /></Button>
                 </Card>
               </Col>
             ))}
           </Row>
        </div>

        {/* Section Abonnements */}
         <div style={{ padding: '64px 24px', background: '#f8f9fa' }}>
           <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Nos Abonnements</Title>
           <Row gutter={[32, 32]} justify="center">
             <Col xs={24} sm={12} md={8}>
                <Card bordered style={{ borderRadius: 16, border: '2px solid #1ec773', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <Title level={3} style={{ textAlign: 'center', color: '#222', marginBottom: 0 }}>Étudiant & Candidat</Title>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 34, color: '#1ec773', margin: '12px 0 0 0' }}>1 000 F CFA<small style={{ fontSize: 16, color: '#888' }}>/mois</small></div>
                    <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>Idéal pour démarrer sa carrière.</Paragraph>
                    <ul style={{ fontSize: 16, color: '#222', marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
                      <li>✔️ Accès à toutes les offres</li>
                      <li>✔️ Création de CV professionnels</li>
                      <li>✔️ Accès aux formations</li>
                      <li>✔️ Postuler en illimité</li>
                      <li style={{ color: '#bbb' }}>✖️ Publier sur le Marketplace</li>
                      <li style={{ color: '#bbb' }}>✖️ Publier des offres d'emploi</li>
                    </ul>
                  </div>
                  <Button type="primary" block style={{ borderRadius: 8, fontWeight: 600, background: '#1ec773', borderColor: '#1ec773' }} onClick={() => navigate('/subscription')}>S'abonner</Button>
                </Card>
             </Col>
             <Col xs={24} sm={12} md={8}>
               <Card bordered style={{ borderRadius: 16, border: '2px solid #1890ff', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                 <div>
                    <Title level={3} style={{ textAlign: 'center', color: '#222', marginBottom: 0 }}>Annonceur Marketplace</Title>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 34, color: '#1890ff', margin: '12px 0 0 0' }}>5 000 F CFA<small style={{ fontSize: 16, color: '#888' }}>/mois</small></div>
                    <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>Pour les vendeurs et freelances.</Paragraph>
                    <ul style={{ fontSize: 16, color: '#222', marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
                      <li>✔️ Tous les avantages Étudiant</li>
                      <li>✔️ Publier sur le Marketplace</li>
                      <li>✔️ Visibilité accrue</li>
                      <li>✔️ Messagerie professionnelle</li>
                      <li>✔️ Notifications en temps réel</li>
                      <li style={{ color: '#bbb' }}>✖️ Publier des offres d'emploi</li>
                    </ul>
                 </div>
                 <Button type="primary" block style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => navigate('/subscription')}>S'abonner</Button>
               </Card>
             </Col>
             <Col xs={24} sm={12} md={8}>
               <Card bordered style={{ borderRadius: 16, border: '2px solid #8a2be2', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                 <div>
                    <Title level={3} style={{ textAlign: 'center', color: '#222', marginBottom: 0 }}>Employeur</Title>
                    <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 34, color: '#8a2be2', margin: '12px 0 0 0' }}>9 000 F CFA<small style={{ fontSize: 16, color: '#888' }}>/mois</small></div>
                    <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>Pour les entreprises qui recrutent.</Paragraph>
                    <ul style={{ fontSize: 16, color: '#222', marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
                      <li>✔️ Tous les avantages Annonceur</li>
                      <li>✔️ Publier des offres d'emploi</li>
                      <li>✔️ Accès à la CVthèque</li>
                      <li>✔️ Tableau de bord de suivi</li>
                      <li>✔️ Statistiques des offres</li>
                      <li>✔️ Support prioritaire</li>
                    </ul>
                 </div>
                 <Button type="primary" block style={{ borderRadius: 8, fontWeight: 600, background: '#8a2be2', borderColor: '#8a2be2' }} onClick={() => navigate('/subscription')}>S'abonner</Button>
               </Card>
             </Col>
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
          <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>Ils nous font confiance</Title>
          <Row gutter={[16, 16]} justify="center">
            {TESTIMONIALS.map((testimonial, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
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

        {/* Section Secteurs d'activité */}
         <div style={{ padding: '64px 24px', background: '#f8f9fa' }}>
           <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Découvrez par Secteurs</Title>
           <Carousel autoplay autoplaySpeed={4000} dots={false} responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }, { breakpoint: 1200, settings: { slidesToShow: 3 } }]} slidesToShow={4} style={{ paddingBottom: '32px' }}>
             {SECTEURS.map((secteur) => (
               <div key={secteur.id} style={{ padding: '0 16px' }}>
                 <SectorCard color={secteur.couleur} onClick={() => navigate('/careers')}>
                   <IconCircle color={secteur.couleur}><span>{secteur.icone}</span></IconCircle>
                   <Title level={4}>{secteur.nom}</Title>
                 </SectorCard>
               </div>
             ))}
           </Carousel>
         </div>

      </Content>
    </Layout>
  );
};

export default Home; 