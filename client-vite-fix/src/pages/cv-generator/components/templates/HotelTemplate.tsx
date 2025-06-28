import React from 'react';
import { Row, Col, Tag, Timeline, Card, Avatar, Rate, Progress } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, CoffeeOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface HotelTemplateProps {
  data: CVData;
  isMiniature?: boolean;
  customization?: { primaryColor?: string };
}

const marron = '#6B4F3A';
const beige = '#F5F3F0';
const blanc = '#fff';
const gris = '#888';

const HotelTemplate: React.FC<HotelTemplateProps> = ({ data, isMiniature = false, customization }) => {
  const primaryColor = customization?.primaryColor || marron;
  // Sécurisation des accès aux champs potentiellement absents
  const personalInfo = {
    ...data.personalInfo,
    linkedin: (data.personalInfo as any).linkedin || '',
    portfolio: (data.personalInfo as any).portfolio || '',
    summary: (data.personalInfo as any).summary || '',
  };
  const summary = personalInfo.summary || (data as any).summary || '';
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];

  // Styles dynamiques
  const padding = isMiniature ? 12 : 32;
  const borderRadius = isMiniature ? 8 : 16;
  const boxShadow = isMiniature ? '0 2px 8px rgba(24, 144, 255, 0.08)' : '0 4px 24px rgba(24, 144, 255, 0.08)';
  const avatarSize = isMiniature ? 48 : 160;
  const avatarBorder = isMiniature ? '2px solid #13c2c2' : '4px solid #13c2c2';
  const avatarMargin = isMiniature ? 4 : 16;
  const titleLevel = isMiniature ? 5 : 3;
  const titleFontSize = isMiniature ? 14 : 28;
  const subtitleFontSize = isMiniature ? 11 : 16;
  const sectionMargin = isMiniature ? 8 : 32;
  const cardPadding = isMiniature ? 6 : 16;
  const cardFontSize = isMiniature ? 9 : 14;
  const tagFontSize = isMiniature ? 9 : 16;
  const rowGutter: [number, number] = isMiniature ? [4, 4] : [16, 16];
  const timelineCardPadding = isMiniature ? 4 : 16;
  const timelineCardFontSize = isMiniature ? 9 : 14;

  return (
    <div className="cv-template-container" style={{ width: 794, minHeight: 1123, background: blanc, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: blanc, padding: '32px 48px 0 48px', minHeight: 180 }}>
        <Avatar src={personalInfo.photo || '/images/avatars/woman-5.png'} size={120} style={{ border: '4px solid #fff', marginRight: 32, boxShadow: '0 2px 8px #0001' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 32, color: primaryColor, letterSpacing: 1, lineHeight: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}</div>
          <div style={{ fontSize: 20, color: gris, fontWeight: 500, marginTop: 8, letterSpacing: 8, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.title?.toUpperCase()}</div>
        </div>
      </div>
      {/* Bloc contacts horizontal */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', background: beige, padding: '12px 0', gap: 32, borderRadius: '0 0 18px 18px', margin: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PhoneOutlined style={{ background: primaryColor, color: blanc, borderRadius: '50%', padding: 6, fontSize: 18 }} /> {personalInfo.phone}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined style={{ background: primaryColor, color: blanc, borderRadius: '50%', padding: 6, fontSize: 18 }} /> {personalInfo.email}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined style={{ background: primaryColor, color: blanc, borderRadius: '50%', padding: 6, fontSize: 18 }} /> {personalInfo.address}</div>
        {personalInfo.portfolio && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><GlobalOutlined style={{ background: primaryColor, color: blanc, borderRadius: '50%', padding: 6, fontSize: 18 }} /> {personalInfo.portfolio}</div>}
      </div>
      {/* Deux colonnes */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, background: blanc, padding: '32px 48px', gap: 48 }}>
        {/* Colonne gauche */}
        <div style={{ width: '44%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* À propos */}
          {summary && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, background: beige, padding: '6px 12px', borderRadius: 8, marginBottom: 8 }}>À PROPOS</div>
              <div style={{ fontSize: 14, color: gris }}>{summary}</div>
            </div>
          )}
          {/* Formation */}
          {education.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, background: beige, padding: '6px 12px', borderRadius: 8, marginBottom: 8 }}>FORMATION</div>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.institution}</div>
                  <div style={{ fontSize: 12, color: primaryColor }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 11, color: gris }}>{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          )}
          {/* Langues avec barres */}
          {languages.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, background: beige, padding: '6px 12px', borderRadius: 8, marginBottom: 8 }}>LANGUES</div>
              {languages.map((lang, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: primaryColor, marginBottom: 2 }}>{lang.name}</div>
                  <Progress percent={typeof lang.level === 'number' ? lang.level : lang.level === 'Débutant' ? 20 : lang.level === 'Intermédiaire' ? 50 : lang.level === 'Avancé' ? 75 : lang.level === 'Expert' ? 100 : 0} showInfo={false} strokeColor={primaryColor} trailColor={beige} style={{ height: 8 }} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Colonne droite */}
        <div style={{ width: '56%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Expérience */}
          {experience.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, background: beige, padding: '6px 12px', borderRadius: 8, marginBottom: 8 }}>EXPÉRIENCE</div>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: primaryColor }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: gris }}>{exp.company}</div>
                  <div style={{ fontSize: 12, color: primaryColor }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                  <div style={{ fontSize: 13, color: gris }}>{exp.description}</div>
                </div>
              ))}
            </div>
          )}
          {/* Compétences avec barres */}
          {skills.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, background: beige, padding: '6px 12px', borderRadius: 8, marginBottom: 8 }}>COMPÉTENCES</div>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ fontSize: 13, color: primaryColor, marginBottom: 10 }}>{skill.name}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelTemplate; 