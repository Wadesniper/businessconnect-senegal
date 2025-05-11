import React from 'react';
import { Card, Row, Col, Typography, Radio, message } from 'antd';
import { Template } from '../../../types/cv';
import { CV_TEMPLATES } from './data/templates';

const { Title } = Typography;

interface TemplateSelectionProps {
  selected: Template | null;
  onSelect: (template: Template) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ selected, onSelect }) => {
  const handleTemplateSelect = (templateId: string) => {
    const template = CV_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      onSelect(template);
      message.success(`Template "${template.name}" sélectionné avec succès !`);
    } else {
      message.error('Erreur lors de la sélection du template. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <Title level={3}>Choisissez votre modèle de CV</Title>
      <Radio.Group 
        value={selected?.id} 
        onChange={(e) => handleTemplateSelect(e.target.value)}
        style={{ width: '100%' }}
      >
        <Row gutter={[16, 16]}>
          {CV_TEMPLATES.map((template) => (
            <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
              <Radio.Button value={template.id} style={{ width: '100%', height: '100%', padding: 0 }}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={template.name}
                      src={template.thumbnail}
                      style={{ height: 200, objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/cv-templates/default-template.png';
                        message.warning('Image du template non disponible');
                      }}
                    />
                  }
                  style={{ 
                    border: selected?.id === template.id ? '2px solid #1890ff' : 'none',
                    height: '100%'
                  }}
                >
                  <Card.Meta
                    title={template.name}
                    description={
                      <>
                        <div>{template.description}</div>
                        {template.premium && (
                          <div style={{ color: '#faad14', marginTop: 8 }}>
                            Premium ⭐
                          </div>
                        )}
                      </>
                    }
                  />
                </Card>
              </Radio.Button>
            </Col>
          ))}
        </Row>
      </Radio.Group>
    </div>
  );
};

export default TemplateSelection; 