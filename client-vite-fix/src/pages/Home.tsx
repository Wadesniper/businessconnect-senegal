// Forçage de build Vercel - commit technique
import React, { useEffect, useState, useRef } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Rate, Tag, Carousel, Statistic, Spin } from 'antd';
import { motion, useScroll, useTransform } from 'framer-motion';
import styled from '@emotion/styled';
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
import JobCard from './jobs/components/JobCard';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import { hasPremiumAccess } from '../utils/premiumAccess';
import manBeret from '../assets/testimonials/man-beret.png';
import manHeadphones from '../assets/testimonials/man-headphones.png';
import womanGlasses from '../assets/testimonials/woman-glasses.png';
import womanHijab from '../assets/testimonials/woman-hijab.png';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const SECTEURS = [
  { id: 1, nom: 'Informatique', icone: <TeamOutlined />, couleur: '#1890ff', description: 'Secteur lié à l\'informatique et à la technologie' },
  { id: 2, nom: 'Finance', icone: <ShoppingOutlined />, couleur: '#52c41a', description: 'Secteur lié à la finance et à l\'économie' },
  { id: 3, nom: 'Santé', icone: <BulbOutlined />, couleur: '#faad14', description: 'Secteur lié à la santé et à la médecine' },
  { id: 4, nom: 'Éducation', icone: <BookOutlined />, couleur: '#ff4d4f', description: 'Secteur lié à l\'éducation et à la formation' },
  { id: 5, nom: 'Marketing', icone: <ShoppingOutlined />, couleur: '#b37feb', description: 'Secteur lié au marketing et à la communication' },
  { id: 6, nom: 'Industrie', icone: <BuildOutlined />, couleur: '#1890ff', description: 'Secteur lié à l\'industrie et à la production' },
  { id: 7, nom: 'Services', icone: <ShoppingOutlined />, couleur: '#52c41a', description: 'Secteur lié aux services et à la prestation de services' },
  { id: 8, nom: 'Agriculture', icone: <ShoppingOutlined />, couleur: '#faad14', description: 'Secteur lié à l\'agriculture et à l\'élevage' },
  { id: 9, nom: 'Tourisme', icone: <ShoppingOutlined />, couleur: '#ff4d4f', description: 'Secteur lié au tourisme et à l\'hébergement' },
  { id: 10, nom: 'Communication', icone: <ShoppingOutlined />, couleur: '#b37feb', description: 'Secteur lié à la communication et à la média' },
];

const AnimatedStatistic = ({ value, suffix = '+', duration = 1200, color }: { value: number; suffix?: string; duration?: number; color?: string }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    config: { duration, easing: t => t * (2 - t) },
    reset: true,
  });
  return (
    <animated.span style={{ color, fontWeight: 800 }}>
      {number.to((n: number) => `${Math.floor(n)}${suffix}`)}
    </animated.span>
  );
};

// Section Témoignages
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

