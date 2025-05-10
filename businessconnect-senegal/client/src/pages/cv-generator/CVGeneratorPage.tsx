import React, { useState } from 'react';
import { Card, Typography, Row, Col, Button, Empty, List, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Template } from '../../types/cv';
import { CV_TEMPLATES } from './data/templates';

const { Title } = Typography;

// Exemples statiques de templates
const templates = [
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Un template moderne et épuré',
    preview: '/images/cv-templates/modern-preview.png'
  },
  {
    id: 'classic',
    name: 'Classique',
    description: 'Un template classique et professionnel',
    preview: '/images/cv-templates/classic-preview.png'
  }
];

// Exemples statiques de CVs (à remplacer par un formulaire local si besoin)
const exampleCVs = [
  {
    id: '1',
    personalInfo: { fullName: 'Jean Dupont' },
    createdAt: new Date().toISOString()
  }
];

const CVGeneratorPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [myCVs, setMyCVs] = useState(exampleCVs);
  const navigate = useNavigate();

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
      <Title level={2}>Générateur de CV</Title>
      <Title level={3} style={{ marginTop: '24px' }}>
        Choisissez un modèle professionnel selon votre secteur et votre style
      </Title>
      <Row gutter={[16, 16]}>
        {CV_TEMPLATES.map(template => (
          <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
            <Card
              hoverable
              cover={<img alt={template.name} src={template.photo} style={{ width: '100%', height: 220, objectFit: 'cover' }} />}
              onClick={() => setSelectedTemplate(template)}
              style={{ border: selectedTemplate?.id === template.id ? '2px solid #1890ff' : undefined }}
            >
              <Card.Meta
                title={template.name + ' (' + template.style.charAt(0).toUpperCase() + template.style.slice(1) + ')'}
                description={<>
                  <div><b>Secteur :</b> {template.sector}</div>
                  <div style={{ marginTop: 8 }}>{template.description}</div>
                </>}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Button
        type="primary"
        size="large"
        onClick={handleStartCV}
        style={{ marginTop: '32px' }}
      >
        Commencer mon CV avec ce modèle
      </Button>

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