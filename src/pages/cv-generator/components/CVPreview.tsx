import React from 'react';
import { Card } from 'antd';
import { CVTemplateData } from '../../../data/cv-templates';
import ModernTemplate from './templates/ModernTemplate';

interface CVPreviewProps {
  data: CVTemplateData;
  template: 'modern' | string;
  scale?: number;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, template, scale = 0.7 }) => {
  return (
    <Card 
      className="cv-preview-container"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        maxHeight: '100vh',
        overflow: 'auto'
      }}
    >
      {template === 'modern' && <ModernTemplate data={data} />}
    </Card>
  );
};

export default CVPreview; 