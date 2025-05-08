import React, { useRef } from 'react';
import { Typography, Card, Row, Col, Tag, Divider, Rate, Progress, Button, Space, message } from 'antd';
import { DownloadOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
import { CVData, Template, CustomizationOptions } from '../types';
import { exportCV } from '../services/documentExport';

const { Title, Text, Paragraph } = Typography;

interface CVPreviewProps {
  data: CVData;
  template: Template;
  customization: CustomizationOptions;
  isSubscribed: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, template, customization, isSubscribed }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: 'pdf' | 'docx') => {
    if (!isSubscribed) {
      message.warning('Cette fonctionnalité est réservée aux abonnés Premium');
      return;
    }

    try {
      if (!previewRef.current) {
        message.error('Erreur : impossible de générer l\'aperçu');
        return;
      }

      message.loading('Export en cours...', 0);
      await exportCV(data, template, customization, previewRef, format);
      message.destroy();
      message.success(`CV exporté avec succès en format ${format.toUpperCase()}`);
    } catch (error) {
      message.destroy();
      message.error('Erreur lors de l\'export : ' + (error as Error).message);
    }
  };

  const getSpacing = () => {
    switch (customization.spacing) {
      case 'compact':
        return '16px';
      case 'comfortable':
        return '24px';
      case 'spacious':
        return '32px';
      default:
        return '24px';
    }
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Boutons d'export */}
        <Space>
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            onClick={() => handleExport('pdf')}
            disabled={!isSubscribed}
          >
            Exporter en PDF
          </Button>
          <Button
            icon={<FileWordOutlined />}
            onClick={() => handleExport('docx')}
            disabled={!isSubscribed}
          >
            Exporter en Word
          </Button>
          {!isSubscribed && (
            <Text type="warning">
              L'export est réservé aux abonnés Premium
            </Text>
          )}
        </Space>

        {/* Aperçu du CV */}
        <div
          ref={previewRef}
          style={{
            padding: getSpacing(),
            backgroundColor: '#ffffff',
            fontFamily: customization.fontFamily,
            fontSize: customization.fontSize,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '8px',
          }}
        >
          {/* En-tête */}
          <div style={{ marginBottom: getSpacing() }}>
            <Title
              level={2}
              style={{
                color: customization.primaryColor,
                marginBottom: '8px'
              }}
            >
              {`${data.personalInfo.firstName} ${data.personalInfo.lastName}`}
            </Title>
            <Title
              level={3}
              style={{
                color: customization.secondaryColor,
                marginTop: 0
              }}
            >
              {data.personalInfo.title}
            </Title>
            <Space split={<Divider type="vertical" />}>
              <Text>{data.personalInfo.email}</Text>
              <Text>{data.personalInfo.phone}</Text>
              <Text>{data.personalInfo.address}</Text>
            </Space>
          </div>

          {/* Résumé */}
          {data.personalInfo.summary && (
            <div style={{ marginBottom: getSpacing() }}>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Résumé professionnel
              </Title>
              <Paragraph>{data.personalInfo.summary}</Paragraph>
            </div>
          )}

          {/* Expérience */}
          {data.experience.length > 0 && (
            <div style={{ marginBottom: getSpacing() }}>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Expérience professionnelle
              </Title>
              {data.experience.map((exp, index) => (
                <div key={exp.id} style={{ marginBottom: '16px' }}>
                  <Title level={5} style={{ marginBottom: '4px' }}>
                    {exp.title}
                  </Title>
                  <Text strong>{exp.company}</Text>
                  <br />
                  <Text type="secondary">
                    {exp.location} • {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                  </Text>
                  <Paragraph style={{ marginTop: '8px' }}>
                    {exp.description}
                  </Paragraph>
                  {exp.achievements.length > 0 && (
                    <ul style={{ marginTop: '8px' }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Formation */}
          {data.education.length > 0 && (
            <div style={{ marginBottom: getSpacing() }}>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Formation
              </Title>
              {data.education.map((edu, index) => (
                <div key={edu.id} style={{ marginBottom: '16px' }}>
                  <Title level={5} style={{ marginBottom: '4px' }}>
                    {edu.degree}
                  </Title>
                  <Text strong>{edu.institution}</Text>
                  <br />
                  <Text type="secondary">
                    {edu.location} • {edu.startDate} - {edu.endDate}
                  </Text>
                  {edu.description && (
                    <Paragraph style={{ marginTop: '8px' }}>
                      {edu.description}
                    </Paragraph>
                  )}
                  {edu.achievements.length > 0 && (
                    <ul style={{ marginTop: '8px' }}>
                      {edu.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Compétences */}
          {data.skills.length > 0 && (
            <div style={{ marginBottom: getSpacing() }}>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Compétences
              </Title>
              <Row gutter={[16, 16]}>
                {data.skills.map((skill) => (
                  <Col key={skill.id} span={12}>
                    <div>
                      <Text strong>{skill.name}</Text>
                      <Progress
                        percent={skill.level * 25}
                        strokeColor={customization.secondaryColor}
                        showInfo={false}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Langues */}
          {data.languages.length > 0 && (
            <div>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Langues
              </Title>
              <Row gutter={[16, 16]}>
                {data.languages.map((lang) => (
                  <Col key={lang.id} span={12}>
                    <Space>
                      <Text strong>{lang.name}</Text>
                      <Tag color={customization.secondaryColor}>
                        {lang.level}
                      </Tag>
                    </Space>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div style={{ marginBottom: getSpacing() }}>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Certifications
              </Title>
              {data.certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '16px' }}>
                  <Title level={5} style={{ marginBottom: '4px' }}>
                    {cert.name}
                  </Title>
                  <Text strong>{cert.issuer}</Text>
                  <br />
                  <Text type="secondary">{cert.date}</Text>
                  {cert.description && (
                    <Paragraph style={{ marginTop: '8px' }}>
                      {cert.description}
                    </Paragraph>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projets */}
          {data.projects.length > 0 && (
            <div style={{ marginBottom: getSpacing() }}>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Projets
              </Title>
              {data.projects.map((project) => (
                <div key={project.id} style={{ marginBottom: '16px' }}>
                  <Title level={5} style={{ marginBottom: '4px' }}>
                    {project.name}
                  </Title>
                  <Text type="secondary">
                    {project.startDate} - {project.endDate || 'En cours'}
                  </Text>
                  <Paragraph style={{ marginTop: '8px' }}>
                    {project.description}
                  </Paragraph>
                  {project.technologies.length > 0 && (
                    <Space size={[0, 8]} wrap>
                      {project.technologies.map((tech, i) => (
                        <Tag key={i} color={customization.secondaryColor}>
                          {tech}
                        </Tag>
                      ))}
                    </Space>
                  )}
                  {project.url && (
                    <div style={{ marginTop: '8px' }}>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        Voir le projet
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Centres d'intérêt */}
          {data.interests.length > 0 && (
            <div>
              <Title level={4} style={{ color: customization.primaryColor }}>
                Centres d'intérêt
              </Title>
              {data.interests.map((interest) => (
                <div key={interest.id} style={{ marginBottom: '16px' }}>
                  <Text strong>{interest.name}</Text>
                  {interest.description && (
                    <Paragraph style={{ marginTop: '4px' }}>
                      {interest.description}
                    </Paragraph>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Space>
    </div>
  );
};

export default CVPreview; 