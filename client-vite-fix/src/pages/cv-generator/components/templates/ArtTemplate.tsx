import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface ArtTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const bleu = '#3b4a5a';
const gris = '#f7f7f7';
const blanc = '#fff';

const ArtTemplate: React.FC<ArtTemplateProps> = ({ data, isMiniature = false }) => {
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
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const interests = Array.isArray(data.interests) ? data.interests : [];
  const references = Array.isArray((data as any).references) ? (data as any).references : [];

  return (
    <div style={{ width: 794, minHeight: 1123, background: gris, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column' }}>
      {/* Bandeau contacts + photo */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', background: bleu, padding: '0 0 0 36px', height: 120 }}>
        <Avatar src={personalInfo.photo || '/images/avatars/woman-4.png'} size={90} style={{ border: '4px solid #fff', marginRight: 32, boxShadow: '0 2px 8px #0001' }} />
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 32, width: '100%', justifyContent: 'space-evenly' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: blanc, fontSize: 15, gap: 8 }}><PhoneOutlined /> {personalInfo.phone}</div>
            <div style={{ display: 'flex', alignItems: 'center', color: blanc, fontSize: 15, gap: 8 }}><MailOutlined /> {personalInfo.email}</div>
            {personalInfo.portfolio && <div style={{ display: 'flex', alignItems: 'center', color: blanc, fontSize: 15, gap: 8 }}><GlobalOutlined /> {personalInfo.portfolio}</div>}
            <div style={{ display: 'flex', alignItems: 'center', color: blanc, fontSize: 15, gap: 8 }}><EnvironmentOutlined /> {personalInfo.address}</div>
          </div>
        </div>
      </div>
      {/* Nom, titre */}
      <div style={{ padding: '32px 48px 0 48px', background: blanc }}>
        <div style={{ fontWeight: 900, fontSize: 32, color: bleu, letterSpacing: 1, lineHeight: 1 }}>{personalInfo.firstName?.toUpperCase()} {personalInfo.lastName?.toUpperCase()}</div>
        <div style={{ fontSize: 18, color: bleu, fontWeight: 500, marginTop: 2 }}>{personalInfo.title}</div>
      </div>
      {/* Sections principales */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, background: blanc, padding: '24px 48px 32px 48px', gap: 48 }}>
        {/* Colonne gauche */}
        <div style={{ width: '38%', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Formation */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>FORMATION</div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{edu.institution}</div>
                <div style={{ fontSize: 12, color: bleu }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>CERTIFICATIONS</div>
              {certifications.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{typeof cert === 'string' ? cert : cert.name}</div>
                  {typeof cert !== 'string' && cert.issuer && <div style={{ fontSize: 12, color: bleu }}>{cert.issuer}</div>}
                  {typeof cert !== 'string' && cert.date && <div style={{ fontSize: 11, color: '#888' }}>{cert.date}</div>}
                </div>
              ))}
            </div>
          )}
          {/* Compétences */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>COMPÉTENCES</div>
            {skills.map((skill, idx) => (
              <div key={idx} style={{ fontSize: 13, color: bleu, marginBottom: 6 }}>{skill.name}</div>
            ))}
          </div>
          {/* Langues */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, textAlign: 'center' }}>LANGUES</div>
            {languages.map((lang, idx) => (
              <div key={idx} style={{ fontSize: 13, color: bleu, marginBottom: 4 }}>{lang.name} <span style={{ color: '#888', fontSize: 12 }}>({lang.level})</span></div>
            ))}
          </div>
        </div>
        {/* Colonne droite */}
        <div style={{ width: '62%', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* À propos de moi */}
          {summary && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>À PROPOS DE MOI</div>
              <div style={{ fontSize: 14, color: bleu }}>{summary}</div>
            </div>
          )}
          {/* Expérience */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>EXPÉRIENCE</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: bleu }}>{exp.title}</div>
                <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                <div style={{ fontSize: 12, color: bleu }}>{exp.description}</div>
              </div>
            ))}
          </div>
          {/* Projets */}
          {projects && projects.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>PROJETS</div>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ fontSize: 13, color: bleu, marginBottom: 6 }}>{typeof proj === 'string' ? proj : proj.name}</div>
              ))}
            </div>
          )}
          {/* Centres d'intérêt */}
          {interests && interests.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>CENTRES D'INTÉRÊT</div>
              {interests.map((interest, idx) => (
                <div key={idx} style={{ fontSize: 13, color: bleu, marginBottom: 6 }}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && (interest as any).name ? (interest as any).name : '')}</div>
              ))}
            </div>
          )}
          {/* Références */}
          {Array.isArray(data.references) && data.references.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleu, marginBottom: 8, background: gris, padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>RÉFÉRENCES</div>
              {data.references.map((ref: any, idx: number) => (
                <div key={idx} style={{ fontSize: 13, color: bleu, marginBottom: 6 }}>
                  <div style={{ fontWeight: 600 }}>{ref.name}</div>
                  {ref.position && <div style={{ fontSize: 12 }}>{ref.position}</div>}
                  {ref.contact && <div style={{ fontSize: 12, color: '#888' }}>{ref.contact}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtTemplate; 