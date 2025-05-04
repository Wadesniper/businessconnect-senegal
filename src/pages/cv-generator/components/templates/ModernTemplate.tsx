import React from 'react';
import { Typography, Space, Avatar, Tag, Divider } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkedinOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { CVData, Template } from '../../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface ModernTemplateProps {
  data: CVData;
  template: Template;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data, template }) => {
  return (
    <div className="modern-template">
      {/* En-tête */}
      <div className="header">
        <Space align="start" size="large">
          {data.personalInfo.photo && (
            <Avatar 
              size={120} 
              src={data.personalInfo.photo} 
              alt={data.personalInfo.fullName} 
            />
          )}
          <div>
            <Title level={2}>{data.personalInfo.fullName}</Title>
            <Title level={4} type="secondary">{data.personalInfo.title}</Title>
            <Space direction="vertical" size="small">
              {data.personalInfo.email && (
                <Text>
                  <MailOutlined /> {data.personalInfo.email}
                </Text>
              )}
              {data.personalInfo.phone && (
                <Text>
                  <PhoneOutlined /> {data.personalInfo.phone}
                </Text>
              )}
              {data.personalInfo.location && (
                <Text>
                  <EnvironmentOutlined /> {data.personalInfo.location}
                </Text>
              )}
              {data.personalInfo.linkedin && (
                <Text>
                  <LinkedinOutlined /> {data.personalInfo.linkedin}
                </Text>
              )}
              {data.personalInfo.portfolio && (
                <Text>
                  <GlobalOutlined /> {data.personalInfo.portfolio}
                </Text>
              )}
            </Space>
          </div>
        </Space>
      </div>

      <Divider />

      {/* Résumé */}
      {data.summary && (
        <>
          <Title level={3}>Résumé professionnel</Title>
          <Paragraph>{data.summary}</Paragraph>
          <Divider />
        </>
      )}

      {/* Expérience */}
      {data.experience.length > 0 && (
        <>
          <Title level={3}>Expérience professionnelle</Title>
          {data.experience.map((exp, index) => (
            <div key={index} className="section-item">
              <Title level={4}>{exp.position}</Title>
              <Text strong>{exp.company}</Text>
              <br />
              <Text type="secondary">
                {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
              </Text>
              <Paragraph>{exp.description}</Paragraph>
              {exp.achievements && (
                <ul>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Divider />
        </>
      )}

      {/* Formation */}
      {data.education.length > 0 && (
        <>
          <Title level={3}>Formation</Title>
          {data.education.map((edu, index) => (
            <div key={index} className="section-item">
              <Title level={4}>{edu.degree}</Title>
              <Text strong>{edu.institution}</Text>
              <br />
              <Text type="secondary">
                {edu.startDate} - {edu.current ? 'Présent' : edu.endDate}
              </Text>
              {edu.description && <Paragraph>{edu.description}</Paragraph>}
            </div>
          ))}
          <Divider />
        </>
      )}

      {/* Compétences */}
      {data.skills.length > 0 && (
        <>
          <Title level={3}>Compétences</Title>
          <Space wrap>
            {data.skills.map((skill, index) => (
              <Tag 
                key={index}
                color="blue"
                style={{ padding: '5px 10px', marginBottom: '8px' }}
              >
                {skill.name} - {skill.level}
              </Tag>
            ))}
          </Space>
          <Divider />
        </>
      )}

      {/* Langues */}
      {data.languages.length > 0 && (
        <>
          <Title level={3}>Langues</Title>
          <Space wrap>
            {data.languages.map((lang, index) => (
              <Tag 
                key={index}
                color="green"
                style={{ padding: '5px 10px', marginBottom: '8px' }}
              >
                {lang.name} - {lang.level}
              </Tag>
            ))}
          </Space>
          <Divider />
        </>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <>
          <Title level={3}>Certifications</Title>
          <ul>
            {data.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
          <Divider />
        </>
      )}

      {/* Centres d'intérêt */}
      {data.interests && data.interests.length > 0 && (
        <>
          <Title level={3}>Centres d'intérêt</Title>
          <Space wrap>
            {data.interests.map((interest, index) => (
              <Tag key={index}>{interest}</Tag>
            ))}
          </Space>
        </>
      )}
    </div>
  );
};

export default ModernTemplate; 