import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface HealthTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const HealthTemplate: React.FC<HealthTemplateProps> = ({ data, isMiniature = false }) => {
  // Sécurisation des accès aux champs potentiellement absents
  const personalInfo = {
    firstName: data.personalInfo.firstName || '',
    lastName: data.personalInfo.lastName || '',
    title: data.personalInfo.title || '',
    email: data.personalInfo.email || '',
    phone: data.personalInfo.phone || '',
    address: data.personalInfo.address || '',
    photo: data.personalInfo.photo || '',
    summary: data.personalInfo.summary || '',
    linkedin: (data.personalInfo as any).linkedin || '',
    portfolio: (data.personalInfo as any).portfolio || '',
  };
  const summary = personalInfo.summary || '';
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];
  const languages = Array.isArray(data.languages) ? data.languages : [];

  return (
    <div style={{ background: 'linear-gradient(135deg, #e6fffb 0%, #bae7ff 100%)', borderRadius: 16, boxShadow: '0 4px 24px rgba(24, 144, 255, 0.08)', padding: isMiniature ? 8 : 32, fontSize: isMiniature ? 11 : undefined }}>
      {/* En-tête */}
      <Row gutter={isMiniature ? 8 : 24} align="middle" style={{ marginBottom: isMiniature ? 12 : 32 }}>
        <Col xs={24} md={7} style={{ textAlign: 'center' }}>
          <Avatar
            src={personalInfo.photo || '/images/avatars/woman-2.png'}
            size={isMiniature ? 56 : 160}
            style={{ border: `4px solid #13c2c2`, marginBottom: isMiniature ? 6 : 16 }}
          />
          <Title level={isMiniature ? 5 : 3} style={{ color: '#08979c', margin: 0 }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Title>
          <Text style={{ color: '#006d75' }}>{personalInfo.title}</Text>
        </Col>
        <Col xs={24} md={17}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMiniature ? 4 : 16 }}>
            <Tag color="cyan" style={isMiniature ? { fontSize: 10, padding: '2px 6px' } : {}}><MailOutlined /> {personalInfo.email}</Tag>
            <Tag color="blue" style={isMiniature ? { fontSize: 10, padding: '2px 6px' } : {}}><PhoneOutlined /> {personalInfo.phone}</Tag>
            <Tag color="geekblue" style={isMiniature ? { fontSize: 10, padding: '2px 6px' } : {}}><EnvironmentOutlined /> {personalInfo.address}</Tag>
            {personalInfo.linkedin && <Tag color="geekblue" style={isMiniature ? { fontSize: 10, padding: '2px 6px' } : {}}><LinkedinOutlined /> {personalInfo.linkedin}</Tag>}
            {personalInfo.portfolio && <Tag color="purple" style={isMiniature ? { fontSize: 10, padding: '2px 6px' } : {}}><GlobalOutlined /> {personalInfo.portfolio}</Tag>}
          </div>
          <Paragraph style={{ marginTop: isMiniature ? 8 : 24, fontSize: isMiniature ? 11 : 16, color: '#006d75' }}>{summary}</Paragraph>
        </Col>
      </Row>

      {/* Expérience */}
      <section style={{ marginBottom: isMiniature ? 10 : 32 }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#13c2c2' }}><MedicineBoxOutlined /> Expérience Santé</Title>
        <Timeline>
          {experience.map((exp, idx) => (
            <Timeline.Item key={idx} color="#13c2c2">
              <Card style={{ borderLeft: '4px solid #13c2c2', marginBottom: isMiniature ? 6 : 16, padding: isMiniature ? 6 : 16 }}>
                <Title level={isMiniature ? 5 : 5} style={{ color: '#08979c' }}>{exp.title}</Title>
                <Text strong>{exp.company}</Text> <Text type="secondary">{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</Text>
                <Paragraph style={{ fontSize: isMiniature ? 10 : undefined }}>{exp.description}</Paragraph>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={isMiniature ? { margin: 0, paddingLeft: 14 } : {}}>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </section>

      {/* Compétences */}
      <section style={{ marginBottom: isMiniature ? 10 : 32 }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#13c2c2' }}>Compétences Clés</Title>
        <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
          {skills.map((skill, idx) => (
            <Col xs={24} sm={12} md={8} key={idx} style={isMiniature ? { marginBottom: 2 } : {}}>
              <Card style={{ background: '#e6fffb', border: '1px solid #87e8de', padding: isMiniature ? 4 : 12 }}>
                <Text strong style={isMiniature ? { fontSize: 10 } : {}}>{skill.name}</Text>
                <Rate disabled defaultValue={typeof skill.level === 'number' ? skill.level : skill.level === 'Débutant' ? 1 : skill.level === 'Intermédiaire' ? 2 : skill.level === 'Avancé' ? 3 : skill.level === 'Expert' ? 4 : 0} style={isMiniature ? { fontSize: 10 } : {}} />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Formation */}
      <section style={{ marginBottom: isMiniature ? 10 : 32 }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#13c2c2' }}>Formation</Title>
        <Timeline>
          {education.map((edu, idx) => (
            <Timeline.Item key={idx} color="#13c2c2">
              <Card style={{ background: '#e6fffb', border: '1px solid #87e8de', padding: isMiniature ? 4 : 12 }}>
                <Title level={isMiniature ? 5 : 5}>{edu.degree} en {edu.field}</Title>
                <Text strong>{edu.institution}</Text> <Text type="secondary">{edu.startDate} - {edu.endDate}</Text>
                <Paragraph style={{ fontSize: isMiniature ? 10 : undefined }}>{edu.description}</Paragraph>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </section>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section style={{ marginBottom: isMiniature ? 10 : 32 }}>
          <Title level={isMiniature ? 5 : 4} style={{ color: '#13c2c2' }}>Certifications</Title>
          <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
            {certifications.map((cert, idx) => {
              if (typeof cert === 'string') {
                return (
                  <Col key={idx} xs={24} sm={12} md={8} style={isMiniature ? { marginBottom: 2 } : {}}>
                    <Card style={{ background: '#e6fffb', border: '1px solid #87e8de', padding: isMiniature ? 4 : 12 }}>
                      <Text style={isMiniature ? { fontSize: 10 } : {}}>{cert}</Text>
                    </Card>
                  </Col>
                );
              } else {
                return (
                  <Col key={idx} xs={24} sm={12} md={8} style={isMiniature ? { marginBottom: 2 } : {}}>
                    <Card style={{ background: '#e6fffb', border: '1px solid #87e8de', padding: isMiniature ? 4 : 12 }}>
                      <Text strong style={isMiniature ? { fontSize: 10 } : {}}>{cert.name}</Text><br/>
                      <Text style={isMiniature ? { fontSize: 10 } : {}}>{cert.issuer}</Text><br/>
                      <Text type="secondary" style={isMiniature ? { fontSize: 10 } : {}}>{cert.date}</Text>
                    </Card>
                  </Col>
                );
              }
            })}
          </Row>
        </section>
      )}

      {/* Langues */}
      <section>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#13c2c2' }}>Langues</Title>
        <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
          {languages.map((lang, idx) => (
            <Col key={idx} xs={12} sm={8} md={6} style={isMiniature ? { marginBottom: 2 } : {}}>
              <Tag color="cyan" style={isMiniature ? { fontSize: 10, padding: '2px 6px' } : {}}>{lang.name} - {lang.level}</Tag>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default HealthTemplate; 