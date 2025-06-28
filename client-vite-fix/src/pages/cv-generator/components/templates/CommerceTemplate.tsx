import React from 'react';
import { Avatar, Progress } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface CommerceTemplateProps {
  data: CVData;
  isMiniature?: boolean;
  customization?: { primaryColor?: string };
}

const CommerceTemplate: React.FC<CommerceTemplateProps> = ({ data, isMiniature = false, customization }) => {
  const primaryColor = customization?.primaryColor || '#232323';
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
  const boxShadow = isMiniature ? '0 2px 8px rgba(255, 77, 79, 0.08)' : '0 4px 24px rgba(255, 77, 79, 0.08)';
  const avatarSize = isMiniature ? 48 : 160;
  const avatarBorder = isMiniature ? '2px solid #ff4d4f' : '4px solid #ff4d4f';
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
    <div style={{ width: 794, minHeight: 1123, background: '#f7f7f7', borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'row' }}>
      {/* Colonne gauche */}
      <div style={{ width: '35%', background: '#ededed', padding: '36px 18px 24px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
        {/* Photo de profil */}
        <Avatar src={personalInfo.photo || '/images/avatars/man-3.png'} size={120} style={{ border: '4px solid #fff', marginBottom: 18, boxShadow: '0 2px 8px #0001' }} />
        {/* Education */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, marginBottom: 8, background: '#fff', padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>FORMATION</div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.institution}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
              <div style={{ fontSize: 11, color: '#aaa' }}>{edu.startDate} - {edu.endDate}</div>
            </div>
          ))}
        </div>
        {/* Langue */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, marginBottom: 8, background: '#fff', padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>LANGUES</div>
          {languages.map((lang, idx) => (
            <div key={idx} style={{ fontSize: 13, color: primaryColor, marginBottom: 4 }}>{lang.name} <span style={{ color: '#888', fontSize: 12 }}>({lang.level})</span></div>
          ))}
        </div>
        {/* Skill Summary */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: primaryColor, marginBottom: 8, background: '#fff', padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>COMPÉTENCES</div>
          {skills.map((skill, idx) => (
            <div key={idx} style={{ fontSize: 13, color: primaryColor, marginBottom: 10 }}>{skill.name}</div>
          ))}
        </div>
      </div>
      {/* Colonne droite */}
      <div style={{ width: '65%', background: '#fff', padding: '36px 36px 24px 36px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Nom, titre */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 36, color: '#232323', letterSpacing: 1, lineHeight: 1 }}>{personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}</div>
          <div style={{ fontSize: 18, color: '#888', fontWeight: 500, marginTop: 2 }}>{personalInfo.title}</div>
        </div>
        {/* Expérience */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#232323', marginBottom: 10, background: '#ededed', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>EXPÉRIENCE PROFESSIONNELLE</div>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#232323' }}>{exp.title}</div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
              <div style={{ fontSize: 12, color: '#232323' }}>{exp.description}</div>
            </div>
          ))}
        </div>
        {/* Projets */}
        {projects && projects.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#232323', marginBottom: 10, background: '#ededed', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>PROJETS</div>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{typeof proj === 'string' ? proj : proj.name}</div>
                {typeof proj !== 'string' && proj.description && <div style={{ fontSize: 12 }}>{proj.description}</div>}
                {typeof proj !== 'string' && (proj.startDate || proj.endDate) && (
                  <div style={{ fontSize: 11, color: '#888' }}>{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#232323', marginBottom: 10, background: '#ededed', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>CERTIFICATIONS</div>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{typeof cert === 'string' ? cert : cert.name}</div>
                {typeof cert !== 'string' && cert.issuer && <div style={{ fontSize: 12, color: '#888' }}>{cert.issuer}</div>}
                {typeof cert !== 'string' && cert.date && <div style={{ fontSize: 11, color: '#aaa' }}>{cert.date}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Centres d'intérêt */}
        {interests && interests.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#232323', marginBottom: 10, background: '#ededed', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>CENTRES D'INTÉRÊT</div>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#232323', fontSize: 14 }}>
              {interests.map((interest, idx) => (
                <li key={idx}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && 'name' in interest ? interest.name : '')}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Expertise */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#232323', marginBottom: 10, background: '#ededed', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>DOMAINES D'EXPERTISE</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#232323', fontSize: 14 }}>
            {skills.map((skill, idx) => (
              <li key={idx}>{skill.name}</li>
            ))}
          </ul>
        </div>
        {/* Contact */}
        <div style={{ marginTop: 'auto', background: '#ededed', borderRadius: 8, padding: '16px 18px', color: '#232323', fontSize: 14 }}>
          <div style={{ marginBottom: 6 }}><PhoneOutlined /> {personalInfo.phone}</div>
          <div style={{ marginBottom: 6 }}><MailOutlined /> {personalInfo.email}</div>
          {personalInfo.portfolio && <div style={{ marginBottom: 6 }}><GlobalOutlined /> {personalInfo.portfolio}</div>}
          <div style={{ marginBottom: 6 }}><EnvironmentOutlined /> {personalInfo.address}</div>
        </div>
        {/* Section Références dynamique */}
        {Array.isArray(data.references) && data.references.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, marginBottom: 8 }}>RÉFÉRENCES</div>
            {data.references.map((ref: any, idx: number) => (
              <div key={idx} style={{ fontSize: 14, color: primaryColor, marginBottom: 8 }}>
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

export default CommerceTemplate; 