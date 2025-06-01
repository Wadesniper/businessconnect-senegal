import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag } from 'antd';
import { UserOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons';
import './SubscriptionPage.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';
import type { SubscriptionType } from '../../types/subscription';

const { Title, Paragraph } = Typography;

const offers = [
  {
    key: 'student',
    title: "Étudiant / Chercheur d'emploi",
    price: 1000,
    color: '#1890ff',
    icon: <UserOutlined style={{ fontSize: 40, color: '#1890ff' }} />,
    features: [
      "Accès aux offres d'emploi",
      'Espace CV',
      'Forum',
      'Fiches métiers',
      'Formations',
      'Support standard'
    ],
  },
  {
    key: 'annonceur',
    title: 'Annonceur',
    price: 5000,
    color: '#52c41a',
    icon: <ShopOutlined style={{ fontSize: 40, color: '#52c41a' }} />,
    features: [
      "Publication d'offres",
      'Visibilité plateforme',
      'Statistiques de vues',
      'Support prioritaire',
      'Badge "Annonceur Vérifié"',
      'Outils de promotion'
    ],
  },
  {
    key: 'employeur',
    title: 'Recruteur',
    price: 9000,
    color: '#faad14',
    icon: <TeamOutlined style={{ fontSize: 40, color: '#faad14' }} />,
    features: [
      'Accès CVthèque complète',
      'Contact direct candidats',
      'Publication offres illimitées',
      'Statistiques avancées',
      'Support dédié 24/7',
      'Outils de filtrage premium'
    ],
    popular: true
  },
];

const SubscriptionPage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { initiateSubscription } = useSubscription();

  // DEBUG TEMPORAIRE - À supprimer après fix
  console.log('🔍 SubscriptionPage DEBUG:', {
    user: user ? { id: user.id, firstName: user.firstName, lastName: user.lastName } : null,
    isAuthenticated,
    loading,
    tokenExists: !!localStorage.getItem('token'),
    userExists: !!localStorage.getItem('user')
  });

  // Attendre que l'authentification soit vérifiée
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1890ff 0%, #43e97b 100%)',
      }}>
        <div style={{ color: '#fff', fontSize: 18 }}>Vérification de l'authentification...</div>
      </div>
    );
  }

  const handleSubscribe = async (offerKey: string) => {
    // DEBUG TEMPORAIRE
    console.log('🚀 HandleSubscribe - État complet:', {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      userComplete: user ? {
        firstName: !!user.firstName,
        lastName: !!user.lastName,
        phoneNumber: !!user.phoneNumber
      } : null
    });

    // Vérification robuste avec le nouvel état d'authentification
    if (!isAuthenticated || !user) {
      console.log('❌ REDIRECTION VERS LOGIN - Raison:', {
        isAuthenticated,
        hasUser: !!user
      });
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }
    
    console.log('✅ Utilisateur authentifié - Continuons:', user.id);
    
    // Vérification du profil complet
    if (!user.firstName || !user.lastName || !user.phoneNumber) {
      alert("Merci de compléter votre profil (prénom, nom, téléphone) avant de vous abonner.\nVous pouvez le faire dans votre tableau de bord ou lors de la prochaine connexion.");
      return;
    }

    try {
      let type = offerKey;
      if (type === 'student') type = 'etudiant';
      
      console.log('🔄 Initiation abonnement pour:', type);
      const res = await initiateSubscription(type as SubscriptionType);
      
      if (res && res.paymentUrl) {
        console.log('🎯 Redirection vers CinetPay:', res.paymentUrl);
        window.location.href = res.paymentUrl;
      } else {
        console.error('❌ Pas d\'URL de paiement dans la réponse:', res);
        alert("Erreur lors de la génération du lien de paiement.");
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'initiation:', error);
      alert(error.message || "Erreur lors de l'initialisation du paiement.");
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
          Accédez à toutes les fonctionnalités de BusinessConnect Sénégal selon votre profil. Paiement sécurisé via CinetPay.
        </Paragraph>
        <Row gutter={[32, 32]} justify="center">
          {offers.map((offer) => (
            <Col xs={24} sm={12} md={8} key={offer.key}>
              <Card
                className="subscription-card"
                variant="outlined"
                style={{
                  borderRadius: 20,
                  boxShadow: offer.popular
                    ? '0 8px 32px 0 rgba(24, 144, 255, 0.18)'
                    : '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
                  border: offer.popular ? '2px solid #43e97b' : '1px solid #f0f0f0',
                  background: offer.popular
                    ? 'linear-gradient(135deg, #e0ffe9 0%, #e6f7ff 100%)'
                    : '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                  paddingBottom: 24,
                  textAlign: 'center',
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
                    {offer.features.map((feature, idx) => (
                      <Tag key={idx} color={offer.color} style={{ marginBottom: 8 }}>{feature}</Tag>
                    ))}
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