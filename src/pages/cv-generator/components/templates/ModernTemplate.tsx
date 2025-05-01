import React from 'react';
import { CVTemplateData } from '../../../../data/cv-templates';
import { Typography, Row, Col, Rate, Tag, Timeline, Card, Avatar, Divider } from 'antd';
import { 
  LinkedinOutlined, 
  GithubOutlined, 
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ModernTemplateProps {
  data: CVTemplateData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  return (
    <div className="modern-cv-template" style={{ padding: '40px', backgroundColor: '#fff' }}>
      {/* En-tête */}
      <Row gutter={24} align="middle" style={{ marginBottom: '2rem' }}>
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Avatar
            src={data.profile.photo}
            size={200}
            style={{ 
              border: '4px solid #f0f0f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
        </Col>
        <Col xs={24} md={16}>
          <Title level={2} style={{ marginBottom: '0.5rem', color: '#1890ff' }}>
            {data.profile.fullName}
          </Title>
          <Title level={3} style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 'normal' }}>
            {data.profile.title}
          </Title>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Text>
                <MailOutlined style={{ marginRight: 8 }} />
                {data.profile.email}
              </Text>
            </Col>
            <Col span={24}>
              <Text>
                <PhoneOutlined style={{ marginRight: 8 }} />
                {data.profile.phone}
              </Text>
            </Col>
            <Col span={24}>
              <Text>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                {data.profile.location}
              </Text>
            </Col>
            {data.profile.linkedin && (
              <Col span={24}>
                <a href={`https://${data.profile.linkedin}`} target="_blank" rel="noopener noreferrer">
                  <LinkedinOutlined style={{ marginRight: 8 }} />
                  {data.profile.linkedin}
                </a>
              </Col>
            )}
            {data.profile.portfolio && (
              <Col span={24}>
                <a href={`https://${data.profile.portfolio}`} target="_blank" rel="noopener noreferrer">
                  <GithubOutlined style={{ marginRight: 8 }} />
                  {data.profile.portfolio}
                </a>
              </Col>
            )}
          </Row>
        </Col>
      </Row>

      <Divider />

      {/* Résumé */}
      <div style={{ marginBottom: '2rem' }}>
        <Title level={4} style={{ color: '#1890ff' }}>À propos</Title>
        <Paragraph>{data.summary}</Paragraph>
      </div>

      {/* Expérience */}
      <div style={{ marginBottom: '2rem' }}>
        <Title level={4} style={{ color: '#1890ff' }}>Expérience Professionnelle</Title>
        <Timeline>
          {data.experience.map((exp, index) => (
            <Timeline.Item key={index}>
              <Card bordered={false} style={{ marginBottom: '1rem' }}>
                <Title level={5} style={{ marginBottom: '0.5rem' }}>
                  {exp.position} - {exp.company}
                </Title>
                <Text type="secondary">
                  {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                </Text>
                <Paragraph style={{ marginTop: '0.5rem' }}>
                  <ul style={{ paddingLeft: '20px' }}>
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </Paragraph>
                {exp.achievements && (
                  <div>
                    <Text strong>Réalisations principales :</Text>
                    <ul style={{ paddingLeft: '20px' }}>
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
      </div>

      {/* Formation */}
      <div style={{ marginBottom: '2rem' }}>
        <Title level={4} style={{ color: '#1890ff' }}>Formation</Title>
        <Timeline>
          {data.education.map((edu, index) => (
            <Timeline.Item key={index}>
              <Title level={5} style={{ marginBottom: '0.5rem' }}>
                {edu.degree} en {edu.field}
              </Title>
              <Text>{edu.school}</Text>
              <br />
              <Text type="secondary">{edu.startDate} - {edu.endDate}</Text>
              {edu.description && (
                <Paragraph style={{ marginTop: '0.5rem' }}>{edu.description}</Paragraph>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {/* Compétences */}
      <div style={{ marginBottom: '2rem' }}>
        <Title level={4} style={{ color: '#1890ff' }}>Compétences</Title>
        {data.skills.map((skillGroup, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <Title level={5}>{skillGroup.category}</Title>
            <Row gutter={[16, 16]}>
              {skillGroup.items.map((skill, i) => (
                <Col key={i} xs={24} sm={12}>
                  <Card size="small">
                    <Row justify="space-between" align="middle">
                      <Col>{skill.name}</Col>
                      <Col>
                        <Rate disabled defaultValue={skill.level} />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </div>

      {/* Langues */}
      <div style={{ marginBottom: '2rem' }}>
        <Title level={4} style={{ color: '#1890ff' }}>Langues</Title>
        <Row gutter={[16, 16]}>
          {data.languages.map((lang, index) => (
            <Col key={index}>
              <Tag color="blue" style={{ padding: '4px 8px' }}>
                {lang.name} - {lang.level}
              </Tag>
            </Col>
          ))}
        </Row>
      </div>

      {/* Certifications */}
      {data.certifications && (
        <div>
          <Title level={4} style={{ color: '#1890ff' }}>Certifications</Title>
          <Row gutter={[16, 16]}>
            {data.certifications.map((cert, index) => (
              <Col key={index} xs={24} sm={12}>
                <Card size="small">
                  <Title level={5} style={{ marginBottom: '0.5rem' }}>{cert.name}</Title>
                  <Text>{cert.issuer}</Text>
                  <br />
                  <Text type="secondary">{cert.date}</Text>
                  {cert.url && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={`https://${cert.url}`} target="_blank" rel="noopener noreferrer">
                        <GlobalOutlined /> Voir le certificat
                      </a>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate; 