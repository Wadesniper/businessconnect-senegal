import React from 'react';
import { Avatar } from 'antd';
import { LinkedinOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';
import '../../styles/FinanceTemplate.css';

interface FinanceTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const FinanceTemplate: React.FC<FinanceTemplateProps> = ({ data, isMiniature = false }) => {
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
  const references = Array.isArray(data.references) ? data.references : [];

  // Ajout des couleurs manquantes
  const bleuFonce = '#2D3142';
  const grisClair = '#f5f6fa';
  const bleuClair = '#4F5D75';

  return (
    <div
      className="finance-cv-template"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        fontSize: 11,
        background: '#fff',
        borderRadius: 12,
        boxSizing: 'border-box',
        padding: 0,
      }}
    >
      {/* Colonne gauche */}
      <div style={{ width: '32%', background: '#17406a', color: '#fff', borderRadius: '12px 0 0 12px', padding: '24px 12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Avatar src={data.personalInfo.photo || '/images/avatars/man-1.png'} size={80} style={{ border: '3px solid #fff', marginBottom: 8 }} />
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>{data.personalInfo.firstName} {data.personalInfo.lastName}</div>
          <div style={{ fontSize: 12 }}>{data.personalInfo.title}</div>
        </div>
        <div style={{ fontSize: 11, marginBottom: 12 }}>
          <div style={{ marginBottom: 4 }}><MailOutlined /> {personalInfo.email}</div>
          <div style={{ marginBottom: 4 }}><PhoneOutlined /> {personalInfo.phone}</div>
          <div style={{ marginBottom: 4 }}><EnvironmentOutlined /> {personalInfo.address}</div>
          {personalInfo.linkedin && <div><LinkedinOutlined /> {personalInfo.linkedin}</div>}
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Compétences</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {skills.slice(0, 5).map((skill, i) => <li key={i}>{skill.name}</li>)}
          </ul>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Langues</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {languages.slice(0, 3).map((lang, i) => <li key={i}>{lang.name} - {lang.level}</li>)}
          </ul>
        </div>
        {certifications && certifications.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Certifications</div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {certifications.slice(0, 3).map((cert, i) => typeof cert === 'string' ? <li key={i}>{cert}</li> : <li key={i}>{cert.name}</li>)}
            </ul>
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '68%', padding: '24px 24px 24px 16px', display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#17406a', marginBottom: 4 }}>Profil</div>
          <div style={{ fontSize: 11 }}>{summary}</div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#17406a', marginBottom: 4 }}>Expérience</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {experience.slice(0, 3).map((exp, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{exp.title} <span style={{ fontWeight: 400, color: '#888' }}>@ {exp.company}</span></div>
                <div style={{ fontSize: 10, color: '#888' }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                <div style={{ fontSize: 11 }}>{exp.description}</div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {exp.achievements.slice(0, 2).map((ach, j) => <li key={j} style={{ fontSize: 10 }}>{ach}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#17406a', marginBottom: 4 }}>Formation</div>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {education.slice(0, 2).map((edu, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{edu.degree} en {edu.field}</div>
                <div style={{ fontSize: 10, color: '#888' }}>{edu.institution} — {edu.startDate} - {edu.endDate}</div>
                {edu.description && <div style={{ fontSize: 11 }}>{edu.description}</div>}
              </li>
            ))}
          </ul>
        </div>
        {/* Section Projets */}
        {Array.isArray(data.projects) && data.projects.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#17406a', marginBottom: 4 }}>Projets</div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {data.projects.map((proj, i) => (
                <li key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontWeight: 600 }}>{typeof proj === 'string' ? proj : proj.name}</div>
                  {typeof proj !== 'string' && proj.description && <div style={{ fontSize: 11 }}>{proj.description}</div>}
                  {typeof proj !== 'string' && (proj.startDate || proj.endDate) && (
                    <div style={{ fontSize: 10, color: '#888' }}>{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Section Centres d'intérêt */}
        {interests.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#17406a', marginBottom: 4 }}>Centres d'intérêt</div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {interests.map((interest, i) => (
                <li key={i} style={{ fontSize: 11 }}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && (interest as any).name ? (interest as any).name : '')}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Références */}
        {references.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: bleuFonce, marginBottom: 10, background: grisClair, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>RÉFÉRENCES</div>
            {references.map((ref: any, idx: number) => (
              <div key={idx} style={{ fontSize: 13, color: bleuClair, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{ref.name}</div>
                {ref.position && <div style={{ fontSize: 12 }}>{ref.position}</div>}
                {ref.contact && <div style={{ fontSize: 12, color: '#888' }}>{ref.contact}</div>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default FinanceTemplate; 