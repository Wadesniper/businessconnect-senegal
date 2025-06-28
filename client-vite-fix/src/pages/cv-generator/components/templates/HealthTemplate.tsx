import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface HealthTemplateProps {
  data: CVData;
  isMiniature?: boolean;
  customization?: { primaryColor?: string };
}

const rose = '#fbeeee';
const roseFonce = '#e6bfcf';
const noir = '#222';
const gris = '#666';
const blanc = '#fff';

const sectionTitle = {
  color: roseFonce,
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: 1,
  marginBottom: 8,
  textTransform: 'uppercase' as const,
};

const HealthTemplate: React.FC<HealthTemplateProps> = ({ data, isMiniature = false, customization }) => {
  const primaryColor = customization?.primaryColor || roseFonce;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: 794, minHeight: 1123, background: blanc, borderRadius: 18, boxShadow: '0 4px 24px #0002', fontFamily: 'Montserrat, Arial, sans-serif', overflow: 'hidden' }}>
      {/* Colonne gauche */}
      <div style={{ background: rose, width: 270, padding: '32px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar src={personalInfo.photo || '/images/avatars/woman-2.png'} size={90} style={{ border: `2px solid ${primaryColor}`, marginBottom: 16 }} />
        <div style={{ fontSize: 22, fontWeight: 700, color: noir, marginBottom: 2, textAlign: 'center' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
        <div style={{ fontSize: 13, color: gris, fontWeight: 500, marginBottom: 16, textAlign: 'center' }}>{personalInfo.title}</div>
        {/* Contacts */}
        <div style={{ width: '100%', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <MailOutlined style={{ color: primaryColor, fontSize: 14, marginRight: 6 }} />
            <span style={{ color: noir, fontSize: 13, fontWeight: 500 }}>{personalInfo.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <PhoneOutlined style={{ color: primaryColor, fontSize: 14, marginRight: 6 }} />
            <span style={{ color: noir, fontSize: 13, fontWeight: 500 }}>{personalInfo.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <EnvironmentOutlined style={{ color: primaryColor, fontSize: 14, marginRight: 6 }} />
            <span style={{ color: noir, fontSize: 13, fontWeight: 500 }}>{personalInfo.address}</span>
          </div>
        </div>
        {/* Compétences */}
        <div style={{ width: '100%', marginBottom: 18 }}>
          <div style={{ ...sectionTitle, fontSize: 13, color: primaryColor, marginBottom: 6 }}>COMPÉTENCES</div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {skills.map((skill, idx) => (
              <li key={idx} style={{ color: gris, fontSize: 13, marginBottom: 2 }}>{skill.name}</li>
            ))}
          </ul>
        </div>
        {/* Formation */}
        <div style={{ width: '100%', marginBottom: 18 }}>
          <div style={{ ...sectionTitle, fontSize: 13, color: primaryColor, marginBottom: 6 }}>FORMATION</div>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {education.map((edu, idx) => (
              <li key={idx} style={{ color: gris, fontSize: 13, marginBottom: 2 }}>
                {edu.degree} {edu.field && <>en {edu.field} </>}
                <br /><span style={{ color: primaryColor }}>{edu.institution}</span>
                {edu.description && <div style={{ fontSize: 12, color: gris, marginTop: 2 }}>{edu.description}</div>}
              </li>
            ))}
          </ul>
        </div>
        {/* Référence */}
        {personalInfo.reference && (
          <div style={{ width: '100%', marginBottom: 18 }}>
            <div style={{ ...sectionTitle, fontSize: 13, color: primaryColor, marginBottom: 6 }}>RÉFÉRENCE</div>
            <div style={{ color: gris, fontSize: 13 }}>{personalInfo.reference}</div>
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ flex: 1, background: blanc, padding: '36px 36px 36px 36px', display: 'flex', flexDirection: 'column' }}>
        {/* Résumé */}
        {summary && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...sectionTitle, color: primaryColor, fontSize: 16, marginBottom: 8 }}>À PROPOS DE MOI</div>
            <div style={{ color: gris, fontSize: 14, lineHeight: 1.6 }}>{summary}</div>
          </div>
        )}
        {/* Expérience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...sectionTitle, color: primaryColor, fontSize: 16, marginBottom: 8 }}>EXPÉRIENCE</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: primaryColor }}>{exp.title}</div>
                <div style={{ color: gris, fontSize: 13, fontWeight: 500 }}>{exp.company} <span style={{ color: noir, fontWeight: 400 }}>• {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</span></div>
                <div style={{ color: gris, fontSize: 13, marginTop: 2 }}>{exp.description}</div>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ color: primaryColor, fontSize: 12, marginTop: 3, marginBottom: 0, paddingLeft: 16 }}>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...sectionTitle, color: primaryColor, fontSize: 16, marginBottom: 8 }}>CERTIFICATIONS</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {certifications.map((cert, idx) => (
                <li key={idx} style={{ color: gris, fontSize: 13, marginBottom: 2 }}>{typeof cert === 'string' ? cert : cert.name}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Langues */}
        {languages.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...sectionTitle, color: primaryColor, fontSize: 16, marginBottom: 8 }}>LANGUES</div>
            <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {languages.map((lang, idx) => (
                <li key={idx} style={{ color: gris, fontSize: 13, marginBottom: 2 }}>{lang.name} - {lang.level}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Projets */}
        {Array.isArray(data.projects) && data.projects.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...sectionTitle, color: primaryColor, fontSize: 16, marginBottom: 8 }}>PROJETS</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {data.projects.map((proj, i) => (
                <li key={i} style={{ color: gris, fontSize: 13, marginBottom: 2 }}>
                  <div style={{ fontWeight: 600 }}>{typeof proj === 'string' ? proj : proj.name}</div>
                  {typeof proj !== 'string' && proj.description && <div style={{ fontSize: 12 }}>{proj.description}</div>}
                  {typeof proj !== 'string' && (proj.startDate || proj.endDate) && (
                    <div style={{ fontSize: 11, color: '#888' }}>{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Centres d'intérêt */}
        {Array.isArray(data.interests) && data.interests.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...sectionTitle, color: primaryColor, fontSize: 16, marginBottom: 8 }}>CENTRES D'INTÉRÊT</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {data.interests.map((interest, i) => (
                <li key={i} style={{ fontSize: 13 }}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && 'name' in interest ? interest.name : '')}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Section Références dynamique (tableau) */}
        {Array.isArray(data.references) && data.references.length > 0 && (
          <div style={{ width: '100%', marginBottom: 18 }}>
            <div style={{ ...sectionTitle, fontSize: 13, color: primaryColor, marginBottom: 6 }}>RÉFÉRENCES</div>
            {data.references.map((ref: any, idx: number) => (
              <div key={idx} style={{ color: gris, fontSize: 13, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{ref.name}</div>
                {ref.position && <div style={{ fontSize: 12 }}>{ref.position}</div>}
                {ref.contact && <div style={{ fontSize: 12, color: '#888' }}>{ref.contact}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthTemplate; 