import React from 'react';
import { Avatar, Typography, Divider, Tag, Space } from 'antd';
import { CVData, CustomizationOptions, Template } from '../../../types/cv';

const { Title, Text, Paragraph } = Typography;

interface CVPreviewProps {
  data: CVData;
  template: Template;
  customization: CustomizationOptions;
  isSubscribed: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, template, customization, isSubscribed }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
      padding: 32,
      maxWidth: 900,
      margin: '0 auto',
      fontFamily: customization.fontFamily,
      color: customization.primaryColor
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Avatar size={96} src={data.personalInfo.photo} style={{ background: customization.secondaryColor, fontSize: 32 }}>
          {data.personalInfo.firstName?.[0]}{data.personalInfo.lastName?.[0]}
        </Avatar>
        <div>
          <Title level={2} style={{ margin: 0 }}>{data.personalInfo.firstName} {data.personalInfo.lastName}</Title>
          <Text type="secondary">{data.personalInfo.title}</Text>
          <div style={{ marginTop: 8 }}>
            <Tag color="blue">{template.name}</Tag>
            {isSubscribed ? <Tag color="green">Abonné</Tag> : <Tag color="red">Non abonné</Tag>}
          </div>
        </div>
      </div>
      <Divider />
      <Title level={4}>À propos</Title>
      <Paragraph>{data.summary || data.personalInfo.summary}</Paragraph>
      <Divider />
      <Title level={4}>Expérience professionnelle</Title>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {data.experience.map((exp, idx) => (
          <div key={idx}>
            <Text strong>{exp.title}</Text> chez <Text>{exp.company}</Text> <br />
            <Text type="secondary">{exp.startDate} - {exp.endDate || 'Présent'}</Text>
            <Paragraph>{exp.description}</Paragraph>
          </div>
        ))}
      </Space>
      <Divider />
      <Title level={4}>Formation</Title>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {data.education.map((edu, idx) => (
          <div key={idx}>
            <Text strong>{edu.degree}</Text> à <Text>{edu.institution}</Text> <br />
            <Text type="secondary">{edu.startDate} - {edu.endDate || 'Présent'}</Text>
            <Paragraph>{edu.description}</Paragraph>
          </div>
        ))}
      </Space>
      <Divider />
      <Title level={4}>Compétences</Title>
      <Space wrap>
        {data.skills.map((skill, idx) => (
          <Tag key={idx} color="geekblue">{skill.name}</Tag>
        ))}
      </Space>
      {data.languages && data.languages.length > 0 && (
        <>
          <Divider />
          <Title level={4}>Langues</Title>
          <Space wrap>
            {data.languages.map((lang, idx) => (
              <Tag key={idx} color="purple">{lang.name} ({lang.level})</Tag>
            ))}
          </Space>
        </>
      )}
      {data.certifications && data.certifications.length > 0 && (
        <>
          <Divider />
          <Title level={4}>Certifications</Title>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            {data.certifications.map((cert, idx) => (
              typeof cert === 'string' ? (
                <Tag key={idx} color="gold">{cert}</Tag>
              ) : (
                <div key={idx}>
                  <Text strong>{cert.name}</Text> - <Text>{cert.issuer}</Text> <br />
                  <Text type="secondary">{cert.date}</Text>
                  {cert.description && <Paragraph>{cert.description}</Paragraph>}
                </div>
              )
            ))}
          </Space>
        </>
      )}
    </div>
  );
};

export default CVPreview; 