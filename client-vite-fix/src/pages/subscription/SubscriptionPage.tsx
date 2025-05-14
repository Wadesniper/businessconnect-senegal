import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag } from 'antd';
import { UserOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons';
import './SubscriptionPage.css';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

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
  const { user } = useAuth();
  const handleSubscribe = async (offerKey: string) => {
    try {
      let type = offerKey;
      if (type === 'student') type = 'etudiant';
      if (!user) {
        alert("Veuillez vous connecter pour vous abonner.");
        return;
      }
      const customer_name = user.firstName || '';
      const customer_surname = user.lastName || '';
      const customer_email = user.email || '';
      const customer_phone_number = user.phoneNumber || '';
      const res = await axios.post('/api/payment/init', {
        type,
        customer_name,
        customer_surname,
        customer_email,
        customer_phone_number
      });
      if (res.data && res.data.data && res.data.data.payment_url) {
        window.location.href = res.data.data.payment_url;
      } else {
        alert("Erreur lors de la génération du lien de paiement.");
      }
    } catch (error) {
      alert("Erreur lors de l'initialisation du paiement.");
    }
  };

  return (
    <div className="subscription-page-bg" style={{ minHeight: '100vh', padding: '40px 0', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Title level={1} style={{ textAlign: 'center', marginBottom: 16 }}>Choisissez votre abonnement</Title>
        <Paragraph style={{ textAlign: 'center', fontSize: 18, marginBottom: 40 }}>
          Accédez à toutes les fonctionnalités de BusinessConnect Sénégal selon votre profil. Paiement sécurisé via CinetPay.
        </Paragraph>
        <Row gutter={[32, 32]} justify="center">
          {offers.map((offer) => (
            <Col xs={24} sm={12} md={8} key={offer.key}>
              <Card
                className="subscription-card"
                variant="outlined"
                style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center', background: '#fff' }}
                hoverable
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {offer.icon}
                  <Title level={3} style={{ color: offer.color }}>{offer.title}</Title>
                  <div>
                    <span style={{ fontSize: 36, fontWeight: 700, color: offer.color }}>{offer.price.toLocaleString()} FCFA</span>
                    <span style={{ fontSize: 18, color: '#888', marginLeft: 4 }}>/mois</span>
                    {offer.popular && <Tag color="gold" style={{ marginLeft: 8 }}>Populaire</Tag>}
                  </div>
                  <div style={{ margin: '16px 0' }}>
                    {offer.features.map((feature, idx) => (
                      <Tag key={idx} color={offer.color} style={{ marginBottom: 8 }}>{feature}</Tag>
                    ))}
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    style={{ background: offer.color, border: 'none', borderRadius: 25, width: '100%' }}
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