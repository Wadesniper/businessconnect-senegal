import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface LogisticsTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const bleuFonce = '#2d3a5a';
const bleu = '#3b6cb7';
const bleuClair = '#eaf1fb';
const blanc = '#fff';
const gris = '#f5f6fa';

const LogisticsTemplate: React.FC<LogisticsTemplateProps> = ({ data, isMiniature = false }) => {
  const personalInfo = {
    ...data.personalInfo,
    linkedin: (data.personalInfo as any).linkedin || '',
    portfolio: (data.personalInfo as any).portfolio || '',
    summary: (data.personalInfo as any).summary || '',
  };
  const summary = personalInfo.summary || '';
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const references = Array.isArray((data as any).references) ? (data as any).references : [];

  return (
    <div style={{ width: 794, height: 1123, background: blanc, fontFamily: 'Montserrat, Arial, sans-serif', display: 'flex', flexDirection: 'row', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 24px #0002' }}>
      {/* Colonne gauche */}
      <div style={{ width: '32%', background: bleuFonce, color: blanc, padding: '0 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
        {/* Photo */}
        <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', border: '5px solid ' + bleu, margin: '40px auto 18px auto', background: blanc, boxShadow: '0 2px 8px #0001' }}>
          <img src={personalInfo.photo || '/images/avatars/man-5.png'} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        {/* Nom et titre */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 28, color: blanc, letterSpacing: 1 }}>{personalInfo.firstName} <br />{personalInfo.lastName}</div>
          <div style={{ fontSize: 16, color: bleuClair, fontWeight: 500, marginTop: 2 }}>{personalInfo.title}</div>
        </div>
        {/* Contact */}
        <div style={{ width: '100%', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: bleu, color: blanc, fontWeight: 600, fontSize: 18, padding: '8px 0 8px 24px', borderRadius: '0 18px 18px 0', marginBottom: 8 }}>Contact</div>
          <div style={{ fontSize: 14, color: bleuClair, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span><PhoneOutlined /> {personalInfo.phone}</span>
            <span><MailOutlined /> {personalInfo.email}</span>
            <span><EnvironmentOutlined /> {personalInfo.address}</span>
            {personalInfo.portfolio && <span><GlobalOutlined /> {personalInfo.portfolio}</span>}
          </div>
        </div>
        {/* Education */}
        {education.length > 0 && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: bleu, color: blanc, fontWeight: 600, fontSize: 18, padding: '8px 0 8px 24px', borderRadius: '0 18px 18px 0', marginBottom: 8 }}>Éducation</div>
            <div style={{ paddingLeft: 24 }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                  <div style={{ fontSize: 14, color: bleuClair }}>{edu.institution}</div>
                  <div style={{ fontSize: 13, color: '#b0b0b0' }}>{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: bleu, color: blanc, fontWeight: 600, fontSize: 18, padding: '8px 0 8px 24px', borderRadius: '0 18px 18px 0', marginBottom: 8 }}>Compétences</div>
            <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ fontSize: 14, color: bleuClair }}>{skill.name}</div>
              ))}
            </div>
          </div>
        )}
        {/* Langues */}
        {languages.length > 0 && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: bleu, color: blanc, fontWeight: 600, fontSize: 18, padding: '8px 0 8px 24px', borderRadius: '0 18px 18px 0', marginBottom: 8 }}>Langues</div>
            <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {languages.map((lang, idx) => (
                <div key={idx} style={{ fontSize: 14, color: bleuClair }}>{lang.name} <span style={{ color: '#b0b0b0', fontSize: 13 }}>({lang.level})</span></div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '68%', background: gris, padding: '48px 40px 40px 40px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Expérience professionnelle */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: bleuFonce, marginBottom: 16 }}>Expérience professionnelle</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ background: blanc, borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: bleuFonce }}>{exp.company}</div>
                  <div style={{ fontSize: 14, color: bleuFonce }}>{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</div>
                </div>
                <div style={{ fontWeight: 500, fontSize: 15, color: '#555', marginBottom: 4 }}>{exp.title}</div>
                <div style={{ fontSize: 14, color: '#888' }}>{exp.description}</div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ margin: '8px 0 0 16px', color: bleuFonce }}>
                    {exp.achievements.map((ach: string, i: number) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Références */}
        {references.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: bleuFonce, marginBottom: 16 }}>Références</div>
            <div style={{ display: 'flex', gap: 32 }}>
              {references.map((ref: any, idx: number) => (
                <div key={idx} style={{ background: blanc, borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18, minWidth: 180 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: bleuFonce }}>{ref.name}</div>
                  {ref.position && <div style={{ fontSize: 14, color: bleu }}>{ref.position}</div>}
                  {ref.contact && <div style={{ fontSize: 13, color: '#888' }}>{ref.contact}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsTemplate; 