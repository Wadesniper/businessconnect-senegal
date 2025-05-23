import React from 'react';
import { Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, BuildOutlined, ToolOutlined, ProjectOutlined, BarChartOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const orange = '#FF6F3C';
const noir = '#232323';
const blanc = '#fff';
const gris = '#b0b0b0';

interface BtpTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const BtpTemplate: React.FC<BtpTemplateProps> = ({ data, isMiniature = false }) => {
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
  const boxShadow = isMiniature ? '0 2px 8px rgba(140, 140, 140, 0.08)' : '0 4px 24px rgba(140, 140, 140, 0.08)';
  const avatarSize = isMiniature ? 48 : 160;
  const avatarBorder = isMiniature ? '2px solid #595959' : '4px solid #595959';
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
    <div style={{ width: 794, height: 1123, background: noir, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'row' }}>
      {/* Colonne gauche */}
      <div style={{ width: '38%', background: noir, color: blanc, padding: '0 0 0 0', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Header graphique */}
        <div style={{ background: orange, height: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Avatar src={personalInfo.photo || '/images/avatars/man-1.png'} size={100} style={{ border: '4px solid #fff', marginBottom: 12, boxShadow: '0 2px 8px #0001' }} />
          <div style={{ fontWeight: 900, fontSize: 28, color: blanc, letterSpacing: 1, lineHeight: 1 }}>{personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}</div>
          <div style={{ fontSize: 16, color: orange, fontWeight: 700, marginTop: 2, textTransform: 'uppercase' }}>{personalInfo.title}</div>
          {/* Ligne graphique */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 6, background: blanc, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
        </div>
        {/* Contact */}
        <div style={{ padding: '24px 32px 0 32px', color: blanc, fontSize: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><PhoneOutlined /> {personalInfo.phone}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><MailOutlined /> {personalInfo.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><EnvironmentOutlined /> {personalInfo.address}</div>
          {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
          {personalInfo.portfolio && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><GlobalOutlined /> {personalInfo.portfolio}</div>}
        </div>
        {/* À propos */}
        {summary && (
          <div style={{ padding: '24px 32px 0 32px' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: orange, marginBottom: 8 }}>À PROPOS</div>
            <div style={{ fontSize: 14, color: blanc }}>{summary}</div>
          </div>
        )}
        {/* Formation */}
        {education.length > 0 && (
          <div style={{ padding: '24px 32px 0 32px' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: orange, marginBottom: 8 }}>FORMATION</div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.institution}</div>
                <div style={{ fontSize: 12, color: gris }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                <div style={{ fontSize: 11, color: gris }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
        {/* Compétences avec pictos */}
        {skills.length > 0 && (
          <div style={{ padding: '24px 32px 0 32px' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: orange, marginBottom: 8 }}>COMPÉTENCES</div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
                  <div style={{ width: 40, height: 40, background: orange, borderRadius: 12, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: blanc, fontSize: 22 }}>
                    {idx % 3 === 0 ? <ToolOutlined /> : idx % 3 === 1 ? <ProjectOutlined /> : <BarChartOutlined />}
                  </div>
                  <span style={{ fontSize: 13, color: blanc, textAlign: 'center' }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '62%', background: blanc, padding: '48px 48px 32px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Expérience */}
        {experience.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: orange, marginBottom: 12 }}>EXPÉRIENCE</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ background: '#23232308', borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18, marginBottom: 18, borderLeft: `6px solid ${orange}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: noir }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: orange, fontWeight: 700 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                </div>
                <div style={{ fontSize: 13, color: gris, fontWeight: 500 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                <div style={{ fontSize: 13, color: noir, marginTop: 2 }}>{exp.description}</div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ color: orange, fontSize: 12, marginTop: 3, marginBottom: 0, paddingLeft: 16 }}>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: orange, marginBottom: 8 }}>CERTIFICATIONS</div>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{typeof cert === 'string' ? cert : cert.name}</div>
                {typeof cert !== 'string' && cert.issuer && <div style={{ fontSize: 12, color: gris }}>{cert.issuer}</div>}
                {typeof cert !== 'string' && cert.date && <div style={{ fontSize: 11, color: gris }}>{cert.date}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Langues */}
        {languages.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: orange, marginBottom: 8 }}>LANGUES</div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {languages.map((lang, idx) => (
                <div key={idx} style={{ fontSize: 13, color: noir, background: '#f5f5f5', borderRadius: 8, padding: '4px 12px', marginBottom: 6 }}>{lang.name} <span style={{ color: orange, fontWeight: 700 }}>- {lang.level}</span></div>
              ))}
            </div>
          </div>
        )}
        {/* Références dynamiques */}
        {Array.isArray(data.references) && data.references.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: orange, marginBottom: 8 }}>RÉFÉRENCES</div>
            {data.references.map((ref: any, idx: number) => (
              <div key={idx} style={{ fontSize: 13, color: noir, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{ref.name}</div>
                {ref.position && <div style={{ fontSize: 12 }}>{ref.position}</div>}
                {ref.contact && <div style={{ fontSize: 12, color: gris }}>{ref.contact}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BtpTemplate; 