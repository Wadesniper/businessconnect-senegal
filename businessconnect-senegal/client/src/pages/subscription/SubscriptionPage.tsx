import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Typography, Tag, List, Spin, message } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { subscriptionService } from '../../services/subscriptionService';
import { paymentService } from '../../services/paymentService';

const { Title, Text } = Typography;

interface PlanFeature {
  feature: string;
  included: boolean;
}

interface Plan {
  type: 'free' | 'premium' | 'enterprise';
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
}

const plans: Plan[] = [
  {
    type: 'free',
    name: 'Gratuit',
    price: 0,
    description: 'Pour commencer votre recherche d\'emploi',
    features: [
      { feature: 'Création de CV basique', included: true },
      { feature: 'Recherche d\'emplois limitée', included: true },
      { feature: 'Candidature aux offres', included: true },
      { feature: 'Profil de base', included: true },
      { feature: 'Alertes emploi basiques', included: false },
      { feature: 'Support prioritaire', included: false },
      { feature: 'CV téléchargeable', included: false },
      { feature: 'Statistiques avancées', included: false }
    ]
  },
  {
    type: 'premium',
    name: 'Premium',
    price: 15000,
    description: 'Pour les chercheurs d\'emploi sérieux',
    features: [
      { feature: 'Création de CV avancée', included: true },
      { feature: 'Recherche d\'emplois illimitée', included: true },
      { feature: 'Candidature aux offres', included: true },
      { feature: 'Profil avancé', included: true },
      { feature: 'Alertes emploi personnalisées', included: true },
      { feature: 'Support prioritaire', included: true },
      { feature: 'CV téléchargeable', included: true },
      { feature: 'Statistiques basiques', included: true }
    ]
  },
  {
    type: 'enterprise',
    name: 'Entreprise',
    price: 50000,
    description: 'Pour les professionnels et les entreprises',
    features: [
      { feature: 'Création de CV premium', included: true },
      { feature: 'Recherche d\'emplois illimitée', included: true },
      { feature: 'Candidature prioritaire', included: true },
      { feature: 'Profil premium', included: true },
      { feature: 'Alertes emploi avancées', included: true },
      { feature: 'Support dédié', included: true },
      { feature: 'CV téléchargeable illimité', included: true },
      { feature: 'Statistiques avancées', included: true }
    ]
  }
];

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        const sub = await subscriptionService.getSubscription(user.id);
        setCurrentSubscription(sub);
      }
    };
    fetchSubscription();
  }, [user]);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      message.warning('Veuillez vous connecter pour vous abonner');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // Initialiser le paiement avec PayTech
      const paymentRequest = {
        amount: plan.price,
        currency: 'XOF',
        description: `Abonnement ${plan.name} - BusinessConnect Sénégal`,
        customerId: user.id,
        customerEmail: user.email,
        customerFullName: user.fullName,
        subscriptionType: plan.type === 'premium' ? 'premium' : 'enterprise'
      };

      const redirectUrl = await paymentService.initiateSubscriptionPayment(paymentRequest);
      
      // Rediriger vers la page de paiement PayTech
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du paiement:', error);
      message.error('Une erreur est survenue lors de l\'initialisation du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '50px 20px', textAlign: 'center' }}>
        <Title level={2}>Connectez-vous pour accéder aux abonnements</Title>
        <Button type="primary" size="large" onClick={() => navigate('/login')}>
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1890ff 0%, #43e97b 100%)',
        padding: 0,
      }}
    >
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '40px 0' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
          Choisissez votre abonnement
        </Title>
        <div style={{ textAlign: 'center', color: '#e6f7ff', fontSize: 18, marginBottom: 40 }}>
          Accédez à toutes les fonctionnalités premium de BusinessConnect Sénégal et boostez votre carrière !
        </div>

        {currentSubscription && (
          <Card style={{ marginBottom: 30, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.10)' }}>
            <Title level={4}>Votre abonnement actuel</Title>
            <Text>Type: {currentSubscription.type}</Text>
            <br />
            <Text>
              Statut: <Tag color={currentSubscription.status === 'active' ? 'success' : 'error'}>
                {currentSubscription.status}
              </Tag>
            </Text>
            <br />
            <Text>Expire le: {new Date(currentSubscription.endDate).toLocaleDateString()}</Text>
          </Card>
        )}

        <Row gutter={[32, 32]} justify="center" align="middle">
          {plans.map(plan => (
            <Col xs={24} sm={24} md={8} key={plan.type}>
              <Card
                hoverable
                style={{
                  height: '100%',
                  borderRadius: 20,
                  boxShadow: plan.type === 'premium'
                    ? '0 8px 32px 0 rgba(24, 144, 255, 0.18)'
                    : '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
                  border: plan.type === 'premium' ? '2px solid #43e97b' : '1px solid #f0f0f0',
                  background: plan.type === 'premium'
                    ? 'linear-gradient(135deg, #e0ffe9 0%, #e6f7ff 100%)'
                    : '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                  paddingBottom: 24,
                }}
                title={
                  <div style={{ textAlign: 'center', position: 'relative' }}>
                    <Title level={3} style={{ marginBottom: 0, fontWeight: 700, color: plan.type === 'premium' ? '#43e97b' : '#1890ff' }}>
                      {plan.name}
                    </Title>
                    {plan.type === 'premium' && (
                      <Tag color="#43e97b" style={{ position: 'absolute', top: -8, right: 0, fontWeight: 600, fontSize: 13 }}>
                        Le plus populaire
                      </Tag>
                    )}
                  </div>
                }
              >
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <Title level={2} style={{ margin: 0, color: plan.type === 'premium' ? '#43e97b' : '#1890ff', fontWeight: 800 }}>
                    {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} XOF`}
                  </Title>
                  <Text type="secondary">/mois</Text>
                </div>

                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20, fontSize: 16 }}>
                  {plan.description}
                </Text>

                <List
                  itemLayout="horizontal"
                  dataSource={plan.features}
                  renderItem={item => (
                    <List.Item style={{ padding: '6px 0' }}>
                      <List.Item.Meta
                        avatar={
                          <CheckCircleOutlined
                            style={{ color: item.included ? '#43e97b' : '#d9d9d9', fontSize: 18 }}
                          />
                        }
                        title={
                          <Text
                            style={{
                              color: item.included ? '#222' : '#d9d9d9',
                              fontWeight: item.included ? 500 : 400,
                              fontSize: 15
                            }}
                          >
                            {item.feature}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
                <Button
                  type={plan.type === 'free' ? 'default' : 'primary'}
                  size="large"
                  style={{
                    width: '100%',
                    marginTop: 24,
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 17,
                    height: 52,
                    background: plan.type === 'premium' ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' : undefined,
                    color: plan.type === 'premium' ? '#222' : undefined,
                    boxShadow: plan.type === 'premium' ? '0 2px 12px 0 rgba(67, 233, 123, 0.10)' : undefined
                  }}
                  loading={loading}
                  onClick={() => handleSubscribe(plan)}
                  disabled={plan.type === currentSubscription?.type}
                >
                  {plan.type === currentSubscription?.type ? 'Déjà abonné' : 'Choisir'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SubscriptionPage; 