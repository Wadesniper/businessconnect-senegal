import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface AdminTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const bleuFonce = '#2D3142';
const grisClair = '#f5f6fa';
const blanc = '#fff';
const bleuClair = '#4F5D75';

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
  const references = Array.isArray((data as any).references) && (data as any).references.length > 0
    ? (data as any).references
    : [];

  return (
    <div style={{ width: 794, height: 1123, background: blanc, fontFamily: 'Montserrat, Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', padding: '40px 40px 20px 40px', background: blanc }}>
        <Avatar src={personalInfo.photo || '/images/avatars/woman-3.png'} size={120} style={{ border: '4px solid #fff', marginRight: 32, boxShadow: '0 2px 8px #0001' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 32, color: bleuFonce, marginBottom: 4 }}>{personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}</div>
          <div style={{ fontSize: 20, color: bleuClair, marginBottom: 16 }}>{personalInfo.title}</div>
          <div style={{ display: 'flex', gap: 24, color: bleuClair, fontSize: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><PhoneOutlined /> {personalInfo.phone}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined /> {personalInfo.email}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined /> {personalInfo.address}</div>
            {personalInfo.portfolio && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><GlobalOutlined /> {personalInfo.portfolio}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Colonne gauche */}
        <div style={{ width: '30%', background: bleuFonce, color: blanc, padding: '40px 24px' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, borderBottom: '2px solid #fff', paddingBottom: 8 }}>FORMATION</div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{edu.institution}</div>
                <div style={{ fontSize: 13, color: '#e0e0e0' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                <div style={{ fontSize: 12, color: '#b0b0b0' }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>

          {certifications && certifications.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, borderBottom: '2px solid #fff', paddingBottom: 8 }}>CERTIFICATIONS</div>
              {certifications.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{typeof cert === 'string' ? cert : cert.name}</div>
                  {typeof cert !== 'string' && cert.issuer && <div style={{ fontSize: 13, color: '#e0e0e0' }}>{cert.issuer}</div>}
                  {typeof cert !== 'string' && cert.date && <div style={{ fontSize: 12, color: '#b0b0b0' }}>{cert.date}</div>}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, borderBottom: '2px solid #fff', paddingBottom: 8 }}>COMPÉTENCES</div>
            {skills.map((skill, idx) => (
              <div key={idx} style={{ fontSize: 14, marginBottom: 8 }}>{skill.name}</div>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, borderBottom: '2px solid #fff', paddingBottom: 8 }}>LANGUES</div>
            {languages.map((lang, idx) => (
              <div key={idx} style={{ fontSize: 14, marginBottom: 8 }}>
                {lang.name} <span style={{ color: '#b0b0b0', fontSize: 13 }}>({lang.level})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite */}
        <div style={{ width: '70%', padding: '40px 32px', background: blanc }}>
          {summary && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontWeight: 600, fontSize: 18, color: bleuFonce, marginBottom: 16, borderBottom: `2px solid ${bleuFonce}`, paddingBottom: 8 }}>À PROPOS DE MOI</div>
              <div style={{ fontSize: 14, color: bleuClair, lineHeight: 1.6 }}>{summary}</div>
            </div>
          )}

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: bleuFonce, marginBottom: 16, borderBottom: `2px solid ${bleuFonce}`, paddingBottom: 8 }}>EXPÉRIENCE</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: bleuFonce }}>{exp.title}</div>
                <div style={{ fontSize: 14, color: bleuClair, fontWeight: 500 }}>{exp.company}{exp.location ? ` | ${exp.location}` : ''}</div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                <div style={{ fontSize: 14, color: bleuClair, lineHeight: 1.6 }}>{exp.description}</div>
              </div>
            ))}
          </div>

          {references && references.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontWeight: 600, fontSize: 18, color: bleuFonce, marginBottom: 16, borderBottom: `2px solid ${bleuFonce}`, paddingBottom: 8 }}>RÉFÉRENCES</div>
              {references.map((ref: any, idx: number) => (
                <div key={idx} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: bleuFonce }}>{ref.name}</div>
                  {ref.position && <div style={{ fontSize: 13, color: bleuClair }}>{ref.position}</div>}
                  {ref.contact && <div style={{ fontSize: 13, color: '#888' }}>{ref.contact}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTemplate; 