import React from 'react';
import { Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, NotificationOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const bleuPastel = '#b7d8e6';
const bleuFonce = '#1a237e';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface ComTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const aquarelleSVG = `url('data:image/svg+xml;utf8,<svg width=\'800\' height=\'200\' viewBox=\'0 0 800 200\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M0 80 Q 200 0 400 60 T 800 80 V200 H0Z\' fill=\'%23b7d8e6\' fill-opacity=\'0.95\'/></svg>')`;

const dancingScriptFont = {
  fontFamily: 'Dancing Script, cursive',
  fontWeight: 700,
  fontSize: 36,
  color: bleuFonce,
  letterSpacing: 1,
  lineHeight: 1,
  marginBottom: 0,
};
const nomFont = {
  fontFamily: 'Montserrat, Arial, sans-serif',
  fontWeight: 900,
  fontSize: 28,
  color: bleuFonce,
  letterSpacing: 1,
  lineHeight: 1,
  marginBottom: 8,
};

const ComTemplate: React.FC<ComTemplateProps> = ({ data, isMiniature = false }) => {
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
  const qualities = Array.isArray((data as any).qualities) ? (data as any).qualities : [];

  return (
    <div style={{ width: 794, height: 1123, background: blanc, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column' }}>
      {/* Bandeau aquarelle bleu clair */}
      <div style={{
        width: '100%',
        minHeight: 180,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        padding: 0,
        background: aquarelleSVG,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'top left',
        overflow: 'visible',
      }}>
        {/* Photo superposée */}
        <div style={{
          position: 'absolute',
          left: 32,
          top: 60,
          zIndex: 2,
          width: 140,
          height: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Avatar src={personalInfo.photo || '/images/avatars/woman-1.png'} size={120} style={{ border: '4px solid #fff', boxShadow: '0 2px 8px #0001', background: '#fff' }} />
        </div>
        {/* Infos à droite */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 48px 32px 200px' }}>
          {/* Prénom manuscrit */}
          <div style={{...dancingScriptFont, textTransform: 'capitalize'}}>{personalInfo.firstName}</div>
          {/* Nom en gras */}
          <div style={{...nomFont, textTransform: 'uppercase'}}>{personalInfo.lastName}</div>
          <div style={{ fontSize: 20, color: bleuFonce, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2 }}>{personalInfo.title}</div>
          {summary && <div style={{ fontSize: 14, color: bleuFonce, fontWeight: 400, lineHeight: 1.5 }}>{summary}</div>}
        </div>
      </div>
      {/* Deux colonnes principales */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, background: blanc, padding: '0 0 0 0' }}>
        {/* Colonne gauche */}
        <div style={{ width: '32%', background: '#f4fafd', color: bleuFonce, display: 'flex', flexDirection: 'column', padding: '40px 0 0 32px', gap: 36, minHeight: 'calc(100% - 180px)' }}>
          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Contact</div>
            <div style={{ height: 2, width: 32, background: bleuFonce, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
            <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><PhoneOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.phone}</div>
            <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.email}</div>
            <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><GlobalOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.portfolio}</div>
            <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.address}</div>
            {personalInfo.linkedin && <div style={{ fontSize: 14, color: grisTexte, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><LinkedinOutlined style={{ fontSize: 18, color: bleuFonce, marginRight: 8 }} /> {personalInfo.linkedin}</div>}
          </div>
          {/* Compétences */}
          {skills.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Compétences</div>
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
          {/* Qualités */}
          {qualities.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>Qualités</div>
              <div style={{ height: 2, width: 32, background: bleuFonce, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                {qualities.map((q: any, i: number) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: bleuFonce, marginBottom: 7, gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: bleuFonce, marginRight: 8, flexShrink: 0 }} />
                    {typeof q === 'string' ? q : (q && typeof q === 'object' && (q as any).name ? (q as any).name : '')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Colonne droite */}
        <div style={{ width: '68%', background: blanc, color: bleuFonce, display: 'flex', flexDirection: 'column', padding: '40px 48px 40px 48px', gap: 40 }}>
          {/* Expérience professionnelle */}
          {experience.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Expérience professionnelle</div>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ background: '#f8fafc', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: '22px 28px', marginBottom: 28, border: `1.5px solid ${gris}` }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 2 }}>{exp.title}</div>
                  <div style={{ fontSize: 14, color: grisTexte, marginBottom: 2 }}>{exp.company}{exp.location ? ` / ${exp.location}` : ''}</div>
                  <div style={{ fontSize: 13, color: bleuPastel, fontWeight: 600, marginBottom: 6 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                  <div style={{ fontSize: 14, color: grisTexte, marginTop: 6 }}>{exp.description}</div>
                  {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                    <ul style={{ fontSize: 14, color: bleuFonce, margin: '10px 0 0 0', paddingLeft: 18 }}>
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Séparateur entre Expérience et Formations */}
          {experience.length > 0 && education.length > 0 && (
            <div style={{ height: 2, width: '40%', background: bleuFonce, opacity: 0.10, margin: '0 auto 0 0', borderRadius: 2 }} />
          )}
          {/* Formations */}
          {education.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Formations</div>
              {education.map((edu, idx) => (
                <div key={idx} style={{ background: '#f8fafc', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: '22px 28px', marginBottom: 28, border: `1.5px solid ${gris}` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: bleuFonce }}>{edu.degree}</div>
                  <div style={{ fontSize: 14, color: grisTexte }}>{edu.institution}</div>
                  <div style={{ fontSize: 13, color: bleuPastel, fontWeight: 600 }}>{edu.startDate} - {edu.endDate}</div>
                  {edu.description && <div style={{ fontSize: 14, color: grisTexte, marginTop: 8 }}>{edu.description}</div>}
                </div>
              ))}
            </div>
          )}
          {/* Langues dynamiques */}
          {languages.length > 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: bleuFonce, marginBottom: 18, textTransform: 'uppercase', letterSpacing: 1 }}>Langues</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {languages.map((lang, i) => <li key={i} style={{ fontSize: 13, color: bleuFonce, marginBottom: 4 }}>{lang.name} - {lang.level}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
      {typeof window !== 'undefined' && (
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      )}
    </div>
  );
};

export default ComTemplate; 