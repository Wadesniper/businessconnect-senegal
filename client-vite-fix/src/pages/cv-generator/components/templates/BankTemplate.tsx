import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, DollarOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface BankTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const BankTemplate: React.FC<BankTemplateProps> = ({ data, isMiniature = false }) => {
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
  const boxShadow = isMiniature ? '0 2px 8px rgba(24, 24, 24, 0.08)' : '0 4px 24px rgba(24, 24, 24, 0.08)';
  const avatarSize = isMiniature ? 48 : 160;
  const avatarBorder = isMiniature ? '2px solid #1d39c4' : '4px solid #1d39c4';
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
    <div style={{ background: 'linear-gradient(135deg, #f0f5ff 0%, #fffbe6 100%)', borderRadius, boxShadow, padding }}>
      {/* En-tête */}
      <Row gutter={isMiniature ? 8 : 24} align="middle" style={{ marginBottom: sectionMargin }}>
        <Col xs={24} md={7} style={{ textAlign: 'center' }}>
          <Avatar
            src={personalInfo.photo || '/images/avatars/man-4.png'}
            size={avatarSize}
            style={{ border: avatarBorder, marginBottom: avatarMargin }}
          />
          <Title level={titleLevel} style={{ color: '#1d39c4', margin: 0, fontSize: titleFontSize }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Title>
          <Text style={{ color: '#faad14', fontSize: subtitleFontSize }}>{personalInfo.title}</Text>
        </Col>
        <Col xs={24} md={17}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMiniature ? 4 : 16 }}>
            <Tag color="blue" style={{ fontSize: tagFontSize }}><MailOutlined /> {personalInfo.email}</Tag>
            <Tag color="gold" style={{ fontSize: tagFontSize }}><PhoneOutlined /> {personalInfo.phone}</Tag>
            <Tag color="geekblue" style={{ fontSize: tagFontSize }}><EnvironmentOutlined /> {personalInfo.address}</Tag>
            {personalInfo.linkedin && <Tag color="geekblue" style={{ fontSize: tagFontSize }}><LinkedinOutlined /> {personalInfo.linkedin}</Tag>}
            {personalInfo.portfolio && <Tag color="purple" style={{ fontSize: tagFontSize }}><GlobalOutlined /> {personalInfo.portfolio}</Tag>}
          </div>
          <Paragraph style={{ marginTop: isMiniature ? 8 : 24, fontSize: cardFontSize, color: '#1d39c4' }}>{summary}</Paragraph>
        </Col>
      </Row>

      {/* Expérience */}
      <section style={{ marginBottom: sectionMargin }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#faad14', fontSize: isMiniature ? 11 : 18 }}><DollarOutlined /> Expérience Banque / Assurance</Title>
        <Timeline>
          {experience.map((exp, idx) => (
            <Timeline.Item key={idx} color="#faad14">
              <Card style={{ borderLeft: '4px solid #faad14', marginBottom: isMiniature ? 4 : 16, padding: timelineCardPadding, fontSize: timelineCardFontSize }}>
                <Title level={isMiniature ? 5 : 5} style={{ color: '#1d39c4', fontSize: isMiniature ? 10 : 16 }}>{exp.title}</Title>
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
      <section style={{ marginBottom: sectionMargin }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#faad14', fontSize: isMiniature ? 11 : 18 }}>Compétences Clés</Title>
        <Row gutter={rowGutter}>
          {skills.map((skill, idx) => (
            <Col xs={24} sm={12} md={8} key={idx} style={{ marginBottom: isMiniature ? 2 : 8 }}>
              <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: cardPadding, fontSize: cardFontSize }}>
                <Text strong style={{ fontSize: isMiniature ? 10 : 16 }}>{skill.name}</Text>
                <Rate disabled style={{ fontSize: isMiniature ? 10 : 16 }} defaultValue={typeof skill.level === 'number' ? skill.level : skill.level === 'Débutant' ? 1 : skill.level === 'Intermédiaire' ? 2 : skill.level === 'Avancé' ? 3 : skill.level === 'Expert' ? 4 : 0} />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Formation */}
      <section style={{ marginBottom: sectionMargin }}>
        <Title level={isMiniature ? 5 : 4} style={{ color: '#faad14', fontSize: isMiniature ? 11 : 18 }}>Formation</Title>
        <Timeline>
          {education.map((edu, idx) => (
            <Timeline.Item key={idx} color="#faad14">
              <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: timelineCardPadding, fontSize: timelineCardFontSize }}>
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
        <section style={{ marginBottom: sectionMargin }}>
          <Title level={isMiniature ? 5 : 4} style={{ color: '#faad14', fontSize: isMiniature ? 11 : 18 }}>Certifications</Title>
          <Row gutter={rowGutter}>
            {certifications.map((cert, idx) => {
              if (typeof cert === 'string') {
                return (
                  <Col key={idx} xs={24} sm={12} md={8} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                    <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: cardPadding, fontSize: cardFontSize }}>
                      <Text style={{ fontSize: isMiniature ? 10 : 16 }}>{cert}</Text>
                    </Card>
                  </Col>
                );
              } else {
                return (
                  <Col key={idx} xs={24} sm={12} md={8} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                    <Card style={{ background: '#f0f5ff', border: '1px solid #adc6ff', padding: cardPadding, fontSize: cardFontSize }}>
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
        <Title level={isMiniature ? 5 : 4} style={{ color: '#faad14', fontSize: isMiniature ? 11 : 18 }}>Langues</Title>
        <Row gutter={rowGutter}>
          {languages.map((lang, idx) => (
            <Col key={idx} xs={12} sm={8} md={6} style={{ marginBottom: isMiniature ? 2 : 8 }}>
              <Tag color="gold" style={{ fontSize: tagFontSize }}>{lang.name} - {lang.level}</Tag>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default BankTemplate; 