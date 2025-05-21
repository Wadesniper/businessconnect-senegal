import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { 
  LinkedinOutlined, 
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  BankOutlined
} from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';
import '../../styles/FinanceTemplate.css';

const { Title, Text, Paragraph } = Typography;

interface FinanceTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const FinanceTemplate: React.FC<FinanceTemplateProps> = ({ data, isMiniature = false }) => {
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
    <div
      className="finance-cv-template"
      style={{
        padding: isMiniature ? 12 : 40,
        fontSize: isMiniature ? 10 : 16,
        borderRadius: isMiniature ? 8 : 16,
        background: '#fff',
        minHeight: isMiniature ? 0 : undefined,
      }}
    >
      {/* En-tête */}
      <div className="finance-header" style={{
        padding: isMiniature ? 8 : 32,
        borderRadius: isMiniature ? 6 : 8,
        marginBottom: isMiniature ? 12 : 32,
      }}>
        <Row gutter={isMiniature ? 8 : 24} align="middle">
          <Col xs={24} md={8} className="finance-avatar-container" style={{ textAlign: 'center' }}>
            <Avatar
              src={data.personalInfo.photo || '/images/avatars/man-1.png'}
              size={isMiniature ? 48 : 120}
              className="finance-avatar"
              style={{ border: isMiniature ? '2px solid #fff' : '4px solid #fff', marginBottom: isMiniature ? 4 : 16 }}
            />
          </Col>
          <Col xs={24} md={16} className="finance-header-content">
            <Title level={isMiniature ? 5 : 2} className="finance-name" style={{ fontSize: isMiniature ? 14 : 28, margin: 0 }}>
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </Title>
            <Title level={isMiniature ? 5 : 3} className="finance-title" style={{ fontSize: isMiniature ? 11 : 20, margin: 0 }}>
              {data.personalInfo.title}
            </Title>
            <div className="finance-contact-info" style={{ gap: isMiniature ? 4 : 16, fontSize: isMiniature ? 9 : 14 }}>
              <Text><MailOutlined /> {personalInfo.email}</Text>
              <Text><PhoneOutlined /> {personalInfo.phone}</Text>
              <Text><EnvironmentOutlined /> {personalInfo.address}</Text>
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinOutlined /> {personalInfo.linkedin}
                </a>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <div className="finance-content">
        {/* Résumé */}
        <section className="finance-section" style={{ marginBottom: isMiniature ? 8 : 32 }}>
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={isMiniature ? 5 : 4} style={{ fontSize: isMiniature ? 11 : 18 }}>Profil Professionnel</Title>
          </div>
          <Card className="finance-card" style={{ padding: isMiniature ? 6 : 16, fontSize: isMiniature ? 9 : 14 }}>
            <Paragraph>{summary}</Paragraph>
          </Card>
        </section>

