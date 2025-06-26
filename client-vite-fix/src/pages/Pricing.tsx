import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, List, Space, Tooltip } from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined,
  UserOutlined, 
  ShopOutlined, 
  TeamOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import type { SubscriptionType } from '../types/subscription';

const { Title, Paragraph } = Typography;

const StyledCard = styled(Card)<{ $isPremium?: boolean }>`
  height: 100%;
  ${props => props.$isPremium && `
    border: 2px solid #ffd700;
    transform: scale(1.05);
    
    &:hover {
      border: 2px solid #ffd700;
    }
  `}
`;

const PriceTag = styled(Title)`
  margin: 24px 0 !important;
  .currency {
    font-size: 24px;
    vertical-align: super;
  }
  .period {
    font-size: 16px;
    color: #8c8c8c;
    margin-left: 4px;
  }
`;

const PaymentSecurityCard = styled(Card)`
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  border: 1px solid #e8e8e8;
  margin-top: 32px;
`;

const SecurityFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .icon {
    font-size: 24px;
    color: #52c41a;
  }
  
  .text {
    flex: 1;
  }
`;

const plans = [
  {
    title: "Étudiant / Chercheur d'emploi",
    price: 1000,
    features: [
      { label: "Accès aux offres d'emploi", included: true },
      { label: 'Générer votre CV', included: true },
      { label: 'Fiches métiers', included: true },
      { label: 'Accès à +4000 formations', included: true },
      { label: 'Support standard', included: true },
      { label: 'Publier sur la marketplace', included: false },
      { label: "Publier des offres d'emploi", included: false },
    ],
    icon: <UserOutlined />, color: '#1890ff'
  },
  {
    title: 'Annonceur',
    price: 5000,
    features: [
      { label: 'Toutes les fonctionnalités Étudiant', included: true },
      { label: 'Visibilité sur la plateforme', included: true },
      { label: 'Badge "Annonceur Vérifié"', included: true },
      { label: 'Support prioritaire', included: true },
      { label: "Publier des offres d'emploi", included: false },
    ],
    icon: <ShopOutlined />, color: '#52c41a'
  },
  {
    title: 'Recruteur',
    price: 9000,
    features: [
      { label: 'Toutes les fonctionnalités Étudiant et Annonceur', included: true },
      { label: "Publication d'offres d'emploi", included: true },
      { label: 'Support dédié', included: true },
      { label: 'Visibilité plateforme', included: true },
    ],
    icon: <TeamOutlined />, color: '#722ed1'
  }
];

const planTypeMap: Record<string, string> = {
  "étudiant / chercheur d'emploi": 'etudiant',
  'annonceur': 'annonceur',
  'recruteur': 'employeur'
};

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initiateSubscription } = useSubscription();

  const handleSubscribe = async (planTitle: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const planType = planTypeMap[planTitle.toLowerCase()] || 'etudiant';
    try {
      const res = await initiateSubscription(planType as SubscriptionType);
      if (res && res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        alert("Erreur lors de la génération du lien de paiement.");
      }
    } catch (error) {
      alert("Erreur lors de l'initialisation du paiement.");
    }
  };

  const securityFeatures = [
    {
      icon: <LockOutlined />,
      title: 'Paiement Sécurisé',
      description: 'Toutes les transactions sont cryptées et sécurisées par PayTech'
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Certifié PCI DSS',
      description: 'Conformité aux normes internationales de sécurité des paiements'
    },
    {
      icon: <CreditCardOutlined />,
      title: 'Moyens de Paiement Locaux',
      description: 'Orange Money, Wave, Free Money et cartes bancaires acceptés'
    }
  ];

  return (
    <Layout.Content style={{ padding: '50px 0', background: '#f0f2f5' }}>
      <Row justify="center" style={{ margin: '0 20px' }}>
        <Col xs={24} md={20} lg={18}>
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center', marginBottom: 48 }}>
            <Title level={1}>Nos Formules d'Abonnement</Title>
            <Paragraph style={{ fontSize: '18px' }}>
              Choisissez la formule adaptée à vos besoins sur BusinessConnect Sénégal
            </Paragraph>
          </Space>

          <Row gutter={[32, 32]} style={{ display: 'flex', alignItems: 'stretch' }}>
            {plans.map((plan, index) => (
              <Col xs={24} md={8} key={index} style={{ display: 'flex' }}>
                <Card
                  className="pricing-card"
                  style={{
                    height: '100%',
                    minHeight: 520,
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    border: `2.5px solid ${plan.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  hoverable
                  variant="outlined"
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: plan.color
                    }}
                  />
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '48px',
                        color: plan.color,
                        marginBottom: '16px'
                      }}>
                        {React.cloneElement(plan.icon, { style: { fontSize: '48px' } })}
                      </div>
                      <Title level={2} style={{ margin: '16px 0', fontSize: '24px' }}>
                        {plan.title}
                      </Title>
                      <PriceTag level={2}>
                        <span className="currency">FCFA</span> {plan.price.toLocaleString()}
                        <span className="period">/mois</span>
                      </PriceTag>
                    </div>

                    <List
                      dataSource={plan.features}
                      renderItem={item => (
                        <List.Item style={{ padding: 0, border: 'none', background: 'none' }}>
                          <Space>
                            {item.included ? (
                              <CheckOutlined style={{ color: plan.color }} />
                            ) : (
                              <CloseOutlined style={{ color: '#ff4d4f' }} />
                            )}
                            <span style={{ color: item.included ? undefined : '#888', textDecoration: item.included ? undefined : 'line-through' }}>{item.label}</span>
                          </Space>
                        </List.Item>
                      )}
                      style={{ textAlign: 'left' }}
                    />

                    <Button
                      type="primary"
                      size="large"
                      block
                      style={{
                        background: plan.color,
                        borderColor: plan.color
                      }}
                      onClick={() => handleSubscribe(plan.title)}
                    >
                      S'abonner maintenant
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Section Sécurité des Paiements */}
          <Row justify="center" style={{ marginTop: 64 }}>
            <Col xs={24}>
              <PaymentSecurityCard>
                <Row gutter={[32, 32]}>
                  <Col xs={24} md={8}>
                    <Title level={3}>
                      <LockOutlined /> Paiement 100% Sécurisé
                    </Title>
                    <Paragraph>
                      Vos paiements sont traités de manière sécurisée par PayTech, 
                      leader des solutions de paiement en Afrique de l'Ouest.
                    </Paragraph>
                  </Col>
                  <Col xs={24} md={16}>
                    <Row gutter={[24, 24]}>
                      {securityFeatures.map((feature, index) => (
                        <Col xs={24} md={8} key={index}>
                          <SecurityFeature>
                            <div className="icon">
                              {feature.icon}
                            </div>
                            <div className="text">
                              <Title level={5}>{feature.title}</Title>
                              <Paragraph type="secondary">
                                {feature.description}
                              </Paragraph>
                            </div>
                          </SecurityFeature>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </PaymentSecurityCard>
            </Col>
          </Row>

          {/* Section FAQ et Support */}
          <Row justify="center" style={{ marginTop: 32 }}>
            <Col xs={24} md={16}>
              <Card>
                <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                  <Title level={3}>Engagement flexible</Title>
                  <Space direction="vertical" size="small">
                    <Paragraph>
                      Tous nos abonnements sont sans engagement. Vous pouvez annuler à tout moment.
                    </Paragraph>
                    <Paragraph>
                      <Space>
                        <img src="/images/payment/orange-money.png" alt="Orange Money" height="30" />
                        <img src="/images/payment/wave.png" alt="Wave" height="30" />
                        <img src="/images/payment/free-money.png" alt="Free Money" height="30" />
                        <img src="/images/payment/visa.png" alt="Visa" height="30" />
                        <img src="/images/payment/mastercard.png" alt="Mastercard" height="30" />
                      </Space>
                    </Paragraph>
                    <Paragraph type="secondary">
                      Une question ? Notre équipe support est disponible 24/7 au +221 XX XXX XX XX
                    </Paragraph>
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout.Content>
  );
};

export default Pricing; 