import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, CodeOutlined } from '@ant-design/icons';
import { CVData } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface TechTemplateProps {
  data: CVData;
}

const TechTemplate: React.FC<TechTemplateProps> = ({ data }) => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)', borderRadius: 16, boxShadow: '0 4px 24px rgba(24, 144, 255, 0.08)', padding: 32 }}>
      {/* En-tête */}
      <Row gutter={24} align="middle" style={{ marginBottom: 32 }}>
        <Col xs={24} md={7} style={{ textAlign: 'center' }}>
          <Avatar
            src={data.personalInfo.photo || '/images/avatars/man-4.png'}
            size={160}
            style={{ border: '4px solid #1890ff', marginBottom: 16 }}
          />
          <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Title>
          <Text style={{ color: '#096dd9' }}>{data.personalInfo.title}</Text>
        </Col>
        <Col xs={24} md={17}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Tag color="blue"><MailOutlined /> {data.personalInfo.email}</Tag>
            <Tag color="geekblue"><PhoneOutlined /> {data.personalInfo.phone}</Tag>
            <Tag color="cyan"><EnvironmentOutlined /> {data.personalInfo.address}</Tag>
            {data.personalInfo.linkedin && <Tag color="geekblue"><LinkedinOutlined /> {data.personalInfo.linkedin}</Tag>}
            {data.personalInfo.portfolio && <Tag color="purple"><GlobalOutlined /> {data.personalInfo.portfolio}</Tag>}
          </div>
          <Paragraph style={{ marginTop: 24, fontSize: 16, color: '#096dd9' }}>{data.summary}</Paragraph>
        </Col>
      </Row>

      {/* Expérience */}
      <section style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: '#1890ff' }}><CodeOutlined /> Expérience Informatique / Tech</Title>
        <Timeline>
          {data.experience.map((exp, idx) => (
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
      <section style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: '#1890ff' }}>Compétences Clés</Title>
        <Row gutter={[16, 16]}>
          {data.skills.map((skill, idx) => (
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
      <section style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: '#1890ff' }}>Formation</Title>
        <Timeline>
          {data.education.map((edu, idx) => (
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
      {data.certifications && data.certifications.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <Title level={4} style={{ color: '#1890ff' }}>Certifications</Title>
          <Row gutter={[16, 16]}>
            {data.certifications.map((cert, idx) => {
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
          {data.languages.map((lang, idx) => (
            <Col key={idx} xs={12} sm={8} md={6}>
              <Tag color="blue" style={{ fontSize: 16 }}>{lang.name} - {lang.level}</Tag>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default TechTemplate; 