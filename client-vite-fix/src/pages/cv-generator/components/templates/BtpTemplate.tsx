import React from 'react';
import { Typography, Row, Col, Tag, Timeline, Card, Avatar, Rate } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, BuildOutlined } from '@ant-design/icons';
import { CVData } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface BtpTemplateProps {
  data: CVData;
}

const BtpTemplate: React.FC<BtpTemplateProps> = ({ data }) => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e6f7ff 100%)', borderRadius: 16, boxShadow: '0 4px 24px rgba(140, 140, 140, 0.08)', padding: 32 }}>
      {/* En-tête */}
      <Row gutter={24} align="middle" style={{ marginBottom: 32 }}>
        <Col xs={24} md={7} style={{ textAlign: 'center' }}>
          <Avatar
            src={data.personalInfo.photo || '/images/avatars/man-1.png'}
            size={160}
            style={{ border: '4px solid #595959', marginBottom: 16 }}
          />
          <Title level={3} style={{ color: '#262626', margin: 0 }}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Title>
          <Text style={{ color: '#434343' }}>{data.personalInfo.title}</Text>
        </Col>
        <Col xs={24} md={17}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <Tag color="blue"><MailOutlined /> {data.personalInfo.email}</Tag>
            <Tag color="geekblue"><PhoneOutlined /> {data.personalInfo.phone}</Tag>
            <Tag color="gray"><EnvironmentOutlined /> {data.personalInfo.address}</Tag>
            {data.personalInfo.linkedin && <Tag color="geekblue"><LinkedinOutlined /> {data.personalInfo.linkedin}</Tag>}
            {data.personalInfo.portfolio && <Tag color="purple"><GlobalOutlined /> {data.personalInfo.portfolio}</Tag>}
          </div>
          <Paragraph style={{ marginTop: 24, fontSize: 16, color: '#434343' }}>{data.summary}</Paragraph>
        </Col>
      </Row>

      {/* Expérience */}
      <section style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: '#595959' }}><BuildOutlined /> Expérience BTP / Ingénierie</Title>
        <Timeline>
          {data.experience.map((exp, idx) => (
            <Timeline.Item key={idx} color="#595959">
              <Card style={{ borderLeft: '4px solid #595959', marginBottom: 16 }}>
                <Title level={5} style={{ color: '#262626' }}>{exp.title}</Title>
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
        <Title level={4} style={{ color: '#595959' }}>Compétences Clés</Title>
        <Row gutter={[16, 16]}>
          {data.skills.map((skill, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card style={{ background: '#f5f5f5', border: '1px solid #d9d9d9' }}>
                <Text strong>{skill.name}</Text>
                <Rate disabled defaultValue={typeof skill.level === 'number' ? skill.level : skill.level === 'Débutant' ? 1 : skill.level === 'Intermédiaire' ? 2 : skill.level === 'Avancé' ? 3 : skill.level === 'Expert' ? 4 : 0} />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Formation */}
      <section style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: '#595959' }}>Formation</Title>
        <Timeline>
          {data.education.map((edu, idx) => (
            <Timeline.Item key={idx} color="#595959">
              <Card style={{ background: '#f5f5f5', border: '1px solid #d9d9d9' }}>
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
          <Title level={4} style={{ color: '#595959' }}>Certifications</Title>
          <Row gutter={[16, 16]}>
            {data.certifications.map((cert, idx) => {
              if (typeof cert === 'string') {
                return (
                  <Col key={idx} xs={24} sm={12} md={8}>
                    <Card style={{ background: '#f5f5f5', border: '1px solid #d9d9d9' }}>
                      <Text>{cert}</Text>
                    </Card>
                  </Col>
                );
              } else {
                return (
                  <Col key={idx} xs={24} sm={12} md={8}>
                    <Card style={{ background: '#f5f5f5', border: '1px solid #d9d9d9' }}>
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
        <Title level={4} style={{ color: '#595959' }}>Langues</Title>
        <Row gutter={[16, 16]}>
          {data.languages.map((lang, idx) => (
            <Col key={idx} xs={12} sm={8} md={6}>
              <Tag color="geekblue" style={{ fontSize: 16 }}>{lang.name} - {lang.level}</Tag>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
};

export default BtpTemplate; 