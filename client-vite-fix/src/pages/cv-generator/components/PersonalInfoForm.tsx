import React from 'react';
import { Form, Input, Button, Upload, Space, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;
const { TextArea } = Input;

interface PersonalInfoFormProps {
  data: CVData['personalInfo'];
  onChange: (data: CVData['personalInfo']) => void;
  onNext: () => void;
  onPrev?: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange, onNext, onPrev }) => {
  const [form] = Form.useForm();
  const [uploadLoading, setUploadLoading] = React.useState(false);

  const handleImageUpload = async (file: RcFile) => {
    setUploadLoading(true);
    // Vérification de la taille
    if (file.size > 5 * 1024 * 1024) {
      setUploadLoading(false);
      return Upload.LIST_IGNORE;
    }
    // Vérification du type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadLoading(false);
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      form.setFieldValue('photo', reader.result);
      onChange({ ...form.getFieldsValue(), photo: reader.result });
    };
    setUploadLoading(false);
    return false;
  };

  const onFinish = (values: any) => {
    onChange(values);
    onNext();
  };

  React.useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={data}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Title level={3}>Informations personnelles</Title>
      <Form.Item name="photo" label="Photo de profil">
        <Upload
          accept="image/*"
          maxCount={1}
          listType="picture"
          beforeUpload={handleImageUpload}
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        >
          <Button icon={<UploadOutlined />} loading={uploadLoading}>
            {uploadLoading ? 'Traitement...' : 'Télécharger une photo'}
          </Button>
        </Upload>
      </Form.Item>
      <Space direction="horizontal" size={16} style={{ display: 'flex' }}>
        <Form.Item name="firstName" label="Prénom" rules={[{ required: true }]}
          style={{ flex: 1 }}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Nom" rules={[{ required: true }]}
          style={{ flex: 1 }}>
          <Input />
        </Form.Item>
      </Space>
      <Form.Item name="title" label="Titre professionnel" rules={[{ required: true }]}> <Input /> </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}> <Input /> </Form.Item>
      <Form.Item name="phone" label="Téléphone" rules={[{ required: true }]}> <Input /> </Form.Item>
      <Form.Item name="address" label="Adresse"> <Input /> </Form.Item>
      <Form.Item name="summary" label="Résumé professionnel" rules={[{ required: true }]}> <TextArea rows={4} /> </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        {onPrev && <Button onClick={onPrev}>Précédent</Button>}
        <Button type="primary" htmlType="submit">Suivant</Button>
      </div>
    </Form>
  );
};

export default PersonalInfoForm; 