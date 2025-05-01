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
    <div style={{ padding: '50px 20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 50 }}>
        Choisissez votre abonnement
      </Title>

      {currentSubscription && (
        <Card style={{ marginBottom: 30 }}>
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

      <Row gutter={[24, 24]} justify="center">
        {plans.map(plan => (
          <Col xs={24} sm={24} md={8} key={plan.type}>
            <Card
              hoverable
              style={{ height: '100%' }}
              title={
                <Title level={3} style={{ textAlign: 'center' }}>
                  {plan.name}
                </Title>
              }
            >
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <Title level={2} style={{ margin: 0 }}>
                  {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} XOF`}
                </Title>
                <Text type="secondary">/mois</Text>
              </div>

              <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 20 }}>
                {plan.description}
              </Text>

              <List
                itemLayout="horizontal"
                dataSource={plan.features}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <CheckCircleOutlined
                          style={{ color: item.included ? '#52c41a' : '#d9d9d9' }}
                        />
                      }
                      title={
                        <Text
                          style={{
                            color: item.included ? 'inherit' : '#d9d9d9'
                          }}
                        >
                          {item.feature}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
                style={{ marginBottom: 20 }}
              />

              <Button
                type={plan.type === 'free' ? 'default' : 'primary'}
                size="large"
                block
                onClick={() => handleSubscribe(plan)}
                disabled={loading || (currentSubscription?.type === plan.type && currentSubscription?.status === 'active')}
              >
                {loading ? <LoadingOutlined /> : null}
                {plan.type === 'free' ? 'Commencer' : 'S\'abonner'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SubscriptionPage; 