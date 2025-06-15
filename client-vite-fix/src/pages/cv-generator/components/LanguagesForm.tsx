import React from 'react';
import { Form, Input, Button, Select, Space, Typography } from 'antd';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;

const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Bilingue', 'Langue maternelle'];

interface LanguagesFormProps {
  data: CVData['languages'];
  onChange: (data: CVData['languages']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [languages, setLanguages] = React.useState(data || []);
  const [input, setInput] = React.useState('');
  const [level, setLevel] = React.useState(LEVELS[0]);

  React.useEffect(() => {
    setLanguages(data || []);
  }, [data]);

  const addLanguage = () => {
    if (input.trim() && !languages.some(l => l.name === input.trim())) {
      const newLangs = [...languages, { name: input.trim(), level }];
      setLanguages(newLangs);
      onChange(newLangs);
      setInput('');
      setLevel(LEVELS[0]);
    }
  };

  const removeLanguage = (lang: string) => {
    const newLangs = languages.filter(l => l.name !== lang);
    setLanguages(newLangs);
    onChange(newLangs);
  };

  const onFinish = () => {
    onChange(languages);
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>Langues</Title>
      {languages.map(l => (
        <Space key={l.name} style={{ marginBottom: 8 }}>
          <span>{l.name} ({l.level})</span>
          <Button danger size="small" onClick={() => removeLanguage(l.name)}>Supprimer</Button>
        </Space>
      ))}
      <Space style={{ marginTop: 16 }}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ajouter une langue"
        />
        <Select value={level} onChange={setLevel} style={{ width: 160 }}>
          {LEVELS.map(l => <Select.Option key={l} value={l}>{l}</Select.Option>)}
        </Select>
        <Button onClick={addLanguage} type="dashed">Ajouter</Button>
      </Space>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <Button onClick={onPrev}>Précédent</Button>
        <Button type="primary" htmlType="submit">Suivant</Button>
      </div>
    </Form>
  );
};

export default LanguagesForm; 