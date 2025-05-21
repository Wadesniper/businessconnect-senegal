import React from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;
const { TextArea } = Input;

interface ProjectsFormProps {
  data: CVData['projects'];
  onChange: (data: CVData['projects']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [projects, setProjects] = React.useState(data || []);

  const addProject = () => {
    setProjects([...projects, { title: '', description: '', technologies: '', startDate: '', endDate: '' }]);
  };

  const removeProject = (index: number) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
    onChange(newProjects);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newProjects = projects.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setProjects(newProjects);
    onChange(newProjects);
  };

  const onFinish = () => {
    onChange(projects);
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>Projets</Title>
      {projects.map((p, idx) => (
        <Space key={idx} direction="vertical" style={{ width: '100%', marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Form.Item label="Titre" required>
            <Input value={p.title} onChange={e => handleChange(idx, 'title', e.target.value)} />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea value={p.description} onChange={e => handleChange(idx, 'description', e.target.value)} rows={2} />
          </Form.Item>
          <Form.Item label="Technologies">
            <Input value={p.technologies} onChange={e => handleChange(idx, 'technologies', e.target.value)} placeholder="ex: React, Node.js, SQL" />
          </Form.Item>
          <Form.Item label="Date de début">
            <Input value={p.startDate} onChange={e => handleChange(idx, 'startDate', e.target.value)} placeholder="MM/YYYY" />
          </Form.Item>
          <Form.Item label="Date de fin">
            <Input value={p.endDate} onChange={e => handleChange(idx, 'endDate', e.target.value)} placeholder="MM/YYYY ou 'En cours'" />
          </Form.Item>
          <Button danger onClick={() => removeProject(idx)} disabled={projects.length === 1}>Supprimer</Button>
        </Space>
      ))}
      <Button type="dashed" onClick={addProject} style={{ width: '100%', marginBottom: 24 }}>+ Ajouter un projet</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Button onClick={onPrev}>Précédent</Button>
        <Button type="primary" htmlType="submit">Suivant</Button>
      </div>
    </Form>
  );
};

export default ProjectsForm; 