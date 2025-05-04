import React from 'react';
import { Typography, Space, Avatar, Tag, Divider, Rate } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LinkedinOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { CVData, CustomizationOptions, Experience, Education } from '../types/cv';
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

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant':
        return 'blue';
      case 'Intermédiaire':
        return 'green';
      case 'Avancé':
        return 'gold';
      case 'Expert':
        return 'purple';
      default:
        return 'default';
    }
  };

  const renderExperience = (exp: Experience) => (
    <div key={exp.id} style={{ marginBottom: '20px' }}>
      <Title level={5} style={{ marginBottom: '5px' }}>{exp.position}</Title>
      <Text strong>{exp.company}</Text>
      <br />
      <Text type="secondary">
        {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate || '')}
      </Text>
      <Paragraph>{exp.description}</Paragraph>
      {exp.achievements && (
        <ul>
          {exp.achievements.map((achievement: string, index: number) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderEducation = (edu: Education) => (
    <div key={edu.id} style={{ marginBottom: '20px' }}>
      <Title level={5} style={{ marginBottom: '5px' }}>{edu.degree}</Title>
      <Text strong>{edu.institution}</Text>
      <br />
      <Text type="secondary">
        {formatDate(edu.startDate)} - {edu.current ? 'Présent' : formatDate(edu.endDate || '')}
      </Text>
      {edu.description && <Paragraph>{edu.description}</Paragraph>}
    </div>
  );

  return (
    <div style={containerStyle} className={className}>
      <div style={{ textAlign: 'center', ...sectionStyle }}>
        {data.personalInfo.photo && (
          <Avatar
            size={150}
            src={data.personalInfo.photo}
            style={{ marginBottom: '10px' }}
          />
        )}
        <Title level={2} style={titleStyle}>
          {data.personalInfo.fullName}
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
          {data.personalInfo.location && (
            <Text>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              {data.personalInfo.location}
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
        <Title level={4} style={titleStyle}>Expérience professionnelle</Title>
        {data.experience.map(renderExperience)}
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Formation</Title>
        {data.education.map(renderEducation)}
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Compétences</Title>
        <Space wrap>
          {data.skills.map(skill => (
            <div key={skill.id} style={{ marginBottom: '10px', width: '100%' }}>
              <Space>
                <Text strong>{skill.name}</Text>
                <Tag color={getSkillLevelColor(skill.level)}>
                  {skill.level}
                </Tag>
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

      {data.certifications && data.certifications.length > 0 && (
        <div style={sectionStyle}>
          <Title level={4} style={titleStyle}>Certifications</Title>
          {data.certifications.map((cert, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <Text>{cert}</Text>
            </div>
          ))}
        </div>
      )}

      {data.interests && data.interests.length > 0 && (
        <div style={sectionStyle}>
          <Title level={4} style={titleStyle}>Centres d'intérêt</Title>
          <Space wrap>
            {data.interests.map((interest, index) => (
              <Tag key={index}>{interest}</Tag>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
};

export default CVPreview; 