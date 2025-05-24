import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const bleuFonce = '#1a237e';
const bleuClair = '#eaf2fb';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface BankTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const BankTemplate: React.FC<BankTemplateProps> = ({ data, isMiniature = false }) => {
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
  const expertise = Array.isArray((data as any).expertise) ? (data as any).expertise : [];

  return (
    <div style={{ width: 794, height: 1123, background: blanc, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 24px #0002' }}>
      {/* Header bleu foncé */}
      <div style={{ width: '100%', background: bleuFonce, minHeight: 140, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, position: 'relative' }}>
        <div style={{ width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 32 }}>
          <img src={personalInfo.photo || '/images/avatars/man-4.png'} alt="avatar" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', background: '#fff', boxShadow: '0 2px 8px #0001' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 48px 32px 32px', marginTop: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 32, color: blanc, letterSpacing: 1, lineHeight: 1, textTransform: 'uppercase', marginBottom: 8 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 18, color: blanc, fontWeight: 500, marginBottom: 12, textTransform: 'capitalize' }}>{personalInfo.title}</div>
          {summary && <div style={{ fontSize: 15, color: blanc, fontWeight: 400, lineHeight: 1.5 }}>{summary}</div>}
        </div>
      </div>
      {/* Deux colonnes principales */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, background: blanc }}>
        {/* Colonne gauche */}
        <div style={{ width: '34%', background: bleuClair, color: bleuFonce, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0 32px 0', gap: 32 }}>
          {/* Contact */}
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: blanc, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Contact</div>
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
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: blanc, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Compétences</div>
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
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: blanc, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Formation</div>
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
          {/* Langues */}
          {languages.length > 0 && (
            <div style={{ width: '80%', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: blanc, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Langues</div>
              <div style={{ height: 2, width: 32, background: bleuFonce, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                {languages.map((lang, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: bleuFonce, marginBottom: 7, gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: bleuFonce, marginRight: 8, flexShrink: 0 }} />
                    {lang.name} - {lang.level}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Colonne droite */}
        <div style={{ width: '66%', background: blanc, color: bleuFonce, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '40px 40px 32px 40px', gap: 32 }}>
          {/* Expérience */}
          {experience.length > 0 && (
            <div style={{ width: '100%', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1, background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Expérience</div>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ background: bleuClair, borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: '18px 24px', marginBottom: 18, border: `1px solid ${gris}` }}>
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
          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ width: '100%', marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1, background: bleuClair, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Certifications</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {certifications.map((cert: any, idx: number) => (
                  <li key={idx} style={{ fontSize: 14, color: bleuFonce, marginBottom: 8, fontWeight: 500 }}>{typeof cert === 'string' ? cert : `${cert.name}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankTemplate; 