import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, CodeOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface TechTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const TechTemplate: React.FC<TechTemplateProps> = ({ data, isMiniature = false }) => {
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

  // Styles dynamiques
  const padding = isMiniature ? 12 : 32;
  const borderRadius = isMiniature ? 8 : 16;
  const boxShadow = isMiniature ? '0 2px 8px rgba(24, 144, 255, 0.08)' : '0 4px 24px rgba(24, 144, 255, 0.08)';
  const avatarSize = isMiniature ? 48 : 160;
  const avatarBorder = isMiniature ? '2px solid #1890ff' : '4px solid #1890ff';
  const avatarMargin = isMiniature ? 4 : 16;
  const titleLevel = isMiniature ? 5 : 3;
  const titleFontSize = isMiniature ? 14 : 28;
  const subtitleFontSize = isMiniature ? 11 : 16;
  const sectionMargin = isMiniature ? 8 : 32;
  const cardPadding = isMiniature ? 6 : 16;
  const cardFontSize = isMiniature ? 9 : 14;
  const tagFontSize = isMiniature ? 9 : 16;
  const rowGutter: [number, number] = isMiniature ? [4, 4] : [16, 16];
  const timelineCardPadding = isMiniature ? 4 : 16;
  const timelineCardFontSize = isMiniature ? 9 : 14;

  return (
    <div style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', borderRadius: borderRadius, boxShadow: boxShadow, padding: padding }}>
      {/* En-tête */}
      <Row gutter={rowGutter} align="middle" style={{ marginBottom: sectionMargin }}>
        <Col xs={24} md={7} style={{ textAlign: 'center' }}>
          <Avatar
            src={personalInfo.photo || '/images/avatars/man-4.png'}
            size={avatarSize}
            style={{ border: avatarBorder, marginBottom: avatarMargin }}
          />
          <Title level={titleLevel} style={{ color: '#0050b3', margin: 0 }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Title>
          <Text style={{ color: '#096dd9', fontSize: subtitleFontSize }}>{personalInfo.title}</Text>
        </Col>
        <Col xs={24} md={17}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Tag color="blue"><MailOutlined /> {personalInfo.email}</Tag>
            <Tag color="geekblue"><PhoneOutlined /> {personalInfo.phone}</Tag>
            <Tag color="cyan"><EnvironmentOutlined /> {personalInfo.address}</Tag>
            {personalInfo.linkedin && <Tag color="geekblue"><LinkedinOutlined /> {personalInfo.linkedin}</Tag>}
            {personalInfo.portfolio && <Tag color="purple"><GlobalOutlined /> {personalInfo.portfolio}</Tag>}
          </div>
          <Paragraph style={{ marginTop: 24, fontSize: cardFontSize, color: '#096dd9' }}>{summary}</Paragraph>
        </Col>
      </Row>

      {/* Expérience */}
      <section style={{ marginBottom: sectionMargin }}>
        <Title level={4} style={{ color: '#1890ff' }}><CodeOutlined /> Expérience Informatique / Tech</Title>
        <Timeline>
          {experience.map((exp, idx) => (
            <Timeline.Item key={idx} color="#1890ff">
              <Card style={{ borderLeft: '4px solid #1890ff', marginBottom: 16 }}>
                <Title level={5} style={{ color: '#0050b3' }}>{exp.title}</Title>
                <Text strong>{exp.company}</Text> <Text type="secondary">{exp.startDate} - {exp.current ? 'Présent' : exp.endDate}</Text>
                <Paragraph>{exp.description}</Paragraph>
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul>
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                )}
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </section>

      {/* Compétences */}
      <section style={{ marginBottom: sectionMargin }}>
        <Title level={4} style={{ color: '#1890ff' }}>Compétences Clés</Title>
        <Row gutter={[16, 16]}>
          {skills.map((skill, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                <Text strong>{skill.name}</Text>
                <Rate disabled defaultValue={typeof skill.level === 'number' ? skill.level : skill.level === 'Débutant' ? 1 : skill.level === 'Intermédiaire' ? 2 : skill.level === 'Avancé' ? 3 : skill.level === 'Expert' ? 4 : 0} />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Formation */}
      <section style={{ marginBottom: sectionMargin }}>
        <Title level={4} style={{ color: '#1890ff' }}>Formation</Title>
        <Timeline>
          {education.map((edu, idx) => (
            <Timeline.Item key={idx} color="#1890ff">
              <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                <Title level={5}>{edu.degree} en {edu.field}</Title>
                <Text strong>{edu.institution}</Text> <Text type="secondary">{edu.startDate} - {edu.endDate}</Text>
                <Paragraph>{edu.description}</Paragraph>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </section>

      {/* Certifications */}
      {certifications.length > 0 && (
        <section style={{ marginBottom: sectionMargin }}>
          <Title level={4} style={{ color: '#1890ff' }}>Certifications</Title>
          <Row gutter={[16, 16]}>
            {certifications.map((cert, idx) => {
              if (typeof cert === 'string') {
                return (
                  <Col key={idx} xs={24} sm={12} md={8}>
                    <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                      <Text>{cert}</Text>
                    </Card>
                  </Col>
                );
              } else {
                return (
                  <Col key={idx} xs={24} sm={12} md={8}>
                    <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                      <Text strong>{cert.name}</Text><br/>
                      <Text>{cert.issuer}</Text><br/>
                      <Text type="secondary">{cert.date}</Text>
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
        <Title level={4} style={{ color: '#1890ff' }}>Langues</Title>
        <Row gutter={[16, 16]}>
          {languages.map((lang, idx) => (
            <Col key={idx} xs={12} sm={8} md={6}>
              <Tag color="blue" style={{ fontSize: tagFontSize }}>{lang.name} - {lang.level}</Tag>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default TechTemplate; 