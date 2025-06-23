import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Button, Empty, List, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Template } from '../../types/cv';
import { CV_TEMPLATES } from './components/data/templates';
import { useAuth } from '../../context/AuthContext';
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
  const [loadingPage, setLoadingPage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && user.subscription && typeof user.subscription === 'object' && 'type' in user.subscription && user.subscription.type !== 'etudiant') {
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

  if (loadingPage) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="ant-spin ant-spin-lg ant-spin-spinning">
          <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item" />
            <i className="ant-spin-dot-item" />
            <i className="ant-spin-dot-item" />
            <i className="ant-spin-dot-item" />
          </span>
        </span>
        <span style={{ marginLeft: 16, fontSize: 18, color: '#1890ff' }}>Chargement du générateur de CV...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', maxWidth: '100%' }}>
      {!hasActiveSubscription && (
        <div style={{
          background: 'linear-gradient(90deg, #fffbe6 0%, #f7faff 100%)',
          border: '1.5px solid #ffe58f',
          borderRadius: 16,
          padding: '16px 12px',
          margin: '0 auto 24px auto',
          maxWidth: '100%',
          textAlign: 'center',
          color: '#ad8b00',
          fontWeight: 600,
          fontSize: '16px',
          boxShadow: '0 2px 8px #ffe58f33',
        }}>
          <div style={{ marginBottom: '8px' }}>
            <span>Pour créer et télécharger votre CV, <span style={{color:'#1890ff', fontWeight:700}}>abonnez-vous</span> à la plateforme !</span>
          </div>
          <button
            style={{
              background: '#1890ff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #1890ff22',
              transition: 'background 0.2s',
              minWidth: '120px',
            }}
            onClick={() => navigate('/subscription')}
          >
            S'abonner
          </button>
        </div>
      )}
      <Title level={2} style={{ fontSize: '28px', marginBottom: '16px' }}>Générateur de CV</Title>
      <Title level={3} style={{ marginTop: '20px', fontSize: '20px', marginBottom: '24px' }}>
        Choisissez un modèle professionnel selon votre secteur et votre style
      </Title>
      <Row gutter={[12, 16]} style={{ margin: 0 }}>
        {CV_TEMPLATES.map(template => (
          <Col xs={24} sm={12} md={8} lg={6} key={template.id} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              hoverable
              cover={<img alt={template.name} src={template.thumbnail} style={{ width: '100%', maxWidth: 320, height: 200, objectFit: 'cover', margin: '0 auto', display: 'block' }} />}
              onClick={() => setSelectedTemplate(template as Template)}
              style={{ 
                border: selectedTemplate?.id === template.id ? '2px solid #1890ff' : undefined,
                borderRadius: '12px',
                overflow: 'hidden',
                width: '100%',
                maxWidth: 340,
                minWidth: 0,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Card.Meta
                title={<div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', wordBreak: 'break-word' }}>
                  {template.name + (template.category ? ' (' + template.category + ')' : '')}
                </div>}
                description={<>
                  <div style={{ marginBottom: '8px' }}><b>Secteur :</b> {template.category}</div>
                  <div style={{ marginBottom: '8px', fontSize: '14px', wordBreak: 'break-word' }}>{template.description}</div>
                  {template.features && (
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: '13px' }}>
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
          style={{ 
            marginTop: '24px', 
            width: '100%',
            height: '48px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px'
          }}
        >
          Commencer mon CV avec ce modèle
        </Button>
      ) : (
        <Button
          type="default"
          size="large"
          disabled
          style={{ 
            marginTop: '24px', 
            width: '100%',
            height: '48px',
            fontSize: '16px',
            background: '#f7faff', 
            color: '#bbb', 
            border: '1.5px solid #eee', 
            cursor: 'not-allowed',
            borderRadius: '8px'
          }}
        >
          Abonnez-vous pour créer votre CV
        </Button>
      )}

      {/* Section Mes CVs */}
      <Title level={3} style={{ marginTop: '40px', fontSize: '24px', marginBottom: '20px' }}>
        Mes CVs
      </Title>
      {myCVs.length === 0 ? (
        <Empty description="Vous n'avez pas encore créé de CV" style={{ margin: '32px 0' }} />
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
                style={{ borderRadius: '12px' }}
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