import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface EducationTemplateProps {
  data: CVData;
  isMiniature?: boolean;
  customization?: { primaryColor?: string };
}

const noir = '#232323';
const bleu = '#1746a2';
const gris = '#f5f5f5';
const blanc = '#fff';

const EducationTemplate: React.FC<EducationTemplateProps> = ({ data, isMiniature = false, customization }) => {
  const primaryColor = customization?.primaryColor || bleu;
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

  return (
    <div className="cv-template-container" style={{ position: 'relative', width: 794, minHeight: 1123, background: gris, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002' }}>
      {/* Bande bleue traversante, arrondie à gauche, derrière la colonne noire */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 120, background: primaryColor, borderTopLeftRadius: 18, zIndex: 1 }} />
      {/* Colonne noire traversante, au-dessus de la bande bleue à gauche */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 240, height: '100%', background: noir, color: blanc, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 18px' }}>
        {/* Photo de profil centrée dans le bandeau noir */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120, marginBottom: 18 }}>
          <Avatar src={personalInfo.photo || '/images/avatars/man-2.png'} size={110} style={{ border: '4px solid #fff', boxShadow: '0 2px 8px #0001', background: '#eee' }} />
        </div>
        <div style={{ fontSize: 12, marginBottom: 18, textAlign: 'center', lineHeight: 1.5 }}>{summary}</div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><MailOutlined /> <span>{personalInfo.email}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><PhoneOutlined /> <span>{personalInfo.phone}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><EnvironmentOutlined /> <span>{personalInfo.address}</span></div>
          {personalInfo.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><LinkedinOutlined /> <span>{personalInfo.linkedin}</span></div>}
          {personalInfo.portfolio && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><GlobalOutlined /> <span>{personalInfo.portfolio}</span></div>}
        </div>
        <div style={{ width: '100%', marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#fff' }}>Langues</div>
          {languages.map((lang, idx) => (
            <div key={idx} style={{ fontSize: 12, color: '#b0b0b0', marginBottom: 4 }}>{lang.name} ({lang.level})</div>
          ))}
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#fff' }}>Compétences</div>
          {skills.map((skill, idx) => (
            <div key={idx} style={{ fontSize: 12, color: '#b0b0b0', marginBottom: 4 }}>{skill.name}</div>
          ))}
        </div>
      </div>
      {/* Nom et titre dans la bande bleue, à droite de la photo, avec marge */}
      <div style={{ position: 'absolute', top: 38, left: 290, zIndex: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 70, marginLeft: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 28, color: blanc, letterSpacing: 1 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
        <div style={{ fontSize: 16, color: '#e0e0e0', marginTop: 2 }}>{personalInfo.title}</div>
      </div>
      {/* Colonne droite blanche */}
      <div style={{ position: 'absolute', top: 120, left: 240, width: 554, height: 'calc(100% - 120px)', background: blanc, padding: '32px 36px 32px 36px', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
        {/* Expérience */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, marginBottom: 10 }}>Expérience</div>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#232323' }}>{exp.title}</div>
              <div style={{ fontSize: 13, color: primaryColor }}>{exp.company} — {exp.location}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
              <div style={{ fontSize: 12, color: '#232323' }}>{exp.description}</div>
            </div>
          ))}
        </div>
        {/* Formation */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, marginBottom: 10 }}>Formation</div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#232323' }}>{edu.degree} en {edu.field}</div>
              <div style={{ fontSize: 13, color: primaryColor }}>{edu.institution}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{edu.startDate} - {edu.endDate}</div>
              <div style={{ fontSize: 12, color: '#232323' }}>{edu.description}</div>
            </div>
          ))}
        </div>
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, marginBottom: 10 }}>Certifications</div>
            {certifications.map((cert, idx) => (
              <div key={idx} style={{ fontSize: 13, color: '#232323', marginBottom: 6 }}>
                {typeof cert === 'string' ? cert : <>{cert.name} ({cert.issuer}, {cert.date})</>}
              </div>
            ))}
          </div>
        )}
        {/* Projets */}
        {Array.isArray(data.projects) && data.projects.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, marginBottom: 10 }}>Projets</div>
            {data.projects.map((proj, idx) => (
              <div key={idx} style={{ fontSize: 13, color: '#232323', marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{typeof proj === 'string' ? proj : proj.name}</div>
                {typeof proj !== 'string' && proj.description && <div style={{ fontSize: 12 }}>{proj.description}</div>}
                {typeof proj !== 'string' && (proj.startDate || proj.endDate) && (
                  <div style={{ fontSize: 11, color: '#888' }}>{proj.startDate}{proj.endDate ? ` - ${proj.endDate}` : ''}</div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Centres d'intérêt */}
        {Array.isArray(data.interests) && data.interests.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, marginBottom: 10 }}>Centres d'intérêt</div>
            {data.interests.map((interest, idx) => (
              <div key={idx} style={{ fontSize: 13, color: '#232323', marginBottom: 6 }}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && 'name' in interest ? interest.name : '')}</div>
            ))}
          </div>
        )}
        {/* Section Références dynamique */}
        {Array.isArray(data.references) && data.references.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: primaryColor, marginBottom: 8 }}>RÉFÉRENCES</div>
            {data.references.map((ref: any, idx: number) => (
              <div key={idx} style={{ fontSize: 14, color: primaryColor, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{ref.name}</div>
                {ref.position && <div style={{ fontSize: 13 }}>{ref.position}</div>}
                {ref.contact && <div style={{ fontSize: 12, color: '#888' }}>{ref.contact}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationTemplate; 