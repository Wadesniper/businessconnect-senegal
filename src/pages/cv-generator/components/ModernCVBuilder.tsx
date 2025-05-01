import React, { useState, useRef } from 'react';
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
  Space
} from 'antd';
import { 
  PlusOutlined, 
  DragOutlined, 
  EyeOutlined, 
  DownloadOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Section } from '../types';
import { CVData, Template, PersonalInfo, Experience, Education, Skill, Language } from '../../../../../businessconnect-senegal/client/src/types/cv';
import CVPreview from './CVPreview';
import './ModernCVBuilder.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface FormValues extends Omit<CVData, 'template'> {}

interface ModernCVBuilderProps {
  isSubscribed: boolean;
  onSave: (data: CVData) => void;
  onExport: (format: string) => void;
}

const ModernCVBuilder: React.FC<ModernCVBuilderProps> = ({
  isSubscribed,
  onSave,
  onExport
}) => {
  const [form] = Form.useForm<FormValues>();
  const [sections, setSections] = useState<Section[]>([
    { id: 'personal', title: 'Informations Personnelles', order: 0 },
    { id: 'experience', title: 'Expérience Professionnelle', order: 1 },
    { id: 'education', title: 'Formation', order: 2 },
    { id: 'skills', title: 'Compétences', order: 3 },
    { id: 'languages', title: 'Langues', order: 4 }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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
  const handleSave = async (values: FormValues) => {
    try {
      const cvData: CVData = {
        ...values,
        template: selectedTemplate?.id || 'modern'
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
            <DragDropContext onDragEnd={onDragEnd}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
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
                                {/* Contenu dynamique selon le type de section */}
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
            <CVPreview
              data={form.getFieldsValue()}
              template={selectedTemplate}
              scale={0.7}
            />
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

// Fonction helper pour rendre le contenu des sections
const renderSectionContent = (section: Section) => {
  switch (section.id) {
    case 'personal':
      return (
        <>
          <Form.Item
            name={['personal', 'firstName']}
            label="Prénom"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['personal', 'lastName']}
            label="Nom"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {/* Autres champs personnels */}
        </>
      );
    case 'experience':
      return (
        <Form.List name="experience">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Card key={field.key} className="experience-card">
                  <Form.Item
                    {...field}
                    name={[field.name, 'title']}
                    label="Poste"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  {/* Autres champs d'expérience */}
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Ajouter une expérience
              </Button>
            </>
          )}
        </Form.List>
      );
    // Autres sections...
    default:
      return null;
  }
};

export default ModernCVBuilder; 