import React, { useState } from 'react';
import { Steps, Button, message, Layout, Typography, Spin, Row, Col, Card } from 'antd';
import TemplateSelection from './components/TemplateSelection';
import CVWizard from './components/CVWizard';
import CVPreview from './components/CVPreview';
import { CVProvider, useCV } from './context/CVContext';
import { exportCV } from './services/documentExport';
import { useSubscription } from '../../hooks/useSubscription';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasPremiumAccess } from '../../utils/premiumAccess';
import type { Template } from '../../types/cv';
import CustomizationForm from './components/CustomizationForm';
import { CV_TEMPLATES } from './components/data/templates';
import {
  UserOutlined,
  SolutionOutlined,
  BookOutlined,
  StarOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  ProjectOutlined,
  HeartOutlined,
  EyeOutlined,
  FileDoneOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title: AntTitle } = Typography;

const steps = [
  { title: 'Modèle', key: 'template', icon: <FileDoneOutlined /> },
  { title: 'Informations personnelles', key: 'personalInfo', icon: <UserOutlined /> },
  { title: 'Expérience', key: 'experience', icon: <SolutionOutlined /> },
  { title: 'Formation', key: 'education', icon: <BookOutlined /> },
  { title: 'Compétences', key: 'skills', icon: <StarOutlined /> },
  { title: 'Langues', key: 'languages', icon: <GlobalOutlined /> },
  { title: 'Certifications', key: 'certifications', icon: <SafetyCertificateOutlined /> },
  { title: 'Projets', key: 'projects', icon: <ProjectOutlined /> },
  { title: "Centres d'intérêt", key: 'interests', icon: <HeartOutlined /> },
  { title: 'Aperçu', key: 'preview', icon: <EyeOutlined /> },
];

type CVGeneratorProps = { isSubscribed?: boolean };

// Fonction utilitaire pour un CVData vide mais typé
const emptyCVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  interests: [],
};

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
  const location = useLocation();

  // Lecture du paramètre template dans l'URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get('template');
    if (templateId) {
      const tpl = CV_TEMPLATES.find(t => t.id === templateId);
      if (tpl) {
        setSelectedTemplate(tpl);
        setCVData(tpl.sampleData || emptyCVData);
        setCurrentStep(steps.length - 1); // Aller directement à l'étape Aperçu
      }
    }
  }, [location.search]);

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

  const handleNext = () => setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(currentStep - 1);

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
    if (currentStep === 0) {
      return (
        <TemplateSelection
          selected={selectedTemplate}
          onSelect={handleSelectTemplate}
          isPremium={isPremium}
          onContinue={handleNext}
        />
      );
    }
    if (currentStep > 0 && currentStep < steps.length - 1) {
      // Étapes du wizard multi-pages
      return (
        <CVWizard
          initialData={cvData || emptyCVData}
          onSubmit={setCVData}
          current={currentStep - 1}
          setCurrent={step => setCurrentStep(step + 1)}
        />
      );
    }
    if (currentStep === steps.length - 1) {
      return (
        <Card style={{ marginTop: 24 }}>
          {selectedTemplate ? (
            <>
              <CVPreview
                data={cvData || emptyCVData}
                template={selectedTemplate}
                customization={customization}
                isPremium={isPremium}
              />
              <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                <Button type="primary" onClick={() => handleExport('pdf')}>Exporter en PDF</Button>
                <Button onClick={() => handleExport('docx')}>Exporter en Word</Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <Typography.Text type="secondary">Veuillez sélectionner un modèle de CV pour afficher l'aperçu.</Typography.Text>
            </div>
          )}
        </Card>
      );
    }
    return null;
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {currentStep === 0 ? (
        // Galerie de modèles : pas de stepper vertical, affichage horizontal
        <div>{renderStepContent()}</div>
      ) : (
        <Row gutter={32}>
          {/* Stepper vertical à gauche uniquement dans le wizard */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <Col xs={0} md={6} style={{ minWidth: 180 }}>
              <Steps
                direction="vertical"
                current={currentStep}
                items={steps.map(s => ({ ...s, status: undefined }))}
                style={{ minHeight: 600, background: 'none', padding: 0 }}
              />
            </Col>
          )}
          {/* Wizard à droite */}
          <Col xs={24} md={18}>
            {/* Stepper horizontal sur mobile */}
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <div style={{ marginBottom: 32, display: 'block' }}>
                <div className="cv-stepper-mobile" style={{ display: 'block' }}>
                  <Steps
                    direction="horizontal"
                    current={currentStep}
                    items={steps.map(s => ({ ...s, status: undefined }))}
                    style={{ marginBottom: 16, display: 'none' }}
                    responsive
                  />
                </div>
              </div>
            )}
            {renderStepContent()}
            {(currentStep === steps.length - 1) && (
              <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
                {currentStep > 0 && <Button onClick={handlePrev}>Précédent</Button>}
                {currentStep < steps.length - 1 && <Button type="primary" onClick={handleNext}>Suivant</Button>}
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

const TIMEOUT = 10000; // 10 secondes
const CVGenerator: React.FC<Partial<CVGeneratorProps>> = (props) => {
  const { hasActiveSubscription, loading } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isPremium = !!hasPremiumAccess(user, hasActiveSubscription);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Content style={{ padding: '40px 8px 0', maxWidth: 1200, margin: '0 auto' }}>
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