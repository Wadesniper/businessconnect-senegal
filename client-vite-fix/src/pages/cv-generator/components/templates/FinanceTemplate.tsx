import React from 'react';
import { Avatar } from 'antd';
import { LinkedinOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';
import '../../styles/FinanceTemplate.css';

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

  const fontScale = isMiniature ? 0.8 : 1;

  return (
    <div style={{ 
        width: '100%', 
        height: '100%', 
        background: blanc, 
        overflow: 'hidden', 
        fontFamily: 'Montserrat, Arial, sans-serif', 
        display: 'flex', 
        flexDirection: 'row' 
    }}>
      {/* Colonne gauche */}
      <div style={{ width: '33%', background: bleu, color: blanc, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2vw 0 0 0', minHeight: '100%' }}>
        {/* Photo */}
        <Avatar src={personalInfo.photo || '/images/avatars/man-1.png'} size={isMiniature ? 60 : 110} style={{ border: '2px solid #fff', marginBottom: '2vw' }} />
        {/* Bloc Informations */}
        <div style={{ width: '100%', padding: '0 2vw', marginBottom: '1.5vw' }}>
          <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.2}vw`, background: bleu, color: blanc, padding: '0.5vw 1vw', borderRadius: 8, marginBottom: '0.8vw', letterSpacing: 1 }}>INFORMATIONS</div>
          <div style={{ fontSize: `${fontScale * 1.1}vw`, marginBottom: '0.6vw' }}><PhoneOutlined /> {personalInfo.phone}</div>
          <div style={{ fontSize: `${fontScale * 1.1}vw`, marginBottom: '0.6vw' }}><MailOutlined /> {personalInfo.email}</div>
          <div style={{ fontSize: `${fontScale * 1.1}vw`, marginBottom: '0.6vw' }}><EnvironmentOutlined /> {personalInfo.address}</div>
          {personalInfo.linkedin && <div style={{ fontSize: `${fontScale * 1.1}vw`, marginBottom: '0.6vw' }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
        </div>
        {/* Bloc Compétences */}
        {skills.length > 0 && (
          <div style={{ width: '100%', padding: '0 2vw', marginBottom: '1.5vw' }}>
            <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.2}vw`, background: bleu, color: blanc, padding: '0.5vw 1vw', borderRadius: 8, marginBottom: '0.8vw', letterSpacing: 1 }}>COMPÉTENCES</div>
            <ul style={{ paddingLeft: '1.5vw', margin: 0 }}>
              {skills.map((skill, i) => <li key={i} style={{ fontSize: `${fontScale * 1.1}vw`, color: blanc, marginBottom: '0.4vw' }}>{skill.name}</li>)}
            </ul>
          </div>
        )}
        {/* Bloc Langues */}
        {languages.length > 0 && (
          <div style={{ width: '100%', padding: '0 2vw', marginBottom: '1.5vw' }}>
            <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.2}vw`, background: bleu, color: blanc, padding: '0.5vw 1vw', borderRadius: 8, marginBottom: '0.8vw', letterSpacing: 1 }}>LANGUES</div>
            <ul style={{ paddingLeft: '1.5vw', margin: 0 }}>
              {languages.map((lang, i) => <li key={i} style={{ fontSize: `${fontScale * 1.1}vw`, color: blanc, marginBottom: '0.4vw' }}>{lang.name} - {lang.level}</li>)}
            </ul>
          </div>
        )}
        {/* Bloc Intérêts */}
        {interests.length > 0 && (
          <div style={{ width: '100%', padding: '0 2vw', marginBottom: '1.5vw' }}>
            <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.2}vw`, background: bleu, color: blanc, padding: '0.5vw 1vw', borderRadius: 8, marginBottom: '0.8vw', letterSpacing: 1 }}>INTÉRÊTS</div>
            <ul style={{ paddingLeft: '1.5vw', margin: 0 }}>
              {interests.map((interest, i) => <li key={i} style={{ fontSize: `${fontScale * 1.1}vw`, color: blanc, marginBottom: '0.4vw' }}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && (interest as any).name ? (interest as any).name : '')}</li>)}
            </ul>
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '67%', background: blanc, color: bleu, display: 'flex', flexDirection: 'column', padding: 0, gap: 0 }}>
        {/* En-tête nom, titre, résumé */}
        <div style={{ width: '100%', padding: '3vw 4vw 0 4vw', boxSizing: 'border-box' }}>
          <div style={{ fontWeight: 900, fontSize: `${fontScale * 2.2}vw`, letterSpacing: 1, lineHeight: 1, color: bleu, marginBottom: '0.6vw' }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: `${fontScale * 1.3}vw`, color: bleu, fontWeight: 500, marginBottom: '1.2vw', textTransform: 'uppercase' }}>{personalInfo.title}</div>
          {summary && <div style={{ fontSize: `${fontScale * 1.1}vw`, color: '#222', marginBottom: '2vw' }}>{summary}</div>}
        </div>
        {/* Expériences professionnelles */}
        {experience.length > 0 && (
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.3}vw`, color: blanc, background: bleu, padding: '1vw 0 1vw 4vw', borderRadius: '0 12px 12px 0', marginBottom: '1.5vw', width: '100%', textAlign: 'left', letterSpacing: 1, textTransform: 'uppercase', boxSizing: 'border-box' }}>EXPÉRIENCES PROFESSIONNELLES</div>
            <div style={{ padding: '0 4vw' }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '1.5vw' }}>
                  <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.2}vw`, color: bleu }}>{exp.title}</div>
                  <div style={{ fontSize: `${fontScale * 1.1}vw`, color: grisTexte }}>{exp.company}</div>
                  <div style={{ fontSize: `${fontScale * 1}vw`, color: bleu }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                  <div style={{ fontSize: `${fontScale * 1.1}vw`, color: grisTexte }}>{exp.description}</div>
                  {idx < experience.length - 1 && <div style={{ borderBottom: `1px solid ${gris}`, margin: '1.2vw 0' }} />}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Formations */}
        {education.length > 0 && (
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.3}vw`, color: blanc, background: bleu, padding: '1vw 0 1vw 4vw', borderRadius: '0 12px 12px 0', marginBottom: '1.5vw', width: '100%', textAlign: 'left', letterSpacing: 1, textTransform: 'uppercase', boxSizing: 'border-box' }}>FORMATIONS</div>
            <div style={{ padding: '0 4vw' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '1.2vw' }}>
                  <div style={{ fontWeight: 700, fontSize: `${fontScale * 1.2}vw`, color: bleu }}>{edu.degree}</div>
                  <div style={{ fontSize: `${fontScale * 1.1}vw`, color: grisTexte }}>{edu.institution}</div>
                  <div style={{ fontSize: `${fontScale * 1}vw`, color: bleu }}>{edu.startDate} - {edu.endDate}</div>
                  {idx < education.length - 1 && <div style={{ borderBottom: `1px solid ${gris}`, margin: '1vw 0' }} />}
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