import React from 'react';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

interface TechTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const bleuFonce = '#232b38';
const grisClair = '#f5f6fa';
const blanc = '#fff';
const jaune = '#d6a85a';
const gris = '#e9e9e9';

const hexagonStyle = {
  width: 120,
  height: 120,
  background: jaune,
  clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginTop: 24,
  marginBottom: 16,
  boxShadow: '0 4px 16px #0002',
};

const TechTemplate: React.FC<TechTemplateProps> = ({ data, isMiniature = false }) => {
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
  const achievements = Array.isArray((data as any).achievements) ? (data as any).achievements : [];

  return (
    <div style={{ width: 794, height: 1123, background: blanc, fontFamily: 'Montserrat, Arial, sans-serif', display: 'flex', flexDirection: 'row', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 24px #0002' }}>
      {/* Colonne gauche */}
      <div style={{ width: '34%', background: bleuFonce, color: blanc, padding: '0 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100%' }}>
        {/* Hexagone photo */}
        <div style={hexagonStyle as React.CSSProperties}>
          <img src={personalInfo.photo || '/images/avatars/man-4.png'} alt="avatar" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff' }} />
        </div>
        {/* Nom et titre */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 28, color: blanc, letterSpacing: 1 }}>{personalInfo.firstName} <br />{personalInfo.lastName}</div>
          <div style={{ fontSize: 16, color: gris, fontWeight: 500, marginTop: 2 }}>{personalInfo.title}</div>
        </div>
        {/* Description */}
        {summary && (
          <div style={{ margin: '0 24px 24px 24px', background: '#232b38', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: jaune, marginBottom: 8 }}>Description</div>
            <div style={{ fontSize: 14, color: gris }}>{summary}</div>
          </div>
        )}
        {/* Contact */}
        <div style={{ margin: '0 24px 24px 24px', background: '#232b38', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #0001' }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: jaune, marginBottom: 8 }}>My Contact</div>
          <div style={{ fontSize: 14, color: gris, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span><PhoneOutlined /> {personalInfo.phone}</span>
            <span><MailOutlined /> {personalInfo.email}</span>
            <span><EnvironmentOutlined /> {personalInfo.address}</span>
            {personalInfo.portfolio && <span><GlobalOutlined /> {personalInfo.portfolio}</span>}
          </div>
        </div>
        {/* Expertise */}
        {skills.length > 0 && (
          <div style={{ margin: '0 24px 24px 24px', background: '#232b38', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #0001' }}>
            <div style={{ fontWeight: 600, fontSize: 18, color: jaune, marginBottom: 8 }}>Expertise</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
              {skills.map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
                  {/* Placeholder icône */}
                  <div style={{ width: 40, height: 40, background: gris, borderRadius: '50%', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: bleuFonce, fontSize: 22 }}>
                    <span role="img" aria-label="icon">💡</span>
                  </div>
                  <span style={{ fontSize: 13, color: gris }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '66%', background: grisClair, padding: '48px 40px 40px 40px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Nom et titre (mobile/miniature) */}
        {/* Work Experiences */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: bleuFonce, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
              Work Experiences
              <div style={{ width: 32, height: 8, background: jaune, marginLeft: 12, clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }} />
            </div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ background: blanc, borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18, marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 16, color: bleuFonce }}>{exp.company}</div>
                  <div style={{ fontSize: 14, color: bleuFonce }}>{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</div>
                </div>
                <div style={{ fontWeight: 500, fontSize: 15, color: '#555', marginBottom: 4 }}>{exp.title}</div>
                <div style={{ fontSize: 14, color: '#888' }}>{exp.description}</div>
              </div>
            ))}
          </div>
        )}
        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: bleuFonce, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
              Education
              <div style={{ width: 32, height: 8, background: jaune, marginLeft: 12, clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }} />
            </div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ background: blanc, borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18, marginBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: bleuFonce }}>{edu.institution}</div>
                <div style={{ fontSize: 15, color: '#555', marginBottom: 4 }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
        {/* Achievement */}
        {achievements.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 22, color: bleuFonce, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
              Achievement
              <div style={{ width: 32, height: 8, background: jaune, marginLeft: 12, clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }} />
            </div>
            {achievements.map((ach, idx) => (
              <div key={idx} style={{ background: blanc, borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 18, marginBottom: 18 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: bleuFonce }}>{ach.title}</div>
                <div style={{ fontSize: 14, color: '#888' }}>{ach.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechTemplate; 