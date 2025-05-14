import React, { useState } from 'react';
import { Steps, Button, message, Layout, Typography, Spin } from 'antd';
import TemplateSelection from './components/TemplateSelection';
import CVForm from './components/CVForm';
import CustomizationForm from './components/CustomizationForm';
import CVPreview from './components/CVPreview';
import { CVProvider, useCV } from './context/CVContext';
import { exportCV } from './services/documentExport';
import { CVGeneratorProps } from '../../types/cv';
import { useSubscription } from '../../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title: AntTitle } = Typography;

const steps = [
  {
    title: 'Modèle',
    description: 'Choisissez votre template'
  },
  {
    title: 'Informations',
    description: 'Remplissez vos informations'
  },
  {
    title: 'Personnalisation',
    description: 'Personnalisez le design'
  },
  {
    title: 'Aperçu & Export',
    description: 'Prévisualisez et exportez'
  }
];

const CVGeneratorContent: React.FC<CVGeneratorProps> = ({ isSubscribed }) => {
  const {
    cvData,
    setCVData,
    selectedTemplate,
    setSelectedTemplate,
    customization,
    setCustomization,
    currentStep,
    setCurrentStep,
    isValid
  } = useCV();

  const previewRef = React.useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!selectedTemplate) {
        message.error('Veuillez sélectionner un modèle');
        return;
      }
      message.success('Template sélectionné avec succès !');
    }
    if (currentStep === 1 && !isValid) {
      message.error('Veuillez remplir correctement tous les champs obligatoires');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      if (!isValid || !selectedTemplate || !previewRef.current) {
        message.error('Veuillez remplir correctement tous les champs obligatoires avant l\'export');
        return;
      }
      
      setIsExporting(true);
      await exportCV(cvData!, selectedTemplate, customization, previewRef, format);
      message.success(`CV exporté avec succès en format ${format.toUpperCase()}`);
    } catch (error) {
      message.error('Erreur lors de l\'export : ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  const renderStepContent = () => {
    if (isExporting) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '20px' }}>Export en cours...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <TemplateSelection
            selected={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        );
      case 1:
        return (
          <CVForm
            data={cvData}
            onChange={setCVData}
          />
        );
      case 2:
        return (
          <CustomizationForm
            options={customization}
            onChange={setCustomization}
          />
        );
      case 3:
        return (
          <div>
            <div ref={previewRef}>
              <CVPreview
                data={cvData!}
                template={selectedTemplate!}
                customization={customization}
                isSubscribed={isSubscribed}
              />
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <Button 
                type="primary" 
                onClick={() => handleExport('pdf')}
                loading={isExporting}
              >
                Exporter en PDF
              </Button>
              <Button 
                onClick={() => handleExport('docx')}
                loading={isExporting}
              >
                Exporter en Word
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Content style={{ padding: '50px 50px 0', maxWidth: 1200, margin: '0 auto' }}>
        <AntTitle level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          Créez votre CV professionnel
        </AntTitle>

        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 40 }}
        />

        <div style={{ marginBottom: 40 }}>
          {renderStepContent()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 50 }}>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>
              Précédent
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button 
              type="primary" 
              onClick={handleNext}
              disabled={currentStep === 0 && !selectedTemplate}
            >
              Suivant
            </Button>
          )}
        </div>
      </Content>
    </Layout>
  );
};

const CVGenerator: React.FC<Partial<CVGeneratorProps>> = (props) => {
  const { hasActiveSubscription, loading } = useSubscription();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !hasActiveSubscription) {
      navigate('/subscription', { replace: true });
    }
  }, [loading, hasActiveSubscription, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 100 }}>Chargement...</div>;
  }

  return (
    <CVProvider>
      <CVGeneratorContent {...props} />
    </CVProvider>
  );
};

export default CVGenerator; 