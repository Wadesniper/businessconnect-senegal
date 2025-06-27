import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const bleuClair = '#eaf2fb';
const bleuFonce = '#1a237e';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface ComTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const ComTemplate: React.FC<ComTemplateProps> = ({ data, isMiniature = false }) => {
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
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const expertise = Array.isArray((data as any).expertise) ? (data as any).expertise : [];

  return (
    <div style={{ width: 794, minHeight: 1123, background: bleuClair, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', display: 'flex', flexDirection: 'row', boxShadow: '0 4px 24px #0002', position: 'relative' }}>
      {/* Barre verticale de séparation */}
      <div style={{ position: 'absolute', left: '34%', top: 48, bottom: 32, width: 2, background: gris, opacity: 0.25, borderRadius: 1, zIndex: 1 }} />
      {/* Colonne gauche (blanche) */}
      <div style={{ width: '34%', background: blanc, color: bleuFonce, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0 32px 0', gap: 32 }}>
        {/* Photo + nom + titre */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: bleuClair, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 2px 8px #0001' }}>
            <img src={personalInfo.photo || '/images/avatars/woman-1.png'} alt="avatar" style={{ width: 108, height: 108, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 28, color: bleuFonce, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 16, color: bleuFonce, fontWeight: 500, marginBottom: 10, textTransform: 'capitalize', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.title}</div>
        </div>
        {/* Contact */}
        <div style={{ width: '80%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Contact</div>
          <div style={{ height: 2, width: 32, background: bleuFonce, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
          {personalInfo.phone && <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><PhoneOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.phone}</div>}
          {personalInfo.email && <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.email}</div>}
          {personalInfo.portfolio && <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><GlobalOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.portfolio}</div>}
          {personalInfo.address && <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.address}</div>}
          {personalInfo.linkedin && <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><LinkedinOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.linkedin}</div>}
        </div>
        {/* Compétences */}
        {skills.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Compétences</div>
            <div style={{ height: 2, width: 32, background: bleuFonce, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
            <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
              {skills.map((skill, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: bleuFonce, marginBottom: 7, gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: bleuFonce, marginRight: 8, flexShrink: 0 }} />
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Formation */}
        {education.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Formation</div>
            <div style={{ height: 2, width: 32, background: bleuFonce, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: bleuFonce }}>{edu.degree}</div>
                <div style={{ fontSize: 13, color: grisTexte }}>{edu.institution}</div>
                <div style={{ fontSize: 12, color: bleuFonce, opacity: 0.7 }}>{edu.startDate} - {edu.endDate}</div>
                {edu.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 4 }}>{edu.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Colonne droite (bleu clair) */}
      <div style={{ width: '66%', background: bleuClair, color: bleuFonce, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '48px 40px 32px 40px', gap: 32 }}>
        {/* Résumé */}
        {summary && <div style={{ fontSize: 15, color: bleuFonce, marginBottom: 18 }}>{summary}</div>}
        {/* Expérience */}
        {experience.length > 0 && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1, background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Expérience</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ background: blanc, borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: '18px 24px', marginBottom: 18, border: `1px solid ${gris}` }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce }}>{exp.title}</div>
                <div style={{ fontSize: 13, color: grisTexte }}>{exp.company}{exp.location ? ` / ${exp.location}` : ''}</div>
                <div style={{ fontSize: 12, color: bleuFonce, opacity: 0.7 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                {exp.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 4 }}>{exp.description}</div>}
                {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                  <ul style={{ fontSize: 13, color: bleuFonce, margin: '8px 0 0 0', paddingLeft: 18 }}>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Expertise */}
        {expertise.length > 0 && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1, background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Expertise</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
              {expertise.map((exp: any, idx: number) => (
                <span key={idx} style={{ background: bleuFonce, color: blanc, borderRadius: 12, padding: '4px 14px', fontSize: 14, fontWeight: 600 }}>{typeof exp === 'string' ? exp : (exp && exp.name ? exp.name : '')}</span>
              ))}
            </div>
          </div>
        )}
        {/* Langues dynamiques */}
        {languages.length > 0 && (
          <div style={{ width: '100%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1, background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Langues</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {languages.map((lang, i) => <li key={i} style={{ fontSize: 13, color: bleuFonce, marginBottom: 4 }}>{lang.name} - {lang.level}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComTemplate; 