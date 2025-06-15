import React from 'react';
import { Form, Input, Button, Space, Typography, Tag } from 'antd';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;

interface InterestsFormProps {
  data: CVData['interests'];
  onChange: (data: CVData['interests']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [interests, setInterests] = React.useState(data || []);
  const [input, setInput] = React.useState('');

  React.useEffect(() => {
    setInterests(data || []);
  }, [data]);

  const addInterest = () => {
    if (input.trim() && !interests.includes(input.trim())) {
      const newInterests = [...interests, input.trim()];
      setInterests(newInterests);
      onChange(newInterests);
      setInput('');
    }
  };

  const removeInterest = (removed: string) => {
    const newInterests = interests.filter(i => i !== removed);
    setInterests(newInterests);
    onChange(newInterests);
  };

  const onFinish = () => {
    onChange(interests);
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>Centres d'intérêt</Title>
      <Space wrap>
        {interests.map(interest => (
          <Tag key={interest} closable onClose={() => removeInterest(interest)}>{interest}</Tag>
        ))}
      </Space>
      <Space style={{ marginTop: 16 }}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={addInterest}
          placeholder="Ajouter un centre d'intérêt"
        />
        <Button onClick={addInterest} type="dashed">Ajouter</Button>
      </Space>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Button onClick={onPrev}>Précédent</Button>
        <Button type="primary" htmlType="submit">Suivant</Button>
      </div>
    </Form>
  );
};

export default InterestsForm; 