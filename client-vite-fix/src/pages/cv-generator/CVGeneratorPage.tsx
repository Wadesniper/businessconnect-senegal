import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Button, Empty, List, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Template } from '../../types/cv';
import { CV_TEMPLATES } from './components/data/templates';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const { Title } = Typography;

// Exemples statiques de CVs (à remplacer par un formulaire local si besoin)
const exampleCVs = [
  {
    id: '1',
    personalInfo: { fullName: 'Jean Dupont' },
    createdAt: new Date().toISOString()
  }
];

const CVGeneratorPage: React.FC = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [myCVs, setMyCVs] = useState(exampleCVs);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.subscription?.type !== 'etudiant') {
      navigate('/subscription');
    }
  }, [user, navigate]);

  const handleStartCV = () => {
    if (selectedTemplate) {
      navigate(`/cv-generator/create/${selectedTemplate.id}`);
    } else {
      Modal.info({ title: 'Veuillez sélectionner un modèle de CV' });
    }
  };

  const handleDeleteCV = (id: string) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer ce CV ?',
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk: () => setMyCVs(myCVs.filter(cv => cv.id !== id))
    });
  };

  const handleDownloadCV = (id: string) => {
    Modal.info({ title: 'Téléchargement', content: 'Fonctionnalité à venir (génération PDF côté front).' });
  };

  const handleShareCV = (id: string) => {
    Modal.info({ title: 'Partager le CV', content: 'Cette fonctionnalité sera bientôt disponible.' });
  };

  return (
    <div style={{ padding: '24px' }}>
      {!hasActiveSubscription && (
        <div style={{
          background: 'linear-gradient(90deg, #fffbe6 0%, #f7faff 100%)',
          border: '1.5px solid #ffe58f',
          borderRadius: 16,
          padding: '18px 12px',
          margin: '0 auto 32px auto',
          maxWidth: 700,
          textAlign: 'center',
          color: '#ad8b00',
          fontWeight: 600,
          fontSize: 17,
          boxShadow: '0 2px 8px #ffe58f33',
        }}>
          <span>Pour créer et télécharger votre CV, <span style={{color:'#1890ff', fontWeight:700}}>abonnez-vous</span> à la plateforme !</span>
          <br />
          <button
            style={{
              marginTop: 10,
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 22px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #1890ff22',
              transition: 'background 0.2s',
            }}
            onClick={() => navigate('/subscription')}
          >
            S'abonner
          </button>
        </div>
      )}
      <Title level={2}>Générateur de CV</Title>
      <Title level={3} style={{ marginTop: '24px' }}>
        Choisissez un modèle professionnel selon votre secteur et votre style
      </Title>
      <Row gutter={[16, 16]}>
        {CV_TEMPLATES.map(template => (
          <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
            <Card
              hoverable
              cover={<img alt={template.name} src={template.thumbnail} style={{ width: '100%', height: 220, objectFit: 'cover' }} />}
              onClick={() => setSelectedTemplate(template as Template)}
              style={{ border: selectedTemplate?.id === template.id ? '2px solid #1890ff' : undefined }}
            >
              <Card.Meta
                title={template.name + (template.category ? ' (' + template.category + ')' : '')}
                description={<>
                  <div><b>Secteur :</b> {template.category}</div>
                  <div style={{ marginTop: 8 }}>{template.description}</div>
                  {template.features && (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {template.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  )}
                </>}
              />
            </Card>
          </Col>
        ))}
      </Row>
      {hasActiveSubscription ? (
        <Button
          type="primary"
          size="large"
          onClick={handleStartCV}
          style={{ marginTop: '32px' }}
        >
          Commencer mon CV avec ce modèle
        </Button>
      ) : (
        <Button
          type="default"
          size="large"
          disabled
          style={{ marginTop: '32px', background: '#f7faff', color: '#bbb', border: '1.5px solid #eee', cursor: 'not-allowed' }}
        >
          Abonnez-vous pour créer votre CV
        </Button>
      )}

      {/* Section Mes CVs */}
      <Title level={3} style={{ marginTop: '48px' }}>
        Mes CVs
      </Title>
      {myCVs.length === 0 ? (
        <Empty description="Vous n'avez pas encore créé de CV" style={{ margin: '40px 0' }} />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={myCVs}
          renderItem={cv => (
            <List.Item>
              <Card
                actions={[
                  <EditOutlined key="edit" onClick={() => navigate(`/cv-generator/edit/${cv.id}`)} />,
                  <DeleteOutlined key="delete" onClick={() => handleDeleteCV(cv.id)} />,
                  <DownloadOutlined key="download" onClick={() => handleDownloadCV(cv.id)} />,
                  <ShareAltOutlined key="share" onClick={() => handleShareCV(cv.id)} />
                ]}
              >
                <Card.Meta
                  title={cv.personalInfo.fullName}
                  description={`Créé le ${new Date(cv.createdAt).toLocaleDateString('fr-FR')}`}
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default CVGeneratorPage; 