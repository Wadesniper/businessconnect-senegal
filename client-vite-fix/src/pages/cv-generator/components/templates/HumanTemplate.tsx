import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const terracotta = '#C97B63';
const blanc = '#fff';
const gris = '#f5f5f5';
const grisTexte = '#6b4f3a';

interface HumanTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const HumanTemplate: React.FC<HumanTemplateProps> = ({ data, isMiniature = false }) => {
  const personalInfo = {
    ...data.personalInfo,
    summary: (data.personalInfo as any).summary || '',
  };
  const summary = personalInfo.summary || (data as any).summary || '';
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const references = Array.isArray((data as any).references) ? (data as any).references : [];

  return (
    <div style={{ width: 794, minHeight: 1123, background: terracotta, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', display: 'flex', flexDirection: 'row', boxShadow: '0 4px 24px #0002' }}>
      {/* Colonne gauche */}
      <div style={{ width: '54%', background: 'transparent', color: blanc, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0 32px 0', gap: 32 }}>
        {/* Photo + nom + titre + résumé */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: blanc, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 2px 8px #0001' }}>
            <img src={personalInfo.photo || '/images/avatars/woman-2.png'} alt="avatar" style={{ width: 128, height: 128, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 36, color: blanc, letterSpacing: 1, textTransform: 'capitalize', marginBottom: 4, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 18, color: blanc, fontWeight: 500, marginBottom: 18, textTransform: 'capitalize', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.title}</div>
          {summary && <div style={{ fontSize: 15, color: blanc, textAlign: 'center', maxWidth: 320, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{summary}</div>}
        </div>
        {/* Éducation */}
        {education.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: blanc, background: 'rgba(255,255,255,0.12)', padding: '6px 18px', borderRadius: 8, marginBottom: 16, letterSpacing: 1 }}>ÉDUCATION</div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: blanc }}>{edu.degree}</div>
                <div style={{ fontSize: 13, color: blanc }}>{edu.institution}</div>
                <div style={{ fontSize: 12, color: blanc, opacity: 0.8 }}>{edu.startDate} - {edu.endDate}</div>
                {edu.description && <div style={{ fontSize: 13, color: blanc, marginTop: 4 }}>{edu.description}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Expérience */}
        {experience.length > 0 && (
          <div style={{ width: '80%' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: blanc, background: 'rgba(255,255,255,0.12)', padding: '6px 18px', borderRadius: 8, marginBottom: 16, letterSpacing: 1 }}>EXPÉRIENCE</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: blanc }}>{exp.title}</div>
                <div style={{ fontSize: 13, color: blanc }}>{exp.company}</div>
                <div style={{ fontSize: 12, color: blanc, opacity: 0.8 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                {exp.description && <div style={{ fontSize: 13, color: blanc, marginTop: 4 }}>{exp.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '46%', background: blanc, color: terracotta, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', padding: '48px 0 32px 0', gap: 32 }}>
        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: terracotta, background: gris, padding: '6px 18px', borderRadius: 8, marginBottom: 16, letterSpacing: 1 }}>COMPÉTENCES</div>
            {skills.map((skill, idx) => (
              <div key={idx} style={{ marginBottom: 12, fontWeight: 600, fontSize: 15 }}>{skill.name}</div>
            ))}
          </div>
        )}
        {/* Langues */}
        {languages.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: terracotta, background: gris, padding: '6px 18px', borderRadius: 8, marginBottom: 16, letterSpacing: 1 }}>LANGUES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {languages.map((lang, idx) => (
                <span key={idx} style={{ background: terracotta, color: blanc, borderRadius: 12, padding: '4px 14px', fontSize: 14, fontWeight: 600 }}>{lang.name} - {lang.level}</span>
              ))}
            </div>
          </div>
        )}
        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: terracotta, background: gris, padding: '6px 18px', borderRadius: 8, marginBottom: 16, letterSpacing: 1 }}>CERTIFICATIONS</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {certifications.map((cert, idx) => (
                <li key={idx} style={{ fontSize: 14, color: terracotta, marginBottom: 8, fontWeight: 500 }}>
                  {typeof cert === 'string' ? cert : `${cert.name}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Contact */}
        <div style={{ width: '80%' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: terracotta, background: gris, padding: '6px 18px', borderRadius: 8, marginBottom: 16, letterSpacing: 1 }}>CONTACT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {personalInfo.phone && <div style={{ fontSize: 15, color: terracotta, display: 'flex', alignItems: 'center', gap: 10 }}><PhoneOutlined /> {personalInfo.phone}</div>}
            {personalInfo.email && <div style={{ fontSize: 15, color: terracotta, display: 'flex', alignItems: 'center', gap: 10 }}><MailOutlined /> {personalInfo.email}</div>}
            {personalInfo.address && <div style={{ fontSize: 15, color: terracotta, display: 'flex', alignItems: 'center', gap: 10 }}><EnvironmentOutlined /> {personalInfo.address}</div>}
          </div>
        </div>
        {/* Références */}
        {references.length > 0 && (
          <div style={{ width: '80%', marginTop: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: terracotta, background: gris, padding: '6px 18px', borderRadius: 8, marginBottom: 16, letterSpacing: 1 }}>RÉFÉRENCES</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {references.map((ref: any, idx: number) => (
                <li key={idx} style={{ fontSize: 14, color: terracotta, marginBottom: 8, fontWeight: 500 }}>
                  <div style={{ fontWeight: 600 }}>{ref.name}</div>
                  {ref.position && <div style={{ fontSize: 13 }}>{ref.position}</div>}
                  {ref.contact && <div style={{ fontSize: 12, color: grisTexte }}>{ref.contact}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HumanTemplate; 