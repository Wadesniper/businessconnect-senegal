import React from 'react';
import { Avatar, Progress, Tag, Typography, Space, Rate } from 'antd';
import { GithubOutlined, LinkedinOutlined, GlobalOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { CVData } from '../../../../types/cv';
import { formatDate } from '../../../../utils/dateUtils';

const { Title, Text, Paragraph } = Typography;

interface TechModernTemplateProps {
  data: CVData;
  isMiniature?: boolean;
}

const TechModernTemplate: React.FC<TechModernTemplateProps> = ({ data, isMiniature = false }) => {
  return (
    <div style={{
      padding: isMiniature ? 8 : 20,
      display: 'grid',
      gridTemplateColumns: isMiniature ? '1fr' : '300px 1fr',
      gap: isMiniature ? 8 : 20,
      fontSize: isMiniature ? 10 : 16,
      borderRadius: isMiniature ? 8 : 16,
      background: '#fff',
      minHeight: isMiniature ? 0 : undefined,
    }}>
      {/* Sidebar */}
      <aside style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: isMiniature ? 8 : 20, borderRadius: isMiniature ? 8 : 16 }}>
        <div style={{ textAlign: 'center', marginBottom: isMiniature ? 8 : 20 }}>
          <Avatar
            size={isMiniature ? 48 : 150}
            src={data.personalInfo.photo || undefined}
            style={{ marginBottom: isMiniature ? 4 : 10 }}
          >
            {data.personalInfo.firstName?.[0]}{data.personalInfo.lastName?.[0]}
          </Avatar>
          <Title level={isMiniature ? 5 : 3} style={{ color: 'white', margin: 0, fontSize: isMiniature ? 14 : 24 }}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: isMiniature ? 10 : 16 }}>
            {data.personalInfo.title}
          </Text>
        </div>

        <div style={{ marginBottom: isMiniature ? 8 : 20 }}>
          <Title level={isMiniature ? 5 : 4} style={{ color: 'white', fontSize: isMiniature ? 11 : 18 }}>Contact</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMiniature ? 4 : 10, fontSize: isMiniature ? 9 : 14 }}>
            <Text style={{ color: 'white' }}>
              <MailOutlined style={{ marginRight: '8px' }} />
              {data.personalInfo.email}
            </Text>
            <Text style={{ color: 'white' }}>
              <PhoneOutlined style={{ marginRight: '8px' }} />
              {data.personalInfo.phone}
            </Text>
            <Text style={{ color: 'white' }}>
              <EnvironmentOutlined style={{ marginRight: '8px' }} />
              {data.personalInfo.address}
            </Text>
            {data.personalInfo.linkedin && (
              <Text style={{ color: 'white' }}>
                <LinkedinOutlined style={{ marginRight: '8px' }} />
                {data.personalInfo.linkedin}
              </Text>
            )}
            {data.personalInfo.portfolio && (
              <Text style={{ color: 'white' }}>
                <GlobalOutlined style={{ marginRight: '8px' }} />
                {data.personalInfo.portfolio}
              </Text>
            )}
          </div>
        </div>

        <div style={{ marginBottom: isMiniature ? 8 : 20 }}>
          <Title level={isMiniature ? 5 : 4} style={{ color: 'white', fontSize: isMiniature ? 11 : 18 }}>Compétences</Title>
          {data.skills.map(skill => (
            <div key={skill.id} style={{ marginBottom: isMiniature ? 4 : 10 }}>
              <Text style={{ color: 'white', display: 'block', marginBottom: isMiniature ? 2 : 5, fontSize: isMiniature ? 10 : 16 }}>
                {skill.name}
              </Text>
              <Progress
                percent={typeof skill.level === 'number' ? skill.level * 20 : skill.level === 'Débutant' ? 20 : skill.level === 'Intermédiaire' ? 40 : skill.level === 'Avancé' ? 60 : skill.level === 'Expert' ? 80 : skill.level === 'Maître' ? 100 : 0}
                showInfo={false}
                strokeColor="var(--secondary-color)"
                trailColor="rgba(255, 255, 255, 0.2)"
                style={{ height: isMiniature ? 4 : 8 }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: isMiniature ? 8 : 20 }}>
          <Title level={isMiniature ? 5 : 4} style={{ color: 'white', fontSize: isMiniature ? 11 : 18 }}>Langues</Title>
          {data.languages.map(language => (
            <div key={language.id} style={{ marginBottom: isMiniature ? 4 : 10 }}>
              <Text style={{ color: 'white', display: 'block', fontSize: isMiniature ? 10 : 16 }}>
                {language.name} - {language.level}
              </Text>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: isMiniature ? 8 : 20 }}>
        <div style={{ marginBottom: isMiniature ? 10 : 30 }}>
          <Title level={isMiniature ? 5 : 4}>À propos</Title>
          <Paragraph style={{ fontSize: isMiniature ? 10 : 16 }}>{data.summary}</Paragraph>
        </div>

        <div style={{ marginBottom: isMiniature ? 10 : 30 }}>
          <Title level={isMiniature ? 5 : 4}>Expérience professionnelle</Title>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: isMiniature ? 6 : 20 }}>
              <Title level={isMiniature ? 5 : 5} style={{ marginBottom: isMiniature ? 2 : 5, fontSize: isMiniature ? 10 : 16 }}>{exp.title}</Title>
              <Text strong style={{ fontSize: isMiniature ? 9 : 14 }}>{exp.company}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: isMiniature ? 9 : 12 }}>
                {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate || '')}
              </Text>
              <ul style={{ marginTop: isMiniature ? 4 : 10, fontSize: isMiniature ? 9 : 13 }}>
                {exp.description && <li>{exp.description}</li>}
              </ul>
              {exp.achievements && exp.achievements.length > 0 && (
                <>
                  <Text strong style={{ fontSize: isMiniature ? 9 : 13 }}>Réalisations :</Text>
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

        <div style={{ marginBottom: isMiniature ? 10 : 30 }}>
          <Title level={isMiniature ? 5 : 4}>Formation</Title>
          {data.education.map(edu => (
            <div key={edu.id} style={{ marginBottom: isMiniature ? 6 : 20 }}>
              <Title level={isMiniature ? 5 : 5} style={{ marginBottom: isMiniature ? 2 : 5, fontSize: isMiniature ? 10 : 16 }}>{edu.degree}</Title>
              <Text strong style={{ fontSize: isMiniature ? 9 : 14 }}>{edu.institution}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: isMiniature ? 9 : 12 }}>
                {typeof edu.startDate === 'string'
                  ? formatDate(edu.startDate)
                  : edu.startDate
                    ? formatDate(String(edu.startDate))
                    : ''}
                {' - '}
                {typeof edu.endDate === 'string'
                  ? formatDate(edu.endDate)
                  : edu.endDate
                    ? formatDate(String(edu.endDate))
                    : ''}
              </Text>
              {edu.description && (
                <p style={{ marginTop: isMiniature ? 4 : 10, fontSize: isMiniature ? 9 : 13 }}>{edu.description}</p>
              )}
              {edu.achievements && edu.achievements.length > 0 && (
                <>
                  <Text strong style={{ fontSize: isMiniature ? 9 : 13 }}>Réalisations :</Text>
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

        {data.certifications.length > 0 && (
          <div style={{ marginBottom: isMiniature ? 8 : 30 }}>
            <Title level={isMiniature ? 5 : 4}>Certifications</Title>
            {data.certifications.map((cert, index) => {
              if (typeof cert === 'string') {
                return (
                  <div key={index} style={{ marginBottom: isMiniature ? 4 : 10 }}>
                    <Text strong style={{ fontSize: isMiniature ? 10 : 16 }}>{cert}</Text>
                  </div>
                );
              } else {
                return (
                  <div key={cert.id || index} style={{ marginBottom: isMiniature ? 4 : 10 }}>
                    <Text strong style={{ fontSize: isMiniature ? 10 : 16 }}>{cert.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: isMiniature ? 9 : 13 }}>{cert.issuer} - {cert.date}</Text>
                    {cert.description && (
                      <Paragraph style={{ marginTop: isMiniature ? 4 : 8, fontSize: isMiniature ? 9 : 13 }}>{cert.description}</Paragraph>
                    )}
                  </div>
                );
              }
            })}
          </div>
        )}

        {data.projects.length > 0 && (
          <div style={{ marginBottom: isMiniature ? 8 : 30 }}>
            <Title level={isMiniature ? 5 : 4}>Projets</Title>
            {data.projects.map(project => (
              <div key={project.id} style={{ marginBottom: isMiniature ? 6 : 20 }}>
                <Title level={isMiniature ? 5 : 5} style={{ marginBottom: isMiniature ? 2 : 5, fontSize: isMiniature ? 10 : 16 }}>{project.name}</Title>
                <Paragraph style={{ fontSize: isMiniature ? 9 : 13 }}>{project.description}</Paragraph>
                <div>
                  {project.technologies.map((tech, index) => (
                    <Tag key={index} color="blue">{tech}</Tag>
                  ))}
                </div>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <GithubOutlined /> Voir le projet
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {data.interests.length > 0 && (
          <div>
            <Title level={4}>Centres d'intérêt</Title>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {data.interests.map((interest, index) => {
                if (typeof interest === 'string') {
                  return <Tag key={index}>{interest}</Tag>;
                } else {
                  return <Tag key={interest.id || index}>{interest.name}</Tag>;
                }
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TechModernTemplate; 