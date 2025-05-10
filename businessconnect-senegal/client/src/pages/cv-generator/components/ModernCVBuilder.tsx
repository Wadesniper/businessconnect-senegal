import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Form, 
  Input, 
  Select, 
  Upload, 
  message,
  Tooltip,
  Space,
  DatePicker
} from 'antd';
import { 
  PlusOutlined, 
  DragOutlined, 
  EyeOutlined, 
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { CVData, Template, CustomizationOptions, Section } from '../../../types/cv';
import './ModernCVBuilder.css';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const defaultCustomization: CustomizationOptions = {
  primaryColor: '#1890ff',
  secondaryColor: '#096dd9',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  spacing: 'comfortable'
};

interface CVBuilderData extends Omit<CVData, 'template'> {
  template: Template;
  sections: Section[];
}

interface PreviewData extends CVData {
  sections: Section[];
}

interface ModernCVBuilderProps {
  isSubscribed: boolean;
  onSave: (data: CVBuilderData) => void;
  onExport: (format: string) => void;
  initialData?: CVBuilderData;
  templates: Template[];
  customization?: CustomizationOptions;
}

const ModernCVBuilder: React.FC<ModernCVBuilderProps> = ({
  isSubscribed,
  onSave,
  onExport,
  initialData,
  templates,
  customization = defaultCustomization
}) => {
  const [form] = Form.useForm<Omit<CVData, 'template'>>();
  const [sections, setSections] = useState<Section[]>([
    { id: 'personal', title: 'Informations Personnelles', order: 0 },
    { id: 'summary', title: 'Résumé', order: 1 },
    { id: 'experience', title: 'Expérience Professionnelle', order: 2 },
    { id: 'education', title: 'Formation', order: 3 },
    { id: 'skills', title: 'Compétences', order: 4 },
    { id: 'languages', title: 'Langues', order: 5 },
    { id: 'projects', title: 'Projets', order: 6 },
    { id: 'interests', title: 'Centres d\'intérêt', order: 7 }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [previewMode, setPreviewMode] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setSelectedTemplate(initialData.template);
      setSections(initialData.sections);
    }
  }, [initialData, form]);

  const renderSectionContent = (section: Section) => {
    switch (section.id) {
      case 'personal':
        return (
          <Form.Item
            name={['personalInfo']}
            initialValue={{}}
          >
            <Form.Item name={['personalInfo', 'firstName']} label="Prénom" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['personalInfo', 'lastName']} label="Nom" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['personalInfo', 'email']} label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['personalInfo', 'phone']} label="Téléphone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={['personalInfo', 'address']} label="Adresse">
              <Input />
            </Form.Item>
            <Form.Item name={['personalInfo', 'linkedin']} label="LinkedIn">
              <Input />
            </Form.Item>
            <Form.Item name={['personalInfo', 'portfolio']} label="Portfolio">
              <Input />
            </Form.Item>
          </Form.Item>
        );

      case 'experience':
        return (
          <Form.List name="experience">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="experience-item">
                    <Form.Item
                      {...restField}
                      name={[name, 'position']}
                      label="Poste"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'company']}
                      label="Entreprise"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'dates']}
                      label="Période"
                      rules={[{ required: true }]}
                    >
                      <RangePicker />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Description"
                    >
                      <TextArea rows={4} />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />}>
                      Supprimer
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Ajouter une expérience
                </Button>
              </>
            )}
          </Form.List>
        );

      case 'education':
        return (
          <Form.List name="education">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="education-item">
                    <Form.Item
                      {...restField}
                      name={[name, 'degree']}
                      label="Diplôme"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'school']}
                      label="École"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'dates']}
                      label="Période"
                      rules={[{ required: true }]}
                    >
                      <RangePicker />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Description"
                    >
                      <TextArea rows={4} />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />}>
                      Supprimer
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Ajouter une formation
                </Button>
              </>
            )}
          </Form.List>
        );

      case 'skills':
        return (
          <Form.List name="skills">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="skill-item">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Compétence"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'level']}
                      label="Niveau"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Select.Option value={1}>Débutant</Select.Option>
                        <Select.Option value={2}>Intermédiaire</Select.Option>
                        <Select.Option value={3}>Avancé</Select.Option>
                        <Select.Option value={4}>Expert</Select.Option>
                        <Select.Option value={5}>Maître</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'category']}
                      label="Catégorie"
                    >
                      <Input />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />}>
                      Supprimer
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Ajouter une compétence
                </Button>
              </>
            )}
          </Form.List>
        );

      case 'languages':
        return (
          <Form.List name="languages">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="language-item">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Langue"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'level']}
                      label="Niveau"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Select.Option value="Débutant">Débutant</Select.Option>
                        <Select.Option value="Intermédiaire">Intermédiaire</Select.Option>
                        <Select.Option value="Avancé">Avancé</Select.Option>
                        <Select.Option value="Bilingue">Bilingue</Select.Option>
                        <Select.Option value="Langue maternelle">Langue maternelle</Select.Option>
                      </Select>
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />}>
                      Supprimer
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Ajouter une langue
                </Button>
              </>
            )}
          </Form.List>
        );

      case 'summary':
        return (
          <Form.Item
            name="summary"
            label="Résumé professionnel"
          >
            <TextArea rows={4} placeholder="Décrivez brièvement votre profil et vos objectifs professionnels" />
          </Form.Item>
        );

      case 'projects':
        return (
          <Form.List name="projects">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="project-item">
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Titre du projet"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Description"
                      rules={[{ required: true }]}
                    >
                      <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'technologies']}
                      label="Technologies utilisées"
                    >
                      <Select mode="tags" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'url']}
                      label="URL du projet"
                    >
                      <Input />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />}>
                      Supprimer
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Ajouter un projet
                </Button>
              </>
            )}
          </Form.List>
        );

      case 'interests':
        return (
          <Form.List name="interests">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} className="interest-item">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Centre d'intérêt"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      label="Description"
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)} icon={<DeleteOutlined />}>
                      Supprimer
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Ajouter un centre d'intérêt
                </Button>
              </>
            )}
          </Form.List>
        );

      default:
        return null;
    }
  };

  // Gestion du drag and drop
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mise à jour de l'ordre
    const updatedSections = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setSections(updatedSections);
  };

  // Sauvegarde du CV
  const handleSave = async (values: Omit<CVData, 'template'>) => {
    try {
      const cvData: CVBuilderData = {
        ...values,
        template: selectedTemplate,
        sections
      };
      await onSave(cvData);
      message.success('CV sauvegardé avec succès !');
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
    }
  };

  // Export du CV
  const handleExport = async (format: string) => {
    if (!isSubscribed) {
      message.warning('Cette fonctionnalité est réservée aux abonnés');
      return;
    }
    try {
      await onExport(format);
      message.success(`CV exporté en format ${format.toUpperCase()}`);
    } catch (error) {
      message.error('Erreur lors de l\'export');
    }
  };

  return (
    <Layout className="modern-cv-builder">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={previewMode ? 24 : 12}>
          <Card className="builder-card">
            <Form.Item name="template" label="Template" rules={[{ required: true }]}>
              <Select
                value={selectedTemplate.id}
                onChange={(value) => {
                  const template = templates.find(t => t.id === value);
                  if (template) {
                    setSelectedTemplate(template);
                  }
                }}
              >
                {templates.map(template => (
                  <Select.Option key={template.id} value={template.id}>
                    {template.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <DragDropContext onDragEnd={onDragEnd}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={initialData}
                className="cv-form"
              >
                <Droppable droppableId="cv-sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {sections.map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="section-container"
                            >
                              <Card
                                title={
                                  <div className="section-header">
                                    <span {...provided.dragHandleProps}>
                                      <DragOutlined />
                                    </span>
                                    <Text strong>{section.title}</Text>
                                  </div>
                                }
                                className="section-card"
                              >
                                {renderSectionContent(section)}
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Space className="action-buttons">
                  <Button type="primary" htmlType="submit">
                    Sauvegarder
                  </Button>
                  <Tooltip title={!isSubscribed ? "Fonctionnalité premium" : ""}>
                    <Button 
                      onClick={() => handleExport('pdf')}
                      icon={<DownloadOutlined />}
                      disabled={!isSubscribed}
                    >
                      PDF
                    </Button>
                  </Tooltip>
                  <Tooltip title={!isSubscribed ? "Fonctionnalité premium" : ""}>
                    <Button
                      onClick={() => handleExport('docx')}
                      icon={<DownloadOutlined />}
                      disabled={!isSubscribed}
                    >
                      Word
                    </Button>
                  </Tooltip>
                </Space>
              </Form>
            </DragDropContext>
          </Card>
        </Col>

        <Col xs={24} lg={previewMode ? 0 : 12}>
          <div ref={previewRef} className="preview-container">
            {/* CVPreview component is removed as per the instructions */}
          </div>
        </Col>
      </Row>

      <Button
        className="preview-toggle"
        type="primary"
        icon={previewMode ? <EditOutlined /> : <EyeOutlined />}
        onClick={() => setPreviewMode(!previewMode)}
        shape="circle"
        size="large"
      />
    </Layout>
  );
};

export default ModernCVBuilder; 