import React from 'react';
import { Avatar } from 'antd';
import { LinkedinOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';
import '../../styles/FinanceTemplate.css';

const noir = '#232323';
const jaune = '#FFD600';
const gris = '#b0b0b0';
const blanc = '#fff';

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
  const techSkills = Array.isArray((data as any).technicalSkills) ? (data as any).technicalSkills : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];
  const interests = Array.isArray(data.interests) ? data.interests : [];
  const references = Array.isArray(data.references) ? data.references : [];

  return (
    <div style={{ width: 794, height: 1123, background: blanc, borderRadius: 18, overflow: 'hidden', fontFamily: 'Montserrat, Arial, sans-serif', boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'row' }}>
      {/* Colonne gauche jaune */}
      <div style={{ width: '32%', background: jaune, color: noir, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0 0 0 0', position: 'relative' }}>
        {/* Bandeau noir incliné */}
        <div style={{ width: '120%', height: 120, background: noir, color: blanc, transform: 'skewY(-7deg)', position: 'absolute', top: 0, left: -30, zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '32px 0 0 32px' }}>
          <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 1, lineHeight: 1, textTransform: 'uppercase', marginBottom: 8 }}>{personalInfo.firstName} {personalInfo.lastName}</div>
          <div style={{ fontSize: 16, color: jaune, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase' }}>{personalInfo.title}</div>
        </div>
        {/* Bloc profil personnel */}
        <div style={{ marginTop: 140, width: '100%', padding: '0 24px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: noir, background: jaune, padding: '6px 12px', borderRadius: 8, marginBottom: 8, display: 'inline-block', letterSpacing: 1 }}>PROFIL PERSONNEL</div>
          <div style={{ fontSize: 13, color: noir, marginBottom: 18 }}>{summary}</div>
        </div>
        {/* Compétences */}
        {skills.length > 0 && (
          <div style={{ width: '100%', padding: '0 24px', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: noir, background: jaune, padding: '6px 12px', borderRadius: 8, marginBottom: 8, display: 'inline-block', letterSpacing: 1 }}>COMPÉTENCES</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {skills.map((skill, i) => <li key={i} style={{ fontSize: 13 }}>{skill.name}</li>)}
            </ul>
          </div>
        )}
        {/* Contacts */}
        <div style={{ width: '100%', padding: '0 24px', marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: noir, background: jaune, padding: '6px 12px', borderRadius: 8, marginBottom: 8, display: 'inline-block', letterSpacing: 1 }}>CONTACTEZ-MOI</div>
          <div style={{ fontSize: 13, marginBottom: 6 }}><EnvironmentOutlined /> {personalInfo.address}</div>
          <div style={{ fontSize: 13, marginBottom: 6 }}><MailOutlined /> {personalInfo.email}</div>
          <div style={{ fontSize: 13, marginBottom: 6 }}><PhoneOutlined /> {personalInfo.phone}</div>
          {personalInfo.linkedin && <div style={{ fontSize: 13, marginBottom: 6 }}><LinkedinOutlined /> {personalInfo.linkedin}</div>}
        </div>
      </div>
      {/* Colonne droite blanche */}
      <div style={{ width: '68%', background: blanc, color: noir, display: 'flex', flexDirection: 'column', padding: '48px 40px 32px 40px', gap: 24 }}>
        {/* Expérience professionnelle */}
        {experience.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: blanc, background: noir, padding: '6px 18px', borderRadius: 8, marginBottom: 12, display: 'inline-block', letterSpacing: 1 }}>EXPÉRIENCE PROFESSIONNELLE</div>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: noir }}>{exp.title}</div>
                <div style={{ fontSize: 13, color: gris }}>{exp.company}</div>
                <div style={{ fontSize: 12, color: noir }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</div>
                <div style={{ fontSize: 13, color: gris }}>{exp.description}</div>
              </div>
            ))}
          </div>
        )}
        {/* Formation antérieure */}
        {education.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: blanc, background: noir, padding: '6px 18px', borderRadius: 8, marginBottom: 12, display: 'inline-block', letterSpacing: 1 }}>FORMATION ANTÉRIEURE</div>
            {education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: noir }}>{edu.institution}</div>
                <div style={{ fontSize: 13, color: gris }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</div>
                <div style={{ fontSize: 12, color: noir }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
        {/* Compétences techniques */}
        {techSkills.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: noir, background: jaune, padding: '6px 18px', borderRadius: 8, marginBottom: 12, display: 'inline-block', letterSpacing: 1 }}>COMPÉTENCES TECHNIQUES</div>
            {techSkills.map((skill: any, idx: number) => (
              <div key={idx} style={{ fontSize: 13, color: noir, marginBottom: 8 }}>{skill.name}</div>
            ))}
          </div>
        )}
        {/* Références dynamiques */}
        {references.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: noir, background: jaune, padding: '6px 18px', borderRadius: 8, marginBottom: 12, display: 'inline-block', letterSpacing: 1 }}>RÉFÉRENCES</div>
            {references.map((ref: any, idx: number) => (
              <div key={idx} style={{ fontSize: 13, color: noir, marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{ref.name}</div>
                {ref.position && <div style={{ fontSize: 12 }}>{ref.position}</div>}
                {ref.contact && <div style={{ fontSize: 12, color: gris }}>{ref.contact}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceTemplate; 