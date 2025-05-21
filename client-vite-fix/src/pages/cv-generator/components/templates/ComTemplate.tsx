import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, NotificationOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface ComTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const ComTemplate: React.FC<ComTemplateProps> = ({ data, isMiniature = false }) => {
  // Sécurisation des accès aux champs potentiellement absents
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
    <div style={{ background: 'linear-gradient(135deg, #f0f5ff 0%, #fff0f6 100%)', borderRadius: isMiniature ? 8 : 16, boxShadow: '0 4px 24px rgba(255, 77, 153, 0.08)', padding: isMiniature ? 12 : 32, fontSize: isMiniature ? 10 : 16 }}>
      {/* En-tête */}
      <Row gutter={isMiniature ? 8 : 24} align="middle" style={{ marginBottom: isMiniature ? 12 : 32 }}>
        <Col xs={24} md={7} style={{ textAlign: 'center' }}>
          <Avatar
            src={data.personalInfo.photo || '/images/avatars/woman-1.png'}
            size={isMiniature ? 48 : 160}
            style={{ border: isMiniature ? '2px solid #eb2f96' : '4px solid #eb2f96', marginBottom: isMiniature ? 4 : 16 }}
          />
          <Title level={isMiniature ? 5 : 3} style={{ color: '#2f54eb', margin: 0, fontSize: isMiniature ? 14 : 24 }}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Title>
          <Text style={{ color: '#eb2f96', fontSize: isMiniature ? 10 : 16 }}>{data.personalInfo.title}</Text>
        </Col>
        <Col xs={24} md={17}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMiniature ? 4 : 16, fontSize: isMiniature ? 9 : 14 }}>
            <Tag color="blue"><MailOutlined /> {data.personalInfo.email}</Tag>
            <Tag color="magenta"><PhoneOutlined /> {data.personalInfo.phone}</Tag>
            <Tag color="pink"><EnvironmentOutlined /> {data.personalInfo.address}</Tag>
            {personalInfo.linkedin && <Tag color="geekblue"><LinkedinOutlined /> {personalInfo.linkedin}</Tag>}
            {personalInfo.portfolio && <Tag color="purple"><GlobalOutlined /> {personalInfo.portfolio}</Tag>}
          </div>
          <Paragraph style={{ marginTop: isMiniature ? 8 : 24, fontSize: isMiniature ? 10 : 16, color: '#eb2f96' }}>{summary}</Paragraph>
        </Col>
      </Row>

      {/* Expérience */}
      <section style={{ marginBottom: isMiniature ? 8 : 32 }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#2f54eb', fontSize: isMiniature ? 11 : 18 }}><NotificationOutlined /> Expérience Communication / Médias</Title>
        <Timeline>
          {experience.map((exp, idx) => (
            <Timeline.Item key={idx} color="#eb2f96">
              <Card style={{ borderLeft: '4px solid #eb2f96', marginBottom: isMiniature ? 4 : 16, padding: isMiniature ? 6 : 16, fontSize: isMiniature ? 9 : 14 }}>
                <Title level={isMiniature ? 5 : 5} style={{ color: '#2f54eb', fontSize: isMiniature ? 10 : 16 }}>{exp.title}</Title>
                <Text strong style={{ fontSize: isMiniature ? 9 : 14 }}>{exp.company}</Text> <Text type="secondary" style={{ fontSize: isMiniature ? 9 : 12 }}>{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</Text>
                <Paragraph style={{ fontSize: isMiniature ? 9 : 13 }}>{exp.description}</Paragraph>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ fontSize: isMiniature ? 9 : 13 }}>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </section>

      {/* Compétences */}
      <section style={{ marginBottom: isMiniature ? 8 : 32 }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#2f54eb', fontSize: isMiniature ? 11 : 18 }}>Compétences Clés</Title>
        <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
          {skills.map((skill, idx) => (
            <Col xs={24} sm={12} md={8} key={idx} style={{ marginBottom: isMiniature ? 2 : 8 }}>
              <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: isMiniature ? 4 : 12, fontSize: isMiniature ? 9 : 13 }}>
                <Text strong style={{ fontSize: isMiniature ? 10 : 16 }}>{skill.name}</Text>
                <Rate disabled style={{ fontSize: isMiniature ? 10 : 16 }} defaultValue={typeof skill.level === 'number' ? skill.level : skill.level === 'Débutant' ? 1 : skill.level === 'Intermédiaire' ? 2 : skill.level === 'Avancé' ? 3 : skill.level === 'Expert' ? 4 : 0} />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Formation */}
      <section style={{ marginBottom: isMiniature ? 8 : 32 }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#2f54eb', fontSize: isMiniature ? 11 : 18 }}>Formation</Title>
        <Timeline>
          {education.map((edu, idx) => (
            <Timeline.Item key={idx} color="#eb2f96">
              <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: isMiniature ? 4 : 12, fontSize: isMiniature ? 9 : 13 }}>
                <Title level={isMiniature ? 5 : 5} style={{ fontSize: isMiniature ? 10 : 16 }}>{edu.degree} en {edu.field}</Title>
                <Text strong style={{ fontSize: isMiniature ? 9 : 14 }}>{edu.institution}</Text> <Text type="secondary" style={{ fontSize: isMiniature ? 9 : 12 }}>{edu.startDate} - {edu.endDate}</Text>
                <Paragraph style={{ fontSize: isMiniature ? 9 : 13 }}>{edu.description}</Paragraph>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </section>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section style={{ marginBottom: isMiniature ? 8 : 32 }}>
          <Title level={isMiniature ? 5 : 4} style={{ color: '#2f54eb', fontSize: isMiniature ? 11 : 18 }}>Certifications</Title>
          <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
            {certifications.map((cert, idx) => {
              if (typeof cert === 'string') {
                return (
                  <Col key={idx} xs={24} sm={12} md={8} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                    <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: isMiniature ? 4 : 12, fontSize: isMiniature ? 9 : 13 }}>
                      <Text style={{ fontSize: isMiniature ? 10 : 16 }}>{cert}</Text>
                    </Card>
                  </Col>
                );
              } else {
                return (
                  <Col key={idx} xs={24} sm={12} md={8} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                    <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: isMiniature ? 4 : 12, fontSize: isMiniature ? 9 : 13 }}>
                      <Text strong style={{ fontSize: isMiniature ? 10 : 16 }}>{cert.name}</Text><br/>
                      <Text style={{ fontSize: isMiniature ? 9 : 13 }}>{cert.issuer}</Text><br/>
                      <Text type="secondary" style={{ fontSize: isMiniature ? 9 : 12 }}>{cert.date}</Text>
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
        <Title level={isMiniature ? 5 : 4} style={{ color: '#2f54eb', fontSize: isMiniature ? 11 : 18 }}>Langues</Title>
        <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
          {languages.map((lang, idx) => (
            <Col key={idx} xs={12} sm={8} md={6} style={{ marginBottom: isMiniature ? 2 : 8 }}>
              <Tag color="magenta" style={{ fontSize: isMiniature ? 9 : 16 }}>{lang.name} - {lang.level}</Tag>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default ComTemplate; 