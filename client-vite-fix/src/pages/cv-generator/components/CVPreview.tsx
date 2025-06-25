import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Card, Avatar, Typography, Divider, Tag, Space, Button, Slider } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { CVData, Template, CustomizationOptions } from '../../../types/cv';

const { Title, Text, Paragraph } = Typography;

const GlobalCVStyles = () => (
  <style>{`
    .cv-preview-for-export,
    .cv-preview-for-export * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cv-preview-for-export p,
    .cv-preview-for-export div,
    .cv-preview-for-export span,
    .cv-preview-for-export li {
      word-wrap: break-word; /* Ancien nom */
      overflow-wrap: break-word; /* Nouveau nom, standard */
      white-space: pre-wrap; /* Respecte les retours à la ligne et espaces */
    }
  `}</style>
);

interface CVPreviewProps {
  data: CVData;
  template: Template;
  customization: CustomizationOptions;
  isPremium: boolean;
  isMiniature?: boolean;
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data, template, customization, isPremium, isMiniature = false }, ref) => {
    const navigate = useNavigate();
    const TemplateComponent = template.component;

    // Données sécurisées pour éviter les erreurs si des champs sont nuls
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

    // Pour les miniatures (utilisées dans la galerie de sélection), on garde un rendu simple.
    if (isMiniature) {
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

    // --- Rendu principal de l'aperçu ---
    return (
      <>
        {/* Style global pour corriger le retour à la ligne */}
        <style>{`
          .cv-preview-for-export, .cv-preview-for-export * {
            box-sizing: border-box;
          }
          .cv-preview-for-export p,
          .cv-preview-for-export div,
          .cv-preview-for-export span,
          .cv-preview-for-export li {
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
          }
        `}</style>
        
        <div className="cv-preview-wrapper" style={{ 
          width: '100%', 
          padding: '20px 0', 
          display: 'flex', 
          justifyContent: 'center', 
          background: '#f0f2f5' 
        }}>
          {/* Le conteneur qui sera capturé pour le PDF */}
          <div
            ref={ref}
            className="cv-preview-for-export"
            style={{
              width: '210mm', // Format A4
              minHeight: '297mm', // Format A4
              background: '#fff',
              boxShadow: '0 0 15px rgba(0,0,0,0.1)',
            }}
          >
            <TemplateComponent
              data={safeData}
              customization={customization}
              isMiniature={false}
            />

            {/* Le watermark pour les non-abonnés */}
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
        </div>
      </>
    );
  }
);

export default CVPreview; 