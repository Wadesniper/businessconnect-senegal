import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Tag, List, Space } from 'antd';
import { CheckCircleOutlined, CrownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  padding: 50px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PricingCard = styled(Card)<{ $isPopular?: boolean }>`
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: ${props => props.$isPopular ? '2px solid #1890ff' : '1px solid #f0f0f0'};
  box-shadow: ${props => props.$isPopular ? '0 8px 24px rgba(24,144,255,0.15)' : '0 4px 16px rgba(0,0,0,0.08)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.15);
  }
`;

const FeatureList = styled(List)`
  .ant-list-item {
    border-bottom: none;
    padding: 8px 0;
  }
`;

const subscriptionPlans = [
  {
    id: 'basic',
    title: 'Gratuit',
    price: '0 FCFA',
    period: 'pour toujours',
    description: 'Parfait pour découvrir la plateforme',
    features: [
      'Accès au forum communautaire',
      'Consultation des offres d\'emploi',
      'Profil de base',
      'CV simple'
    ],
    color: '#52c41a',
    popular: false
  },
  {
    id: 'premium',
    title: 'Premium',
    price: '5 000 FCFA',
    period: 'par mois',
    description: 'Pour les professionnels ambitieux',
    features: [
      'Tout du plan Gratuit',
      'CV avancé avec templates premium',
      'Candidatures illimitées',
      'Accès prioritaire aux offres',
      'Formations certifiantes',
      'Support prioritaire 24/7'
    ],
    color: '#1890ff',
    popular: true
  },
  {
    id: 'business',
    title: 'Business',
    price: '15 000 FCFA',
    period: 'par mois',
    description: 'Solution complète pour les entreprises',
    features: [
      'Tout du plan Premium',
      'Publication d\'offres illimitées',
      'Accès à la CVthèque',
      'Dashboard recruteur',
      'API access',
      'Account manager dédié'
    ],
    color: '#722ed1',
    popular: false
  }
];

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    // Redirection vers la page de paiement CinetPay avec le plan sélectionné
    navigate(`/payment?plan=${planId}`);
  };

  return (
    <StyledLayout>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={1}>
            Choisissez votre plan
          </Title>
          <Text style={{ fontSize: '1.2rem', color: '#666' }}>
            Débloquez tout le potentiel de BusinessConnect avec nos abonnements adaptés à vos besoins
          </Text>
        </div>

        <Row gutter={[32, 32]} justify="center">
          {subscriptionPlans.map(plan => (
            <Col xs={24} md={8} key={plan.id}>
              <PricingCard $isPopular={plan.popular}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  {plan.popular && (
                    <Tag color="gold" style={{ marginBottom: 16 }}>
                      <CrownOutlined /> PLUS POPULAIRE
                    </Tag>
                  )}
                  <Title level={3} style={{ color: plan.color, marginBottom: 8 }}>
                    {plan.title}
                  </Title>
                  <div style={{ margin: '24px 0' }}>
                    <Text style={{ fontSize: '2.5rem', fontWeight: 700, color: plan.color }}>
                      {plan.price}
                    </Text>
                    <Text style={{ color: '#666' }}> / {plan.period}</Text>
                  </div>
                  <Text type="secondary">{plan.description}</Text>
                </div>

                <FeatureList
                  dataSource={plan.features}
                  renderItem={item => (
                    <List.Item>
                      <Space>
                        <CheckCircleOutlined style={{ color: plan.color }} />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                  style={{ marginBottom: 24 }}
                />

                <Button
                  type={plan.popular ? 'primary' : 'default'}
                  size="large"
                  block
                  style={{
                    height: 50,
                    fontSize: '1.1rem',
                    background: plan.popular ? plan.color : undefined,
                    borderColor: plan.color
                  }}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.id === 'basic' ? 'Commencer gratuitement' : 'Souscrire maintenant'}
                </Button>
              </PricingCard>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <Title level={4} style={{ marginBottom: 24 }}>
            Des questions ?
          </Title>
          <Text>
            Contactez notre équipe commerciale au{' '}
            <a href="tel:+221338238383">+221 33 823 83 83</a>
            {' '}ou par email à{' '}
            <a href="mailto:commercial@businessconnectsenegal.com">
              commercial@businessconnectsenegal.com
            </a>
          </Text>
        </div>
      </Container>
    </StyledLayout>
  );
};

export default SubscriptionPage; 