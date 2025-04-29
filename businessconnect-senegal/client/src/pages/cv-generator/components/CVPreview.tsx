import React from 'react';
import { Card, Typography, Divider, Rate, Tag } from 'antd';
import { CVData, Template, CustomizationOptions } from '../types';

const { Title, Text } = Typography;

interface CVPreviewProps {
  data: CVData;
  template: Template;
  customization: CustomizationOptions;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, template, customization }) => {
  const { personalInfo, summary, experience, education, skills, languages } = data;
  const { primaryColor, secondaryColor, fontFamily, fontSize, spacing } = customization;

  const containerStyle = {
    fontFamily,
    fontSize,
    padding: spacing === 'compact' ? 16 : spacing === 'comfortable' ? 24 : 32,
  };

  const sectionStyle = {
    marginBottom: spacing === 'compact' ? 16 : spacing === 'comfortable' ? 24 : 32,
  };

  const titleStyle = {
    color: primaryColor,
    marginBottom: spacing === 'compact' ? 8 : spacing === 'comfortable' ? 16 : 24,
  };

  return (
    <Card style={containerStyle}>
      <div style={sectionStyle}>
        <Title level={2} style={titleStyle}>
          {personalInfo.firstName} {personalInfo.lastName}
        </Title>
        <Title level={4} style={{ color: secondaryColor }}>
          {personalInfo.title}
        </Title>
        <Text>{personalInfo.email} | {personalInfo.phone}</Text>
        {personalInfo.address && <Text> | {personalInfo.address}</Text>}
      </div>

      <Divider style={{ borderColor: primaryColor }} />

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Résumé professionnel</Title>
        <Text>{summary}</Text>
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Expérience professionnelle</Title>
        {experience.map((exp, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <Text strong>{exp.position}</Text>
            <br />
            <Text>{exp.company}</Text>
            <br />
            <Text type="secondary">
              {exp.startDate.toLocaleDateString()} - {exp.endDate ? exp.endDate.toLocaleDateString() : 'Présent'}
            </Text>
            {exp.description && (
              <>
                <br />
                <Text>{exp.description}</Text>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Formation</Title>
        {education.map((edu, index) => (
          <div key={index} style={{ marginBottom: 16 }}>
            <Text strong>{edu.degree}</Text>
            <br />
            <Text>{edu.school}</Text>
            <br />
            <Text type="secondary">
              {edu.startDate.toLocaleDateString()} - {edu.endDate ? edu.endDate.toLocaleDateString() : 'Présent'}
            </Text>
            {edu.description && (
              <>
                <br />
                <Text>{edu.description}</Text>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Compétences</Title>
        {skills.map((skill, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <Text>{skill.name}</Text>
            <Rate disabled defaultValue={skill.level} style={{ marginLeft: 8 }} />
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <Title level={4} style={titleStyle}>Langues</Title>
        {languages.map((lang, index) => (
          <Tag key={index} color={primaryColor} style={{ marginBottom: 8 }}>
            {lang.name} - {lang.level}
          </Tag>
        ))}
      </div>
    </Card>
  );
};

export default CVPreview; 