// Ajout des composants stylés premium pour les cartes secteurs
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
    JobService.getJobs().then(jobs => {
      setJobs(jobs || []);
      setIsLoading(false);
    });
    marketplaceService.getItems().then(items => {
      setMarketplaceItems(items || []);
    });
  }, []);

  const handleScrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const latestJobs = jobs
    ? [...jobs]
        .filter(job => job?.id && job.createdAt && !isNaN(new Date(job.createdAt).getTime()))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    : [];

  const MarketplacePreview = () => {
    if (marketplaceItems.length === 0) {
      return <div style={{ textAlign: 'center', color: '#888' }}>Aucun service disponible pour le moment.</div>;
    }

    const formatPrice = (item: MarketplaceItem) => {
      switch (item.priceType) {
        case 'fixed':
          return item.price ? `${item.price.toLocaleString()} FCFA` : 'Prix non spécifié';
        case 'range':
          return item.minPrice && item.maxPrice ? `${item.minPrice.toLocaleString()} - ${item.maxPrice.toLocaleString()} FCFA` : 'Fourchette de prix non définie';
        case 'negotiable':
          return 'Prix négociable';
        default:
          return typeof item.price === 'number' ? `${item.price.toLocaleString()} FCFA` : 'Prix non spécifié';
      }
    };

    return (
      <Row gutter={[16, 16]}>
        {marketplaceItems.slice(0, 3).map((item) => {
          if (!item?.id || !item.title) return null;

          return (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <Card
                hoverable
                cover={
                  Array.isArray(item.images) && item.images[0] ? (
                    <img
                      alt={item.title}
                      src={item.images[0]}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  ) : null
                }
                bodyStyle={{ padding: '16px' }}
                onClick={() => navigate(`/marketplace/${item.id}`)}
              >
                <Typography.Title level={5} style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
                  {formatPrice(item)}
                </Typography.Text>
                {item.location && (
                  <Typography.Text type="secondary" style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    {item.location}
                  </Typography.Text>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  if (isLoading) {
    return <div style={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement..." /></div>;
  }

  return (
    <Layout>
      <Content style={{ overflow: 'hidden' }}>
        <Hero onDiscoverClick={handleScrollToServices} />

        {/* Section Nos Services */}
        <div ref={servicesRef} style={{ padding: '64px 24px', background: '#f0f2f5' }}>
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
              { title: "Créateur de CV", icon: <BookOutlined style={{ fontSize: 32, color: '#52c41a' }} />, text: "Créez un CV professionnel et moderne avec notre générateur.", link: '/cv-generator' },
              { title: "Fiches métiers", icon: <BulbOutlined style={{ fontSize: 32, color: '#faad14' }} />, text: "Découvrez des informations détaillées sur différents métiers.", link: '/careers' },
              { title: "Formations", icon: <CrownOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />, text: "Développez vos compétences avec nos programmes de formation.", link: '/formations' },
              { title: "Marketplace", icon: <ShoppingOutlined style={{ fontSize: 32, color: '#b37feb' }} />, text: "Achetez et vendez des produits et services professionnels.", link: '/marketplace' },
            ].map(service => (
              <Col key={service.title} xs={24} sm={12} md={8} lg={8}>
                <Card hoverable>
                  <Space direction="vertical" size="middle" align="center" style={{ width: '100%', textAlign: 'center' }}>
                    {service.icon}
                    <Title level={4} style={{ margin: 0 }}>{service.title}</Title>
                    <Paragraph>{service.text}</Paragraph>
                    <Button type="link" onClick={() => navigate(service.link)}>Découvrir <ArrowRightOutlined /></Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section Secteurs d'activité */}
        <div style={{ padding: '64px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Secteurs d'Activité</Title>
          <Carousel autoplay autoplaySpeed={3000} dots responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }, { breakpoint: 1200, settings: { slidesToShow: 2 } }]} slidesToShow={3} style={{ paddingBottom: '32px' }}>
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

        {/* Section Emploi */}
        <div style={{ padding: '64px 24px', background: '#f0f2f5' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Offres d'emploi récentes</Title>
          <Row gutter={[32, 32]} justify="center">
            {latestJobs.length > 0 ? latestJobs.map((job) => (
              <Col key={job.id} xs={24} sm={12} md={8}>
                <JobCard
                  job={job}
                  user={user}
                  isSubscribed={isPremium}
                  onViewDetails={() => navigate(`/jobs/${job.id}`)}
                  onPostuler={() => navigate(`/jobs/${job.id}`)}
                  onEdit={() => navigate(`/jobs/${job.id}/edit`)}
                  onDelete={() => navigate(`/jobs/${job.id}/delete`)}
                  onPublish={() => navigate('/jobs/publish')}
                />
              </Col>
            )) : <Paragraph>Aucune offre d'emploi pour le moment.</Paragraph>}
          </Row>
        </div>

        {/* Section Abonnements */}
        <div style={{ padding: '64px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Nos Abonnements</Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card bordered style={{ borderRadius: 16, border: '2px solid #1890ff', minHeight: 420 }}>
                <Title level={3} style={{ textAlign: 'center', color: '#222', marginBottom: 0 }}>Étudiant & Chercheur d'emploi</Title>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 34, color: '#1890ff', margin: '12px 0 0 0' }}>1 000 F CFA<small style={{ fontSize: 16, color: '#888' }}>/mois</small></div>
                <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>Idéal pour les étudiants et demandeurs d'emploi</Paragraph>
                <ul style={{ fontSize: 16, color: '#222', marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
                  <li>✔️ Accès à toutes les offres d'emploi</li>
                  <li>✔️ Création de CV professionnels</li>
                  <li>✔️ Accès aux formations en ligne</li>
                  <li>✔️ Postuler aux offres illimitées</li>
                  <li style={{ color: '#bbb' }}>✖️ Publication d'annonces</li>
                  <li style={{ color: '#bbb' }}>✖️ Publication d'offres d'emploi</li>
                </ul>
                <Button type="primary" block style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => navigate('/subscription')}>S'abonner maintenant</Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered style={{ borderRadius: 16, border: '2px solid #f59e42', minHeight: 420 }}>
                <Title level={3} style={{ textAlign: 'center', color: '#222', marginBottom: 0 }}>Annonceur Marketplace</Title>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 34, color: '#f59e42', margin: '12px 0 0 0' }}>5 000 F CFA<small style={{ fontSize: 16, color: '#888' }}>/mois</small></div>
                <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>Pour les vendeurs de produits et services</Paragraph>
                <ul style={{ fontSize: 16, color: '#222', marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
                  <li>✔️ Tous les avantages du forfait Étudiant</li>
                  <li>✔️ Publication d'annonces sur le marketplace</li>
                  <li>✔️ Visibilité auprès des entreprises</li>
                  <li>✔️ Messagerie professionnelle</li>
                  <li>✔️ Notifications en temps réel</li>
                  <li style={{ color: '#bbb' }}>✖️ Publication d'offres d'emploi</li>
                </ul>
                <Button type="primary" block style={{ borderRadius: 8, fontWeight: 600, background: '#f59e42', borderColor: '#f59e42' }} onClick={() => navigate('/subscription')}>S'abonner maintenant</Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered style={{ borderRadius: 16, border: '2px solid #43a047', minHeight: 420 }}>
                <Title level={3} style={{ textAlign: 'center', color: '#222', marginBottom: 0 }}>Employeur</Title>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 34, color: '#43a047', margin: '12px 0 0 0' }}>9 000 F CFA<small style={{ fontSize: 16, color: '#888' }}>/mois</small></div>
                <Paragraph style={{ textAlign: 'center', color: '#888', marginBottom: 18 }}>Pour les entreprises qui recrutent</Paragraph>
                <ul style={{ fontSize: 16, color: '#222', marginBottom: 24, paddingLeft: 0, listStyle: 'none' }}>
                  <li>✔️ Tous les avantages du forfait Vendeur</li>
                  <li>✔️ Publication d'offres d'emploi</li>
                  <li>✔️ Accès à la base de CV des candidats</li>
                  <li>✔️ Tableau de bord des candidatures</li>
                  <li>✔️ Statistiques de vos offres</li>
                  <li>✔️ Support prioritaire</li>
                </ul>
                <Button type="primary" block style={{ borderRadius: 8, fontWeight: 600, background: '#43a047', borderColor: '#43a047' }} onClick={() => navigate('/subscription')}>S'abonner maintenant</Button>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Section CV Professionnel */}
        <div style={{ padding: '64px 24px', background: 'linear-gradient(90deg, #f7fafc 60%, #e3fcec 100%)' }}>
          <Row justify="center" align="middle" gutter={48}>
            <Col xs={24} md={12}>
              <Title level={2}>Créez un CV professionnel</Title>
              <Paragraph>Notre générateur de CV vous permet de créer un CV attrayant en quelques minutes.</Paragraph>
              <Button type="primary" size="large" onClick={() => navigate('/cv-generator')}>Créer mon CV maintenant</Button>
            </Col>
            <Col xs={24} md={12}>
              <img src="/images/cv-hero.jpg" alt="Créer un CV professionnel" style={{ width: '100%', borderRadius: 16 }} />
            </Col>
          </Row>
        </div>

        {/* Section Marketplace */}
        <div style={{ padding: '64px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Marketplace</Title>
          <MarketplacePreview />
        </div>

        {/* Section Chiffres */}
        <div style={{ padding: '64px 24px', background: '#f0f2f5' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>BusinessConnect en chiffres</Title>
          <Row gutter={[32, 32]} justify="center" style={{ textAlign: 'center' }}>
            <Col xs={12} md={6}><Statistic title="Entreprises" value={500} formatter={() => <AnimatedStatistic value={500} />} /></Col>
            <Col xs={12} md={6}><Statistic title="Offres" value={1000} valueStyle={{ color: '#e91e63' }} formatter={() => <AnimatedStatistic value={1000} />} /></Col>
            <Col xs={12} md={6}><Statistic title="Membres" value={10000} formatter={() => <AnimatedStatistic value={10000} />} /></Col>
            <Col xs={12} md={6}><Statistic title="Secteurs" value={15} valueStyle={{ color: '#ff9800' }} formatter={() => <AnimatedStatistic value={15} />} /></Col>
          </Row>
        </div>

        {/* Section Témoignages */}
        <div style={{ padding: '64px 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#002766', fontWeight: 700 }}>Ils nous font confiance</Title>
          <Row gutter={[32, 32]} justify="center">
            {TESTIMONIALS.map((t, idx) => (
              <Col xs={24} sm={12} md={6} key={idx}>
                <Card style={{ textAlign: 'center' }}>
                  <Avatar size={64} src={t.img} />
                  <Title level={5} style={{ marginTop: 16 }}>{t.name}</Title>
                  <Text type="secondary">{t.role}</Text>
                  <Paragraph style={{ marginTop: 8 }}>"{t.text}"</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Section Appel à l'action */}
        <div style={{ padding: '64px 24px', background: '#2056a8', color: '#fff', textAlign: 'center' }}>
          <Title level={2} style={{ color: '#fff' }}>Prêt à booster votre carrière ?</Title>
          <Paragraph style={{ color: '#fff', fontSize: 16 }}>
            Rejoignez BusinessConnect Sénégal dès aujourd'hui.
          </Paragraph>
          <Space>
            <Button type="primary" size="large" onClick={() => navigate('/register')}>S'inscrire gratuitement</Button>
            <Button size="large" onClick={() => navigate('/contact')}>Contactez-nous</Button>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default Home; 