import React from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;
const { TextArea } = Input;

interface EducationFormProps {
  data: CVData['education'];
  onChange: (data: CVData['education']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [educations, setEducations] = React.useState(data || []);

  const addEducation = () => {
    setEducations([
      ...educations,
      { degree: '', field: '', institution: '', location: '', startDate: '', endDate: '', description: '', achievements: [] }
    ]);
  };

  const removeEducation = (index: number) => {
    const newEd = educations.filter((_, i) => i !== index);
    setEducations(newEd);
    onChange(newEd);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newEd = educations.map((ed, i) =>
      i === index ? { ...ed, [field]: value } : ed
    );
    setEducations(newEd);
    onChange(newEd);
  };

  const onFinish = () => {
    onChange(educations);
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>Formation</Title>
      {educations.map((ed, idx) => (
        <Space key={idx} direction="vertical" style={{ width: '100%', marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Form.Item label="Diplôme" required>
            <Input value={ed.degree} onChange={e => handleChange(idx, 'degree', e.target.value)} />
          </Form.Item>
          <Form.Item label="Établissement" required>
            <Input value={ed.institution} onChange={e => handleChange(idx, 'institution', e.target.value)} />
          </Form.Item>
          <Form.Item label="Date de début" required>
            <Input value={ed.startDate} onChange={e => handleChange(idx, 'startDate', e.target.value)} placeholder="MM/YYYY" />
          </Form.Item>
          <Form.Item label="Date de fin">
            <Input value={ed.endDate} onChange={e => handleChange(idx, 'endDate', e.target.value)} placeholder="MM/YYYY ou 'En cours'" />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea value={ed.description} onChange={e => handleChange(idx, 'description', e.target.value)} rows={3} />
          </Form.Item>
          <Button danger onClick={() => removeEducation(idx)} disabled={educations.length === 1}>Supprimer</Button>
        </Space>
      ))}
      <Button type="dashed" onClick={addEducation} style={{ width: '100%', marginBottom: 24 }}>+ Ajouter une formation</Button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Button onClick={onPrev}>Précédent</Button>
        <Button type="primary" htmlType="submit">Suivant</Button>
      </div>
    </Form>
  );
};

export default EducationForm; 