import React from 'react';
import { Form, Input, DatePicker, Button, Space, InputNumber, Upload, Select, Divider, Typography, Rate } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { CVData } from '../types';
import moment from 'moment';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Title } = Typography;

interface CVFormProps {
  data: CVData | null;
  onChange: (data: CVData) => void;
}

const languageLevels = [
  { label: 'Débutant', value: 'Débutant' },
  { label: 'Intermédiaire', value: 'Intermédiaire' },
  { label: 'Avancé', value: 'Avancé' },
  { label: 'Natif', value: 'Natif' },
];

const CVForm: React.FC<CVFormProps> = ({ data, onChange }) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // Transformer les dates en format string
    const formattedValues = {
      ...values,
      experience: values.experience?.map((exp: any) => ({
        ...exp,
        startDate: exp.period[0].format('YYYY-MM-DD'),
        endDate: exp.current ? undefined : exp.period[1].format('YYYY-MM-DD'),
      })),
      education: values.education?.map((edu: any) => ({
        ...edu,
        startDate: edu.period[0].format('YYYY-MM-DD'),
        endDate: edu.period[1].format('YYYY-MM-DD'),
      })),
      certifications: values.certifications?.map((cert: any) => ({
        ...cert,
        date: cert.date.format('YYYY-MM-DD'),
      })),
    };

    onChange(formattedValues);
  };

  const handleValuesChange = (_: any, allValues: any) => {
    onChange(allValues as CVData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...data,
        experience: data?.experience?.map(exp => ({
          ...exp,
          period: [moment(exp.startDate), exp.endDate ? moment(exp.endDate) : undefined],
        })),
        education: data?.education?.map(edu => ({
          ...edu,
          period: [moment(edu.startDate), moment(edu.endDate)],
        })),
        certifications: data?.certifications?.map(cert => ({
          ...cert,
          date: moment(cert.date),
        })),
      }}
      onValuesChange={handleValuesChange}
      autoComplete="off"
    >
      <Divider>Informations personnelles</Divider>
      
      <Form.Item
        name={['personalInfo', 'photo']}
        label="Photo de profil"
      >
        <Upload
          name="photo"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Télécharger une photo</Button>
        </Upload>
      </Form.Item>

      <Space style={{ display: 'flex' }} align="baseline">
        <Form.Item
          name={['personalInfo', 'firstName']}
          label="Prénom"
          rules={[{ required: true, message: 'Veuillez saisir votre prénom' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['personalInfo', 'lastName']}
          label="Nom"
          rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}
        >
          <Input />
        </Form.Item>
      </Space>

      <Form.Item
        name={['personalInfo', 'title']}
        label="Titre professionnel"
        rules={[{ required: true, message: 'Veuillez saisir votre titre professionnel' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={['personalInfo', 'email']}
        label="Email"
        rules={[
          { required: true, message: 'Veuillez saisir votre email' },
          { type: 'email', message: 'Veuillez saisir un email valide' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={['personalInfo', 'phone']}
        label="Téléphone"
        rules={[{ required: true, message: 'Veuillez saisir votre numéro de téléphone' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={['personalInfo', 'address']}
        label="Adresse"
      >
        <Input />
      </Form.Item>

      <Space style={{ display: 'flex' }} align="baseline">
        <Form.Item
          name={['personalInfo', 'linkedin']}
          label="LinkedIn"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['personalInfo', 'github']}
          label="GitHub"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={['personalInfo', 'portfolio']}
          label="Portfolio"
        >
          <Input />
        </Form.Item>
      </Space>

      <Form.Item
        name="summary"
        label="Résumé professionnel"
        rules={[{ required: true, message: 'Veuillez saisir votre résumé professionnel' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Divider>Expérience professionnelle</Divider>

      <Form.List name="experience">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'position']}
                  rules={[{ required: true, message: 'Poste manquant' }]}
                >
                  <Input placeholder="Poste" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'company']}
                  rules={[{ required: true, message: 'Entreprise manquante' }]}
                >
                  <Input placeholder="Entreprise" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'period']}
                  rules={[{ required: true }]}
                >
                  <RangePicker />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'description']}
                  rules={[{ required: true }]}
                >
                  <TextArea placeholder="Description" rows={4} />
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

      <Divider>Formation</Divider>

      <Form.List name="education">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'degree']}
                  rules={[{ required: true, message: 'Diplôme manquant' }]}
                >
                  <Input placeholder="Diplôme" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'school']}
                  rules={[{ required: true, message: 'École manquante' }]}
                >
                  <Input placeholder="École" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'period']}
                  rules={[{ required: true }]}
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

      <Divider>Compétences</Divider>

      <Form.List name="skills">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Nom de la compétence manquant' }]}
                >
                  <Input placeholder="Compétence" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'level']}
                  rules={[{ required: true, message: 'Niveau manquant' }]}
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

      <Divider>Langues</Divider>

      <Form.List name="languages">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true, message: 'Langue manquante' }]}
                >
                  <Input placeholder="Langue" />
                </Form.Item>

                <Form.Item
                  {...restField}
                  name={[name, 'level']}
                  rules={[{ required: true, message: 'Niveau manquant' }]}
                >
                  <Select
                    options={[
                      { value: 'débutant', label: 'Débutant' },
                      { value: 'intermédiaire', label: 'Intermédiaire' },
                      { value: 'avancé', label: 'Avancé' },
                      { value: 'bilingue', label: 'Bilingue' },
                    ]}
                  />
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
        <Button type="primary" htmlType="submit">
          Enregistrer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CVForm; 