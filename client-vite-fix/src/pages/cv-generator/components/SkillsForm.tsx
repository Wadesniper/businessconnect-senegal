import React from 'react';
import { Form, Input, Button, Space, Typography, Tag } from 'antd';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;

interface SkillsFormProps {
  data: CVData['skills'];
  onChange: (data: CVData['skills']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [skills, setSkills] = React.useState(data || []);
  const [input, setInput] = React.useState('');

  React.useEffect(() => {
    setSkills(data || []);
  }, [data]);

  const addSkill = () => {
    if (input.trim() && !skills.some(s => s.name === input.trim())) {
      const newSkills = [...skills, { name: input.trim() }];
      setSkills(newSkills);
      onChange(newSkills);
      setInput('');
    }
  };

  const removeSkill = (removed: string) => {
    const newSkills = skills.filter(skill => skill.name !== removed);
    setSkills(newSkills);
    onChange(newSkills);
  };

  const onFinish = () => {
    onChange(skills);
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>Compétences</Title>
      <Space wrap>
        {skills.map(skill => (
          <Tag key={skill.name} closable onClose={() => removeSkill(skill.name)}>{skill.name}</Tag>
        ))}
      </Space>
      <Space style={{ marginTop: 16 }}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={addSkill}
          placeholder="Ajouter une compétence"
        />
        <Button onClick={addSkill} type="dashed">Ajouter</Button>
      </Space>
    </Form>
  );
};

export default SkillsForm; 