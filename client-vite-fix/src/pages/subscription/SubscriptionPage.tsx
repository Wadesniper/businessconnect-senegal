import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Result, Spin, List } from 'antd';
import { UserOutlined, ShopOutlined, TeamOutlined, LoginOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './SubscriptionPage.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';
import type { SubscriptionType } from '../../types/subscription';
import { message } from 'antd';

const { Title, Paragraph } = Typography;

const offers = [
  {
    key: 'student',
    title: "Étudiant / Chercheur d'emploi",
    price: 1000,
    color: '#1890ff',
    icon: <UserOutlined style={{ fontSize: 40, color: '#1890ff' }} />,
    features: [
      { label: "Accès aux offres d'emploi", included: true },
      { label: 'Générer votre CV', included: true },
      { label: 'Fiches métiers', included: true },
      { label: 'Accès à +4000 formations', included: true },
      { label: 'Support standard', included: true },
      { label: 'Publier sur la marketplace', included: false },
      { label: "Publier des offres d'emploi", included: false },
    ],
  },
  {
    key: 'annonceur',
    title: 'Annonceur',
    price: 5000,
    color: '#52c41a',
    icon: <ShopOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
    features: [
      { label: 'Toutes les fonctionnalités Étudiant', included: true },
      { label: 'Visibilité sur la plateforme', included: true },
      { label: 'Badge "Annonceur Vérifié"', included: true },
      { label: 'Support prioritaire', included: true },
      { label: "Publier des offres d'emploi", included: false },
    ],
  },
  {
    key: 'employeur',
    title: 'Recruteur',
    price: 9000,
    color: '#faad14',
    icon: <TeamOutlined style={{ fontSize: 40, color: '#faad14' }} />,
    features: [
      { label: 'Toutes les fonctionnalités Étudiant et Annonceur', included: true },
      { label: "Publication d'offres d'emploi", included: true },
      { label: 'Support dédié', included: true },
      { label: 'Visibilité plateforme', included: true },
    ],
    popular: true
  },
];

const SubscriptionPage: React.FC = () => {
  const { user, loading: loadingUser } = useAuth();
  const navigate = useNavigate();
  const { initiateSubscription, refreshSubscription, loading: loadingSub } = useSubscription();

  // Debug logs
  React.useEffect(() => {
    console.log('SubscriptionPage - État:', {
      user,
      loadingUser,
      loadingSub,
      hasUser: !!user,
      hasToken: !!localStorage.getItem('token')
    });
  }, [user, loadingUser, loadingSub]);

  // Après retour de paiement, forcer le rafraîchissement de l'abonnement
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      refreshSubscription();
    }
  }, [refreshSubscription]);

  // Si en cours de chargement, afficher le loader
  if (loadingUser || loadingSub) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement..." /> </div>;
  }

  const handleSubscribe = async (offerKey: string) => {
    // Si l'utilisateur n'est pas connecté, le rediriger vers la page d'authentification
    if (!user) {
      message.info('Veuillez vous connecter pour vous abonner.');
      navigate('/auth');
      return;
    }
    
    try {
      let type: SubscriptionType;
      if (offerKey === 'student') type = 'etudiant';
      else if (offerKey === 'annonceur') type = 'annonceur';
      else if (offerKey === 'employeur') type = 'recruteur';
      else throw new Error('Type d\'abonnement inconnu');
      
      const res = await initiateSubscription(type);
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        message.error("Erreur lors de la génération du lien de paiement.");
      }
    } catch (error: any) {
      if (error.message?.includes('Session expirée') || error.message?.includes('non connecté')) {
        message.error("Votre session a expiré. Veuillez vous reconnecter.");
        navigate('/auth');
      } else {
        message.error(error.message || "Erreur lors de l'initialisation du paiement.");
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1890ff 0%, #43e97b 100%)',
      padding: 0,
    }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '40px 0' }}>
        <Title level={1} style={{ textAlign: 'center', marginBottom: 16, color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
          Choisissez votre abonnement
        </Title>
        <Paragraph style={{ textAlign: 'center', color: '#e6f7ff', fontSize: 18, marginBottom: 40 }}>
          Accédez à toutes les fonctionnalités de BusinessConnect Sénégal selon votre profil. Paiement sécurisé via PayTech.
        </Paragraph>
        <Row gutter={[32, 32]} justify="center" style={{ display: 'flex', alignItems: 'stretch' }}>
          {offers.map((offer) => (
            <Col xs={24} sm={12} md={8} key={offer.key} style={{ display: 'flex' }}>
              <Card
                className="subscription-card"
                variant="outlined"
                style={{
                  borderRadius: 20,
                  minHeight: 520,
                  height: '100%',
                  boxShadow: offer.popular
                    ? '0 8px 32px 0 rgba(24, 144, 255, 0.18)'
                    : '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
                  border: `2.5px solid ${offer.color}`,
                  background: offer.popular
                    ? 'linear-gradient(135deg, #e0ffe9 0%, #e6f7ff 100%)'
                    : '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                  paddingBottom: 24,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                hoverable
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {offer.icon}
                  <Title level={3} style={{ color: offer.color, fontWeight: 700, marginBottom: 0 }}>
                    {offer.title}
                  </Title>
                  <div>
                    <span style={{ fontSize: 36, fontWeight: 700, color: offer.color }}>{offer.price.toLocaleString()} FCFA</span>
                    <span style={{ fontSize: 18, color: '#888', marginLeft: 4 }}>/mois</span>
                    {offer.popular && <Tag color="#43e97b" style={{ marginLeft: 8, fontWeight: 600, fontSize: 13 }}>Populaire</Tag>}
                  </div>
                  <div style={{ margin: '16px 0' }}>
                    <List
                      dataSource={offer.features}
                      renderItem={item => (
                        <List.Item style={{ padding: 0, border: 'none', background: 'none' }}>
                          <Space>
                            {item.included ? (
                              <CheckOutlined style={{ color: offer.color }} />
                            ) : (
                              <CloseOutlined style={{ color: '#ff4d4f' }} />
                            )}
                            <span style={{ color: item.included ? undefined : '#888', textDecoration: item.included ? undefined : 'line-through' }}>{item.label}</span>
                          </Space>
                        </List.Item>
                      )}
                      style={{ textAlign: 'left', maxWidth: 260, margin: '0 auto' }}
                    />
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      background: offer.color,
                      border: 'none',
                      borderRadius: 25,
                      width: '100%',
                      fontWeight: 600,
                      fontSize: 17,
                      height: 52,
                      boxShadow: offer.popular ? '0 2px 12px 0 rgba(67, 233, 123, 0.10)' : undefined
                    }}
                    onClick={() => handleSubscribe(offer.key)}
                  >
                    S'abonner
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default SubscriptionPage; 