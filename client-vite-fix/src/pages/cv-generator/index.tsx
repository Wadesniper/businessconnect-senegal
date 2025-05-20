import React, { useState } from 'react';
import { Steps, Button, message, Layout, Typography, Spin } from 'antd';
import TemplateSelection from './components/TemplateSelection';
import CVForm from './components/CVForm';
import CustomizationForm from './components/CustomizationForm';
import CVPreview from './components/CVPreview';
import { CVProvider, useCV } from './context/CVContext';
import { exportCV } from './services/documentExport';
import { useSubscription } from '../../hooks/useSubscription';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { hasPremiumAccess } from '../../utils/premiumAccess';

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

type CVGeneratorProps = { isSubscribed?: boolean };

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
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const isPremium = !!hasPremiumAccess(user, hasActiveSubscription);

  const handleSelectTemplate = (template: Template | null) => {
    setSelectedTemplate(template);
    if (template) {
      setCVData({
        personalInfo: {
          firstName: '',
          lastName: '',
          title: '',
          email: '',
          phone: '',
          address: '',
          // autres champs éventuels (photo, linkedin...)
        },
        experience: [],
        education: [],
        skills: [],
        languages: [],
        interests: [],
        summary: '',
        ...template.sampleData // si le template fournit des données par défaut
      });
    }
  };

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
      await exportCV(previewRef.current, cvData!, selectedTemplate, customization, { format });
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
            onSelect={handleSelectTemplate}
            isPremium={isPremium}
          />
        );
      case 1:
        return (
          <CVForm
            data={cvData}
            onChange={setCVData}
            isPremium={isPremium}
          />
        );
      case 2:
        return (
          <CustomizationForm
            options={customization}
            onChange={setCustomization}
            isPremium={isPremium}
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
                isPremium={isPremium}
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
      <Content style={{ padding: '0', maxWidth: 1200, margin: '0 auto' }}>
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 40, marginTop: 0 }}
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

const TIMEOUT = 10000; // 10 secondes
const CVGenerator: React.FC<Partial<CVGeneratorProps>> = (props) => {
  const { hasActiveSubscription, loading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeoutReached, setTimeoutReached] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), TIMEOUT);
    return () => clearTimeout(timer);
  }, []);

  const isPremium = !!hasPremiumAccess(user, hasActiveSubscription);
  const showProfileAlert = Boolean(user) && !isPremium && timeoutReached && loading;

  React.useEffect(() => {
    setSelectedTemplate(null);
    setCurrentStep(0);
  }, [user?.id]);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Content style={{ padding: '40px 8px 0', maxWidth: 1200, margin: '0 auto' }}>
        {showProfileAlert && (
          <div style={{
            background: '#fffbe6',
            border: '1.5px solid #ffe58f',
            borderRadius: 12,
            padding: '12px 10px',
            margin: '0 auto 24px auto',
            maxWidth: 700,
            textAlign: 'center',
            color: '#ad8b00',
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 2px 8px #ffe58f33',
          }}>
            ⚠️ Impossible de charger votre profil pour le moment. Certaines fonctionnalités peuvent être limitées. Merci de vérifier votre connexion ou de réessayer plus tard.
          </div>
        )}
        <div style={{
          background: 'linear-gradient(90deg, #e6f0ff 0%, #f7faff 100%)',
          borderRadius: 24,
          padding: '32px 16px 24px 16px',
          marginBottom: 32,
          textAlign: 'center',
          boxShadow: '0 4px 24px #e3e8f7',
          maxWidth: 900,
          margin: '0 auto 32px auto',
        }}>
          <AntTitle level={2} style={{ color: '#1890ff', fontWeight: 800, marginBottom: 8 }}>
            Générateur de CV professionnel
          </AntTitle>
          <div style={{ fontSize: 18, color: '#333', marginBottom: 0 }}>
            Créez, personnalisez et exportez votre CV premium en quelques clics.
          </div>
        </div>
        {!isPremium && user && !['admin', 'superadmin'].includes(String(user.role).toLowerCase()) && (
          <div style={{
            background: 'linear-gradient(90deg, #fffbe6 0%, #f7faff 100%)',
            border: '1.5px solid #ffe58f',
            borderRadius: 16,
            padding: '18px 12px',
            margin: '0 auto 32px auto',
            maxWidth: 700,
            textAlign: 'center',
            color: '#ad8b00',
            fontWeight: 600,
            fontSize: 17,
            boxShadow: '0 2px 8px #ffe58f33',
          }}>
            <span>Pour créer et télécharger votre CV, <span style={{color:'#1890ff', fontWeight:700}}>abonnez-vous</span> à la plateforme !</span>
            <br />
            <button
              style={{
                marginTop: 10,
                background: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 22px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #1890ff22',
                transition: 'background 0.2s',
              }}
              onClick={() => navigate('/subscription')}
            >
              S'abonner
            </button>
          </div>
        )}
        <div style={{ marginBottom: 40 }}>
          <CVProvider>
            <CVGeneratorContent isSubscribed={props.isSubscribed} />
          </CVProvider>
        </div>
      </Content>
    </Layout>
  );
};

export default CVGenerator; 