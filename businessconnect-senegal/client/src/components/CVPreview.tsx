import React from 'react';
import { Typography, Space, Avatar, Tag, Divider, Rate } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkedinOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { CVData, CustomizationOptions } from '../types/cv';
import { formatDate } from '../utils/dateUtils';

const { Title, Text, Paragraph } = Typography;

interface CVPreviewProps {
  data: CVData;
  customization?: CustomizationOptions;
  className?: string;
}

const CVPreview: React.FC<CVPreviewProps> = ({ 
  data, 
  customization = {
    primaryColor: '#1890ff',
    secondaryColor: '#52c41a',
    fontFamily: 'Arial',
    fontSize: '14px',
    spacing: 'comfortable'
  },
  className 
}) => {
  const containerStyle = {
    padding: '20px',
    fontFamily: customization.fontFamily,
    fontSize: customization.fontSize,
  };

  const sectionStyle = {
    marginBottom: customization.spacing === 'compact' ? '20px' : 
                 customization.spacing === 'comfortable' ? '30px' : '40px'
  };

  const titleStyle = {
    color: customization.primaryColor,
    marginBottom: customization.spacing === 'compact' ? '10px' : 
                 customization.spacing === 'comfortable' ? '15px' : '20px'
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={{ textAlign: 'center', ...sectionStyle }}>
        {data.personalInfo.photo && (
          <Avatar
            size={150}
            src={data.personalInfo.photo}
            style={{ marginBottom: '10px' }}
          >
            {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
          </Avatar>
        )}
        <Title level={2} style={titleStyle}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </Title>
        <Title level={4} style={{ color: customization.secondaryColor }}>
          {data.personalInfo.title}
        </Title>
        <Space direction="vertical" align="center">
          <Text>
            <MailOutlined style={{ marginRight: '8px' }} />
            {data.personalInfo.email}
          </Text>
          <Text>
            <PhoneOutlined style={{ marginRight: '8px' }} />
            {data.personalInfo.phone}
          </Text>
          {data.personalInfo.address && (
            <Text>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              {data.personalInfo.address}
            </Text>
          )}
          {data.personalInfo.linkedin && (
            <Text>
              <LinkedinOutlined style={{ marginRight: '8px' }} />
              {data.personalInfo.linkedin}
            </Text>
          )}
          {data.personalInfo.portfolio && (
            <Text>
              <GlobalOutlined style={{ marginRight: '8px' }} />
              {data.personalInfo.portfolio}
            </Text>
          )}
        </Space>
      </div>

      {data.summary && (
        <div style={sectionStyle}>
          <Title level={4} style={titleStyle}>Résumé professionnel</Title>
          <Paragraph>{data.summary}</Paragraph>
        </div>
      )}

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Compétences</Title>
        <Space wrap>
          {data.skills.map(skill => (
            <div key={skill.id} style={{ marginBottom: '10px', width: '100%' }}>
              <Space>
                <Text strong>{skill.name}</Text>
                <Rate disabled defaultValue={skill.level} />
                {skill.category && (
                  <Tag color={customization.primaryColor}>{skill.category}</Tag>
                )}
              </Space>
            </div>
          ))}
        </Space>
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Langues</Title>
        <Space wrap>
          {data.languages.map(language => (
            <Tag 
              key={language.id} 
              color={customization.secondaryColor}
              style={{ padding: '4px 8px', marginBottom: '8px' }}
            >
              {language.name} - {language.level}
            </Tag>
          ))}
        </Space>
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Expérience professionnelle</Title>
        {data.experience.map(exp => (
          <div key={exp.id} style={{ marginBottom: '20px' }}>
            <Title level={5} style={{ marginBottom: '5px' }}>{exp.title}</Title>
            <Text strong>{exp.company}</Text>
            {exp.location && (
              <Text type="secondary"> - {exp.location}</Text>
            )}
            <br />
            <Text type="secondary">
              {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate || '')}
            </Text>
            <ul style={{ marginTop: '10px' }}>
              {exp.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
            {exp.achievements && exp.achievements.length > 0 && (
              <>
                <Text strong>Réalisations :</Text>
                <ul>
                  {exp.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Formation</Title>
        {data.education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '20px' }}>
            <Title level={5} style={{ marginBottom: '5px' }}>
              {edu.degree}
              {edu.field && <span> en {edu.field}</span>}
            </Title>
            <Text strong>{edu.school}</Text>
            {edu.location && (
              <Text type="secondary"> - {edu.location}</Text>
            )}
            <br />
            <Text type="secondary">
              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
            </Text>
            {edu.description && <Paragraph>{edu.description}</Paragraph>}
            {edu.achievements && edu.achievements.length > 0 && (
              <>
                <Text strong>Réalisations :</Text>
                <ul>
                  {edu.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>

      {data.certifications && data.certifications.length > 0 && (
        <div style={sectionStyle}>
          <Title level={4} style={titleStyle}>Certifications</Title>
          {data.certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: '10px' }}>
              <Text strong>{cert.name}</Text>
              <br />
              <Text type="secondary">
                {cert.issuer} - {formatDate(cert.date)}
              </Text>
            </div>
          ))}
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div style={sectionStyle}>
          <Title level={4} style={titleStyle}>Projets</Title>
          {data.projects.map(project => (
            <div key={project.id} style={{ marginBottom: '20px' }}>
              <Title level={5} style={{ marginBottom: '5px' }}>{project.title}</Title>
              <Paragraph>{project.description}</Paragraph>
              {project.technologies && (
                <Space wrap>
                  {project.technologies.map((tech, index) => (
                    <Tag key={index} color={customization.primaryColor}>{tech}</Tag>
                  ))}
                </Space>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CVPreview; 