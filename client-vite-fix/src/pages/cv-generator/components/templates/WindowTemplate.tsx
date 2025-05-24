import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const vertFonce = '#4b6c5c';
const vertClair = '#eaf3ee';
const blanc = '#fff';
const noir = '#222';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface WindowTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const borderStyle = `1.5px solid ${noir}`;
const shadowStyle = '0 4px 16px #0002';

const WindowTemplate: React.FC<WindowTemplateProps> = ({ data, isMiniature = false }) => {
  const personalInfo = {
    ...data.personalInfo,
    linkedin: (data.personalInfo as any)?.linkedin || '',
    portfolio: (data.personalInfo as any)?.portfolio || '',
  };
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const interests = Array.isArray((data as any).interests) ? (data as any).interests : [];

  return (
    <div style={{ width: 794, minHeight: 1123, background: blanc, fontFamily: 'Montserrat, Arial, sans-serif', borderRadius: 18, boxShadow: shadowStyle, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', border: borderStyle }}>
      {/* Header principal effet fenêtre */}
      <div style={{ width: '100%', background: vertClair, borderRadius: '18px 18px 0 0', borderBottom: borderStyle, boxShadow: '0 6px 0 #222, 0 8px 16px #0001', position: 'relative', minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        {/* Boutons fenêtre + flèche */}
        <div style={{ position: 'absolute', left: 24, top: 22, display: 'flex', gap: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#e57373', display: 'inline-block', border: '2px solid #b71c1c' }} />
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff176', display: 'inline-block', border: '2px solid #bdb800' }} />
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#81c784', display: 'inline-block', border: '2px solid #388e3c' }} />
        </div>
        {/* Flèche souris en haut à droite */}
        <svg width="38" height="38" viewBox="0 0 38 38" style={{ position: 'absolute', right: 18, top: 8 }} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L32 18L20 20L24 34L18 32L14 20L6 4Z" fill={vertFonce} stroke={noir} strokeWidth="2"/></svg>
        <div style={{ fontWeight: 900, fontSize: 32, color: noir, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8, textAlign: 'center' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
        <div style={{ fontSize: 18, color: noir, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>{personalInfo.title}</div>
      </div>
      {/* Fenêtre PROFIL sur toute la largeur */}
      <div style={{ width: '92%', background: blanc, border: borderStyle, borderRadius: 8, boxShadow: shadowStyle, marginBottom: 18, overflow: 'hidden' }}>
        <div style={{ background: vertClair, borderBottom: borderStyle, padding: '8px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: noir, letterSpacing: 1 }}>
          PROFIL
          <span style={{ display: 'flex', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: noir, opacity: 0.18 }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: noir, opacity: 0.18 }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: noir, opacity: 0.18 }} />
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24, padding: 24 }}>
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="avatar" style={{ width: 90, height: 90, borderRadius: 10, objectFit: 'cover', boxShadow: '0 2px 8px #0001', border: `2px solid ${vertClair}` }} />
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 24 }}>
            {/* Coordonnées */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 13, color: noir, fontWeight: 700, marginBottom: 2 }}>COORDONNÉES</div>
              {personalInfo.email && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><MailOutlined style={{ marginRight: 6 }} />{personalInfo.email}</div>}
              {personalInfo.phone && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><PhoneOutlined style={{ marginRight: 6 }} />{personalInfo.phone}</div>}
              {personalInfo.address && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><EnvironmentOutlined style={{ marginRight: 6 }} />{personalInfo.address}</div>}
              {personalInfo.linkedin && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><LinkedinOutlined style={{ marginRight: 6 }} />{personalInfo.linkedin}</div>}
              {personalInfo.portfolio && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><GlobalOutlined style={{ marginRight: 6 }} />{personalInfo.portfolio}</div>}
            </div>
            {/* Centres d'intérêt */}
            {interests.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, color: noir, fontWeight: 700, marginBottom: 2 }}>CENTRES D'INTÉRÊT</div>
                <div style={{ fontSize: 13, color: grisTexte }}>{interests.map((i: any) => (typeof i === 'string' ? i : i.name)).join(', ')}</div>
              </div>
            )}
            {/* Langues */}
            {languages.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, color: noir, fontWeight: 700, marginBottom: 2 }}>LANGUES</div>
                <div style={{ fontSize: 13, color: grisTexte }}>{languages.map((l: any) => `${l.name} (${l.level})`).join(', ')}</div>
              </div>
            )}
          </div>
        </div>
        {/* Résumé */}
        {personalInfo.summary && (
          <div style={{ borderTop: borderStyle, padding: '14px 24px', fontSize: 14, color: grisTexte }}>{personalInfo.summary}</div>
        )}
      </div>
      {/* Grille sections */}
      <div style={{ width: '92%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '0 auto', marginBottom: 18 }}>
        {/* Expérience */}
        <div style={{ background: blanc, border: borderStyle, borderRadius: 8, boxShadow: shadowStyle, overflow: 'hidden' }}>
          <div style={{ background: vertClair, borderBottom: borderStyle, padding: '8px 18px', fontWeight: 700, fontSize: 16, color: noir, letterSpacing: 1 }}>EXPÉRIENCE</div>
          <div style={{ padding: 18 }}>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: noir }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                </div>
                <div style={{ fontSize: 13, color: grisTexte }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                {exp.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 2 }}>{exp.description}</div>}
                {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                  <ul style={{ fontSize: 13, color: noir, margin: '6px 0 0 0', paddingLeft: 18 }}>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
                {idx < experience.length - 1 && <div style={{ borderBottom: `1px solid ${gris}`, margin: '12px 0' }} />}
              </div>
            ))}
          </div>
        </div>
        {/* Formation */}
        <div style={{ background: blanc, border: borderStyle, borderRadius: 8, boxShadow: shadowStyle, overflow: 'hidden' }}>
          <div style={{ background: vertClair, borderBottom: borderStyle, padding: '8px 18px', fontWeight: 700, fontSize: 16, color: noir, letterSpacing: 1 }}>FORMATION</div>
          <div style={{ padding: 18 }}>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: noir }}>{edu.degree}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{edu.startDate} - {edu.endDate}</div>
                </div>
                <div style={{ fontSize: 13, color: grisTexte }}>{edu.institution}{edu.field ? `, ${edu.field}` : ''}</div>
                {edu.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 2 }}>{edu.description}</div>}
                {idx < education.length - 1 && <div style={{ borderBottom: `1px solid ${gris}`, margin: '12px 0' }} />}
              </div>
            ))}
          </div>
        </div>
        {/* Compétences */}
        <div style={{ background: blanc, border: borderStyle, borderRadius: 8, boxShadow: shadowStyle, overflow: 'hidden', gridColumn: '2/3', gridRow: '2/3' }}>
          <div style={{ background: vertClair, borderBottom: borderStyle, padding: '8px 18px', fontWeight: 700, fontSize: 16, color: noir, letterSpacing: 1 }}>COMPÉTENCES</div>
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {skills.map((skill, idx) => (
              <div key={idx} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: noir }}>{skill.name}</div>
                  {typeof skill.level === 'number' && (
                    <span style={{ fontSize: 12, color: grisTexte }}>{skill.level}/100</span>
                  )}
                </div>
                {typeof skill.level === 'number' && (
                  <div style={{ width: '100%', height: 7, background: vertClair, borderRadius: 4, marginTop: 2 }}>
                    <div style={{ width: `${skill.level}%`, height: 7, background: vertFonce, borderRadius: 4 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Certifications (en bas, pleine largeur si présentes) */}
      {certifications.length > 0 && (
        <div style={{ width: '92%', background: blanc, border: borderStyle, borderRadius: 8, boxShadow: shadowStyle, marginBottom: 18, overflow: 'hidden' }}>
          <div style={{ background: vertClair, borderBottom: borderStyle, padding: '8px 18px', fontWeight: 700, fontSize: 16, color: noir, letterSpacing: 1 }}>CERTIFICATIONS</div>
          <div style={{ padding: 18 }}>
            <ul style={{ fontSize: 13, color: noir, margin: 0, paddingLeft: 18 }}>
              {certifications.map((cert: any, idx: number) => (
                <li key={idx}>{typeof cert === 'string' ? cert : `${cert.name}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WindowTemplate; 