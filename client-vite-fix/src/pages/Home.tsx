// Forçage de build Vercel - commit technique
import React, { useEffect, useState } from 'react';
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
  RiseOutlined
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

const AnimatedStatistic = ({ value, ...props }: { value: number; [key: string]: any }) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    config: { duration: 1200, easing: t => t * (2 - t) },
  });
  return (
    <animated.span children={number.to((n: number) => `${Math.floor(n)}+`)} />
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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const servicesRef = React.useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const isPremium = hasPremiumAccess(user, hasActiveSubscription);

  React.useEffect(() => {
    JobService.getJobs().then(jobs => {
      setJobs(jobs || []);
      setIsLoading(false);
    });
  }, []);

  React.useEffect(() => {
    marketplaceService.getItems().then(items => {
      setMarketplaceItems(items || []);
    });
  }, []);

  const handleScrollToServices = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const latestJobs = jobs
    ? [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
    : [];

  const MarketplacePreview = () => {
    if (marketplaceItems.length === 0) {
      return <div style={{ textAlign: 'center', color: '#888' }}>Aucun service disponible pour le moment.</div>;
    }

    return (
      <div style={{ display: 'flex', gap: 16 }}>
        {marketplaceItems.slice(0, 3).map((item) => (
          <Card
            key={item.id}
            hoverable
            style={{ width: 'calc(33.33% - 16px)', borderRadius: 18, boxShadow: '0 4px 24px #e3e8f7', border: 'none', minHeight: 180, background: '#fff' }}
            onClick={() => navigate(`/marketplace/${item.id}`)}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Typography.Title level={4} style={{ margin: 0, color: '#457b9d' }}>{item.title}</Typography.Title>
              <Typography.Text strong style={{ color: '#1d3557' }}>{item.contactInfo?.email ?? ''}</Typography.Text>
              <Typography.Text type="secondary">{item.location}</Typography.Text>
            </Space>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div style={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement des offres d'emploi..." /></div>;
  }

  return (
    <Layout>
      <Hero onDiscoverClick={handleScrollToServices} />
      {/* Section Secteurs d'activité */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px' }}>
        <div style={{ background: '#fff', borderRadius: 32, boxShadow: '0 8px 32px #e3e8f7', padding: '48px 0', maxWidth: 1400, margin: '0 auto' }}>
          <Title level={1} style={{ textAlign: 'center', marginBottom: 16, fontWeight: 700, fontSize: 38 }}>
            Secteurs d'<span style={{ color: '#1890ff' }}>activité</span>
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 18, color: '#222', marginBottom: 32, opacity: 0.85, fontWeight: 500 }}>
            Découvrez les opportunités professionnelles dans les secteurs les plus dynamiques au Sénégal
          </Paragraph>
          <Carousel autoplay autoplaySpeed={2500} dots slidesToShow={3} speed={900} easing="ease-in-out" responsive={[{ breakpoint: 900, settings: { slidesToShow: 2 } }, { breakpoint: 600, settings: { slidesToShow: 1 } }]} style={{ width: '100%', padding: '0 0 32px 0' }} data-testid="sector-carousel">
            {SECTEURS.map((secteur, idx) => (
              <div key={secteur.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
                <div
                  style={{
                    width: 320,
                    minHeight: 220,
                    borderRadius: 36,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, ' + secteur.couleur + '22 100%)',
                    boxShadow: '0 12px 40px 0 rgba(24,144,255,0.13)',
                    border: '2px solid #fff',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 36,
                    transition: 'transform 0.28s cubic-bezier(.4,2,.6,1), box-shadow 0.28s, border 0.28s',
                    cursor: 'pointer',
                    opacity: 1,
                    transform: 'none',
                  }}
                  onMouseOver={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.06)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 24px 64px 0 ' + secteur.couleur + '33';
                    (e.currentTarget as HTMLDivElement).style.border = '2.5px solid ' + secteur.couleur;
                  }}
                  onMouseOut={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px 0 rgba(24,144,255,0.13)';
                    (e.currentTarget as HTMLDivElement).style.border = '2px solid #fff';
                  }}
                >
                  <div style={{
                    width: 78,
                    height: 78,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, ' + secteur.couleur + ' 60%, #fff 120%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    boxShadow: '0 0 0 6px ' + secteur.couleur + '22, 0 8px 32px ' + secteur.couleur + '33',
                    position: 'relative',
                  }}>
                    <span style={{ fontSize: 38, color: '#fff', filter: 'drop-shadow(0 2px 8px ' + secteur.couleur + '88)' }}>{secteur.icone}</span>
                  </div>
                  <Title level={4} style={{ color: '#1d3557', margin: 0, fontWeight: 700, fontSize: 25, letterSpacing: 0.5, textShadow: '0 2px 8px #fff8' }}>{secteur.nom}</Title>
                  <Button type="link" style={{ color: secteur.couleur, fontWeight: 600, fontSize: 16, marginTop: 18, display: 'flex', alignItems: 'center' }} onClick={() => navigate('/careers')}>
                    Explorer ce secteur <ArrowRightOutlined style={{ marginLeft: 6 }} />
                  </Button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      {/* Section Emploi */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px' }}>
        <div style={{ background: '#fff', borderRadius: 32, boxShadow: '0 8px 32px #e3e8f7', padding: '48px 0', maxWidth: 1400, margin: '0 auto' }}>
          <Typography.Title level={2} style={{ color: '#1d3557', marginBottom: 24 }}>
            Offres d'emploi récentes
          </Typography.Title>
          <Row gutter={[32, 32]}>
            {isLoading ? (
              <Col span={24}><div style={{ textAlign: 'center' }}>Chargement...</div></Col>
            ) : latestJobs.length === 0 ? (
              <Col span={24}><div style={{ textAlign: 'center', color: '#888' }}>Aucune offre disponible pour le moment.</div></Col>
            ) : (
              latestJobs.map((job) => (
                <Col xs={24} sm={12} md={8} key={job.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <JobCard
                    job={job}
                    user={user}
                    isSubscribed={isPremium}
                    onPostuler={() => navigate('/jobs/' + job.id)}
                    onEdit={() => navigate('/jobs/' + job.id + '/edit')}
                    onDelete={() => navigate('/jobs/' + job.id + '/delete')}
                    onPublish={() => navigate('/jobs/publish')}
                    onViewDetails={() => navigate('/jobs/' + job.id)}
                  />
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
      {/* Section Nos Services Professionnels */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px' }}>
        <div style={{ background: '#fff', borderRadius: 32, boxShadow: '0 8px 32px #e3e8f7', padding: '48px 0', maxWidth: 1400, margin: '0 auto' }}>
          <Title level={1} style={{ textAlign: 'center', marginBottom: 16 }}>
            Nos Services <span style={{ color: '#1890ff' }}>Professionnels</span>
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 18, marginBottom: 40 }}>
            BusinessConnect Sénégal vous offre une gamme complète de services innovants pour propulser votre carrière professionnelle.
          </Paragraph>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card bordered hoverable>
                <Space direction="vertical" size="middle">
                  <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <Title level={3} style={{ margin: 0 }}>Offres d'emploi</Title>
                  <Paragraph>Accédez à des milliers d'offres d'emploi au Sénégal dans tous les secteurs d'activité.</Paragraph>
                  <Button type="link" onClick={() => navigate('/jobs')}>Découvrir <ArrowRightOutlined /></Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card bordered hoverable>
                <Space direction="vertical" size="middle">
                  <BookOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <Title level={3} style={{ margin: 0 }}>Créateur de CV</Title>
                  <Paragraph>Créez un CV professionnel attrayant avec notre générateur de CV intuitif et moderne.</Paragraph>
                  <Button type="link" onClick={() => navigate('/cv-generator')}>Découvrir <ArrowRightOutlined /></Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card bordered hoverable>
                <Space direction="vertical" size="middle">
                  <BulbOutlined style={{ fontSize: 32, color: '#faad14' }} />
                  <Title level={3} style={{ margin: 0 }}>Fiches métiers</Title>
                  <Paragraph>Découvrez des informations détaillées sur différents métiers et secteurs d'activité.</Paragraph>
                  <Button type="link" onClick={() => navigate('/careers')}>Découvrir <ArrowRightOutlined /></Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card bordered hoverable>
                <Space direction="vertical" size="middle">
                  <CrownOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                  <Title level={3} style={{ margin: 0 }}>Formations</Title>
                  <Paragraph>Accédez à des programmes de formation pour développer vos compétences professionnelles.</Paragraph>
                  <Button type="link" onClick={() => navigate('/formations')}>Découvrir <ArrowRightOutlined /></Button>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card bordered hoverable>
                <Space direction="vertical" size="middle">
                  <ShoppingOutlined style={{ fontSize: 32, color: '#b37feb' }} />
                  <Title level={3} style={{ margin: 0 }}>Marketplace</Title>
                  <Paragraph>Achetez et vendez des produits et services professionnels sur notre place de marché.</Paragraph>
                  <Button type="link" onClick={() => navigate('/marketplace')}>Découvrir <ArrowRightOutlined /></Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      {/* Section Abonnements */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px' }}>
        <div style={{ background: '#fff', borderRadius: 32, boxShadow: '0 8px 32px #e3e8f7', padding: '48px 0', maxWidth: 1400, margin: '0 auto' }}>
          <Title level={1} style={{ textAlign: 'center', marginBottom: 16, fontWeight: 700, fontSize: 38 }}>
            Nos <span style={{ color: '#1890ff' }}>Abonnements</span>
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: 18, marginBottom: 40 }}>
            Choisissez l'abonnement qui correspond le mieux à vos besoins professionnels
          </Paragraph>
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <Button type="primary" size="large" style={{ background: '#f59e42', borderColor: '#f59e42', borderRadius: 18, fontWeight: 600, minWidth: 260, fontSize: 18 }} onClick={() => navigate('/subscription')}>
              Voir tous nos abonnements&nbsp;→
            </Button>
          </div>
        </div>
      </div>
      {/* Section CV Professionnel */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', background: 'linear-gradient(90deg, #f7fafc 60%, #e3fcec 100%)', borderRadius: 24, boxShadow: '0 4px 24px #e3e8f7' }}>
        <div style={{ flex: 1, minWidth: 320, padding: '40px 24px 40px 0' }}>
          <Title level={2} style={{ color: '#1d3557', marginBottom: 16 }}>Créez un CV professionnel</Title>
          <Paragraph style={{ fontSize: 18, color: '#333', marginBottom: 24 }}>
            Notre générateur de CV vous permet de créer un CV attrayant et professionnel en quelques minutes. Choisissez parmi plusieurs modèles et personnalisez-le selon vos besoins.
          </Paragraph>
          <ul style={{ fontSize: 16, color: '#222', marginBottom: 32, paddingLeft: 24 }}>
            <li>✔️ Modèles professionnels conçus pour le marché sénégalais</li>
            <li>✔️ Personnalisation simple et intuitive</li>
            <li>✔️ Exportation en format PDF de haute qualité</li>
            <li>✔️ Conseils professionnels pour chaque section</li>
          </ul>
          <Button type="primary" size="large" style={{ borderRadius: 24, fontWeight: 600, transition: 'transform 0.2s, box-shadow 0.2s' }} aria-label="Créer mon CV professionnel" onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = '0 8px 32px #b7e4c7'; }} onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }} onClick={() => navigate('/cv-generator')}>
            Créer mon CV maintenant
          </Button>
        </div>
        <div style={{ flex: 1, minWidth: 320, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24, position: 'relative' }}>
          {/* Carré bleu clair en haut à gauche */}
          <div style={{ position: 'absolute', top: 18, left: 38, width: 220, height: 180, background: '#e3e8f7', borderRadius: 18, zIndex: 1, boxShadow: '0 4px 24px #e3e8f7', opacity: 0.7 }} />
          {/* Carré beige clair en bas à droite */}
          <div style={{ position: 'absolute', bottom: 18, right: 38, width: 220, height: 180, background: '#fdf6e3', borderRadius: 18, zIndex: 1, boxShadow: '0 4px 24px #fdf6e3', opacity: 0.7 }} />
          {/* Image principale */}
          <img src="/images/cv-hero.jpg" alt="Créer un CV professionnel" style={{ width: 500, maxWidth: '100%', borderRadius: 28, boxShadow: '0 8px 32px #b7e4c7', objectFit: 'cover', background: '#fff', position: 'relative', zIndex: 2 }} />
        </div>
      </div>
      {/* Section Marketplace */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px', background: 'linear-gradient(90deg, #f7fafc 60%, #e3e8f7 100%)', borderRadius: 24, boxShadow: '0 4px 24px #e3e8f7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', padding: '32px 0 16px 0' }}>
          <Title level={2} style={{ color: '#7c3aed', margin: 0 }}>Marketplace</Title>
          <div style={{ display: 'flex', gap: 16 }}>
            <Button type="primary" style={{ background: '#f59e42', borderColor: '#f59e42', fontWeight: 600, borderRadius: 20 }} onClick={() => navigate('/marketplace/create')}>Vendre un service</Button>
            <Button type="primary" style={{ background: '#2563eb', borderColor: '#2563eb', fontWeight: 600, borderRadius: 20 }} onClick={() => navigate('/marketplace')}>Explorer tout</Button>
          </div>
        </div>
        <div style={{ minHeight: 180, marginTop: 16 }}>
          <MarketplacePreview />
        </div>
      </div>
      {/* Section BusinessConnect en chiffres */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px' }}>
        <div style={{ background: '#fff', borderRadius: 32, boxShadow: '0 8px 32px #e3e8f7', padding: '48px 0', maxWidth: 1400, margin: '0 auto' }}>
          <Title level={2} style={{ color: '#1d3557', marginBottom: 32, textAlign: 'center' }}>BusinessConnect en chiffres</Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <div style={{
                borderRadius: 36,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, #e0f7fa 100%)',
                boxShadow: '0 12px 40px 0 #1890ff22',
                border: '2px solid #fff',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                padding: '38px 18px 32px 18px',
                minHeight: 140,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.25s, box-shadow 0.25s',
                animation: 'fadeInUp 0.7s 0.1s both',
              }}>
                <div style={{ fontSize: 22, color: '#1890ff', marginBottom: 8, fontWeight: 500 }}>Entreprises</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#1890ff', textShadow: '0 2px 12px #1890ff33' }}>500+</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{
                borderRadius: 36,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, #fce4ec 100%)',
                boxShadow: '0 12px 40px 0 #e91e6333',
                border: '2px solid #fff',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                padding: '38px 18px 32px 18px',
                minHeight: 140,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.25s, box-shadow 0.25s',
                animation: 'fadeInUp 0.7s 0.2s both',
              }}>
                <div style={{ fontSize: 22, color: '#e91e63', marginBottom: 8, fontWeight: 500 }}>Offres d'emploi</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#e91e63', textShadow: '0 2px 8px #e91e633', lineHeight: 1.3 }}>De nouvelles offres<br />publiées chaque jour</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{
                borderRadius: 36,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, #e8f5e9 100%)',
                boxShadow: '0 12px 40px 0 #43a04733',
                border: '2px solid #fff',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                padding: '38px 18px 32px 18px',
                minHeight: 140,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.25s, box-shadow 0.25s',
                animation: 'fadeInUp 0.7s 0.3s both',
              }}>
                <div style={{ fontSize: 22, color: '#43a047', marginBottom: 8, fontWeight: 500 }}>Membres</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#43a047', textShadow: '0 2px 12px #43a04733' }}>10&nbsp;000+</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{
                borderRadius: 36,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, #fff3e0 100%)',
                boxShadow: '0 12px 40px 0 #ff980033',
                border: '2px solid #fff',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                padding: '38px 18px 32px 18px',
                minHeight: 140,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.25s, box-shadow 0.25s',
                animation: 'fadeInUp 0.7s 0.4s both',
              }}>
                <div style={{ fontSize: 22, color: '#ff9800', marginBottom: 8, fontWeight: 500 }}>Secteurs</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#ff9800', textShadow: '0 2px 12px #ff980033' }}>15+</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      {/* Section Ils nous font confiance */}
      <div style={{ width: '100vw', maxWidth: '100vw', margin: '40px 0 0 0', padding: '0 32px' }}>
        <div style={{ background: '#fff', borderRadius: 32, boxShadow: '0 8px 32px #e3e8f7', padding: '48px 0', maxWidth: 1400, margin: '0 auto' }}>
          <Title level={2} style={{ color: '#1d3557', marginBottom: 32, textAlign: 'center' }}>Ils nous font confiance</Title>
          <Row gutter={[32, 32]} justify="center">
            {TESTIMONIALS.map((t, idx) => (
              <Col xs={24} sm={12} md={12} lg={6} key={idx}>
                <Card
                  style={{ borderRadius: 20, boxShadow: '0 4px 24px #e3e8f7', border: 'none', textAlign: 'center', padding: 0 }}
                  styles={{ body: { padding: 32 } }}
                >
                  <img src={t.img} alt={t.name} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', marginBottom: 18, border: '4px solid #e0e7ff' }} />
                  <Title level={4} style={{ margin: 0, color: '#2563eb' }}>{t.name}</Title>
                  <Text type="secondary" style={{ fontWeight: 600, fontSize: 16 }}>{t.role}</Text>
                  <Paragraph style={{ marginTop: 18, fontSize: 17, color: '#333', fontStyle: 'italic' }}>
                    "{t.text}"
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      {/* Section Appel à l'action */}
      <div style={{ width: '100vw', maxWidth: '100vw', background: '#2056a8', color: '#fff', padding: '64px 0 56px 0', margin: '40px auto 0 auto', textAlign: 'center' }}>
        <Typography.Title level={2} style={{ color: '#fff', marginBottom: 24, fontSize: 36, fontWeight: 700 }}>
          Prêt à booster votre carrière professionnelle ?
        </Typography.Title>
        <Typography.Paragraph style={{ color: '#fff', fontSize: 20, marginBottom: 36, maxWidth: 700, margin: '0 auto' }}>
          Rejoignez BusinessConnect Sénégal dès aujourd'hui et accédez à toutes nos fonctionnalités pour développer votre réseau professionnel.
        </Typography.Paragraph>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Button type="primary" size="large" style={{ background: '#ffa940', borderColor: '#ffa940', color: '#fff', fontWeight: 600, borderRadius: 10, minWidth: 200, fontSize: 18 }} onClick={() => navigate('/register')}>
            S'inscrire gratuitement
          </Button>
          <Button type="default" size="large" style={{ background: '#fff', color: '#2056a8', fontWeight: 600, borderRadius: 10, minWidth: 180, fontSize: 18, border: 'none' }} onClick={() => navigate('/contact')}>
            Contactez-nous
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Home; 