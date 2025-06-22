import React from 'react';
import { Form, Input, Button, Space, Typography } from 'antd';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;
const { TextArea } = Input;

interface CertificationsFormProps {
  data: CVData['certifications'];
  onChange: (data: CVData['certifications']) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [certs, setCerts] = React.useState(data || []);

  React.useEffect(() => {
    setCerts(data || []);
  }, [data]);

  const addCert = () => {
    setCerts([
      ...certs,
      { name: '', issuer: '', date: '', description: '' }
    ]);
  };

  const removeCert = (index: number) => {
    const newCerts = certs.filter((_, i) => i !== index);
    setCerts(newCerts);
    onChange(newCerts);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newCerts = certs.map((c, i) =>
      (typeof c === 'object' && c !== null && 'name' in c)
        ? (i === index ? { ...c, [field]: value } : c)
        : c
    );
    setCerts(newCerts);
    onChange(newCerts);
  };

  const onFinish = () => {
    onChange(certs);
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>Certifications</Title>
      {certs.filter(c => typeof c === 'object' && c !== null && 'name' in c).map((c, idx) => (
        <Space key={idx} direction="vertical" style={{ width: '100%', marginBottom: 24, border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <Form.Item label="Titre" required>
            <Input value={c.name} onChange={e => handleChange(idx, 'name', e.target.value)} />
          </Form.Item>
          <Form.Item label="Organisme" required>
            <Input value={c.issuer} onChange={e => handleChange(idx, 'issuer', e.target.value)} />
          </Form.Item>
          <Form.Item label="Date" required>
            <Input value={c.date} onChange={e => handleChange(idx, 'date', e.target.value)} placeholder="MM/YYYY" />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea value={c.description} onChange={e => handleChange(idx, 'description', e.target.value)} rows={2} />
          </Form.Item>
          <Button danger onClick={() => removeCert(idx)} disabled={certs.length === 1}>Supprimer</Button>
        </Space>
      ))}
      <Button type="dashed" onClick={addCert} style={{ width: '100%', marginBottom: 24 }}>+ Ajouter une certification</Button>
    </Form>
  );
};

export default CertificationsForm; 