import React from 'react';
import { Card, Row, Col, Button, Tag, Modal, Typography } from 'antd';
import { LockOutlined, CheckOutlined } from '@ant-design/icons';
import { cvTemplates } from '../../../data/cv-templates';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const { Title, Text } = Typography;

interface TemplateGalleryProps {
  onSelectTemplate?: (templateId: string) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSubscribed = user?.subscription?.isActive;

  const showSubscriptionModal = () => {
    Modal.info({
      title: 'Abonnement Requis',
      content: (
        <div>
          <p>Pour créer votre CV professionnel avec ce modèle, vous devez être abonné.</p>
          <p>L'abonnement vous permet de :</p>
          <ul>
            <li>Créer des CV illimités</li>
            <li>Télécharger en PDF et Word</li>
            <li>Accéder à tous les modèles premium</li>
            <li>Mettre à jour vos CV à tout moment</li>
          </ul>
        </div>
      ),
      okText: 'Voir les abonnements',
      onOk: () => navigate('/subscription')
    });
  };

  const handleTemplateClick = (templateId: string) => {
    if (!isSubscribed) {
      showSubscriptionModal();
      return;
    }

    onSelectTemplate?.(templateId);
  };

  return (
    <div className="template-gallery" style={{ padding: '24px' }}>
      <Title level={2}>Modèles de CV Professionnels</Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        Choisissez parmi notre sélection de modèles conçus pour mettre en valeur votre profil
      </Text>

      <Row gutter={[24, 24]}>
        {cvTemplates.map((template) => (
          <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    alt={`CV ${template.sector}`}
                    src={template.profile.photo}
                    style={{ 
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      filter: !isSubscribed ? 'blur(2px)' : 'none'
                    }}
                  />
                  {!isSubscribed && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <LockOutlined style={{ color: '#fff' }} />
                      <Text style={{ color: '#fff', margin: 0 }}>Version Premium</Text>
                    </div>
                  )}
                </div>
              }
              actions={[
                <Button
                  type="primary"
                  icon={isSubscribed ? <CheckOutlined /> : <LockOutlined />}
                  onClick={() => handleTemplateClick(template.id)}
                  block
                >
                  {isSubscribed ? 'Utiliser ce modèle' : 'Devenir membre'}
                </Button>
              ]}
            >
              <Card.Meta
                title={template.sector}
                description={
                  <>
                    <Tag color="blue">{template.profile.title}</Tag>
                    <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                      Parfait pour les professionnels du secteur {template.sector.toLowerCase()}
                    </Text>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TemplateGallery; 