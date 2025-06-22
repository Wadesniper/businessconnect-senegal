import React, { useState, useEffect, useRef, forwardRef } from 'react';
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

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data, template, customization, isPremium, isMiniature = false }, ref) => {
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

    const baseA4Width = 794;
    const baseA4Height = 1123;
    const maxA4Height = baseA4Height;

    useEffect(() => {
      if (isMiniature) return;
      const handleResize = () => {
        const maxW = Math.min(window.innerWidth - 64, 900);
        const maxH = window.innerHeight * 0.9;
        const scaleW = maxW / baseA4Width;
        const scaleH = maxH / maxA4Height;
        setAutoScale(Math.min(scaleW, scaleH, 1));
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [isMiniature]);

    useEffect(() => {
      if (isMiniature) return;
      const checkHeight = () => {
        if (contentRef.current) {
          const realHeight = contentRef.current.getBoundingClientRect().height;
          setNeedsScroll(realHeight > baseA4Height + 2);
        }
      };
      checkHeight();
      window.addEventListener('resize', checkHeight);
      return () => window.removeEventListener('resize', checkHeight);
    }, [data, template, customization, isMiniature]);

    if (isMiniature) {
      // Le template est maintenant responsive, il s'adaptera tout seul
      return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <TemplateComponent
            data={safeData}
            customization={customization}
            isMiniature={true}
          />
        </div>
      );
    }

    const previewContent = (
      <div
        ref={ref}
        className="cv-preview-for-export"
        style={{
          width: baseA4Width,
          minHeight: baseA4Height,
          background: '#fff',
          margin: '0 auto',
        }}
      >
        <div ref={contentRef} style={{ width: '100%', height: 'auto' }}>
          <TemplateComponent
            data={safeData}
            customization={customization}
            isMiniature={false}
          />
        </div>
        {!isPremium && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '16px', zIndex: 2,
          }}>
            <Title level={3}>Version d'aperçu</Title>
            <Text>Abonnez-vous pour télécharger votre CV</Text>
            <Button type="primary" onClick={() => navigate('/subscription')}>S'abonner</Button>
          </div>
        )}
      </div>
    );

    return (
      <div className="cv-preview-wrapper" style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflowX: 'hidden' }}>
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
        <div style={{
          width: baseA4Width,
          transform: `scale(${autoScale * (zoom / 100)})`,
          transformOrigin: 'top center',
          transition: 'transform 0.3s ease',
        }}>
          {previewContent}
        </div>
      </div>
    );
  }
);

export default CVPreview; 