import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Tag, Rate, Space } from 'antd';
import {
  BookOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  padding: 60px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FormationCard = styled(Card)`
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
`;

const CategoryTag = styled(Tag)`
  font-size: 0.9rem;
  padding: 4px 12px;
  border-radius: 20px;
`;

const formations = [
  {
    id: 1,
    title: 'Développement Web Full Stack',
    category: 'Développement',
    duration: '6 mois',
    level: 'Débutant à Avancé',
    rating: 4.8,
    price: '150 000 FCFA',
    image: '/images/formations/web-dev.jpg',
    description: 'Maîtrisez le développement web moderne avec HTML, CSS, JavaScript, React et Node.js.',
    features: [
      'Projets pratiques',
      'Support personnalisé',
      'Certification professionnelle',
      'Accès à vie au contenu'
    ]
  },
  {
    id: 2,
    title: 'Marketing Digital',
    category: 'Marketing',
    duration: '3 mois',
    level: 'Intermédiaire',
    rating: 4.7,
    price: '100 000 FCFA',
    image: '/images/formations/marketing.jpg',
    description: 'Apprenez les stratégies de marketing digital, SEO, réseaux sociaux et publicité en ligne.',
    features: [
      'Études de cas réels',
      'Outils professionnels',
      'Mentorat individuel',
      'Certification reconnue'
    ]
  },
  {
    id: 3,
    title: 'Data Science & IA',
    category: 'Data',
    duration: '4 mois',
    level: 'Avancé',
    rating: 4.9,
    price: '200 000 FCFA',
    image: '/images/formations/data-science.jpg',
    description: 'Plongez dans l\'analyse de données, le machine learning et l\'intelligence artificielle.',
    features: [
      'Projets data réels',
      'Infrastructure cloud',
      'Support technique 24/7',
      'Certification internationale'
    ]
  },
  {
    id: 4,
    title: 'Design UX/UI',
    category: 'Design',
    duration: '3 mois',
    level: 'Tous niveaux',
    rating: 4.6,
    price: '120 000 FCFA',
    image: '/images/formations/ux-design.jpg',
    description: 'Créez des interfaces utilisateur modernes et des expériences utilisateur optimales.',
    features: [
      'Portfolio professionnel',
      'Outils de design',
      'Feedback personnalisé',
      'Certification UX/UI'
    ]
  }
];

const FormationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StyledLayout>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={1}>
            Nos Formations Certifiantes
          </Title>
          <Paragraph style={{ fontSize: '1.2rem', maxWidth: 800, margin: '20px auto' }}>
            Développez vos compétences professionnelles avec nos formations en ligne de qualité.
            Accédez à des contenus exclusifs et obtenez des certifications reconnues.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {formations.map(formation => (
            <Col xs={24} sm={12} lg={6} key={formation.id}>
              <FormationCard
                cover={
                  <img
                    alt={formation.title}
                    src={formation.image}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button
                    type="primary"
                    block
                    onClick={() => navigate(`/formations/${formation.id}`)}
                  >
                    S'inscrire
                  </Button>
                ]}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <CategoryTag color="blue">{formation.category}</CategoryTag>
                  
                  <Title level={4} style={{ marginBottom: 0 }}>
                    {formation.title}
                  </Title>

                  <Space split={<Text type="secondary">•</Text>}>
                    <Space>
                      <ClockCircleOutlined />
                      <Text>{formation.duration}</Text>
                    </Space>
                    <Space>
                      <UserOutlined />
                      <Text>{formation.level}</Text>
                    </Space>
                  </Space>

                  <Rate disabled defaultValue={formation.rating} style={{ fontSize: 16 }} />
                  
                  <Paragraph style={{ marginBottom: 16 }}>
                    {formation.description}
                  </Paragraph>

                  <Title level={5} style={{ color: '#1890ff' }}>
                    {formation.price}
                  </Title>

                  <div>
                    {formation.features.map((feature, index) => (
                      <div key={index} style={{ marginBottom: 8 }}>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text>{feature}</Text>
                      </div>
                    ))}
                  </div>
                </Space>
              </FormationCard>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <Space direction="vertical" size="large" align="center">
            <Title level={2}>
              Pourquoi choisir nos formations ?
            </Title>
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} sm={8}>
                <Space direction="vertical" align="center">
                  <BookOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                  <Title level={4}>Contenu de qualité</Title>
                  <Text>
                    Des cours structurés et mis à jour régulièrement par des experts du domaine
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space direction="vertical" align="center">
                  <TrophyOutlined style={{ fontSize: 40, color: '#52c41a' }} />
                  <Title level={4}>Certification reconnue</Title>
                  <Text>
                    Obtenez une certification professionnelle valorisante pour votre carrière
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space direction="vertical" align="center">
                  <UserOutlined style={{ fontSize: 40, color: '#faad14' }} />
                  <Title level={4}>Support personnalisé</Title>
                  <Text>
                    Bénéficiez d'un accompagnement individuel tout au long de votre formation
                  </Text>
                </Space>
              </Col>
            </Row>
          </Space>
        </div>
      </Container>
    </StyledLayout>
  );
};

export default FormationsPage; 