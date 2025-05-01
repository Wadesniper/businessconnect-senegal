import React from 'react';
import { Avatar, Typography, Card, Progress, Tag, Timeline, Row, Col } from 'antd';
import { CodeOutlined, CloudOutlined, TeamOutlined, TrophyOutlined, BookOutlined } from '@ant-design/icons';
import './TechTemplate.css';

const { Title, Text } = Typography;

interface TechTemplateProps {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
    linkedin?: string;
    github?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string[];
    technologies: string[];
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

const TechTemplate: React.FC<TechTemplateProps> = ({
  personalInfo,
  experience,
  skills,
  education,
  projects,
}) => {
  return (
    <div className="tech-cv-template">
      <header className="tech-header">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8} className="tech-avatar-container">
            <Avatar size={180} src={personalInfo.avatar} className="tech-avatar" />
          </Col>
          <Col xs={24} md={16}>
            <Title level={1} className="tech-name">{personalInfo.name}</Title>
            <Title level={2} className="tech-title">{personalInfo.title}</Title>
            <div className="tech-contact-info">
              <Text><i className="fas fa-envelope"></i> {personalInfo.email}</Text>
              <Text><i className="fas fa-phone"></i> {personalInfo.phone}</Text>
              <Text><i className="fas fa-map-marker-alt"></i> {personalInfo.location}</Text>
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i> GitHub
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              )}
            </div>
          </Col>
        </Row>
      </header>

      <div className="tech-content">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <section className="tech-section">
              <div className="tech-section-header">
                <CodeOutlined className="tech-section-icon" />
                <Title level={3}>Expérience Professionnelle</Title>
              </div>
              <Timeline>
                {experience.map((exp, index) => (
                  <Timeline.Item key={index} dot={<div className="tech-timeline-dot" />}>
                    <Card className="tech-card">
                      <Title level={4} className="tech-experience-title">{exp.title}</Title>
                      <Text className="tech-company">{exp.company}</Text>
                      <br />
                      <Text className="tech-date">{exp.period}</Text>
                      <ul className="tech-description-list">
                        {exp.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                      <div className="tech-technologies">
                        {exp.technologies.map((tech, i) => (
                          <Tag key={i} color="blue">{tech}</Tag>
                        ))}
                      </div>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </section>

            <section className="tech-section">
              <div className="tech-section-header">
                <CloudOutlined className="tech-section-icon" />
                <Title level={3}>Projets</Title>
              </div>
              <Row gutter={[16, 16]}>
                {projects.map((project, index) => (
                  <Col xs={24} md={12} key={index}>
                    <Card className="tech-card tech-project-card">
                      <Title level={4}>{project.name}</Title>
                      <Text>{project.description}</Text>
                      <div className="tech-technologies">
                        {project.technologies.map((tech, i) => (
                          <Tag key={i} color="blue">{tech}</Tag>
                        ))}
                      </div>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          Voir le projet
                        </a>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>
          </Col>

          <Col xs={24} lg={8}>
            <section className="tech-section">
              <div className="tech-section-header">
                <TeamOutlined className="tech-section-icon" />
                <Title level={3}>Compétences</Title>
              </div>
              <Card className="tech-card">
                {skills.map((skill, index) => (
                  <div key={index} className="tech-skill-item">
                    <Text>{skill.name}</Text>
                    <Progress percent={skill.level} showInfo={false} strokeColor="#1890ff" />
                  </div>
                ))}
              </Card>
            </section>

            <section className="tech-section">
              <div className="tech-section-header">
                <BookOutlined className="tech-section-icon" />
                <Title level={3}>Formation</Title>
              </div>
              {education.map((edu, index) => (
                <Card key={index} className="tech-card" style={{ marginBottom: 16 }}>
                  <Title level={4}>{edu.degree}</Title>
                  <Text strong>{edu.school}</Text>
                  <br />
                  <Text className="tech-date">{edu.period}</Text>
                  <div className="tech-education-description">
                    <Text>{edu.description}</Text>
                  </div>
                </Card>
              ))}
            </section>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TechTemplate; 