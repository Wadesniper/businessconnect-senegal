import React from 'react';
import { Card, Typography, Row, Col, Avatar, Tag, Divider } from 'antd';
import { CVTemplateModel, CVData } from '../../types/cv';

interface CVPreviewProps {
  data: CVData;
  template: CVTemplateModel;
}

const CVPreview: React.FC<CVPreviewProps> = ({ data, template }) => {
  const { personalInfo, summary, experience, education, skills, languages, certifications, projects, interests } = data;

  return (
    <Card style={{ maxWidth: 900, margin: '0 auto', padding: 32, border: '2px solid #1890ff' }}>
      <Row gutter={24} align="middle">
        <Col span={6} style={{ textAlign: 'center' }}>
          <Avatar src={personalInfo.photo || template.photo} size={100} />
          <Typography.Title level={4} style={{ marginTop: 16 }}>{personalInfo.firstName} {personalInfo.lastName}</Typography.Title>
          <Typography.Text type="secondary">{personalInfo.title}</Typography.Text>
          <Divider />
          <div>
            <Typography.Text strong>Email :</Typography.Text> <Typography.Text>{personalInfo.email}</Typography.Text><br />
            <Typography.Text strong>Tél :</Typography.Text> <Typography.Text>{personalInfo.phone}</Typography.Text><br />
            {personalInfo.address && <><Typography.Text strong>Adresse :</Typography.Text> <Typography.Text>{personalInfo.address}</Typography.Text><br /></>}
            {personalInfo.linkedin && <><Typography.Text strong>LinkedIn :</Typography.Text> <Typography.Text>{personalInfo.linkedin}</Typography.Text><br /></>}
            {personalInfo.portfolio && <><Typography.Text strong>Portfolio :</Typography.Text> <Typography.Text>{personalInfo.portfolio}</Typography.Text><br /></>}
          </div>
        </Col>
        <Col span={18}>
          <Typography.Title level={3} style={{ color: template.style === 'moderne' ? '#1890ff' : '#222' }}>{template.name}</Typography.Title>
          <Tag color={template.style === 'moderne' ? 'blue' : 'default'}>{template.sector}</Tag>
          <Typography.Paragraph style={{ marginTop: 16 }}>{summary}</Typography.Paragraph>
          <Divider />
          <Typography.Title level={4}>Expériences professionnelles</Typography.Title>
          {experience && experience.length > 0 ? experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: 12 }}>
              <Typography.Text strong>{exp.position}</Typography.Text> chez <Typography.Text>{exp.company}</Typography.Text>
              <Typography.Text type="secondary">
                {exp.location} • {exp.startDate ? (typeof exp.startDate === 'string' ? exp.startDate : new Date(exp.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })) : ''} - {exp.current ? 'Présent' : (exp.endDate ? (typeof exp.endDate === 'string' ? exp.endDate : new Date(exp.endDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })) : '')}
              </Typography.Text>
              <Typography.Text>{exp.description}</Typography.Text>
            </div>
          )) : <Typography.Text type="secondary">Aucune expérience renseignée</Typography.Text>}
          <Divider />
          <Typography.Title level={4}>Formation</Typography.Title>
          {education && education.length > 0 ? education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: 12 }}>
              <Typography.Text strong>{edu.degree}</Typography.Text> à <Typography.Text>{edu.school}</Typography.Text> ({edu.startDate ? (typeof edu.startDate === 'string' ? edu.startDate : new Date(edu.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })) : ''} - {edu.endDate ? (typeof edu.endDate === 'string' ? edu.endDate : new Date(edu.endDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' })) : 'Présent'})<br />
              <Typography.Text>{edu.description}</Typography.Text>
            </div>
          )) : <Typography.Text type="secondary">Aucune formation renseignée</Typography.Text>}
          <Divider />
          <Typography.Title level={4}>Compétences</Typography.Title>
          {skills && skills.length > 0 ? skills.map((skill, idx) => (
            <Tag key={idx} color="geekblue">{skill.name} ({skill.level}/5)</Tag>
          )) : <Typography.Text type="secondary">Aucune compétence renseignée</Typography.Text>}
          <Divider />
          <Typography.Title level={4}>Langues</Typography.Title>
          {languages && languages.length > 0 ? languages.map((lang, idx) => (
            <Tag key={idx} color="purple">{lang.name} ({lang.level})</Tag>
          )) : <Typography.Text type="secondary">Aucune langue renseignée</Typography.Text>}
          <Divider />
          <Typography.Title level={4}>Certifications</Typography.Title>
          {certifications && certifications.length > 0 ? certifications.map((cert, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <Typography.Text strong>{cert.name}</Typography.Text> - {cert.issuer} ({cert.date}) {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer">Lien</a>}
            </div>
          )) : <Typography.Text type="secondary">Aucune certification renseignée</Typography.Text>}
          <Divider />
          <Typography.Title level={4}>Projets</Typography.Title>
          {projects && projects.length > 0 ? projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <Typography.Text strong>{proj.name}</Typography.Text> - {proj.description} {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer">Lien</a>}
            </div>
          )) : <Typography.Text type="secondary">Aucun projet renseigné</Typography.Text>}
          <Divider />
          <Typography.Title level={4}>Centres d'intérêt</Typography.Title>
          {interests && interests.length > 0 ? interests.map((interest, idx) => (
            <Tag key={idx} color="magenta">{interest}</Tag>
          )) : <Typography.Text type="secondary">Aucun centre d'intérêt renseigné</Typography.Text>}
        </Col>
      </Row>
    </Card>
  );
};

export default CVPreview; 