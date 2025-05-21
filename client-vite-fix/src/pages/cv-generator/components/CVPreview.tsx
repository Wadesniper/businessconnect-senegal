import React, { useState, useEffect } from 'react';
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
  const [autoScale, setAutoScale] = useState(1);

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

  // Dimensions A4
  const baseA4Width = 794; // px
  const baseA4Height = 1123; // px
  // Forcer 1 seule page A4
  const maxPages = 1;
  const maxA4Height = baseA4Height * maxPages;

  // Calcul du scale automatique pour tenir dans la fenêtre
  useEffect(() => {
    if (isMiniature) return;
    const handleResize = () => {
      const maxW = Math.min(window.innerWidth - 64, 900); // padding
      const maxH = window.innerHeight * 0.9;
      const scaleW = maxW / baseA4Width;
      const scaleH = maxH / maxA4Height;
      setAutoScale(Math.min(scaleW, scaleH, 1));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMiniature]);

  const previewStyle = isMiniature
    ? {
        width: `${baseA4Width}px`,
        height: `${baseA4Height}px`,
        transform: `scale(${autoScale * (zoom / 100)})`,
        transformOrigin: 'top left',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        margin: 0,
        padding: 0,
        overflow: 'visible',
        pointerEvents: 'none' as const,
      }
    : {
        transform: `scale(${autoScale * (zoom / 100)})`,
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease',
      };

  const controls = !isMiniature && (
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
        width: `${baseA4Width}px`,
        height: `${baseA4Height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
        margin: '0 auto',
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        borderRadius: 12,
        padding: 0,
      }}
    >
      <div style={{ width: '100%', height: '100%', fontSize: 13, overflow: 'hidden', padding: 0, margin: 0 }}>
        <TemplateComponent
          data={safeData}
          customization={customization}
          isMiniature={true}
        />
      </div>
    </div>
  ) : (
    <div
      className="cv-preview-root"
      style={{
        width: baseA4Width,
        height: baseA4Height,
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', height: '100%', fontSize: 13, overflow: 'hidden', padding: 0, margin: 0 }}>
        <TemplateComponent
          data={safeData}
          customization={customization}
          isMiniature={false}
        />
      </div>
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

  if (isMiniature) {
    // DEBUG : Affiche les données reçues pour la miniature
    // @ts-ignore
    window._lastMiniatureData = data;
    console.log('[CVPreview][miniature] Données reçues :', data);
  }

  return (
    <div className="cv-preview-root" style={{ position: 'relative', width: '100%', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflowX: 'auto', overflowY: 'hidden' }}>
      {preview}
      {!isMiniature && controls}
    </div>
  );
};

export default CVPreview; 