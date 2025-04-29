import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Card } from 'antd';
import { jobService } from '../services/jobService';
import { authService } from '../services/authService';

const { TextArea } = Input;
const { Option } = Select;

const sectors = [
  'Informatique',
  'Marketing',
  'Finance',
  'Ressources Humaines',
  'Communication',
  'Santé',
  'Éducation'
];

const contractTypes = [
  'CDI',
  'CDD',
  'Stage',
  'Alternance',
  'Freelance'
];

export const CreateJobOffer: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        message.error('Veuillez vous connecter pour créer une offre');
        return;
      }

      const jobData = {
        ...values,
        requirements: values.requirements.split('\n').filter((req: string) => req.trim()),
        keywords: values.keywords.split(',').map((kw: string) => kw.trim())
      };

      const result = await jobService.createJobOffer(jobData);
      if (result) {
        message.success('Offre créée avec succès');
        form.resetFields();
      } else {
        message.error('Erreur lors de la création de l\'offre');
      }
    } catch (error) {
      message.error('Une erreur est survenue');
    }
    setLoading(false);
  };

  return (
    <Card title="Créer une nouvelle offre d'emploi">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          sector: 'Informatique',
          type: 'CDI'
        }}
      >
        <Form.Item
          name="title"
          label="Titre de l'offre"
          rules={[{ required: true, message: 'Veuillez saisir le titre' }]}
        >
          <Input placeholder="Ex: Développeur Full Stack" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Entreprise"
          rules={[{ required: true, message: 'Veuillez saisir le nom de l\'entreprise' }]}
        >
          <Input placeholder="Nom de l'entreprise" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Lieu"
          rules={[{ required: true, message: 'Veuillez saisir le lieu' }]}
        >
          <Input placeholder="Ex: Dakar, Sénégal" />
        </Form.Item>

        <Form.Item
          name="sector"
          label="Secteur"
          rules={[{ required: true, message: 'Veuillez sélectionner un secteur' }]}
        >
          <Select>
            {sectors.map(sector => (
              <Option key={sector} value={sector}>{sector}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="type"
          label="Type de contrat"
          rules={[{ required: true, message: 'Veuillez sélectionner un type de contrat' }]}
        >
          <Select>
            {contractTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Veuillez saisir la description' }]}
        >
          <TextArea rows={4} placeholder="Décrivez le poste et les responsabilités" />
        </Form.Item>

        <Form.Item
          name="requirements"
          label="Prérequis"
          rules={[{ required: true, message: 'Veuillez saisir les prérequis' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Entrez un prérequis par ligne
Ex:
- Diplôme en informatique
- 3 ans d'expérience
- Maîtrise de React et Node.js"
          />
        </Form.Item>

        <Form.Item
          name="contactEmail"
          label="Email de contact"
          rules={[
            { required: true, message: 'Veuillez saisir un email' },
            { type: 'email', message: 'Email invalide' }
          ]}
        >
          <Input placeholder="email@entreprise.com" />
        </Form.Item>

        <Form.Item
          name="contactPhone"
          label="Téléphone de contact"
        >
          <Input placeholder="+221 XX XXX XX XX" />
        </Form.Item>

        <Form.Item
          name="keywords"
          label="Mots-clés"
          rules={[{ required: true, message: 'Veuillez saisir des mots-clés' }]}
        >
          <Input placeholder="Séparez les mots-clés par des virgules" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Publier l'offre
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}; 