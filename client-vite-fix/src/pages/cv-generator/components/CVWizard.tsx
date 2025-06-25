import React, { useEffect, useRef, forwardRef } from 'react';
import type { CVData } from '../../../types/cv';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import LanguagesForm from './LanguagesForm';
import CertificationsForm from './CertificationsForm';
import ProjectsForm from './ProjectsForm';
import InterestsForm from './InterestsForm';
import PersonalInfoForm from './PersonalInfoForm';
import { useCV } from '../context/CVContext';
import { Button, message } from 'antd';

interface CVWizardProps {
  current: number;
  setCurrent: (step: number) => void;
}

const steps = [
  { key: 'personalInfo', label: 'Informations personnelles', component: PersonalInfoForm },
  { key: 'experience', label: 'Expérience', component: ExperienceForm },
  { key: 'education', label: 'Éducation', component: EducationForm },
  { key: 'skills', label: 'Compétences', component: SkillsForm },
  { key: 'languages', label: 'Langues', component: LanguagesForm },
  { key: 'certifications', label: 'Certifications', component: CertificationsForm },
  { key: 'projects', label: 'Projets', component: ProjectsForm },
  { key: 'interests', label: 'Intérêts', component: InterestsForm },
];

const CVWizard = forwardRef<HTMLDivElement, CVWizardProps>(({ current, setCurrent }, ref) => {
  const { cvData, setCVData, isStepValid } = useCV();

  // Ref sur le conteneur principal du wizard (utilise le ref passé ou un ref local)
  const wizardRef = (ref as React.RefObject<HTMLDivElement>) || useRef<HTMLDivElement>(null);

  // Effet pour remonter en haut du wizard à chaque changement d'étape
  useEffect(() => {
    const timer = setTimeout(() => {
      if (wizardRef.current) {
        wizardRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [current]);

  const goNext = () => {
    if (isStepValid(current + 1)) {
      setCurrent(current + 1);
    } else {
      message.error('Veuillez remplir tous les champs obligatoires.');
    }
  };
  
  const goPrev = () => setCurrent(Math.max(current - 1, 0));

  const handleChange = (key: keyof CVData) => (value: any) => {
    setCVData({ ...cvData!, [key]: value });
  };

  const StepComponent = steps[current].component;
  const stepKey = steps[current].key as keyof CVData;

  if (!cvData) return null;
  const stepData: any = cvData[stepKey];

  const formProps = {
    data: stepData,
    onChange: handleChange(stepKey),
    onNext: goNext,
    onPrev: goPrev,
  };

  return (
    <div ref={wizardRef} style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #eee', padding: 32 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2>Étape {current + 1} / {steps.length} : {steps[current].label}</h2>
      </div>
      <StepComponent {...formProps} />
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={goPrev} disabled={current === 0}>
          Précédent
        </Button>
        <Button type="primary" onClick={goNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
});

export default CVWizard; 