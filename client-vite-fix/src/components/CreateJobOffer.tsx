import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Card, InputNumber, Switch, Row, Col } from 'antd';
import { JobService } from '../services/jobService';
import { authService } from '../services/authService';
import { JOB_SECTORS } from '../types/job';

const { TextArea } = Input;
const { Option } = Select;

// Types de contrat cohérents avec l'enum JobType de Prisma
const contractTypes = [
  { value: 'full_time', label: 'Temps plein' },
  { value: 'part_time', label: 'Temps partiel' },
  { value: 'contract', label: 'Contrat' },
  { value: 'internship', label: 'Stage' }
];

const currencies = [
  { value: 'XOF', label: 'Franc CFA (XOF)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar US (USD)' }
];

export const CreateJobOffer: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasSalary, setHasSalary] = useState(false);
  const [salaryType, setSalaryType] = useState<'fixed' | 'range'>('fixed');

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        message.error('Veuillez vous connecter pour créer une offre');
        return;
      }

      // Préparer les données selon le schéma de la base
      const jobData = {
        ...values,
        requirements: values.requirements.split('\n').filter((req: string) => req.trim()),
        keywords: values.keywords ? values.keywords.split(',').map((kw: string) => kw.trim()) : [],
        missions: values.missions ? values.missions.split('\n').filter((mission: string) => mission.trim()) : [],
        // Gestion du salaire
        salary_min: hasSalary && salaryType === 'fixed' ? values.salary_min : 
                   hasSalary && salaryType === 'range' ? values.salary_min : null,
        salary_max: hasSalary && salaryType === 'range' ? values.salary_max : null,
        salary_currency: hasSalary ? values.salary_currency : 'XOF',
        // Champs de statut
        status: 'active',
        isActive: true,
        // Type de contrat
        type: values.type,
        jobTypeDetail: values.type // Pour compatibilité avec l'ancien système
      };

      const result = await JobService.createJob(jobData);
      if (result) {
        message.success('Offre créée avec succès');
        form.resetFields();
        setHasSalary(false);
        setSalaryType('fixed');
      } else {
        message.error('Erreur lors de la création de l\'offre');
      }
    } catch (error) {
      message.error('Une erreur est survenue');
    }
    setLoading(false);
  };

  return (
    <Card title="Créer une nouvelle offre d'emploi" className="max-w-4xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          sector: 'Informatique',
          type: 'full_time',
          salary_currency: 'XOF',
          isActive: true
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Titre de l'offre"
              rules={[{ required: true, message: 'Veuillez saisir le titre' }]}
            >
              <Input placeholder="Ex: Développeur Full Stack" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="company"
              label="Entreprise"
              rules={[{ required: true, message: 'Veuillez saisir le nom de l\'entreprise' }]}
            >
              <Input placeholder="Nom de l'entreprise" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="location"
              label="Lieu"
              rules={[{ required: true, message: 'Veuillez saisir le lieu' }]}
            >
              <Input placeholder="Ex: Dakar, Sénégal" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sector"
              label="Secteur"
              rules={[{ required: true, message: 'Veuillez sélectionner un secteur' }]}
            >
              <Select>
                {JOB_SECTORS.map(sector => (
                  <Option key={sector} value={sector}>{sector}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Type de contrat"
              rules={[{ required: true, message: 'Veuillez sélectionner un type de contrat' }]}
            >
              <Select>
                {contractTypes.map(type => (
                  <Option key={type.value} value={type.value}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isActive"
              label="Offre active"
              valuePropName="checked"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description du poste"
          rules={[{ required: true, message: 'Veuillez saisir la description' }]}
        >
          <TextArea rows={4} placeholder="Décrivez le poste et les responsabilités principales" />
        </Form.Item>

        <Form.Item
          name="missions"
          label="Missions principales"
        >
          <TextArea 
            rows={3} 
            placeholder="Entrez une mission par ligne
Ex:
- Développer des applications web
- Maintenir les systèmes existants
- Collaborer avec l'équipe produit"
          />
        </Form.Item>

        <Form.Item
          name="requirements"
          label="Prérequis et compétences"
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

        <Row gutter={16}>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="contactPhone"
              label="Téléphone de contact"
              rules={[{ required: true, message: 'Veuillez saisir un numéro de téléphone' }]}
            >
              <Input placeholder="+221 XX XXX XX XX" />
            </Form.Item>
          </Col>
        </Row>

        {/* Section Salaire */}
        <Card title="Informations salariales" size="small" className="mb-4">
          <Form.Item>
            <Switch 
              checked={hasSalary}
              onChange={setHasSalary}
              checkedChildren="Afficher le salaire"
              unCheckedChildren="Salaire non précisé"
            />
          </Form.Item>

          {hasSalary && (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="salary_currency"
                    label="Devise"
                  >
                    <Select>
                      {currencies.map(currency => (
                        <Option key={currency.value} value={currency.value}>{currency.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Type de salaire">
                    <Select value={salaryType} onChange={setSalaryType}>
                      <Option value="fixed">Salaire fixe</Option>
                      <Option value="range">Fourchette de salaire</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                {salaryType === 'fixed' ? (
                  <Col span={12}>
                    <Form.Item
                      name="salary_min"
                      label="Salaire"
                      rules={[{ required: hasSalary, message: 'Veuillez saisir le salaire' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Ex: 500000"
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                ) : (
                  <>
                    <Col span={12}>
                      <Form.Item
                        name="salary_min"
                        label="Salaire minimum"
                        rules={[{ required: hasSalary, message: 'Veuillez saisir le salaire minimum' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Ex: 400000"
                          min={0}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="salary_max"
                        label="Salaire maximum"
                        rules={[{ required: hasSalary, message: 'Veuillez saisir le salaire maximum' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          placeholder="Ex: 600000"
                          min={0}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>
            </>
          )}
        </Card>

        <Form.Item
          name="keywords"
          label="Mots-clés"
          rules={[{ required: true, message: 'Veuillez saisir des mots-clés' }]}
        >
          <Input placeholder="Séparez les mots-clés par des virgules (ex: React, Node.js, MongoDB)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Publier l'offre
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}; 