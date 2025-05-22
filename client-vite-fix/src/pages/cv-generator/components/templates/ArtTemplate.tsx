import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, HighlightOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface ArtTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const ArtTemplate: React.FC<ArtTemplateProps> = ({ data, isMiniature = false }) => {
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
  const interests = Array.isArray(data.interests) ? data.interests : [];
  const projects = Array.isArray(data.projects) ? data.projects : [];

  // Styles dynamiques
  const padding = isMiniature ? 12 : 32;
  const borderRadius = isMiniature ? 8 : 16;
  const boxShadow = isMiniature ? '0 2px 8px rgba(114, 46, 209, 0.08)' : '0 4px 24px rgba(114, 46, 209, 0.08)';
  const avatarSize = isMiniature ? 48 : 160;
  const avatarBorder = isMiniature ? '2px solid #722ed1' : '4px solid #722ed1';
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

  // Nouvelle structure premium type Morgan Maxwell
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      fontSize: 12,
      background: 'linear-gradient(135deg, #f9f0ff 0%, #e6f4ea 100%)',
      borderRadius: 16,
      boxSizing: 'border-box',
      padding: 0,
      overflow: 'hidden',
    }}>
      {/* Colonne gauche */}
      <div style={{ width: '36%', background: '#f5f7f6', padding: '32px 16px 32px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, height: '100%' }}>
        <Avatar src={personalInfo.photo || '/images/avatars/woman-4.png'} size={110} style={{ border: '4px solid #fff', marginBottom: 12, boxShadow: '0 2px 8px #0001' }} />
        <div style={{ fontWeight: 700, fontSize: 22, color: '#222', textAlign: 'center', marginBottom: 2 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
        <div style={{ fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 10 }}>{personalInfo.title}</div>
        <div style={{ background: '#d2e6d6', borderRadius: 12, padding: '12px 14px', fontSize: 12, color: '#222', marginBottom: 10, width: '100%' }}>
          <b>À propos de moi</b><br />
          <span style={{ color: '#444' }}>{summary}</span>
        </div>
        <div style={{ width: '100%', marginBottom: 10 }}>
          <b style={{ color: '#6b8e6e' }}>Compétences :</b>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {skills.slice(0, 8).map((skill, i) => <li key={i}>{skill.name} {skill.level ? <span style={{ color: '#888', fontSize: 11 }}>({skill.level})</span> : null}</li>)}
          </ul>
        </div>
        <div style={{ width: '100%', marginBottom: 10 }}>
          <b style={{ color: '#6b8e6e' }}>Formation :</b>
          <div style={{ fontSize: 11, color: '#444' }}>
            {education.slice(0, 2).map((edu, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                <div>{edu.degree} - {edu.institution}</div>
                <div style={{ color: '#888' }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
        {certifications.length > 0 && (
          <div style={{ width: '100%', marginBottom: 10 }}>
            <b style={{ color: '#6b8e6e' }}>Certifications :</b>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {certifications.slice(0, 3).map((cert, i) => {
                if (typeof cert === 'string') {
                  return <li key={i}>{cert}</li>;
                } else {
                  return <li key={i}>{cert.name} <span style={{ color: '#888', fontSize: 11 }}>({cert.date || cert.year || ''})</span></li>;
                }
              })}
            </ul>
          </div>
        )}
        <div style={{ width: '100%', marginBottom: 10 }}>
          <b style={{ color: '#6b8e6e' }}>Langues :</b>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {languages.slice(0, 4).map((lang, i) => (
              <div key={i} style={{ background: '#e6f4ea', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#333', minWidth: 48, textAlign: 'center' }}>{lang.name}<br /><span style={{ color: '#888', fontSize: 10 }}>{lang.level}</span></div>
            ))}
          </div>
        </div>
        {interests.length > 0 && (
          <div style={{ width: '100%', marginBottom: 10 }}>
            <b style={{ color: '#6b8e6e' }}>Centres d'intérêt :</b>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {interests.slice(0, 4).map((interest, i) => <li key={i}>{interest}</li>)}
            </ul>
          </div>
        )}
        <div style={{ width: '100%', marginTop: 10 }}>
          <div style={{ fontSize: 11, color: '#888' }}><MailOutlined /> {personalInfo.email}</div>
          <div style={{ fontSize: 11, color: '#888' }}><PhoneOutlined /> {personalInfo.phone}</div>
          <div style={{ fontSize: 11, color: '#888' }}><EnvironmentOutlined /> {personalInfo.address}</div>
          {personalInfo.linkedin && <div style={{ fontSize: 11, color: '#888' }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
          {personalInfo.portfolio && <div style={{ fontSize: 11, color: '#888' }}><GlobalOutlined /> {personalInfo.portfolio}</div>}
        </div>
      </div>
      {/* Colonne droite */}
      <div style={{ width: '64%', background: '#fff', padding: '32px 32px 32px 24px', display: 'flex', flexDirection: 'column', gap: 18, height: '100%' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#3a5d3a', marginBottom: 8 }}>Expérience professionnelle</div>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          {experience.slice(0, 4).map((exp, i) => (
            <li key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600 }}>{exp.title} <span style={{ fontWeight: 400, color: '#888' }}>@ {exp.company}</span></div>
              <div style={{ fontSize: 11, color: '#888' }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
              <div style={{ fontSize: 12 }}>{exp.description}</div>
              {exp.achievements && exp.achievements.length > 0 && (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {exp.achievements.slice(0, 3).map((ach, j) => <li key={j} style={{ fontSize: 11 }}>{ach}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
        {projects.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#3a5d3a', marginBottom: 8 }}>Projets</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {projects.slice(0, 3).map((proj, i) => {
                if (typeof proj === 'string') {
                  return <li key={i}>{proj}</li>;
                } else {
                  return (
                    <li key={i}>
                      <div style={{ fontWeight: 600 }}>{proj.name}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{proj.year || proj.startDate || ''}</div>
                      <div style={{ fontSize: 12 }}>{proj.description}</div>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtTemplate; 