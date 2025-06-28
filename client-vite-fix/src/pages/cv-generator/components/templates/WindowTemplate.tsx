import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface WindowTemplateProps {
  data: CVData;
  isMiniature?: boolean;
  customization?: { primaryColor?: string };
}

const blanc = '#fff';
const noir = '#222';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

const WindowTemplate: React.FC<WindowTemplateProps> = ({ data, isMiniature = false, customization }) => {
  const primaryColor = customization?.primaryColor || '#4b6c5c';
  const vertClair = '#eaf3ee';
  
  const borderStyle = `1.5px solid ${noir}`;
  const shadowStyle = '0 6px 24px #0003';
  const cardShadowStyle = `8px 8px 0 ${primaryColor}, 0 6px 24px #0003`;

  const CardWindow: React.FC<{ title: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ title, children, style }) => (
    <div style={{ background: blanc, border: borderStyle, borderRadius: 12, boxShadow: cardShadowStyle, marginBottom: 24, position: 'relative', ...style }}>
      {/* Boutons décoratifs */}
      <div style={{ position: 'absolute', right: 14, top: 10, display: 'flex', gap: 6, zIndex: 2 }}>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#eaf3ee', border: `2px solid ${primaryColor}`, display: 'inline-block', textAlign: 'center', fontWeight: 700, fontSize: 12, color: primaryColor, lineHeight: '12px', padding: 0 }}>-</span>
        <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#eaf3ee', border: '2px solid #bdb800', display: 'inline-block', textAlign: 'center', fontWeight: 700, fontSize: 12, color: '#bdb800', lineHeight: '12px', padding: 0 }}>×</span>
      </div>
      <div style={{ background: vertClair, borderBottom: borderStyle, padding: '8px 18px', fontWeight: 700, fontSize: 16, color: noir, letterSpacing: 1, borderRadius: '12px 12px 0 0' }}>{title}</div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );

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
    <div className="cv-template-container" style={{ width: 794, minHeight: 1123, background: blanc, fontFamily: 'Montserrat, Arial, sans-serif', borderRadius: 18, boxShadow: shadowStyle, padding: 0, border: borderStyle }}>
      {/* Header principal effet fenêtre */}
      <div style={{ width: '100%', background: primaryColor, borderRadius: '18px 18px 0 0', borderBottom: borderStyle, boxShadow: '0 6px 0 #222, 0 8px 16px #0001', position: 'relative', minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        {/* Boutons fenêtre + flèche */}
        <div style={{ position: 'absolute', left: 24, top: 22, display: 'flex', gap: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#e57373', display: 'inline-block', border: '2px solid #b71c1c' }} />
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff176', display: 'inline-block', border: '2px solid #bdb800' }} />
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#81c784', display: 'inline-block', border: '2px solid #388e3c' }} />
        </div>
        {/* Flèche souris en haut à droite */}
        <svg width="38" height="38" viewBox="0 0 38 38" style={{ position: 'absolute', right: 18, top: 8 }} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4L32 18L20 20L24 34L18 32L14 20L6 4Z" fill={primaryColor} stroke={noir} strokeWidth="2"/></svg>
        <div style={{ fontWeight: 900, fontSize: 32, color: blanc, letterSpacing: 2, textTransform: 'uppercase', marginTop: 8, textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
        <div style={{ fontSize: 18, color: blanc, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.title}</div>
      </div>
      {/* Bloc Profil horizontal avec certifications */}
      <CardWindow title="Profil" style={{ margin: '0 24px 24px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
          {/* Photo de profil */}
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="avatar" style={{ width: 100, height: 100, borderRadius: 14, objectFit: 'cover', boxShadow: '0 2px 12px #0004', border: `3px solid ${primaryColor}`, marginRight: 18 }} />
          )}
          {/* Infos à droite */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 24 }}>
            {/* Coordonnées */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 13, color: noir, fontWeight: 700, marginBottom: 2 }}>Coordonnées</div>
              {personalInfo.email && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><MailOutlined style={{ marginRight: 6 }} />{personalInfo.email}</div>}
              {personalInfo.phone && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><PhoneOutlined style={{ marginRight: 6 }} />{personalInfo.phone}</div>}
              {personalInfo.address && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><EnvironmentOutlined style={{ marginRight: 6 }} />{personalInfo.address}</div>}
              {personalInfo.linkedin && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><LinkedinOutlined style={{ marginRight: 6 }} />{personalInfo.linkedin}</div>}
              {personalInfo.portfolio && <div style={{ fontSize: 13, color: grisTexte, marginBottom: 2 }}><GlobalOutlined style={{ marginRight: 6 }} />{personalInfo.portfolio}</div>}
            </div>
            {/* Centres d'intérêt */}
            {interests.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, color: noir, fontWeight: 700, marginBottom: 2 }}>Centres d'intérêt</div>
                <div style={{ fontSize: 13, color: grisTexte }}>{interests.map((i: any) => (typeof i === 'string' ? i : i.name)).join(', ')}</div>
              </div>
            )}
            {/* Langues */}
            {languages.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, color: noir, fontWeight: 700, marginBottom: 2 }}>Langues</div>
                <div style={{ fontSize: 13, color: grisTexte }}>{languages.map((l: any) => `${l.name} (${l.level})`).join(', ')}</div>
              </div>
            )}
            {/* Certifications dans le profil */}
            {certifications.length > 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 13, color: noir, fontWeight: 700, marginBottom: 2 }}>Certifications</div>
                <ul style={{ fontSize: 13, color: grisTexte, margin: 0, paddingLeft: 18 }}>
                  {certifications.map((cert: any, idx: number) => (
                    <li key={idx}>{typeof cert === 'string' ? cert : `${cert.name}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* Résumé */}
        {personalInfo.summary && (
          <div style={{ borderTop: borderStyle, padding: '14px 0 0 0', fontSize: 14, color: grisTexte, marginTop: 12 }}>{personalInfo.summary}</div>
        )}
      </CardWindow>
      {/* Grille sections : colonne gauche = Expérience, colonne droite = Formation puis Compétences */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
        margin: '0 24px 0 24px',
        alignItems: 'start',
      }}>
        {/* Colonne gauche : Expérience */}
        <div>
          {experience.length > 0 && (
            <CardWindow title="Expérience">
              {experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: noir }}>{exp.title}</div>
                    <div style={{ fontSize: 13, color: grisTexte }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                  </div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                  {exp.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 2 }}>{exp.description}</div>}
                  {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                    <ul style={{ fontSize: 13, color: noir, margin: '6px 0 0 0', paddingLeft: 18 }}>
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </CardWindow>
          )}
        </div>
        {/* Colonne droite : Formation puis Compétences */}
        <div>
          {education.length > 0 && (
            <CardWindow title="Formation">
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: noir }}>{edu.degree}</div>
                    <div style={{ fontSize: 13, color: grisTexte }}>{edu.startDate} - {edu.endDate}</div>
                  </div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{edu.institution}{edu.field ? `, ${edu.field}` : ''}</div>
                  {edu.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 2 }}>{edu.description}</div>}
                </div>
              ))}
            </CardWindow>
          )}
          {skills.length > 0 && (
            <CardWindow title="Compétences">
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                {skills.map((skill, idx) => (
                  <li key={idx} style={{ fontSize: 13, color: noir, marginBottom: 6 }}>{skill.name}</li>
                ))}
              </ul>
            </CardWindow>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindowTemplate; 