import React from 'react';
import { Avatar } from 'antd';
import { LinkedinOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const bleu = '#23336A';
const blanc = '#fff';
const gris = '#e5e7eb';
const grisTexte = '#6b7280';

interface FinanceTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const FinanceTemplate: React.FC<FinanceTemplateProps> = ({ data, isMiniature = false }) => {
  const personalInfo = {
    ...data.personalInfo,
    linkedin: (data.personalInfo as any).linkedin || '',
    summary: (data.personalInfo as any).summary || '',
  };
  const summary = personalInfo.summary || (data as any).summary || '';
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const interests = Array.isArray(data.interests) ? data.interests : [];

  const baseFontSize = isMiniature ? '8px' : '11px';

  return (
    <div style={{ 
        width: '100%', 
        height: '100%', 
        background: blanc, 
        fontFamily: 'Montserrat, Arial, sans-serif', 
        display: 'flex', 
        flexDirection: 'row',
        fontSize: baseFontSize,
        overflow: 'hidden'
    }}>
      {/* Colonne gauche */}
      <div style={{ width: '33%', background: bleu, color: blanc, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2em 0', boxSizing: 'border-box' }}>
        <Avatar src={personalInfo.photo || '/images/avatars/man-1.png'} size={'8em'} style={{ border: '0.2em solid #fff', marginBottom: '2em' }} />
        
        <div style={{ width: '100%', padding: '0 2em', marginBottom: '1.5em' }}>
          <h2 style={{ fontSize: '1.2em', fontWeight: 700, letterSpacing: '0.1em', background: bleu, color: blanc, padding: '0.5em 1em', borderRadius: '0.5em', marginBottom: '0.8em' }}>INFORMATIONS</h2>
          <p style={{ fontSize: '1.1em', marginBottom: '0.6em', wordBreak: 'break-word' }}><PhoneOutlined style={{marginRight: '0.5em'}}/>{personalInfo.phone}</p>
          <p style={{ fontSize: '1.1em', marginBottom: '0.6em', wordBreak: 'break-word' }}><MailOutlined style={{marginRight: '0.5em'}}/>{personalInfo.email}</p>
          <p style={{ fontSize: '1.1em', marginBottom: '0.6em', wordBreak: 'break-word' }}><EnvironmentOutlined style={{marginRight: '0.5em'}}/>{personalInfo.address}</p>
          {personalInfo.linkedin && <p style={{ fontSize: '1.1em', marginBottom: '0.6em', wordBreak: 'break-word' }}><LinkedinOutlined style={{marginRight: '0.5em'}}/>{personalInfo.linkedin}</p>}
        </div>

        {skills.length > 0 && (
          <div style={{ width: '100%', padding: '0 2em', marginBottom: '1.5em' }}>
            <h2 style={{ fontSize: '1.2em', fontWeight: 700, letterSpacing: '0.1em', background: bleu, color: blanc, padding: '0.5em 1em', borderRadius: '0.5em', marginBottom: '0.8em' }}>COMPÉTENCES</h2>
            <ul style={{ paddingLeft: '1.5em', margin: 0 }}>
              {skills.map((skill, i) => <li key={i} style={{ fontSize: '1.1em', color: blanc, marginBottom: '0.4em' }}>{skill.name}</li>)}
            </ul>
          </div>
        )}
        
        {languages.length > 0 && (
          <div style={{ width: '100%', padding: '0 2em', marginBottom: '1.5em' }}>
            <h2 style={{ fontSize: '1.2em', fontWeight: 700, letterSpacing: '0.1em', background: bleu, color: blanc, padding: '0.5em 1em', borderRadius: '0.5em', marginBottom: '0.8em' }}>LANGUES</h2>
            <ul style={{ paddingLeft: '1.5em', margin: 0 }}>
              {languages.map((lang, i) => <li key={i} style={{ fontSize: '1.1em', color: blanc, marginBottom: '0.4em' }}>{lang.name} - {lang.level}</li>)}
            </ul>
          </div>
        )}

        {interests.length > 0 && (
          <div style={{ width: '100%', padding: '0 2em', marginBottom: '1.5em' }}>
            <h2 style={{ fontSize: '1.2em', fontWeight: 700, letterSpacing: '0.1em', background: bleu, color: blanc, padding: '0.5em 1em', borderRadius: '0.5em', marginBottom: '0.8em' }}>INTÉRÊTS</h2>
            <ul style={{ paddingLeft: '1.5em', margin: 0 }}>
              {interests.map((interest, i) => <li key={i} style={{ fontSize: '1.1em', color: blanc, marginBottom: '0.4em' }}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && (interest as any).name ? (interest as any).name : '')}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Colonne droite */}
      <div style={{ width: '67%', background: blanc, color: bleu, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <div style={{ padding: '3em 4em 0 4em' }}>
          <h1 style={{ fontSize: '2.2em', fontWeight: 900, letterSpacing: '0.1em', lineHeight: 1, color: bleu, marginBottom: '0.6em', textTransform: 'uppercase' }}>{personalInfo.firstName} {personalInfo.lastName}</h1>
          <h2 style={{ fontSize: '1.3em', color: bleu, fontWeight: 500, marginBottom: '1.2em', textTransform: 'uppercase' }}>{personalInfo.title}</h2>
          {summary && <p style={{ fontSize: '1.1em', color: '#222', marginBottom: '2em' }}>{summary}</p>}
        </div>

        {experience.length > 0 && (
          <div style={{ marginBottom: '1.5em' }}>
            <h3 style={{ fontSize: '1.3em', fontWeight: 700, color: blanc, background: bleu, padding: '1em 0 1em 4em', borderRadius: '0 1em 1em 0', width: '100%', letterSpacing: '0.1em', textTransform: 'uppercase', boxSizing: 'border-box', marginBottom: '1.5em' }}>EXPÉRIENCES</h3>
            <div style={{ padding: '0 4em' }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '1.5em' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.2em', color: bleu, margin: 0 }}>{exp.title}</p>
                  <p style={{ fontSize: '1.1em', color: grisTexte, margin: '0.2em 0' }}>{exp.company}</p>
                  <p style={{ fontSize: '1em', color: bleu, margin: '0.2em 0' }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</p>
                  <p style={{ fontSize: '1.1em', color: grisTexte, margin: '0.5em 0 0 0' }}>{exp.description}</p>
                  {idx < experience.length - 1 && <hr style={{ border: 'none', borderTop: `1px solid ${gris}`, margin: '1.2em 0' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.3em', fontWeight: 700, color: blanc, background: bleu, padding: '1em 0 1em 4em', borderRadius: '0 1em 1em 0', width: '100%', letterSpacing: '0.1em', textTransform: 'uppercase', boxSizing: 'border-box', marginBottom: '1.5em' }}>FORMATIONS</h3>
            <div style={{ padding: '0 4em' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '1.2em' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.2em', color: bleu, margin: 0 }}>{edu.degree}</p>
                  <p style={{ fontSize: '1.1em', color: grisTexte, margin: '0.2em 0' }}>{edu.institution}</p>
                  <p style={{ fontSize: '1em', color: bleu, margin: '0.2em 0' }}>{edu.startDate} - {edu.endDate}</p>
                  {idx < education.length - 1 && <hr style={{ border: 'none', borderTop: `1px solid ${gris}`, margin: '1em 0' }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceTemplate; 