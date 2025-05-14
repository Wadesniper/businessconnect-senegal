import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Rate, Tag, Carousel, Statistic } from 'antd';
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
import { Job } from '../types/job';
import { marketplaceService, MarketplaceItem } from '../services/marketplaceService';
import { useSpring, animated } from 'react-spring';

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
    img: '/images/testimonials/man-beret.png',
    name: 'Mamadou Diop',
    role: 'Recruteur',
    text: `Grâce à BusinessConnect, j'ai pu recruter rapidement des profils qualifiés pour mon entreprise. La plateforme facilite la mise en relation avec des candidats motivés et sérieux, ce qui a considérablement simplifié notre processus de recrutement.`
  },
  {
    img: '/images/testimonials/man-headphones.png',
    name: 'Cheikh Ndiaye',
    role: 'Chercheur d\'emploi',
    text: `Après plusieurs mois de recherche, c'est sur BusinessConnect que j'ai enfin trouvé un emploi qui correspond à mes compétences. Les offres sont variées et la navigation sur le site est très intuitive. Je recommande vivement à tous les jeunes diplômés !`
  },
  {
    img: '/images/testimonials/woman-glasses.png',
    name: 'Awa Sarr',
    role: 'Étudiante',
    text: `En tant qu'étudiante, j'ai pu trouver un stage enrichissant grâce à BusinessConnect. J'ai aussi pu élargir mon réseau professionnel et découvrir de nombreuses opportunités adaptées à mon profil. C'est un vrai tremplin pour débuter sa carrière.`
  },
  {
    img: '/images/testimonials/woman-hijab.png',
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
              <Typography.Text strong style={{ color: '#1d3557' }}>{item.contactInfo.email}</Typography.Text>
              <Typography.Text type="secondary">{item.location}</Typography.Text>
            </Space>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <Hero onDiscoverClick={handleScrollToServices} />
      {/* Section Emploi */}
      <Content style={{ background: '#f7faff', padding: '40px 0 0 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto 40px auto', padding: '0 16px' }}>
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
                <Col xs={24} sm={12} md={8} key={job.id}>
                  <Card
                    hoverable
                    data-testid="job-preview"
                    style={{ borderRadius: 18, boxShadow: '0 4px 24px #e3e8f7', border: 'none', minHeight: 180, background: '#fff' }}
                    onClick={() => navigate('/jobs')}
                  >
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      <Typography.Title level={4} style={{ margin: 0, color: '#457b9d' }}>{job.title}</Typography.Title>
                      <Typography.Text strong style={{ color: '#1d3557' }}>{job.company}</Typography.Text>
                      <Typography.Text type="secondary">{job.location}</Typography.Text>
                      <Button type="primary" ghost style={{ marginTop: 8, alignSelf: 'flex-start' }} aria-label="Voir toutes les offres d'emploi" onClick={e => { e.stopPropagation(); navigate('/jobs'); }}>Voir toutes les offres</Button>
                    </Space>
                  </Card>
                </Col>
              ))
            )}
            </Row>
          </div>
        <div ref={servicesRef} style={{ marginTop: 60, marginBottom: 40 }}>
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
            <Col xs={24} sm={12} md={8} lg={8}>
              <Card variant="outlined" hoverable>
                <Space direction="vertical" size="middle">
                  <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <Title level={3} style={{ margin: 0 }}>Forum</Title>
                  <Paragraph>Échangez avec d'autres professionnels et partagez vos expériences sur notre forum.</Paragraph>
                  <Button type="link" onClick={() => navigate('/forum')}>Découvrir <ArrowRightOutlined /></Button>
                      </Space>
                    </Card>
                </Col>
            </Row>
        </div>
        {/* Section CV Professionnel */}
        <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', background: 'linear-gradient(90deg, #f7fafc 60%, #e3fcec 100%)', borderRadius: 24, boxShadow: '0 4px 24px #e3e8f7' }}>
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
          <div style={{ flex: 1, minWidth: 320, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <img src="/images/cv-clipboard.jpg" alt="Créer un CV professionnel" style={{ width: 350, maxWidth: '100%', borderRadius: 18, boxShadow: '0 8px 32px #b7e4c7' }} />
          </div>
        </div>
        {/* Section Marketplace */}
        <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 16px', background: 'linear-gradient(90deg, #f7fafc 60%, #e3e8f7 100%)', borderRadius: 24, boxShadow: '0 4px 24px #e3e8f7' }}>
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
        {/* Section Secteurs */}
        <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 16px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 32, textAlign: 'center' }}>Secteurs d'activité</Title>
          <Carousel autoplay autoplaySpeed={2500} dots slidesToShow={3} speed={900} easing="ease-in-out" responsive={[{ breakpoint: 900, settings: { slidesToShow: 2 } }, { breakpoint: 600, settings: { slidesToShow: 1 } }]} style={{ width: '100%', padding: '0 0 32px 0' }} data-testid="sector-carousel">
            {SECTEURS.map((secteur) => (
              <div key={secteur.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 260 }}>
                  <Card 
                    hoverable 
                  style={{ width: 320, minHeight: 220, borderRadius: 20, boxShadow: '0 4px 24px #e3e8f7', border: 'none', background: secteur.couleur, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  styles={{ body: { padding: 24 } }}
                >
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{secteur.icone}</div>
                  <Title level={4} style={{ color: '#fff', margin: 0 }}>{secteur.nom}</Title>
                  <Paragraph style={{ color: '#f0f0f0', margin: '12px 0 0 0', textAlign: 'center' }}>{secteur.description}</Paragraph>
                </Card>
                    </div>
            ))}
          </Carousel>
                    </div>
        {/* Section Statistiques */}
        <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 16px' }}>
          <Title level={2} style={{ color: '#1d3557', marginBottom: 32, textAlign: 'center' }}>BusinessConnect en chiffres</Title>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px #e3e8f7', textAlign: 'center', background: '#e0f7fa' }} data-testid="stat-card" variant="outlined">
                <Statistic title="Entreprises" valueRender={() => <AnimatedStatistic value={500} />} value={500} valueStyle={{ color: '#1890ff', fontWeight: 700, fontSize: 36 }} suffix="+" />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px #e3e8f7', textAlign: 'center', background: '#fce4ec' }} data-testid="stat-card" variant="outlined">
                <Statistic title="Offres d'emploi" valueRender={() => <AnimatedStatistic value={1200} />} value={1200} valueStyle={{ color: '#e91e63', fontWeight: 700, fontSize: 36 }} suffix="+" />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px #e3e8f7', textAlign: 'center', background: '#e8f5e9' }} data-testid="stat-card" variant="outlined">
                <Statistic title="Membres" valueRender={() => <AnimatedStatistic value={8000} />} value={8000} valueStyle={{ color: '#43a047', fontWeight: 700, fontSize: 36 }} suffix="+" />
                  </Card>
              </Col>
            <Col xs={24} sm={12} md={6}>
              <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px #e3e8f7', textAlign: 'center', background: '#fff3e0' }} data-testid="stat-card" variant="outlined">
                <Statistic title="Secteurs" valueRender={() => <AnimatedStatistic value={SECTEURS.length} />} value={SECTEURS.length} valueStyle={{ color: '#ff9800', fontWeight: 700, fontSize: 36 }} suffix="+" />
                  </Card>
              </Col>
            </Row>
        </div>
        {/* Section Témoignages */}
        <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 16px' }}>
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
                    “{t.text}”
                </Paragraph>
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