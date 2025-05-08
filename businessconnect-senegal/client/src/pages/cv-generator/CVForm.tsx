import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Space, Typography, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { PersonalInfo, Experience, Education, Skill, Language, Project, Certification } from './types';

const { Title } = Typography;
const { Option } = Select;

const initialPersonalInfo: PersonalInfo = {
  firstName: '',
  lastName: '',
  title: '',
  email: '',
  phone: '',
  address: '',
  photo: '',
  linkedin: '',
  portfolio: ''
};

const CVForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Title level={3}>Informations personnelles</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ personalInfo: initialPersonalInfo }}
      >
        <Form.Item label="Prénom" name={['personalInfo', 'firstName']} rules={[{ required: true, message: 'Champ requis' }]}> <Input /> </Form.Item>
        <Form.Item label="Nom" name={['personalInfo', 'lastName']} rules={[{ required: true, message: 'Champ requis' }]}> <Input /> </Form.Item>
        <Form.Item label="Titre professionnel" name={['personalInfo', 'title']}> <Input /> </Form.Item>
        <Form.Item label="Email" name={['personalInfo', 'email']} rules={[{ required: true, type: 'email', message: 'Email invalide' }]}> <Input /> </Form.Item>
        <Form.Item label="Téléphone" name={['personalInfo', 'phone']}> <Input /> </Form.Item>
        <Form.Item label="Adresse" name={['personalInfo', 'address']}> <Input /> </Form.Item>
        <Form.Item label="Photo (URL)" name={['personalInfo', 'photo']}> <Input /> </Form.Item>
        <Form.Item label="LinkedIn" name={['personalInfo', 'linkedin']}> <Input /> </Form.Item>
        <Form.Item label="Portfolio" name={['personalInfo', 'portfolio']}> <Input /> </Form.Item>

        <Title level={3} style={{ marginTop: 32 }}>Résumé professionnel</Title>
        <Form.Item label="Résumé" name="summary"> <Input.TextArea rows={3} /> </Form.Item>

        <Divider />
        <Title level={4}>Expériences professionnelles</Title>
        <Form.List name="experience">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name, 'position']} rules={[{ required: true, message: 'Poste requis' }]}>
                    <Input placeholder="Poste" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'company']} rules={[{ required: true, message: 'Entreprise requise' }]}>
                    <Input placeholder="Entreprise" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'startDate']} rules={[{ required: true, message: 'Date de début requise' }]}>
                    <DatePicker picker="month" placeholder="Début" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'endDate']}>
                    <DatePicker picker="month" placeholder="Fin" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'description']}>
                    <Input placeholder="Description" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Ajouter une expérience</Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />
        <Title level={4}>Éducation</Title>
        <Form.List name="education">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name, 'degree']} rules={[{ required: true, message: 'Diplôme requis' }]}>
                    <Input placeholder="Diplôme" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'school']} rules={[{ required: true, message: 'Établissement requis' }]}>
                    <Input placeholder="Établissement" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'startDate']} rules={[{ required: true, message: 'Date de début requise' }]}>
                    <DatePicker picker="month" placeholder="Début" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'endDate']}>
                    <DatePicker picker="month" placeholder="Fin" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'description']}>
                    <Input placeholder="Description" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Ajouter une formation</Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />
        <Title level={4}>Compétences</Title>
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Compétence requise' }]}>
                    <Input placeholder="Compétence" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'level']}>
                    <Select placeholder="Niveau">
                      <Option value={1}>Débutant</Option>
                      <Option value={2}>Intermédiaire</Option>
                      <Option value={3}>Avancé</Option>
                      <Option value={4}>Expert</Option>
                      <Option value={5}>Maîtrise totale</Option>
                    </Select>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Ajouter une compétence</Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />
        <Title level={4}>Langues</Title>
        <Form.List name="languages">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Langue requise' }]}>
                    <Input placeholder="Langue" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'level']}>
                    <Select placeholder="Niveau">
                      <Option value="débutant">Débutant</Option>
                      <Option value="intermédiaire">Intermédiaire</Option>
                      <Option value="avancé">Avancé</Option>
                      <Option value="bilingue">Bilingue</Option>
                    </Select>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Ajouter une langue</Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />
        <Title level={4}>Certifications</Title>
        <Form.List name="certifications">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Nom requis' }]}>
                    <Input placeholder="Nom de la certification" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'issuer']}>
                    <Input placeholder="Organisme" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'date']}>
                    <DatePicker picker="month" placeholder="Date" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'url']}>
                    <Input placeholder="Lien (optionnel)" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Ajouter une certification</Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />
        <Title level={4}>Projets</Title>
        <Form.List name="projects">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Nom requis' }]}>
                    <Input placeholder="Nom du projet" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'description']}>
                    <Input placeholder="Description" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'technologies']}>
                    <Input placeholder="Technologies (séparées par des virgules)" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'url']}>
                    <Input placeholder="Lien (optionnel)" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Ajouter un projet</Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider />
        <Title level={4}>Centres d'intérêt</Title>
        <Form.List name="interests">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...restField} name={name} rules={[{ required: true, message: 'Centre d\'intérêt requis' }]}>
                    <Input placeholder="Centre d'intérêt" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Ajouter un centre d'intérêt</Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" size="large">Voir l'aperçu</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CVForm; 