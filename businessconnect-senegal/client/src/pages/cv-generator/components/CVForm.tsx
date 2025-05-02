import React from 'react';
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
  Col
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CV } from '../../../services/cvService';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CVFormProps {
  initialValues?: Partial<CV>;
  onSubmit: (values: any) => void;
  loading: boolean;
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

const CVForm: React.FC<CVFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    // Formatage des dates avant envoi
    const formattedValues = {
      ...values,
      education: values.education?.map((edu: any) => ({
        ...edu,
        startDate: edu.period[0].format('YYYY-MM-DD'),
        endDate: edu.period[1].format('YYYY-MM-DD')
      })),
      experience: values.experience?.map((exp: any) => ({
        ...exp,
        startDate: exp.period[0].format('YYYY-MM-DD'),
        endDate: exp.current ? null : exp.period[1].format('YYYY-MM-DD')
      })),
      certifications: values.certifications?.map((cert: any) => ({
        ...cert,
        date: cert.date.format('YYYY-MM-DD')
      }))
    };

    onSubmit(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        education: initialValues?.education?.map(edu => ({
          ...edu,
          period: [moment(edu.startDate), moment(edu.endDate)]
        })),
        experience: initialValues?.experience?.map(exp => ({
          ...exp,
          period: [moment(exp.startDate), exp.endDate ? moment(exp.endDate) : null]
        })),
        certifications: initialValues?.certifications?.map(cert => ({
          ...cert,
          date: moment(cert.date)
        }))
      }}
    >
      {/* Informations personnelles */}
      <Title level={3}>Informations personnelles</Title>
      <Row gutter={16}>
        <Col span={12}>
      <Form.Item
            name={['personalInfo', 'fullName']}
            label="Nom complet"
            rules={[{ required: true, message: 'Le nom est requis' }]}
        >
          <Input />
        </Form.Item>
        </Col>
        <Col span={12}>
      <Form.Item
        name={['personalInfo', 'email']}
        label="Email"
        rules={[
              { required: true, message: 'L\'email est requis' },
              { type: 'email', message: 'Email invalide' }
        ]}
      >
        <Input />
      </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
      <Form.Item
        name={['personalInfo', 'phone']}
        label="Téléphone"
            rules={[{ required: true, message: 'Le téléphone est requis' }]}
      >
        <Input />
      </Form.Item>
        </Col>
        <Col span={12}>
      <Form.Item
        name={['personalInfo', 'address']}
        label="Adresse"
      >
        <Input />
      </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
        <Form.Item
          name={['personalInfo', 'linkedin']}
          label="LinkedIn"
        >
          <Input />
        </Form.Item>
        </Col>
        <Col span={12}>
        <Form.Item
            name={['personalInfo', 'website']}
            label="Site web"
        >
          <Input />
        </Form.Item>
        </Col>
      </Row>

      <Divider />

      {/* Formation */}
      <Title level={3}>Formation</Title>
      <Form.List name="education">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'school']}
                  rules={[{ required: true, message: 'L\'école est requise' }]}
                >
                  <Input placeholder="École" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'degree']}
                  rules={[{ required: true, message: 'Le diplôme est requis' }]}
                >
                  <Input placeholder="Diplôme" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'period']}
                  rules={[{ required: true, message: 'La période est requise' }]}
                >
                  <RangePicker />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
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

      <Divider />

      {/* Expérience professionnelle */}
      <Title level={3}>Expérience professionnelle</Title>
      <Form.List name="experience">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'company']}
                  rules={[{ required: true, message: 'L\'entreprise est requise' }]}
                >
                  <Input placeholder="Entreprise" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'position']}
                  rules={[{ required: true, message: 'Le poste est requis' }]}
                >
                  <Input placeholder="Poste" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'period']}
                  rules={[{ required: true, message: 'La période est requise' }]}
                >
                  <RangePicker />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                >
                  <TextArea placeholder="Description" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
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

      <Divider />

      {/* Compétences */}
      <Title level={3}>Compétences</Title>
      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'La compétence est requise' }]}
                >
                  <Input placeholder="Compétence" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'category']}
                  rules={[{ required: true, message: 'La catégorie est requise' }]}
                >
                  <Select options={skillCategories} placeholder="Catégorie" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'level']}
                  rules={[{ required: true, message: 'Le niveau est requis' }]}
                >
                  <Rate />
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

      <Divider />

      {/* Langues */}
      <Title level={3}>Langues</Title>
      <Form.List name="languages">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'La langue est requise' }]}
                >
                  <Input placeholder="Langue" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'level']}
                  rules={[{ required: true, message: 'Le niveau est requis' }]}
                >
                  <Select options={languageLevels} placeholder="Niveau" />
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

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Enregistrer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CVForm; 