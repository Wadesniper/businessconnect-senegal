import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface AdminTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const bleuFonce = '#232f3e';
const grisClair = '#f5f6fa';
const blanc = '#fff';
const bleuClair = '#3b4a5a';

const AdminTemplate: React.FC<AdminTemplateProps> = ({ data, isMiniature = false }) => {
  const personalInfo = {
    ...data.personalInfo,
    linkedin: (data.personalInfo as any).linkedin || '',
    portfolio: (data.personalInfo as any).portfolio || '',
    summary: (data.personalInfo as any).summary || '',
    reference: (data.personalInfo as any).reference || '',
  };
  const summary = personalInfo.summary || '';
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const references = Array.isArray((data as any).references) ? (data as any).references : [];

  return (
    <div style={{ width: 794, height: 1123, background: grisClair, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'row' }}>
      {/* Colonne gauche */}
      <div style={{ width: '32%', background: bleuFonce, color: blanc, padding: '36px 18px 24px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
        {/* Photo de profil */}
        <Avatar src={personalInfo.photo || '/images/avatars/woman-3.png'} size={110} style={{ border: '4px solid #fff', marginBottom: 18, boxShadow: '0 2px 8px #0001' }} />
        {/* Contacts */}
        <div style={{ width: '100%', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PhoneOutlined /> <span>{personalInfo.phone}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined /> <span>{personalInfo.email}</span></div>
          {personalInfo.portfolio && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><GlobalOutlined /> <span>{personalInfo.portfolio}</span></div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined /> <span>{personalInfo.address}</span></div>
        </div>
        {/* Education */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: blanc, marginBottom: 8, background: bleuClair, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>FORMATION</div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.institution}</div>
              <div style={{ fontSize: 12, color: '#e0e0e0' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
              <div style={{ fontSize: 11, color: '#b0b0b0' }}>{edu.startDate} - {edu.endDate}</div>
            </div>
          ))}
        </div>
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: blanc, marginBottom: 8, background: bleuClair, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>CERTIFICATIONS</div>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{typeof cert === 'string' ? cert : cert.name}</div>
                {typeof cert !== 'string' && cert.issuer && <div style={{ fontSize: 12, color: '#e0e0e0' }}>{cert.issuer}</div>}
                {typeof cert !== 'string' && cert.date && <div style={{ fontSize: 11, color: '#b0b0b0' }}>{cert.date}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Skills */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: blanc, marginBottom: 8, background: bleuClair, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>COMPÉTENCES</div>
          {skills.map((skill, idx) => (
            <div key={idx} style={{ fontSize: 13, color: blanc, marginBottom: 6 }}>{skill.name}</div>
          ))}
        </div>
        {/* Langues */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: blanc, marginBottom: 8, background: bleuClair, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>LANGUES</div>
          {languages.map((lang, idx) => (
            <div key={idx} style={{ fontSize: 13, color: blanc, marginBottom: 4 }}>{lang.name} <span style={{ color: '#b0b0b0', fontSize: 12 }}>({lang.level})</span></div>
          ))}
        </div>
      </div>
      {/* Colonne droite */}
      <div style={{ width: '68%', background: blanc, padding: '36px 36px 24px 36px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Nom, titre */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 32, color: bleuFonce, letterSpacing: 1, lineHeight: 1 }}>{personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}</div>
          <div style={{ fontSize: 18, color: bleuClair, fontWeight: 500, marginTop: 2 }}>{personalInfo.title}</div>
        </div>
        {/* About me */}
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: bleuFonce, marginBottom: 10, background: grisClair, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>À PROPOS DE MOI</div>
            <div style={{ fontSize: 14, color: bleuClair }}>{summary}</div>
          </div>
        )}
        {/* Expérience */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: bleuFonce, marginBottom: 10, background: grisClair, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>EXPÉRIENCE</div>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce }}>{exp.title}</div>
              <div style={{ fontSize: 13, color: bleuClair, fontWeight: 500 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              <div style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
              <div style={{ fontSize: 12, color: bleuClair }}>{exp.description}</div>
            </div>
          ))}
        </div>
        {/* Références */}
        {references && references.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: bleuFonce, marginBottom: 10, background: grisClair, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>RÉFÉRENCES</div>
            {references.map((ref: any, idx: number) => (
              <div key={idx} style={{ fontSize: 13, color: bleuClair, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{ref.name}</div>
                {ref.position && <div style={{ fontSize: 12 }}>{ref.position}</div>}
                {ref.contact && <div style={{ fontSize: 12, color: '#888' }}>{ref.contact}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTemplate; 