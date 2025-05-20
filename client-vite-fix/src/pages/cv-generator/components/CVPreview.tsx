import React, { useState } from 'react';
import { Card, Avatar, Typography, Divider, Tag, Space, Button, Slider } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { CVData, Template, CustomizationOptions } from '../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface CVPreviewProps {
  data: CVData;
  template: Template;
  customization: CustomizationOptions;
  isPremium: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, template, customization, isPremium }) => {
  const [zoom, setZoom] = useState(100);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleZoomChange = (value: number) => {
    setZoom(value);
  };

  const TemplateComponent = template.component;

  // Sécurisation des données pour éviter les crashs
  const safeData = {
    personalInfo: {
      firstName: data?.personalInfo?.firstName || '',
      lastName: data?.personalInfo?.lastName || '',
      title: data?.personalInfo?.title || '',
      email: data?.personalInfo?.email || '',
      phone: data?.personalInfo?.phone || '',
      address: data?.personalInfo?.address || '',
      photo: data?.personalInfo?.photo || '',
      summary: data?.personalInfo?.summary || '',
    },
    experience: Array.isArray(data?.experience) ? data.experience : [],
    education: Array.isArray(data?.education) ? data.education : [],
    skills: Array.isArray(data?.skills) ? data.skills : [],
    languages: Array.isArray(data?.languages) ? data.languages : [],
    certifications: Array.isArray(data?.certifications) ? data.certifications : [],
    projects: Array.isArray(data?.projects) ? data.projects : [],
    interests: Array.isArray(data?.interests) ? data.interests : [],
  };

  const previewStyle = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top center',
    transition: 'transform 0.3s ease',
  };

  const controls = (
    <div style={{ 
      position: 'fixed', 
      bottom: 20, 
      left: '50%', 
      transform: 'translateX(-50%)',
      background: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      zIndex: 1000
    }}>
      <Button 
        icon={<ZoomOutOutlined />} 
        onClick={() => handleZoomChange(Math.max(50, zoom - 10))}
      />
      <Slider 
        value={zoom} 
        onChange={handleZoomChange} 
        min={50} 
        max={200} 
        style={{ width: 200 }} 
      />
      <Button 
        icon={<ZoomInOutlined />} 
        onClick={() => handleZoomChange(Math.min(200, zoom + 10))}
      />
      <Button 
        icon={<EyeOutlined />} 
        onClick={() => setShowFullscreen(!showFullscreen)}
      >
        {showFullscreen ? 'Réduire' : 'Plein écran'}
      </Button>
    </div>
  );

  const preview = (
    <div style={{ 
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: 32,
      maxWidth: 900,
      margin: '0 auto',
      ...previewStyle
    }}>
      <TemplateComponent 
        data={safeData} 
        customization={customization}
      />
      {!isPremium && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Title level={3}>Version d'aperçu</Title>
          <Text>Abonnez-vous pour télécharger votre CV</Text>
          <Button type="primary" href="/subscription">S'abonner</Button>
        </div>
      )}
    </div>
  );

  if (showFullscreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f0f2f5',
        padding: '40px',
        overflow: 'auto',
        zIndex: 1000
      }}>
        {preview}
        {controls}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {preview}
      {controls}
    </div>
  );
};

export default CVPreview; 