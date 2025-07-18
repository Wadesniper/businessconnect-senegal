import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, StarOutlined, HeartOutlined, CameraOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const vertFonce = '#4b6c5c';
const vertClair = '#eaf3ee';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface TechModernTemplateProps {
  data: CVData;
  isMiniature?: boolean;
  customization?: { primaryColor?: string };
}

const TechModernTemplate: React.FC<TechModernTemplateProps> = ({ data, isMiniature = false, customization }) => {
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
  const interests = Array.isArray((data as any).interests) ? (data as any).interests : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];

  const primaryColor = customization?.primaryColor || vertFonce;

  // Pictos pour centres d'intérêt (exemple)
  const interestIcons: Record<string, React.ReactNode> = {
    photographie: <CameraOutlined />,
    jeux: <CameraOutlined />,
    sport: <StarOutlined />,
    musique: <HeartOutlined />,
  };

  return (
    <div className="cv-template-container" style={{ width: 794, minHeight: 1123, background: blanc, fontFamily: 'Montserrat, Arial, sans-serif', display: 'flex', flexDirection: 'row', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 24px #0002' }}>
      {/* Colonne gauche */}
      <div style={{ width: '32%', background: primaryColor, color: blanc, padding: '0 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
        {/* Photo */}
        <div style={{ width: 140, height: 140, borderRadius: 18, overflow: 'hidden', marginTop: 28, marginBottom: 18, boxShadow: '0 2px 8px #0003', border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={personalInfo.photo || '/images/avatars/man-4.png'} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18 }} />
        </div>
        {/* Coordonnées */}
        <div style={{ width: '80%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: blanc, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: primaryColor, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Coordonnées</div>
          <div style={{ height: 2, width: 32, background: blanc, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
          {personalInfo.phone && <div style={{ fontSize: 14, color: blanc, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><PhoneOutlined style={{ fontSize: 18, color: blanc, marginRight: 8 }} /> {personalInfo.phone}</div>}
          {personalInfo.email && <div style={{ fontSize: 14, color: blanc, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined style={{ fontSize: 18, color: blanc, marginRight: 8 }} /> {personalInfo.email}</div>}
          {personalInfo.address && <div style={{ fontSize: 14, color: blanc, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined style={{ fontSize: 18, color: blanc, marginRight: 8 }} /> {personalInfo.address}</div>}
          {personalInfo.portfolio && <div style={{ fontSize: 14, color: blanc, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><GlobalOutlined style={{ fontSize: 18, color: blanc, marginRight: 8 }} /> {personalInfo.portfolio}</div>}
          {personalInfo.linkedin && <div style={{ fontSize: 14, color: blanc, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><LinkedinOutlined style={{ fontSize: 18, color: blanc, marginRight: 8 }} /> {personalInfo.linkedin}</div>}
        </div>
        {/* Compétences */}
        {skills.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: blanc, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: primaryColor, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Compétences</div>
            <div style={{ height: 2, width: 32, background: blanc, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
            <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
              {skills.map((skill, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: blanc, marginBottom: 7, gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: blanc, marginRight: 8, flexShrink: 0 }} />
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Centres d'intérêt */}
        {interests.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: blanc, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: primaryColor, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Centres d'intérêt</div>
            <div style={{ height: 2, width: 32, background: blanc, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {interests.map((interest: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: blanc, background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '4px 10px', gap: 8 }}>
                  {interestIcons[(interest.name || '').toLowerCase()] || <StarOutlined />} {interest.name}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Langues */}
        {languages.length > 0 && (
          <div style={{ width: '80%', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: blanc, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: primaryColor, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Langues</div>
            <div style={{ height: 2, width: 32, background: blanc, opacity: 0.12, marginBottom: 12, borderRadius: 2 }} />
            <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
              {languages.map((lang, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: blanc, marginBottom: 7, gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: blanc, marginRight: 8, flexShrink: 0 }} />
                  {lang.name} - {lang.level}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Formations déplacées ici */}
        {education.length > 0 && (
          <div style={{ width: '80%', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: primaryColor, marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase', background: blanc, padding: '4px 16px', borderRadius: 8, display: 'inline-block' }}>Formations</div>
            <div style={{ height: 2, width: 32, background: primaryColor, opacity: 0.12, marginBottom: 8, borderRadius: 2 }} />
            {education.map((edu, idx) => (
              <div key={idx} style={{ background: blanc, borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: '8px 10px', marginBottom: 8, borderLeft: `3px solid ${primaryColor}` }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: primaryColor }}>{edu.degree}</div>
                <div style={{ fontSize: 12, color: grisTexte }}>{edu.institution}{edu.field ? `, ${edu.field}` : ''}</div>
                <div style={{ fontSize: 11, color: primaryColor, opacity: 0.7 }}>{edu.startDate} - {edu.endDate}</div>
                {edu.description && (
                  <div style={{ fontSize: 12, color: grisTexte, marginTop: 4 }}>{edu.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '68%', background: blanc, padding: '48px 40px 40px 40px', display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
        {/* Header nom/titre + pictos + laptop */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 32, color: primaryColor, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
            <div style={{ fontSize: 18, color: primaryColor, fontWeight: 500, textTransform: 'capitalize' }}>{personalInfo.title}</div>
          </div>
          {/* Laptop dessin SVG */}
          <div style={{ marginLeft: 24, transform: 'rotate(-12deg)' }}>
            {/* Laptop SVG isométrique optimisé */}
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Ombre portée */}
              <ellipse cx="45" cy="84" rx="32" ry="6" fill="#000" opacity="0.10" />
              <g stroke={primaryColor} strokeWidth="2" fill="#fff">
                {/* Base du laptop */}
                <polygon points="15,65 75,65 87,80 3,80" />
                {/* Pavé tactile */}
                <rect x="60" y="72" width="12" height="5" rx="1.2" fill={vertClair} />
                {/* Ecran rapproché */}
                <rect x="25" y="18" width="40" height="28" rx="3" fill={vertClair} stroke={primaryColor} strokeWidth="2" />
                {/* Contour écran */}
                <rect x="25" y="18" width="40" height="28" rx="3" fill="none" />
                {/* Contenu écran */}
                <rect x="29" y="22" width="32" height="20" rx="2" fill="#b6e3c6" stroke="none" />
                {/* Charnière (ligne fine) */}
                <line x1="25" y1="46" x2="65" y2="65" stroke={primaryColor} strokeWidth="1.2" opacity="0.5" />
                {/* Clavier (touches) */}
                <g strokeWidth="1" fill={vertClair}>
                  {Array.from({length: 2}).map((_, row) => (
                    Array.from({length: 8}).map((_, col) => (
                      <rect key={row + '-' + col} x={22 + col*6} y={68 + row*4} width="5" height="3" rx="0.7" fill={vertClair} stroke={primaryColor} strokeWidth="0.7" />
                    ))
                  ))}
                </g>
              </g>
            </svg>
          </div>
        </div>
        {/* À propos */}
        {summary && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, background: '#d6eadd', padding: '4px 16px', borderRadius: 8, display: 'inline-block', marginBottom: 10 }}>À propos</div>
            <div style={{ fontSize: 15, color: grisTexte, marginTop: 6 }}>{summary}</div>
          </div>
        )}
        {/* Expériences professionnelles */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, background: '#d6eadd', padding: '4px 16px', borderRadius: 8, display: 'inline-block', marginBottom: 10 }}>Expériences professionnelles</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ background: blanc, borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18, marginBottom: 18, borderLeft: `4px solid ${primaryColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: primaryColor }}>{exp.title}</div>
                  <div style={{ fontSize: 14, color: primaryColor }}>{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</div>
                </div>
                <div style={{ fontWeight: 500, fontSize: 15, color: grisTexte, marginBottom: 4 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                <div style={{ fontSize: 14, color: grisTexte }}>{exp.description}</div>
                {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                  <ul style={{ fontSize: 13, color: primaryColor, margin: '8px 0 0 0', paddingLeft: 18 }}>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, background: '#d6eadd', padding: '4px 16px', borderRadius: 8, display: 'inline-block', marginBottom: 10 }}>Certifications</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {certifications.map((cert: any, idx: number) => (
                <li key={idx} style={{ fontSize: 14, color: primaryColor, marginBottom: 8, fontWeight: 500 }}>{typeof cert === 'string' ? cert : `${cert.name}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Clavier décoratif supprimé pour un rendu plus professionnel */}
      </div>
    </div>
  );
};

export default TechModernTemplate; 