        {/* Expérience */}
        <section className="finance-section" style={{ marginBottom: isMiniature ? 8 : 32 }}>
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={isMiniature ? 5 : 4} style={{ fontSize: isMiniature ? 11 : 18 }}>Expérience Professionnelle</Title>
          </div>
          <Timeline className="finance-timeline">
            {experience.map((exp, index) => (
              <Timeline.Item 
                key={index}
                dot={<div className="finance-timeline-dot" />}
              >
                <Card className="finance-card" style={{ padding: isMiniature ? 6 : 16, fontSize: isMiniature ? 9 : 14 }}>
                  <Title level={isMiniature ? 5 : 5} className="finance-experience-title" style={{ fontSize: isMiniature ? 10 : 16 }}>
                    {exp.title}
                  </Title>
                  <Text strong className="finance-company" style={{ fontSize: isMiniature ? 9 : 14 }}>
                    {exp.company}
                  </Text>
                  <br />
                  <Text type="secondary" className="finance-date" style={{ fontSize: isMiniature ? 9 : 12 }}>
                    {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                  </Text>
                  <ul className="finance-description-list" style={{ fontSize: isMiniature ? 9 : 13 }}>
                    {exp.description && <li>{exp.description}</li>}
                  </ul>
                  {exp.achievements && (
                    <div className="finance-achievements">
                      <Text strong style={{ fontSize: isMiniature ? 9 : 13 }}>Réalisations clés :</Text>
                      <ul>
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </section>

        {/* Compétences */}
        <section className="finance-section" style={{ marginBottom: isMiniature ? 8 : 32 }}>
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={isMiniature ? 5 : 4} style={{ fontSize: isMiniature ? 11 : 18 }}>Compétences</Title>
          </div>
          <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
            {skills.map((skill, index) => (
              <Col xs={24} md={12} key={index} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                <Card className="finance-card" title={skill.name} style={{ padding: isMiniature ? 4 : 12, fontSize: isMiniature ? 9 : 13 }}>
                  <Rate disabled style={{ fontSize: isMiniature ? 10 : 16 }} defaultValue={typeof skill.level === 'number' ? skill.level : skill.level === 'Débutant' ? 1 : skill.level === 'Intermédiaire' ? 2 : skill.level === 'Avancé' ? 3 : skill.level === 'Expert' ? 4 : 0} />
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Formation */}
        <section className="finance-section" style={{ marginBottom: isMiniature ? 8 : 32 }}>
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={isMiniature ? 5 : 4} style={{ fontSize: isMiniature ? 11 : 18 }}>Formation</Title>
          </div>
          <Timeline>
            {education.map((edu, index) => (
              <Timeline.Item 
                key={index}
                dot={<div className="finance-timeline-dot" />}
              >
                <Card className="finance-card" style={{ padding: isMiniature ? 6 : 16, fontSize: isMiniature ? 9 : 14 }}>
                  <Title level={isMiniature ? 5 : 5} style={{ fontSize: isMiniature ? 10 : 16 }}>{edu.degree} en {edu.field}</Title>
                  <Text strong style={{ fontSize: isMiniature ? 9 : 14 }}>{edu.institution}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: isMiniature ? 9 : 12 }}>{edu.startDate} - {edu.endDate}</Text>
                  {edu.description && (
                    <Paragraph className="finance-education-description" style={{ fontSize: isMiniature ? 9 : 13 }}>
                      {edu.description}
                    </Paragraph>
                  )}
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </section>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="finance-section" style={{ marginBottom: isMiniature ? 8 : 32 }}>
            <div className="finance-section-header">
              <BankOutlined className="finance-section-icon" />
              <Title level={isMiniature ? 5 : 4} style={{ fontSize: isMiniature ? 11 : 18 }}>Certifications</Title>
            </div>
            <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
              {certifications.map((cert, index) => {
                if (typeof cert === 'string') {
                  return (
                    <Col key={index} xs={24} sm={12} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                      <Card className="finance-card finance-certification-card" style={{ padding: isMiniature ? 4 : 12, fontSize: isMiniature ? 9 : 13 }}>
                        <Title level={isMiniature ? 5 : 5} style={{ fontSize: isMiniature ? 10 : 16 }}>{cert}</Title>
                      </Card>
                    </Col>
                  );
                } else {
                  return (
                    <Col key={index} xs={24} sm={12} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                      <Card className="finance-card finance-certification-card" style={{ padding: isMiniature ? 4 : 12, fontSize: isMiniature ? 9 : 13 }}>
                        <Title level={isMiniature ? 5 : 5} style={{ fontSize: isMiniature ? 10 : 16 }}>{cert.name}</Title>
                        <Text style={{ fontSize: isMiniature ? 9 : 13 }}>{cert.issuer}</Text>
                        <br />
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
        <section className="finance-section" style={{ marginBottom: isMiniature ? 8 : 32 }}>
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={isMiniature ? 5 : 4} style={{ fontSize: isMiniature ? 11 : 18 }}>Langues</Title>
          </div>
          <Card className="finance-card" style={{ padding: isMiniature ? 6 : 16, fontSize: isMiniature ? 9 : 14 }}>
            <Row gutter={[isMiniature ? 4 : 16, isMiniature ? 4 : 16]}>
              {languages.map((lang, index) => (
                <Col key={index} style={{ marginBottom: isMiniature ? 2 : 8 }}>
                  <Tag color="blue" className="finance-language-tag" style={{ fontSize: isMiniature ? 9 : 13 }}>
                    {lang.name} - {lang.level}
                  </Tag>
                </Col>
              ))}
            </Row>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default FinanceTemplate; 