import React from 'react';
import { Form, Input, Button, DatePicker, Space, Typography } from 'antd';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;
const { TextArea } = Input;

interface ExperienceFormProps {
  data: CVData['experience'];
  onChange: (data: CVData['experience']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [experiences, setExperiences] = React.useState(data || []);

  React.useEffect(() => {
    setExperiences(data || []);
  }, [data]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: [] }
    ]);
  };

  const removeExperience = (index: number) => {
    const newExp = experiences.filter((_, i) => i !== index);
    setExperiences(newExp);
    onChange(newExp);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newExp = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(newExp);
    onChange(newExp);
  };

  const onFinish = () => {
    onChange(experiences);
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>Expérience professionnelle</Title>
      {experiences.map((exp, idx) => (
        <Space key={idx} direction="vertical" style={{ width: '100%', marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Form.Item label="Poste" required>
            <Input value={exp.title} onChange={e => handleChange(idx, 'title', e.target.value)} />
          </Form.Item>
          <Form.Item label="Entreprise" required>
            <Input value={exp.company} onChange={e => handleChange(idx, 'company', e.target.value)} />
          </Form.Item>
          <Form.Item label="Date de début" required>
            <Input value={exp.startDate} onChange={e => handleChange(idx, 'startDate', e.target.value)} placeholder="MM/YYYY" />
          </Form.Item>
          <Form.Item label="Date de fin">
            <Input value={exp.endDate} onChange={e => handleChange(idx, 'endDate', e.target.value)} placeholder="MM/YYYY ou 'En cours'" />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea value={exp.description} onChange={e => handleChange(idx, 'description', e.target.value)} rows={3} />
          </Form.Item>
          <Button danger onClick={() => removeExperience(idx)} disabled={experiences.length === 1}>Supprimer</Button>
        </Space>
      ))}
      <Button type="dashed" onClick={addExperience} style={{ width: '100%', marginBottom: 24 }}>+ Ajouter une expérience</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Button onClick={onPrev}>Précédent</Button>
        <Button type="primary" htmlType="submit">Suivant</Button>
      </div>
    </Form>
  );
};

export default ExperienceForm; 