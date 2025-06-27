import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, BookOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const vert = '#233A32';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface LawTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const LawTemplate: React.FC<LawTemplateProps> = ({ data, isMiniature = false }) => {
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
  const courses = Array.isArray((data as any).courses) ? (data as any).courses : [];
  const awards = Array.isArray((data as any).awards) ? (data as any).awards : [];

  // Styles dynamiques
  const padding = isMiniature ? 12 : 32;
  const borderRadius = isMiniature ? 8 : 16;
  const boxShadow = isMiniature ? '0 2px 8px rgba(24, 24, 24, 0.08)' : '0 4px 24px rgba(24, 24, 24, 0.08)';
  const avatarSize = isMiniature ? 48 : 160;
  const avatarBorder = isMiniature ? '2px solid #1d39c4' : '4px solid #1d39c4';
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
      {/* Header vert foncé */}
      <div style={{ width: '100%', background: vert, color: blanc, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '32px 48px 24px 48px', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 16, color: blanc, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.title}</div>
        </div>
        {/* Logo justice à droite */}
        <div style={{ fontSize: 48, color: blanc, opacity: 0.8 }}>
          <span role="img" aria-label="justice">⚖️</span>
        </div>
      </div>
      {/* Overview */}
      {summary && <div style={{ padding: '24px 48px 0 48px', fontSize: 14, color: vert, fontWeight: 500, lineHeight: 1.6 }}>{summary}</div>}
      {/* Trois colonnes : Contact, Skills, Education */}
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', padding: '32px 48px 0 48px', gap: 32 }}>
        {/* Contact */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: vert, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Contact</div>
          <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><PhoneOutlined /> {personalInfo.phone}</div>
          <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><MailOutlined /> {personalInfo.email}</div>
          <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><EnvironmentOutlined /> {personalInfo.address}</div>
          {personalInfo.linkedin && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
        </div>
        {/* Compétences */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: vert, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Compétences</div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {skills.map((skill, i) => <li key={i} style={{ fontSize: 13, color: grisTexte, marginBottom: 4 }}>{skill.name}</li>)}
          </ul>
        </div>
        {/* Formation */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: vert, marginBottom: 12, letterSpacing: 1, textTransform: 'uppercase' }}>Formation</div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: vert }}>{edu.institution}</div>
              <div style={{ fontSize: 13, color: grisTexte }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
              <div style={{ fontSize: 12, color: vert }}>{edu.startDate} - {edu.endDate}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Séparateur */}
      <div style={{ width: '100%', height: 1, background: gris, margin: '32px 0 0 0' }} />
      {/* Expérience professionnelle */}
      {experience.length > 0 && (
        <div style={{ width: '100%', padding: '32px 48px 0 48px' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: vert, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Expérience professionnelle</div>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: vert }}>{exp.title}</div>
              <div style={{ fontSize: 13, color: grisTexte }}>{exp.company}</div>
              <div style={{ fontSize: 12, color: vert }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
              <ul style={{ fontSize: 13, color: grisTexte, margin: '8px 0 0 0', paddingLeft: 18 }}>
                {exp.description && <li>{exp.description}</li>}
                {Array.isArray(exp.achievements) && exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
      {/* Cours */}
      {courses.length > 0 && (
        <div style={{ width: '100%', padding: '32px 48px 0 48px' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: vert, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Cours</div>
          {courses.map((course: any, idx: number) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: vert }}>{course.name}</div>
              <div style={{ fontSize: 13, color: grisTexte }}>{course.institution}</div>
              <div style={{ fontSize: 12, color: vert }}>{course.year}</div>
            </div>
          ))}
        </div>
      )}
      {/* Distinctions */}
      {awards.length > 0 && (
        <div style={{ width: '100%', padding: '32px 48px 0 48px' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: vert, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Distinctions</div>
          {awards.map((award: any, idx: number) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: vert }}>{award.name}</div>
              <div style={{ fontSize: 13, color: grisTexte }}>{award.issuer}</div>
              <div style={{ fontSize: 12, color: vert }}>{award.year}</div>
            </div>
          ))}
        </div>
      )}
      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ width: '100%', padding: '32px 48px 0 48px' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: vert, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Certifications</div>
          {certifications.map((cert: any, idx: number) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: vert }}>{cert.name || cert}</div>
              {cert.issuer && <div style={{ fontSize: 13, color: grisTexte }}>{cert.issuer}</div>}
              {cert.date && <div style={{ fontSize: 12, color: vert }}>{cert.date}</div>}
            </div>
          ))}
        </div>
      )}
      {/* Langues */}
      {languages.length > 0 && (
        <div style={{ width: '100%', padding: '32px 48px 0 48px' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: vert, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Langues</div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {languages.map((lang, i) => <li key={i} style={{ fontSize: 13, color: grisTexte, marginBottom: 4 }}>{lang.name} - {lang.level}</li>)}
          </ul>
        </div>
      )}
      {/* Références dynamiques */}
      {Array.isArray(data.references) && data.references.length > 0 && (
        <div style={{ width: '100%', padding: '32px 48px 0 48px' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: vert, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Références</div>
          {data.references.map((ref: any, idx: number) => (
            <div key={idx} style={{ fontSize: 14, color: vert, marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{ref.name}</div>
              {ref.position && <div style={{ fontSize: 13 }}>{ref.position}</div>}
              {ref.contact && <div style={{ fontSize: 12, color: grisTexte }}>{ref.contact}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LawTemplate; 