import React, { useState } from 'react';
import { Steps, Button, message } from 'antd';
import TemplateSelection from './components/TemplateSelection';
import CVForm from './components/CVForm';
import { CVData, Template, CustomizationOptions } from './types';

const { Step } = Steps;

const CVGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    primaryColor: '#1890ff',
    secondaryColor: '#f5f5f5',
    fontFamily: 'Arial',
    fontSize: '14px',
    spacing: 'comfortable',
  });

  const steps = [
    {
      title: 'Modèle',
      content: (
        <TemplateSelection
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
      ),
    },
    {
      title: 'Informations',
      content: <CVForm data={cvData} onChange={setCvData} />,
    },
    {
      title: 'Personnalisation',
      content: 'Composant de personnalisation à venir',
    },
    {
      title: 'Aperçu',
      content: 'Composant d\'aperçu à venir',
    },
  ];

  const next = () => {
    if (currentStep === 0 && !selectedTemplate) {
      message.error('Veuillez sélectionner un modèle');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    message.success('CV généré avec succès !');
    // Logique pour générer et télécharger le CV
  };

  return (
    <div style={{ padding: 24 }}>
      <Steps current={currentStep}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ marginTop: 24, minHeight: 400 }}>
        {steps[currentStep].content}
      </div>
      <div style={{ marginTop: 24 }}>
        {currentStep > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Précédent
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Suivant
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleFinish}>
            Terminer
          </Button>
        )}
      </div>
    </div>
  );
};

export default CVGenerator; 