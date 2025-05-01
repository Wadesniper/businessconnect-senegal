import React from 'react';
import { Avatar, Progress, Tag, Typography, Space, Rate } from 'antd';
import { GithubOutlined, LinkedinOutlined, GlobalOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { CVData } from '../../types';
import { formatDate } from '../../../../utils/dateUtils';

const { Title, Text, Paragraph } = Typography;

interface TechModernTemplateProps {
  data: CVData;
}

const TechModernTemplate: React.FC<TechModernTemplateProps> = ({ data }) => {
  return (
    <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
      {/* Sidebar */}
      <aside style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar
            size={150}
            src={data.personalInfo.photo}
            style={{ marginBottom: '10px' }}
          >
            {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
          </Avatar>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            {data.personalInfo.title}
          </Text>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: 'white' }}>Contact</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

        <div style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: 'white' }}>Compétences</Title>
          {data.skills.map(skill => (
            <div key={skill.id} style={{ marginBottom: '10px' }}>
              <Text style={{ color: 'white', display: 'block', marginBottom: '5px' }}>
                {skill.name}
              </Text>
              <Progress
                percent={skill.level * 20}
                showInfo={false}
                strokeColor="var(--secondary-color)"
                trailColor="rgba(255, 255, 255, 0.2)"
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Title level={4} style={{ color: 'white' }}>Langues</Title>
          {data.languages.map(language => (
            <div key={language.id} style={{ marginBottom: '10px' }}>
              <Text style={{ color: 'white', display: 'block' }}>
                {language.name} - {language.level}
              </Text>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        <div style={{ marginBottom: '30px' }}>
          <Title level={4}>À propos</Title>
          <Paragraph>{data.summary}</Paragraph>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <Title level={4}>Expérience professionnelle</Title>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '20px' }}>
              <Title level={5} style={{ marginBottom: '5px' }}>{exp.title}</Title>
              <Text strong>{exp.company}</Text>
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

        <div style={{ marginBottom: '30px' }}>
          <Title level={4}>Formation</Title>
          {data.education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '20px' }}>
              <Title level={5} style={{ marginBottom: '5px' }}>
                {edu.degree}
                {edu.field && <span> en {edu.field}</span>}
              </Title>
              <Text strong>{edu.school}</Text>
              <br />
              <Text type="secondary">
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
              </Text>
              {edu.description && (
                <p style={{ marginTop: '10px' }}>{edu.description}</p>
              )}
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

        {data.certifications.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <Title level={4}>Certifications</Title>
            {data.certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '10px' }}>
                <Text strong>{cert.name}</Text>
                <br />
                <Text type="secondary">{cert.issuer} - {new Date(cert.date).toLocaleDateString()}</Text>
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <Title level={4}>Projets</Title>
            {data.projects.map(project => (
              <div key={project.id} style={{ marginBottom: '20px' }}>
                <Title level={5} style={{ marginBottom: '5px' }}>{project.name}</Title>
                <Paragraph>{project.description}</Paragraph>
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
              {data.interests.map((interest, index) => (
                <Tag key={index}>{interest}</Tag>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TechModernTemplate; 