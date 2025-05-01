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
import { CVTemplateData } from '../../../../data/cv-templates';
import './FinanceTemplate.css';

const { Title, Text, Paragraph } = Typography;

interface FinanceTemplateProps {
  data: CVTemplateData;
}

const FinanceTemplate: React.FC<FinanceTemplateProps> = ({ data }) => {
  return (
    <div className="finance-cv-template">
      {/* En-tête */}
      <div className="finance-header">
        <Row gutter={24} align="middle">
          <Col xs={24} md={8} className="finance-avatar-container">
            <Avatar
              src={data.profile.photo}
              size={200}
              className="finance-avatar"
            />
          </Col>
          <Col xs={24} md={16} className="finance-header-content">
            <Title level={2} className="finance-name">
              {data.profile.fullName}
            </Title>
            <Title level={3} className="finance-title">
              {data.profile.title}
            </Title>
            <div className="finance-contact-info">
              <Text><MailOutlined /> {data.profile.email}</Text>
              <Text><PhoneOutlined /> {data.profile.phone}</Text>
              <Text><EnvironmentOutlined /> {data.profile.location}</Text>
              {data.profile.linkedin && (
                <a href={`https://${data.profile.linkedin}`} target="_blank" rel="noopener noreferrer">
                  <LinkedinOutlined /> {data.profile.linkedin}
                </a>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <div className="finance-content">
        {/* Résumé */}
        <section className="finance-section">
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={4}>Profil Professionnel</Title>
          </div>
          <Card className="finance-card">
            <Paragraph>{data.summary}</Paragraph>
          </Card>
        </section>

        {/* Expérience */}
        <section className="finance-section">
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={4}>Expérience Professionnelle</Title>
          </div>
          <Timeline className="finance-timeline">
            {data.experience.map((exp, index) => (
              <Timeline.Item 
                key={index}
                dot={<div className="finance-timeline-dot" />}
              >
                <Card className="finance-card">
                  <Title level={5} className="finance-experience-title">
                    {exp.position}
                  </Title>
                  <Text strong className="finance-company">
                    {exp.company}
                  </Text>
                  <br />
                  <Text type="secondary" className="finance-date">
                    {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                  </Text>
                  <ul className="finance-description-list">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                  {exp.achievements && (
                    <div className="finance-achievements">
                      <Text strong>Réalisations clés :</Text>
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
        <section className="finance-section">
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={4}>Compétences</Title>
          </div>
          <Row gutter={[16, 16]}>
            {data.skills.map((skillGroup) => (
              <Col xs={24} md={12} key={skillGroup.category}>
                <Card className="finance-card" title={skillGroup.category}>
                  {skillGroup.items.map((skill, index) => (
                    <div key={index} className="finance-skill-item">
                      <Text>{skill.name}</Text>
                      <Rate disabled defaultValue={skill.level} />
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Formation */}
        <section className="finance-section">
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={4}>Formation</Title>
          </div>
          <Timeline>
            {data.education.map((edu, index) => (
              <Timeline.Item 
                key={index}
                dot={<div className="finance-timeline-dot" />}
              >
                <Card className="finance-card">
                  <Title level={5}>{edu.degree} en {edu.field}</Title>
                  <Text strong>{edu.school}</Text>
                  <br />
                  <Text type="secondary">{edu.startDate} - {edu.endDate}</Text>
                  {edu.description && (
                    <Paragraph className="finance-education-description">
                      {edu.description}
                    </Paragraph>
                  )}
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </section>

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="finance-section">
            <div className="finance-section-header">
              <BankOutlined className="finance-section-icon" />
              <Title level={4}>Certifications</Title>
            </div>
            <Row gutter={[16, 16]}>
              {data.certifications.map((cert, index) => (
                <Col key={index} xs={24} sm={12}>
                  <Card className="finance-card finance-certification-card">
                    <Title level={5}>{cert.name}</Title>
                    <Text>{cert.issuer}</Text>
                    <br />
                    <Text type="secondary">{cert.date}</Text>
                    {cert.url && (
                      <div className="finance-certification-link">
                        <a href={cert.url} target="_blank" rel="noopener noreferrer">
                          <GlobalOutlined /> Voir le certificat
                        </a>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        )}

        {/* Langues */}
        <section className="finance-section">
          <div className="finance-section-header">
            <BankOutlined className="finance-section-icon" />
            <Title level={4}>Langues</Title>
          </div>
          <Card className="finance-card">
            <Row gutter={[16, 16]}>
              {data.languages.map((lang, index) => (
                <Col key={index}>
                  <Tag color="blue" className="finance-language-tag">
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