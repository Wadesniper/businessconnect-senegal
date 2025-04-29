import React from 'react';
import { Modal, Form, Input, Select, Button, message, Space } from 'antd';
import { api } from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

interface CreateDiscussionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateDiscussionModal: React.FC<CreateDiscussionModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: {
    title: string;
    content: string;
    category: string;
  }) => {
    try {
      setLoading(true);
      await api.post('/forum/discussions', values);
      message.success('Discussion créée avec succès !');
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('Erreur lors de la création de la discussion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Nouvelle discussion"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Titre"
          rules={[{ required: true, message: 'Veuillez entrer un titre' }]}
        >
          <Input placeholder="Titre de la discussion" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Catégorie"
          rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
        >
          <Select placeholder="Sélectionnez une catégorie">
            <Option value="emploi">Emploi</Option>
            <Option value="formation">Formation</Option>
            <Option value="entrepreneuriat">Entrepreneuriat</Option>
            <Option value="conseils">Conseils</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="Contenu"
          rules={[{ required: true, message: 'Veuillez entrer le contenu de la discussion' }]}
        >
          <TextArea
            rows={6}
            placeholder="Décrivez votre discussion..."
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Publier
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDiscussionModal; 