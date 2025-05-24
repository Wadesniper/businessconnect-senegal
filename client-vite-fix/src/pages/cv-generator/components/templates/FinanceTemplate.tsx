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

  return (
    <div style={{ width: 794, height: 1123, background: blanc, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'row' }}>
      {/* Colonne gauche */}
      <div style={{ width: '33%', background: bleu, color: blanc, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 0 0', minHeight: '100%' }}>
        {/* Photo */}
        <Avatar src={personalInfo.photo || '/images/avatars/man-1.png'} size={110} style={{ border: '4px solid #fff', marginBottom: 24 }} />
        {/* Bloc Informations */}
        <div style={{ width: '100%', padding: '0 24px', marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, background: bleu, color: blanc, padding: '6px 12px', borderRadius: 8, marginBottom: 8, letterSpacing: 1 }}>INFORMATIONS</div>
          <div style={{ fontSize: 13, marginBottom: 6 }}><PhoneOutlined /> {personalInfo.phone}</div>
          <div style={{ fontSize: 13, marginBottom: 6 }}><MailOutlined /> {personalInfo.email}</div>
          <div style={{ fontSize: 13, marginBottom: 6 }}><EnvironmentOutlined /> {personalInfo.address}</div>
          {personalInfo.linkedin && <div style={{ fontSize: 13, marginBottom: 6 }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
        </div>
        {/* Bloc Compétences */}
        {skills.length > 0 && (
          <div style={{ width: '100%', padding: '0 24px', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, background: bleu, color: blanc, padding: '6px 12px', borderRadius: 8, marginBottom: 8, letterSpacing: 1 }}>COMPÉTENCES</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {skills.map((skill, i) => <li key={i} style={{ fontSize: 13, color: blanc, marginBottom: 4 }}>{skill.name}</li>)}
            </ul>
          </div>
        )}
        {/* Bloc Langues */}
        {languages.length > 0 && (
          <div style={{ width: '100%', padding: '0 24px', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, background: bleu, color: blanc, padding: '6px 12px', borderRadius: 8, marginBottom: 8, letterSpacing: 1 }}>LANGUES</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {languages.map((lang, i) => <li key={i} style={{ fontSize: 13, color: blanc, marginBottom: 4 }}>{lang.name} - {lang.level}</li>)}
            </ul>
          </div>
        )}
        {/* Bloc Intérêts */}
        {interests.length > 0 && (
          <div style={{ width: '100%', padding: '0 24px', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, background: bleu, color: blanc, padding: '6px 12px', borderRadius: 8, marginBottom: 8, letterSpacing: 1 }}>INTÉRÊTS</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {interests.map((interest, i) => <li key={i} style={{ fontSize: 13, color: blanc, marginBottom: 4 }}>{typeof interest === 'string' ? interest : (interest && typeof interest === 'object' && (interest as any).name ? (interest as any).name : '')}</li>)}
            </ul>
          </div>
        )}
      </div>
      {/* Colonne droite */}
      <div style={{ width: '67%', background: blanc, color: bleu, display: 'flex', flexDirection: 'column', padding: 0, gap: 0 }}>
        {/* En-tête nom, titre, résumé */}
        <div style={{ width: '100%', padding: '48px 48px 0 48px', boxSizing: 'border-box' }}>
          <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 1, lineHeight: 1, color: bleu, marginBottom: 6 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 16, color: bleu, fontWeight: 500, marginBottom: 12, textTransform: 'uppercase' }}>{personalInfo.title}</div>
          {summary && <div style={{ fontSize: 13, color: '#222', marginBottom: 24 }}>{summary}</div>}
        </div>
        {/* Expériences professionnelles */}
        {experience.length > 0 && (
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: blanc, background: bleu, padding: '14px 0 14px 48px', borderRadius: '0 12px 12px 0', marginBottom: 18, width: '100%', textAlign: 'left', letterSpacing: 1, textTransform: 'uppercase', boxSizing: 'border-box' }}>EXPÉRIENCES PROFESSIONNELLES</div>
            <div style={{ padding: '0 48px' }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: bleu }}>{exp.title}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{exp.company}</div>
                  <div style={{ fontSize: 12, color: bleu }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{exp.description}</div>
                  {idx < experience.length - 1 && <div style={{ borderBottom: `1px solid ${gris}`, margin: '16px 0' }} />}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Formations */}
        {education.length > 0 && (
          <div style={{ width: '100%', margin: 0, padding: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: blanc, background: bleu, padding: '14px 0 14px 48px', borderRadius: '0 12px 12px 0', marginBottom: 18, width: '100%', textAlign: 'left', letterSpacing: 1, textTransform: 'uppercase', boxSizing: 'border-box' }}>FORMATIONS</div>
            <div style={{ padding: '0 48px' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: bleu }}>{edu.degree}</div>
                  <div style={{ fontSize: 13, color: grisTexte }}>{edu.institution}</div>
                  <div style={{ fontSize: 12, color: bleu }}>{edu.startDate} - {edu.endDate}</div>
                  {idx < education.length - 1 && <div style={{ borderBottom: `1px solid ${gris}`, margin: '12px 0' }} />}
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