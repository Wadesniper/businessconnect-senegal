import React from 'react';
import { Modal, Form, Input, Select, Button, message, Space } from 'antd';
import { forumService } from '../../services/forumService';
import { CreateDiscussionDto, ForumCategory } from '../../types/forum';

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

  const handleSubmit = async (values: CreateDiscussionDto) => {
    try {
      setLoading(true);
      await forumService.createDiscussion(values);
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
          rules={[
            { required: true, message: 'Veuillez entrer un titre' },
            { min: 5, message: 'Le titre doit contenir au moins 5 caractères' },
            { max: 100, message: 'Le titre ne doit pas dépasser 100 caractères' }
          ]}
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
            <Option value="networking">Networking</Option>
            <Option value="financement">Financement</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="Contenu"
          rules={[
            { required: true, message: 'Veuillez entrer le contenu de la discussion' },
            { min: 20, message: 'Le contenu doit contenir au moins 20 caractères' },
            { max: 2000, message: 'Le contenu ne doit pas dépasser 2000 caractères' }
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Décrivez votre discussion..."
            showCount
            maxLength={2000}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          rules={[{ max: 5, type: 'array', message: 'Vous ne pouvez pas ajouter plus de 5 tags' }]}
        >
          <Select
            mode="tags"
            placeholder="Ajoutez des tags (optionnel)"
            style={{ width: '100%' }}
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