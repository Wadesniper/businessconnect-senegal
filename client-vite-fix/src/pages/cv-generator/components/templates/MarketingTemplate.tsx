import React from 'react';
import { Row, Col, Avatar, Tag, Progress } from 'antd';
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
  color: accentBlue,
  fontWeight: 700,
  fontSize: 18,
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
    <div style={{ background: mainBlue, color: white, borderRadius: 18, minHeight: 1123, fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'row', width: 794, height: 1123 }}>
      {/* Colonne gauche */}
      <div style={{ background: accentBlue, width: 270, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
        <Avatar src={personalInfo.photo || '/images/avatars/woman-1.png'} size={110} style={{ border: '4px solid #fff', marginBottom: 18, boxShadow: '0 2px 8px #0001' }} />
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 15, color: lightBlue, fontWeight: 500 }}>{personalInfo.title}</div>
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <Tag icon={<MailOutlined />} color="default" style={{ width: '100%', marginBottom: 6, background: white, color: mainBlue, fontWeight: 600 }}>{personalInfo.email}</Tag>
          <Tag icon={<PhoneOutlined />} color="default" style={{ width: '100%', marginBottom: 6, background: white, color: mainBlue, fontWeight: 600 }}>{personalInfo.phone}</Tag>
          <Tag icon={<EnvironmentOutlined />} color="default" style={{ width: '100%', marginBottom: 6, background: white, color: mainBlue, fontWeight: 600 }}>{personalInfo.address}</Tag>
          {personalInfo.linkedin && <Tag icon={<LinkedinOutlined />} color="default" style={{ width: '100%', marginBottom: 6, background: white, color: mainBlue, fontWeight: 600 }}>{personalInfo.linkedin}</Tag>}
          {personalInfo.portfolio && <Tag icon={<GlobalOutlined />} color="default" style={{ width: '100%', marginBottom: 6, background: white, color: mainBlue, fontWeight: 600 }}>{personalInfo.portfolio}</Tag>}
        </div>
        {/* À propos */}
        {summary && <div style={{ marginBottom: 18 }}>
          <div style={sectionTitleStyle}>À propos de moi</div>
          <div style={{ color: white, fontSize: 13, lineHeight: 1.5 }}>{summary}</div>
        </div>}
        {/* Compétences */}
        {skills.length > 0 && <div style={{ marginBottom: 18, width: '100%' }}>
          <div style={sectionTitleStyle}>Compétences</div>
          {skills.map((skill, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div style={{ ...labelStyle, marginBottom: 2 }}>{skill.name}</div>
              <Progress percent={typeof skill.level === 'number' ? skill.level * 25 : skill.level === 'Débutant' ? 25 : skill.level === 'Intermédiaire' ? 50 : skill.level === 'Avancé' ? 75 : skill.level === 'Expert' ? 100 : 0} showInfo={false} strokeColor={lightBlue} trailColor={mainBlue} style={{ height: 6 }} />
            </div>
          ))}
        </div>}
        {/* Langues */}
        {languages.length > 0 && <div style={{ marginBottom: 18, width: '100%' }}>
          <div style={sectionTitleStyle}>Langues</div>
          {languages.map((lang, idx) => (
            <div key={idx} style={{ ...labelStyle, marginBottom: 4 }}>{lang.name} <span style={{ color: lightBlue, fontWeight: 700 }}>- {lang.level}</span></div>
          ))}
        </div>}
        {/* Centres d'intérêt */}
        {interests.length > 0 && <div style={{ marginBottom: 18, width: '100%' }}>
          <div style={sectionTitleStyle}>Centres d'intérêt</div>
          {interests.map((interest, idx) => (
            <div key={idx} style={{ ...labelStyle, color: white, marginBottom: 4 }}>{interest}</div>
          ))}
        </div>}
      </div>
      {/* Colonne droite */}
      <div style={{ flex: 1, background: mainBlue, padding: 40, display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Expérience */}
        {experience.length > 0 && <div style={{ marginBottom: 28 }}>
          <div style={sectionTitleStyle}>Expérience</div>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: lightBlue }}>{exp.title}</div>
              <div style={{ ...labelStyle, color: gray }}>{exp.company} <span style={{ color: white, fontWeight: 400 }}>• {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</span></div>
              <div style={{ color: white, fontSize: 13, marginTop: 2 }}>{exp.description}</div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul style={{ color: lightBlue, fontSize: 12, marginTop: 4, marginBottom: 0, paddingLeft: 18 }}>
                  {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>}
        {/* Formation */}
        {education.length > 0 && <div style={{ marginBottom: 28 }}>
          <div style={sectionTitleStyle}>Formation</div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: lightBlue }}>{edu.degree} en {edu.field}</div>
              <div style={{ ...labelStyle, color: gray }}>{edu.institution} <span style={{ color: white, fontWeight: 400 }}>• {edu.startDate} - {edu.endDate}</span></div>
              <div style={{ color: white, fontSize: 13, marginTop: 2 }}>{edu.description}</div>
            </div>
          ))}
        </div>}
        {/* Certifications */}
        {certifications.length > 0 && <div style={{ marginBottom: 28 }}>
          <div style={sectionTitleStyle}>Certifications</div>
          {certifications.map((cert, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: lightBlue }}>{typeof cert === 'string' ? cert : cert.name}</div>
              {typeof cert !== 'string' && <div style={{ ...labelStyle, color: gray }}>{cert.issuer} <span style={{ color: white, fontWeight: 400 }}>• {cert.date}</span></div>}
            </div>
          ))}
        </div>}
        {/* Projets */}
        {projects.length > 0 && <div style={{ marginBottom: 28 }}>
          <div style={sectionTitleStyle}>Projets</div>
          {projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: lightBlue }}>{typeof proj === 'string' ? proj : proj.name}</div>
              {typeof proj !== 'string' && <div style={{ color: white, fontSize: 13 }}>{proj.description}</div>}
              {typeof proj !== 'string' && <div style={{ ...labelStyle, color: gray }}>{(proj as any).year || proj.startDate || ''}</div>}
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

export default MarketingTemplate; 