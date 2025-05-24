import React from 'react';
import { Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, NotificationOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const bleuPastel = '#b7d8e6';
const bleuFonce = '#1a237e';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface ComTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const ComTemplate: React.FC<ComTemplateProps> = ({ data, isMiniature = false }) => {
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
  const qualities = Array.isArray((data as any).qualities) ? (data as any).qualities : [];

  return (
    <div style={{ width: 794, height: 1123, background: blanc, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column' }}>
      {/* Bandeau aquarelle bleu clair */}
      <div style={{ width: '100%', background: bleuPastel, minHeight: 180, display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative', padding: '0 0 0 0' }}>
        <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 32 }}>
          <Avatar src={personalInfo.photo || '/images/avatars/woman-1.png'} size={120} style={{ border: '4px solid #fff', boxShadow: '0 2px 8px #0001' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 48px 32px 32px' }}>
          <div style={{ fontWeight: 900, fontSize: 28, color: bleuFonce, letterSpacing: 1, lineHeight: 1, textTransform: 'capitalize', marginBottom: 8 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 18, color: bleuFonce, fontWeight: 500, marginBottom: 12, textTransform: 'uppercase' }}>{personalInfo.title}</div>
          {summary && <div style={{ fontSize: 14, color: bleuFonce, fontWeight: 400, lineHeight: 1.5 }}>{summary}</div>}
        </div>
      </div>
      {/* Deux colonnes principales */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, background: blanc, padding: '0 0 0 0' }}>
        {/* Colonne gauche */}
        <div style={{ width: '32%', background: blanc, color: bleuFonce, display: 'flex', flexDirection: 'column', padding: '32px 0 0 32px', gap: 32 }}>
          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Contact</div>
            <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><PhoneOutlined /> {personalInfo.phone}</div>
            <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><MailOutlined /> {personalInfo.email}</div>
            <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><GlobalOutlined /> {personalInfo.portfolio}</div>
            <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><EnvironmentOutlined /> {personalInfo.address}</div>
            {personalInfo.linkedin && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 6 }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
          </div>
          {/* Compétences */}
          {skills.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Compétences</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {skills.map((skill, i) => <li key={i} style={{ fontSize: 13, color: bleuFonce, marginBottom: 4 }}>{skill.name}</li>)}
              </ul>
            </div>
          )}
          {/* Qualités */}
          {qualities.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>Qualités</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {qualities.map((q: any, i: number) => <li key={i} style={{ fontSize: 13, color: bleuFonce, marginBottom: 4 }}>{typeof q === 'string' ? q : (q && typeof q === 'object' && (q as any).name ? (q as any).name : '')}</li>)}
              </ul>
            </div>
          )}
        </div>
        {/* Colonne droite */}
        <div style={{ width: '68%', background: blanc, color: bleuFonce, display: 'flex', flexDirection: 'column', padding: '32px 48px 32px 48px', gap: 32 }}>
          {/* Expérience professionnelle */}
          {experience.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Expérience professionnelle</div>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ background: blanc, borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '18px 24px', marginBottom: 18, border: `1px solid ${gris}` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{exp.company} / {exp.location}</div>
                  <div style={{ fontSize: 12, color: bleuFonce }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                  <div style={{ fontSize: 13, color: grisTexte, marginTop: 8 }}>{exp.description}</div>
                  {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                    <ul style={{ fontSize: 13, color: bleuFonce, margin: '8px 0 0 0', paddingLeft: 18 }}>
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Formations */}
          {education.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Formations</div>
              {education.map((edu, idx) => (
                <div key={idx} style={{ background: blanc, borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '18px 24px', marginBottom: 18, border: `1px solid ${gris}` }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: bleuFonce }}>{edu.degree}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{edu.institution}</div>
                  <div style={{ fontSize: 12, color: bleuFonce }}>{edu.startDate} - {edu.endDate}</div>
                  {edu.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 8 }}>{edu.description}</div>}
                </div>
              ))}
            </div>
          )}
          {/* Langues dynamiques */}
          {languages.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Langues</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {languages.map((lang, i) => <li key={i} style={{ fontSize: 13, color: bleuFonce, marginBottom: 4 }}>{lang.name} - {lang.level}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComTemplate; 