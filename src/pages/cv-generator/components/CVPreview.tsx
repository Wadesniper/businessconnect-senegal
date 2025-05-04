import React from 'react';
import { Card } from 'antd';
import { CVData, Template } from '../../../types/cv';
import ModernTemplate from './templates/ModernTemplate';

interface CVPreviewProps {
  data: CVData;
  template: Template;
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
      <ModernTemplate data={data} template={template} />
    </Card>
  );
};

export default CVPreview; 