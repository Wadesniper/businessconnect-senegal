import React from 'react';
import { Form, Input, Button, Upload, Space, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import type { CVData } from '../../../types/cv';

const { Title } = Typography;
const { TextArea } = Input;

interface PersonalInfoFormProps {
  data: CVData['personalInfo'];
  onChange: (data: CVData['personalInfo']) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const [form] = Form.useForm();
  const [uploadLoading, setUploadLoading] = React.useState(false);

  const handleImageUpload = async (file: RcFile) => {
    setUploadLoading(true);
    if (file.size > 5 * 1024 * 1024) {
      setUploadLoading(false);
      message.error('La taille de l\'image ne doit pas dépasser 5 Mo');
      return Upload.LIST_IGNORE;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadLoading(false);
      message.error('Seuls les formats JPG, PNG et WebP sont acceptés');
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      form.setFieldsValue({ photo: reader.result });
      onChange({ ...form.getFieldsValue(), photo: reader.result });
    };
    reader.onerror = () => {
      message.error('Erreur lors du chargement de la photo');
    };
    setUploadLoading(false);
    return false;
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    onChange(allValues);
  };

  React.useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={data}
      onValuesChange={handleValuesChange}
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
        <Form.Item name="firstName" label="Prénom" rules={[{ required: true, message: 'Le prénom est requis' }]} style={{ flex: 1 }}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Nom" rules={[{ required: true, message: 'Le nom est requis' }]} style={{ flex: 1 }}>
          <Input />
        </Form.Item>
      </Space>
      <Form.Item name="title" label="Titre professionnel" rules={[{ required: true, message: 'Le titre est requis' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Un email valide est requis' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Téléphone" rules={[{ required: true, message: 'Le téléphone est requis' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Adresse">
        <Input />
      </Form.Item>
      <Form.Item name="summary" label="Résumé professionnel" rules={[{ required: true, message: 'Le résumé est requis' }]}>
        <TextArea rows={4} />
      </Form.Item>
    </Form>
  );
};

export default PersonalInfoForm; 