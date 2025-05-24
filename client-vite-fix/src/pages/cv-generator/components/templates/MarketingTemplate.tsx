import React from 'react';
import { Row, Col, Avatar, Tag, Progress, Divider } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface MarketingTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const mainBlue = '#0a2940';
const accentBlue = '#1976d2';
const lightBlue = '#e3f2fd';
const white = '#fff';
const gray = '#b0bec5';

const sectionTitleStyle = {
  color: white,
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: 1,
  marginBottom: 8,
  textTransform: 'uppercase' as const,
};

const labelStyle = { color: gray, fontWeight: 500, fontSize: 13 };
const valueStyle = { color: white, fontWeight: 600, fontSize: 15 };

const MarketingTemplate: React.FC<MarketingTemplateProps> = ({ data, isMiniature = false }) => {
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
  const interests = Array.isArray(data.interests) ? data.interests : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];

  return (
    <div style={{ background: mainBlue, color: white, borderRadius: 18, height: 1123, minHeight: 1123, maxHeight: 1123, fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', padding: 0, overflow: 'visible', display: 'flex', flexDirection: 'row', width: 794 }}>
      {/* Colonne gauche */}
      <div style={{ background: accentBlue, width: 320, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100%', height: '100%' }}>
        {/* Header horizontal */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '32px 18px 16px 18px', borderBottom: `1px solid ${gray}`, minHeight: 120 }}>
          <Avatar src={personalInfo.photo || '/images/avatars/woman-1.png'} size={90} style={{ border: '2px solid #fff', marginRight: 14, boxShadow: '0 2px 8px #0001', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: 1, color: white, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
            <div style={{ fontSize: 13, color: lightBlue, fontWeight: 500, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{personalInfo.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', marginTop: 2 }}>
              {personalInfo.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <MailOutlined style={{ color: white, fontSize: 15 }} />
                  <span style={{ color: white, fontWeight: 600, fontSize: 13, letterSpacing: 0.2 }}>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <PhoneOutlined style={{ color: white, fontSize: 15 }} />
                  <span style={{ color: white, fontWeight: 600, fontSize: 13 }}>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <EnvironmentOutlined style={{ color: white, fontSize: 15 }} />
                  <span style={{ color: white, fontWeight: 600, fontSize: 13 }}>{personalInfo.address}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <LinkedinOutlined style={{ color: lightBlue, fontSize: 15 }} />
                  <span style={{ color: lightBlue, fontWeight: 600, fontSize: 13 }}>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <GlobalOutlined style={{ color: lightBlue, fontSize: 15 }} />
                  <span style={{ color: lightBlue, fontWeight: 600, fontSize: 13 }}>{personalInfo.portfolio}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* À propos */}
        {summary && <div style={{ padding: '14px 18px 0 18px' }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 13, marginBottom: 4, letterSpacing: 0.5 }}>À PROPOS DE MOI</div>
          <div style={{ color: white, fontSize: 12, lineHeight: 1.5 }}>{summary}</div>
        </div>}
        <Divider style={{ background: gray, margin: '12px 0 0 0' }} />
        {/* Compétences */}
        {skills.length > 0 && <div style={{ padding: '12px 18px 0 18px' }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 13, marginBottom: 4, letterSpacing: 0.5 }}>COMPÉTENCES</div>
          {skills.map((skill, idx) => (
            <div key={idx} style={{ marginBottom: 6 }}>
              <div style={{ ...labelStyle, color: lightBlue, marginBottom: 1, fontSize: 12 }}>{skill.name}</div>
              <Progress percent={typeof skill.level === 'number' ? skill.level * 25 : skill.level === 'Débutant' ? 25 : skill.level === 'Intermédiaire' ? 50 : skill.level === 'Avancé' ? 75 : skill.level === 'Expert' ? 100 : 0} showInfo={false} strokeColor={white} trailColor={accentBlue} style={{ height: 4 }} />
            </div>
          ))}
        </div>}
        <Divider style={{ background: gray, margin: '12px 0 0 0' }} />
        {/* Langues */}
        {languages.length > 0 && <div style={{ padding: '12px 18px 0 18px' }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 13, marginBottom: 4, letterSpacing: 0.5 }}>LANGUES</div>
          {languages.map((lang, idx) => (
            <div key={idx} style={{ ...labelStyle, color: white, marginBottom: 3, fontSize: 12 }}>{lang.name} <span style={{ color: lightBlue, fontWeight: 700 }}>- {lang.level}</span></div>
          ))}
        </div>}
        <Divider style={{ background: gray, margin: '12px 0 0 0' }} />
        {/* Centres d'intérêt */}
        {interests.length > 0 && <div style={{ padding: '12px 18px 0 18px' }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 13, marginBottom: 4, letterSpacing: 0.5 }}>CENTRES D'INTÉRÊT</div>
          {interests.map((interest, idx) => (
            <div key={idx} style={{ ...labelStyle, color: white, marginBottom: 3, fontSize: 12 }}>{interest}</div>
          ))}
        </div>}
      </div>
      {/* Colonne droite */}
      <div style={{ flex: 1, background: mainBlue, padding: 36, display: 'flex', flexDirection: 'column', minHeight: '100%', height: '100%', overflow: 'visible' }}>
        {/* Expérience */}
        {experience.length > 0 && <div style={{ marginBottom: 22 }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 18, marginBottom: 14 }}>EXPÉRIENCE</div>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: lightBlue }}>{exp.title}</div>
              <div style={{ ...labelStyle, color: gray, fontSize: 12 }}>{exp.company} <span style={{ color: white, fontWeight: 400 }}>• {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</span></div>
              <div style={{ color: white, fontSize: 12, marginTop: 2 }}>{exp.description}</div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul style={{ color: lightBlue, fontSize: 11, marginTop: 3, marginBottom: 0, paddingLeft: 16 }}>
                  {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>}
        {/* Formation */}
        {education.length > 0 && <div style={{ marginBottom: 22 }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 18, marginBottom: 14 }}>FORMATION</div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: lightBlue }}>{edu.degree} en {edu.field}</div>
              <div style={{ ...labelStyle, color: gray, fontSize: 12 }}>{edu.institution} <span style={{ color: white, fontWeight: 400 }}>• {edu.startDate} - {edu.endDate}</span></div>
              <div style={{ color: white, fontSize: 12, marginTop: 2 }}>{edu.description}</div>
            </div>
          ))}
        </div>}
        {/* Certifications */}
        {certifications.length > 0 && <div style={{ marginBottom: 22 }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 18, marginBottom: 14 }}>CERTIFICATIONS</div>
          {certifications.map((cert, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: lightBlue }}>{typeof cert === 'string' ? cert : cert.name}</div>
              {typeof cert !== 'string' && <div style={{ ...labelStyle, color: gray, fontSize: 12 }}>{cert.issuer} <span style={{ color: white, fontWeight: 400 }}>• {cert.date}</span></div>}
            </div>
          ))}
        </div>}
        {/* Projets */}
        {projects.length > 0 && <div style={{ marginBottom: 22 }}>
          <div style={{ ...sectionTitleStyle, color: white, fontSize: 18, marginBottom: 14 }}>PROJETS</div>
          {projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: lightBlue }}>{typeof proj === 'string' ? proj : proj.name}</div>
              {typeof proj !== 'string' && <div style={{ color: white, fontSize: 12 }}>{proj.description}</div>}
              {typeof proj !== 'string' && <div style={{ ...labelStyle, color: gray, fontSize: 12 }}>{(proj as any).year || proj.startDate || ''}</div>}
            </div>
          ))}
        </div>}
        {/* Section Références dynamique */}
        {Array.isArray(data.references) && data.references.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#1a237e', marginBottom: 8 }}>RÉFÉRENCES</div>
            {data.references.map((ref: any, idx: number) => (
              <div key={idx} style={{ fontSize: 14, color: '#1a237e', marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{ref.name}</div>
                {ref.position && <div style={{ fontSize: 13 }}>{ref.position}</div>}
                {ref.contact && <div style={{ fontSize: 12, color: '#888' }}>{ref.contact}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingTemplate; 