import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  DatePicker,
  Select,
  Rate,
  Divider,
  Typography,
  Row,
  Col,
  InputNumber,
  Upload,
  message
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import type { CVData } from '../../../types/cv';
import dayjs from 'dayjs';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CVFormProps {
  data: CVData | null;
  onChange: (data: CVData) => void;
  isPremium: boolean;
}

const languageLevels = [
  { label: 'Débutant', value: 'Débutant' },
  { label: 'Intermédiaire', value: 'Intermédiaire' },
  { label: 'Avancé', value: 'Avancé' },
  { label: 'Natif', value: 'Natif' }
];

const skillCategories = [
  { label: 'Techniques', value: 'technical' },
  { label: 'Soft Skills', value: 'soft' },
  { label: 'Langages de programmation', value: 'programming' },
  { label: 'Outils', value: 'tools' }
];

const CVForm: React.FC<CVFormProps> = ({ data, onChange, isPremium }) => {
  const [form] = Form.useForm();
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleImageUpload = async (file: RcFile) => {
    try {
      setUploadLoading(true);
      
      // Vérification de la taille
      if (file.size > 5 * 1024 * 1024) {
        message.error('La taille de l\'image ne doit pas dépasser 5 MB');
        return Upload.LIST_IGNORE;
      }

      // Vérification du type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        message.error('Seuls les formats JPG, PNG et WebP sont acceptés');
        return Upload.LIST_IGNORE;
      }

      // Vérification des dimensions
      const img = new Image();
      const imgPromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
        img.src = URL.createObjectURL(file);
      });

      const loadedImg = await imgPromise;
      if (loadedImg.width > 1000 || loadedImg.height > 1000) {
        message.error('Les dimensions de l\'image ne doivent pas dépasser 1000x1000 pixels');
        return Upload.LIST_IGNORE;
      }

      // Si tout est OK, on continue avec l'upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        form.setFieldValue(['personalInfo', 'photo'], reader.result);
      };
      reader.onerror = () => {
        message.error('Erreur lors du chargement de la photo');
      };
      
      return false;
    } catch (error) {
      message.error('Une erreur est survenue lors du traitement de l\'image');
      return Upload.LIST_IGNORE;
    } finally {
      setUploadLoading(false);
    }
  };

  const onFinish = (values: any) => {
    const formattedData: CVData = {
      personalInfo: {
        ...values.personalInfo,
      },
      summary: values.personalInfo.summary,
      experience: values.experience?.map((exp: any) => ({
        ...exp,
        startDate: exp.period?.[0]?.format('YYYY-MM'),
        endDate: exp.current ? null : exp.period?.[1]?.format('YYYY-MM'),
      })) || [],
      education: values.education?.map((edu: any) => ({
        ...edu,
        startDate: edu.period?.[0]?.format('YYYY-MM'),
        endDate: edu.period?.[1]?.format('YYYY-MM'),
      })) || [],
      skills: values.skills || [],
      languages: values.languages || [],
      certifications: values.certifications || [],
      projects: values.projects?.map((proj: any) => ({
        ...proj,
        startDate: proj.period?.[0]?.format('YYYY-MM'),
        endDate: proj.period?.[1]?.format('YYYY-MM'),
      })) || [],
      interests: values.interests || [],
    };
    onChange(formattedData);
  };

  React.useEffect(() => {
    if (data) {
      const formattedData = {
        ...data,
        experience: data.experience?.map(exp => ({
          ...exp,
          period: [
            dayjs(exp.startDate),
            exp.current ? null : dayjs(exp.endDate),
          ],
        })),
        education: data.education?.map(edu => ({
          ...edu,
          period: [dayjs(edu.startDate), dayjs(edu.endDate)],
        })),
        projects: data.projects?.map(proj => ({
          ...proj,
          period: [
            dayjs(proj.startDate),
            proj.endDate ? dayjs(proj.endDate) : null,
          ],
        })),
      };
      form.setFieldsValue(formattedData);
    }
  }, [data, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={() => form.submit()}
      initialValues={data || undefined}
    >
      {/* Informations personnelles */}
      <Title level={3}>Informations personnelles</Title>
      <Form.Item
        name={['personalInfo', 'photo']}
        label="Photo de profil"
      >
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

      <Space direction="horizontal" size={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Form.Item
          name={['personalInfo', 'firstName']}
          label="Prénom"
          rules={[{ required: true }]}
          style={{ flex: '1 1 200px', minWidth: '200px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['personalInfo', 'lastName']}
          label="Nom"
          rules={[{ required: true }]}
          style={{ flex: '1 1 200px', minWidth: '200px' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Form.Item
        name={['personalInfo', 'title']}
        label="Titre professionnel"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Space direction="horizontal" size={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Form.Item
          name={['personalInfo', 'email']}
          label="Email"
          rules={[{ required: true, type: 'email' }]}
          style={{ flex: '1 1 200px', minWidth: '200px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['personalInfo', 'phone']}
          label="Téléphone"
          style={{ flex: '1 1 200px', minWidth: '200px' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space direction="horizontal" size={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Form.Item
          name={['personalInfo', 'address']}
          label="Adresse"
          style={{ flex: '1 1 300px', minWidth: '250px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['personalInfo', 'city']}
          label="Ville"
          style={{ flex: '1 1 150px', minWidth: '150px' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Space direction="horizontal" size={16} style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Form.Item
          name={['personalInfo', 'country']}
          label="Pays"
          style={{ flex: '1 1 150px', minWidth: '150px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['personalInfo', 'postalCode']}
          label="Code postal"
          style={{ flex: '1 1 120px', minWidth: '120px' }}
        >
          <Input />
        </Form.Item>
      </Space>

      <Form.Item
        name={['personalInfo', 'summary']}
        label="Résumé professionnel"
        rules={[{ required: true, message: 'Veuillez saisir votre résumé professionnel' }]}
      >
        <TextArea 
          rows={4} 
          placeholder="Décrivez brièvement votre profil, vos compétences clés et vos objectifs professionnels"
        />
      </Form.Item>

      {/* Expérience professionnelle */}
      <Title level={3}>Expérience professionnelle</Title>
      <Form.List name="experience">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} direction="vertical" style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'title']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Titre du poste" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'company']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Entreprise" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'location']}
                >
                  <Input placeholder="Localisation" />
                </Form.Item>

                <Space>
                  <Form.Item
                    {...restField}
                    name={[name, 'period']}
                    rules={[{ required: true }]}
                  >
                    <RangePicker picker="month" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'current']}
                    valuePropName="checked"
                  >
                    <Select placeholder="En cours ?">
                      <Select.Option value={true}>Oui</Select.Option>
                      <Select.Option value={false}>Non</Select.Option>
                    </Select>
                  </Form.Item>
                </Space>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  rules={[{ required: true }]}
                >
                  <TextArea rows={4} placeholder="Description du poste" />
                </Form.Item>

                <Form.List name={[name, 'achievements']}>
                  {(subFields, subOpt) => (
                    <>
                      {subFields.map((subField) => (
                        <Space key={subField.key}>
                          <Form.Item
                            {...subField}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Réalisation" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => subOpt.remove(subField.name)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block icon={<PlusOutlined />}>
                        Ajouter une réalisation
                      </Button>
                    </>
                  )}
                </Form.List>

                <Button type="text" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                  Supprimer cette expérience
                </Button>
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter une expérience
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Formation */}
      <Title level={3}>Formation</Title>
      <Form.List name="education">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} direction="vertical" style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'degree']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Diplôme" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'institution']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Établissement" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'location']}
                >
                  <Input placeholder="Localisation" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'period']}
                  rules={[{ required: true }]}
                >
                  <RangePicker picker="month" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                >
                  <TextArea rows={4} placeholder="Description de la formation" />
                </Form.Item>

                <Form.List name={[name, 'achievements']}>
                  {(subFields, subOpt) => (
                    <>
                      {subFields.map((subField) => (
                        <Space key={subField.key}>
                          <Form.Item
                            {...subField}
                            validateTrigger={['onChange', 'onBlur']}
                          >
                            <Input placeholder="Réalisation académique" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => subOpt.remove(subField.name)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block icon={<PlusOutlined />}>
                        Ajouter une réalisation
                      </Button>
                    </>
                  )}
                </Form.List>

                <Button type="text" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                  Supprimer cette formation
                </Button>
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter une formation
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Compétences */}
      <Title level={3}>Compétences</Title>
      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Compétence" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'level']}
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} max={5} placeholder="Niveau" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'category']}
                >
                  <Input placeholder="Catégorie" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter une compétence
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Langues */}
      <Title level={3}>Langues</Title>
      <Form.List name="languages">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Langue" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'level']}
                  rules={[{ required: true }]}
                >
                  <Select style={{ width: 200 }}>
                    <Select.Option value="Débutant">Débutant</Select.Option>
                    <Select.Option value="Intermédiaire">Intermédiaire</Select.Option>
                    <Select.Option value="Avancé">Avancé</Select.Option>
                    <Select.Option value="Bilingue">Bilingue</Select.Option>
                    <Select.Option value="Langue maternelle">Langue maternelle</Select.Option>
                  </Select>
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter une langue
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Certifications */}
      <Title level={3}>Certifications</Title>
      <Form.List name="certifications">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} direction="vertical" style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nom de la certification" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'issuer']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Organisme certificateur" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'date']}
                  rules={[{ required: true }]}
                >
                  <DatePicker picker="month" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                >
                  <TextArea rows={2} placeholder="Description de la certification" />
                </Form.Item>

                <Button type="text" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                  Supprimer cette certification
                </Button>
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter une certification
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Projets */}
      <Title level={3}>Projets</Title>
      <Form.List name="projects">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} direction="vertical" style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nom du projet" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  rules={[{ required: true }]}
                >
                  <TextArea rows={3} placeholder="Description du projet" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'url']}
                >
                  <Input placeholder="URL du projet" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'period']}
                  rules={[{ required: true }]}
                >
                  <RangePicker picker="month" />
                </Form.Item>

                <Form.List name={[name, 'technologies']}>
                  {(subFields, subOpt) => (
                    <>
                      {subFields.map((subField) => (
                        <Space key={subField.key}>
                          <Form.Item
                            {...subField}
                            validateTrigger={['onChange', 'onBlur']}
                          >
                            <Input placeholder="Technologie utilisée" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => subOpt.remove(subField.name)} />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => subOpt.add()} block icon={<PlusOutlined />}>
                        Ajouter une technologie
                      </Button>
                    </>
                  )}
                </Form.List>

                <Button type="text" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                  Supprimer ce projet
                </Button>
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter un projet
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Centres d'intérêt */}
      <Title level={3}>Centres d'intérêt</Title>
      <Form.List name="interests">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Centre d'intérêt" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                >
                  <Input placeholder="Description (optionnelle)" />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Ajouter un centre d'intérêt
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default CVForm; 