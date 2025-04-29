import React, { useState, useRef } from 'react';
import { Layout, Steps, Button, message, Row, Col, Modal, Radio } from 'antd';
import { CVData, Template, CustomizationOptions } from './types';
import TemplateSelection from './components/TemplateSelection';
import CVForm from './components/CVForm';
import CustomizationForm from './components/CustomizationForm';
import CVPreview from './components/CVPreview';
import { exportCV, ExportFormat } from './services/documentExport';

const { Content } = Layout;

const defaultCustomization: CustomizationOptions = {
  primaryColor: '#1890ff',
  secondaryColor: '#52c41a',
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  spacing: 'comfortable',
};

const CVGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [template, setTemplate] = useState<Template | null>(null);
  const [cvData, setCVData] = useState<CVData | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>(defaultCustomization);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const previewRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      title: 'Modèle',
      content: (
        <TemplateSelection
          selected={template}
          onSelect={setTemplate}
        />
      ),
    },
    {
      title: 'Informations',
      content: (
        <CVForm
          data={cvData}
          onChange={setCVData}
        />
      ),
    },
    {
      title: 'Personnalisation',
      content: (
        <CustomizationForm
          options={customization}
          onChange={setCustomization}
        />
      ),
    },
    {
      title: 'Aperçu',
      content: cvData && template && (
        <div ref={previewRef}>
          <CVPreview
            data={cvData}
            template={template}
            customization={customization}
          />
        </div>
      ),
    },
  ];

  const next = () => {
    if (currentStep === 0 && !template) {
      message.error('Veuillez sélectionner un modèle');
      return;
    }
    if (currentStep === 1 && !cvData) {
      message.error('Veuillez remplir les informations requises');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const showExportModal = () => {
    setIsExportModalVisible(true);
  };

  const handleExportModalCancel = () => {
    setIsExportModalVisible(false);
  };

  const handleExport = async () => {
    if (!cvData || !template) {
      message.error('Données du CV manquantes');
      return;
    }

    try {
      await exportCV(cvData, template, customization, previewRef, exportFormat);
      message.success(`CV exporté avec succès en format ${exportFormat.toUpperCase()}`);
      setIsExportModalVisible(false);
    } catch (error: any) {
      message.error(`Erreur lors de l'export du CV : ${error?.message || 'Une erreur est survenue'}`);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map(item => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>

        <div style={{ marginBottom: 24, minHeight: 400 }}>
          {steps[currentStep].content}
        </div>

        <Row justify="end" gutter={16}>
          {currentStep > 0 && (
            <Col>
              <Button onClick={prev}>
                Précédent
              </Button>
            </Col>
          )}
          <Col>
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Suivant
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={showExportModal}>
                Exporter
              </Button>
            )}
          </Col>
        </Row>

        <Modal
          title="Exporter le CV"
          open={isExportModalVisible}
          onOk={handleExport}
          onCancel={handleExportModalCancel}
          okText="Exporter"
          cancelText="Annuler"
        >
          <p>Choisissez le format d'export :</p>
          <Radio.Group value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
            <Radio.Button value="pdf">PDF</Radio.Button>
            <Radio.Button value="docx">Word (DOCX)</Radio.Button>
          </Radio.Group>
        </Modal>
      </Content>
    </Layout>
  );
};

export default CVGenerator; 