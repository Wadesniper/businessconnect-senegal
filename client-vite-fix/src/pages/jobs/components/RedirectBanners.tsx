import React from 'react';
import { Card, Row, Col, Typography, Button, Grid } from 'antd';
import { FileAddOutlined, ProfileOutlined, BookOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const RedirectBanners: React.FC = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  if (!screens.md) {
    // Mobile : cartes empilées, bouton "Voir" à droite
    return (
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24}>
            <Card bordered style={{ background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}><FileAddOutlined style={{ color: '#2b6cb0', marginRight: 8 }} />Augmentez vos chances d'être recruté !</div>
                <div style={{ fontSize: 14 }}>Créez votre CV pour multiplier par 3 vos chances d'être contacté.</div>
              </div>
              <Button icon={<EyeOutlined />} size="small" onClick={() => navigate('/cv-generator')}>Voir</Button>
            </Card>
          </Col>
          <Col xs={24}>
            <Card bordered style={{ background: '#e6fffb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}><ProfileOutlined style={{ color: '#13c2c2', marginRight: 8 }} />Explorez les métiers</div>
                <div style={{ fontSize: 14 }}>90+ fiches métiers pour votre orientation professionnelle</div>
              </div>
              <Button icon={<EyeOutlined />} size="small" onClick={() => navigate('/careers')}>Voir</Button>
            </Card>
          </Col>
          <Col xs={24}>
            <Card bordered style={{ background: '#f9f0ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}><BookOutlined style={{ color: '#722ed1', marginRight: 8 }} />Formations professionnelles</div>
                <div style={{ fontSize: 14 }}>Développez vos compétences pour booster votre carrière</div>
              </div>
              <Button icon={<EyeOutlined />} size="small" onClick={() => navigate('/formations')}>Voir</Button>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  // Desktop : colonnes avec boutons larges
  return (
    <div style={{ marginBottom: 32 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card bordered style={{ background: '#f0f5ff' }}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileAddOutlined style={{ color: '#2b6cb0' }} /> Augmentez vos chances d'être recruté !
            </Title>
            <Paragraph>
              Créez votre CV pour multiplier par 3 vos chances d'être contacté.
            </Paragraph>
            <Button type="primary" onClick={() => navigate('/cv-generator')}>
              Créer mon CV
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card bordered style={{ background: '#e6fffb' }}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ProfileOutlined style={{ color: '#13c2c2' }} /> Explorez d'autres opportunités de carrière
            </Title>
            <Paragraph>
              Découvrez plus de 90 fiches métiers détaillées dans divers secteurs d'activité.
            </Paragraph>
            <Button onClick={() => navigate('/careers')}>
              Découvrir les métiers
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card bordered style={{ background: '#f9f0ff' }}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOutlined style={{ color: '#722ed1' }} /> Améliorez vos qualifications professionnelles
            </Title>
            <Paragraph>
              Explorez notre sélection de formations et certifications pour booster votre carrière.
            </Paragraph>
            <Button onClick={() => navigate('/formations')}>
              Voir les formations
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RedirectBanners; 