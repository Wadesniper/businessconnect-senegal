import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface EducationTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const noir = '#232323';
const bleu = '#1746a2';
const gris = '#f5f5f5';
const blanc = '#fff';
const bleuClair = '#eaf0fa';

const EducationTemplate: React.FC<EducationTemplateProps> = ({ data, isMiniature = false }) => {
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
    <div style={{ display: 'flex', flexDirection: 'row', width: 794, height: 1123, background: gris, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002' }}>
      {/* Colonne gauche noire */}
      <div style={{ background: noir, color: blanc, width: 240, padding: '32px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
        <div style={{ height: 120 }} /> {/* Espace pour aligner la photo */}
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
      {/* Colonne droite blanche avec bande bleue en haut */}
      <div style={{ background: blanc, flex: 1, position: 'relative', minHeight: '100%' }}>
        {/* Bande bleue horizontale */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 120, background: bleu, zIndex: 1 }} />
        {/* Photo, nom, titre sur la bande bleue */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', height: 120, paddingLeft: 40 }}>
          <Avatar src={personalInfo.photo || '/images/avatars/man-2.png'} size={90} style={{ border: '4px solid #fff', boxShadow: '0 2px 8px #0001', marginRight: 28, marginTop: 8 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 28, color: blanc, letterSpacing: 1 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
            <div style={{ fontSize: 16, color: '#e0e0e0', marginTop: 2 }}>{personalInfo.title}</div>
          </div>
        </div>
        {/* Contenu principal */}
        <div style={{ marginTop: 120, padding: '32px 36px 32px 36px', display: 'flex', flexDirection: 'column' }}>
          {/* Expérience */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: bleu, marginBottom: 10 }}>Expérience</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#232323' }}>{exp.title}</div>
                <div style={{ fontSize: 13, color: bleu }}>{exp.company} — {exp.location}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                <div style={{ fontSize: 12, color: '#232323' }}>{exp.description}</div>
              </div>
            ))}
          </div>
          {/* Formation */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: bleu, marginBottom: 10 }}>Formation</div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#232323' }}>{edu.degree} en {edu.field}</div>
                <div style={{ fontSize: 13, color: bleu }}>{edu.institution}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>{edu.startDate} - {edu.endDate}</div>
                <div style={{ fontSize: 12, color: '#232323' }}>{edu.description}</div>
              </div>
            ))}
          </div>
          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontWeight: 700, fontSize: 18, color: bleu, marginBottom: 10 }}>Certifications</div>
              {certifications.map((cert, idx) => (
                <div key={idx} style={{ fontSize: 13, color: '#232323', marginBottom: 6 }}>
                  {typeof cert === 'string' ? cert : <>{cert.name} ({cert.issuer}, {cert.date})</>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationTemplate; 