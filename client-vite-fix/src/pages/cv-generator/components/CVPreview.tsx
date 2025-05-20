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
  isMiniature?: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, template, customization, isPremium, isMiniature = false }) => {
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

  // Ratio A4 : largeur/hauteur = 210/297 ≈ 0.707
  const A4_RATIO = 210 / 297;
  const MINIATURE_WIDTH = 180; // px, largeur de la miniature dans la carte
  const MINIATURE_HEIGHT = MINIATURE_WIDTH / A4_RATIO;

  // Calcul du scale pour que le contenu A4 tienne dans la miniature
  const baseA4Width = 794; // px (A4 à 96dpi)
  const baseA4Height = 1123; // px
  const scaleMiniature = isMiniature ? Math.min(MINIATURE_WIDTH / baseA4Width, MINIATURE_HEIGHT / baseA4Height) : zoom / 100;

  const previewStyle = isMiniature
    ? {
        width: `${baseA4Width}px`,
        height: `${baseA4Height}px`,
        transform: `scale(${scaleMiniature})`,
        transformOrigin: 'top left',
        pointerEvents: 'none' as const,
        overflow: 'hidden',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        margin: 0,
        padding: 0,
      }
    : {
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

  const preview = isMiniature ? (
    <div
      style={{
        width: MINIATURE_WIDTH,
        height: MINIATURE_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        overflow: 'hidden',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <div style={previewStyle}>
        <TemplateComponent
          data={safeData}
          customization={customization}
          isMiniature={true}
        />
      </div>
    </div>
  ) : (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: 32,
      maxWidth: 900,
      margin: '0 auto',
      fontSize: undefined,
      ...previewStyle,
      position: 'relative',
      pointerEvents: 'auto' as const,
    }}>
      <TemplateComponent
        data={safeData}
        customization={customization}
        isMiniature={false}
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
          gap: '16px',
          zIndex: 2,
        }}>
          <Title level={3}>Version d'aperçu</Title>
          <Text>Abonnez-vous pour télécharger votre CV</Text>
          <Button type="primary" href="/subscription">S'abonner</Button>
        </div>
      )}
    </div>
  );

  if (showFullscreen && !isMiniature) {
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
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {preview}
        {controls}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {preview}
      {!isMiniature && controls}
    </div>
  );
};

export default CVPreview; 