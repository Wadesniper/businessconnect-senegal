import React from 'react';
import { Avatar } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const vertFonce = '#237804';
const vertClair = '#52c41a';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface AgroTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const AgroTemplate: React.FC<AgroTemplateProps> = ({ data, isMiniature = false }) => {
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
  const interests = Array.isArray((data as any).interests) ? (data as any).interests : [];

  return (
    <div style={{ width: 794, background: blanc, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column' }}>
      {/* Header bandeau vert foncé */}
      <div style={{ width: '100%', background: vertFonce, minHeight: 140, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, position: 'relative', zIndex: 2 }}>
        <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 32, zIndex: 3 }}>
          <Avatar src={personalInfo.photo || '/images/avatars/man-1.png'} size={110} style={{ border: '4px solid #fff', boxShadow: '0 2px 8px #0001', background: '#fff' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 48px 32px 32px', zIndex: 3 }}>
          <div style={{ fontWeight: 900, fontSize: 34, color: blanc, letterSpacing: 1, lineHeight: 1, textTransform: 'uppercase', marginBottom: 6 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 19, color: blanc, fontWeight: 500, marginBottom: 10, textTransform: 'capitalize' }}>{personalInfo.title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 6 }}>
            <div style={{ fontSize: 14, color: blanc, display: 'flex', alignItems: 'center', gap: 8 }}><PhoneOutlined /> {personalInfo.phone}</div>
            <div style={{ fontSize: 14, color: blanc, display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined /> {personalInfo.email}</div>
            <div style={{ fontSize: 14, color: blanc, display: 'flex', alignItems: 'center', gap: 8 }}><EnvironmentOutlined /> {personalInfo.address}</div>
            {personalInfo.linkedin && <div style={{ fontSize: 14, color: blanc, display: 'flex', alignItems: 'center', gap: 8 }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
            {personalInfo.portfolio && <div style={{ fontSize: 14, color: blanc, display: 'flex', alignItems: 'center', gap: 8 }}><GlobalOutlined /> {personalInfo.portfolio}</div>}
          </div>
        </div>
      </div>
      {/* Deux colonnes principales */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, background: blanc, minHeight: 600 }}>
        {/* Colonne gauche */}
        <div style={{ width: '32%', background: blanc, color: vertFonce, display: 'flex', flexDirection: 'column', padding: '32px 0 0 32px', gap: 32 }}>
          {/* Informations */}
          {summary && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: vertFonce, letterSpacing: 1, textTransform: 'uppercase' }}>Informations</span>
                <span style={{ flex: 1, height: 2, background: vertClair, borderRadius: 1, marginLeft: 8, minWidth: 40 }} />
              </div>
              <div style={{ fontSize: 13, color: grisTexte }}>{summary}</div>
            </div>
          )}
          {/* Compétences */}
          {skills.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: vertFonce, letterSpacing: 1, textTransform: 'uppercase' }}>Compétences</span>
                <span style={{ flex: 1, height: 2, background: vertClair, borderRadius: 1, marginLeft: 8, minWidth: 40 }} />
              </div>
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                {skills.map((skill, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: vertFonce, marginBottom: 7, gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: vertFonce, marginRight: 8, flexShrink: 0 }} />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Intérêts */}
          {interests.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: vertFonce, letterSpacing: 1, textTransform: 'uppercase' }}>Intérêts</span>
                <span style={{ flex: 1, height: 2, background: vertClair, borderRadius: 1, marginLeft: 8, minWidth: 40 }} />
              </div>
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                {interests.map((interest: any, i: number) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: vertFonce, marginBottom: 7, gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: vertFonce, marginRight: 8, flexShrink: 0 }} />
                    {typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && (interest as any).name ? (interest as any).name : '')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Langues */}
          {languages.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: vertFonce, letterSpacing: 1, textTransform: 'uppercase' }}>Langues</span>
                <span style={{ flex: 1, height: 2, background: vertClair, borderRadius: 1, marginLeft: 8, minWidth: 40 }} />
              </div>
              <ul style={{ paddingLeft: 0, margin: 0, listStyle: 'none' }}>
                {languages.map((lang, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: vertFonce, marginBottom: 7, gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: vertFonce, marginRight: 8, flexShrink: 0 }} />
                    {lang.name} - {lang.level}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Formations déplacées ici */}
          {education.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: vertFonce, letterSpacing: 1, textTransform: 'uppercase' }}>Formations</span>
                <span style={{ flex: 1, height: 2, background: vertClair, borderRadius: 1, marginLeft: 8, minWidth: 40 }} />
              </div>
              {education.map((edu, idx) => (
                <div key={idx} style={{ background: blanc, borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '14px 18px', marginBottom: 14, border: `1px solid ${gris}` }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: vertFonce }}>{edu.degree}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{edu.institution}</div>
                  <div style={{ fontSize: 12, color: vertClair }}>{edu.startDate} - {edu.endDate}</div>
                  {edu.description && <div style={{ fontSize: 13, color: grisTexte, marginTop: 6 }}>{edu.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Colonne droite */}
        <div style={{ width: '68%', background: blanc, color: vertFonce, display: 'flex', flexDirection: 'column', padding: '32px 48px 32px 48px', gap: 32 }}>
          {/* Expériences professionnelles */}
          {experience.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: vertFonce, textTransform: 'uppercase', letterSpacing: 1 }}>Expériences professionnelles</span>
                <span style={{ flex: 1, height: 2, background: vertClair, borderRadius: 1, marginLeft: 8, minWidth: 40 }} />
              </div>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ background: blanc, borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '18px 24px', marginBottom: 18, border: `1px solid ${gris}` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: vertFonce }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{exp.company}</div>
                  <div style={{ fontSize: 12, color: vertClair }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                  <div style={{ fontSize: 13, color: grisTexte, marginTop: 8 }}>{exp.description}</div>
                  {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                    <ul style={{ fontSize: 13, color: vertFonce, margin: '8px 0 0 0', paddingLeft: 18 }}>
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgroTemplate; 