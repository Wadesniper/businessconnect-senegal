import React, { useState, useEffect, useRef } from 'react';
import { Card, Avatar, Typography, Divider, Tag, Space, Button, Slider } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
  const [needsScroll, setNeedsScroll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      profileImage: (data?.personalInfo as any)?.profileImage || '',
      summary: data?.personalInfo?.summary || '',
    },
    experience: Array.isArray(data?.experience) ? data.experience : [],
    education: Array.isArray(data?.education) ? data.education : [],
    skills: Array.isArray(data?.skills) ? data.skills : [],
    languages: Array.isArray(data?.languages) ? data.languages : [],
    certifications: Array.isArray(data?.certifications) ? data.certifications : [],
    projects: Array.isArray(data?.projects) ? data.projects : [],
    interests: Array.isArray(data?.interests) ? data.interests : [],
    references: Array.isArray(data?.references) ? data.references : [],
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

  // Mesure la hauteur réelle du CV après rendu
  useEffect(() => {
    if (isMiniature) return;
    const checkHeight = () => {
      if (contentRef.current) {
        const realHeight = contentRef.current.getBoundingClientRect().height;
        setNeedsScroll(realHeight > baseA4Height + 2); // +2 pour tolérance de bordure
      }
    };
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, [data, template, customization, isMiniature]);

  const previewStyle = isMiniature
    ? {
        width: '100%',
        height: '100%',
        transform: `scale(${autoScale * (zoom / 100)})`,
        transformOrigin: 'top left',
        background: '#fff',
        overflow: 'hidden',
        pointerEvents: 'none' as const,
      }
    : {
        transform: `scale(${autoScale * (zoom / 100)})`,
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease',
      };

  const preview = isMiniature ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        overflow: 'hidden',
        position: 'relative',
        margin: '0 auto',
        padding: 0,
      }}
    >
      <div style={{ width: '100%', height: '100%', fontSize: 11, overflow: 'hidden', padding: 0, margin: 0 }}>
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
        overflow: 'hidden',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ width: '100%', height: '100%', fontSize: 11, overflow: 'hidden', padding: 8, margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
          <Button type="primary" onClick={() => navigate('/subscription')}>S'abonner</Button>
        </div>
      )}
    </div>
  );

  if (isMiniature) {
    // DEBUG : Affiche les données reçues pour la miniature
    // @ts-ignore
    window._lastMiniatureData = data;
    console.log('[CVPreview][miniature] Données reçues :', data);
  }

  return (
    <div className="cv-preview-root" style={{ position: 'relative', width: '100%', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{
        maxWidth: 800,
        margin: '24px 0 12px 0',
        padding: '12px 20px',
        background: '#f5f7fa',
        border: '1px solid #dbeafe',
        borderRadius: 8,
        color: '#1e293b',
        fontSize: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}} xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#2563eb"/><text x="12" y="17" textAnchor="middle" fontSize="15" fill="#fff" fontFamily="Arial" fontWeight="bold">i</text></svg>
        <span>Si l'aperçu de votre CV est coupé en bas, il faut télécharger le PDF pour voir l'intégralité de votre CV.</span>
      </div>
      {preview}
    </div>
  );
};

export default CVPreview; 