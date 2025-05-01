import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Select, DatePicker, Space, Typography, FloatButton } from 'antd';
import { PlusOutlined, MinusCircleOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { CVTemplateData } from '../../../data/cv-templates';
import CVPreview from './CVPreview';
import './CVBuilder.css';

const { Title } = Typography;
const { TextArea } = Input;

const initialCVData: CVTemplateData = {
  sector: '',
  profile: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    photo: '',
    linkedin: '',
    portfolio: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: []
};

const CVBuilder: React.FC = () => {
  const [form] = Form.useForm();
  const [cvData, setCVData] = useState<CVTemplateData>(initialCVData);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    setCVData(values as CVTemplateData);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Row gutter={24}>
        <Col 
          xs={isPreviewMode ? 0 : 24} 
          lg={12} 
          className="form-section"
          style={{ 
            transition: 'all 0.3s ease',
            display: isPreviewMode ? 'none' : 'block'
          }}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={initialCVData}
            onValuesChange={handleFormChange}
          >
            <Title level={4}>Informations Personnelles</Title>
            <Form.Item name={['profile', 'fullName']} label="Nom complet">
              <Input placeholder="Ex: Jean Dupont" />
            </Form.Item>

            <Form.Item name={['profile', 'title']} label="Titre professionnel">
              <Input placeholder="Ex: Développeur Full Stack" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={['profile', 'email']} label="Email">
                  <Input placeholder="email@exemple.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['profile', 'phone']} label="Téléphone">
                  <Input placeholder="+221 XX XXX XX XX" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name={['profile', 'location']} label="Localisation">
              <Input placeholder="Ex: Dakar, Sénégal" />
            </Form.Item>

            <Form.Item name="sector" label="Secteur d'activité">
              <Select placeholder="Sélectionnez votre secteur">
                <Select.Option value="tech">Technologie</Select.Option>
                <Select.Option value="finance">Finance</Select.Option>
                <Select.Option value="marketing">Marketing</Select.Option>
                <Select.Option value="consulting">Conseil</Select.Option>
                <Select.Option value="education">Éducation</Select.Option>
                <Select.Option value="health">Santé</Select.Option>
                <Select.Option value="entrepreneurship">Entrepreneuriat</Select.Option>
                <Select.Option value="fashion">Mode</Select.Option>
                <Select.Option value="media">Médias</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="summary" label="Résumé">
              <TextArea rows={4} placeholder="Présentez-vous en quelques lignes..." />
            </Form.Item>

            <Title level={4}>Expérience Professionnelle</Title>
            <Form.List name="experience">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'position']}
                        rules={[{ required: true, message: 'Champ requis' }]}
                      >
                        <Input placeholder="Poste" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'company']}
                        rules={[{ required: true, message: 'Champ requis' }]}
                      >
                        <Input placeholder="Entreprise" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'startDate']}
                        rules={[{ required: true, message: 'Champ requis' }]}
                      >
                        <DatePicker placeholder="Date de début" />
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
          </Form>
        </Col>
        
        <Col 
          xs={isPreviewMode ? 24 : 0} 
          lg={12} 
          className="preview-section"
          style={{ 
            position: 'sticky', 
            top: 0,
            transition: 'all 0.3s ease',
            display: isPreviewMode ? 'block' : 'none'
          }}
        >
          <div style={{ padding: '20px' }}>
            <Select
              value={selectedTemplate}
              onChange={setSelectedTemplate}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              <Select.Option value="modern">Template Moderne</Select.Option>
            </Select>
            
            <CVPreview 
              data={cvData}
              template={selectedTemplate}
              scale={0.7}
            />
          </div>
        </Col>
      </Row>

      <FloatButton
        className="preview-toggle"
        icon={isPreviewMode ? <EditOutlined /> : <EyeOutlined />}
        type="primary"
        onClick={togglePreviewMode}
        tooltip={isPreviewMode ? "Mode édition" : "Aperçu"}
        style={{
          right: 24,
          bottom: 24
        }}
      />
    </div>
  );
};

export default CVBuilder; 