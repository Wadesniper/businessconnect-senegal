import React from 'react';
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

const CVWizard: React.FC<CVWizardProps> = ({ current, setCurrent }) => {
  const { cvData, setCVData } = useCV();

  const goNext = () => setCurrent(current + 1);
  const goPrev = () => setCurrent(Math.max(current - 1, 0));

  const handleChange = (key: keyof CVData) => (value: any) => {
    setCVData({ ...cvData!, [key]: value });
  };

  const StepComponent = steps[current].component;
  const stepKey = steps[current].key as keyof CVData;

  if (!cvData) return null;
  const stepData: any = cvData[stepKey];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #eee', padding: 32 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2>Étape {current + 1} / {steps.length} : {steps[current].label}</h2>
      </div>
      <StepComponent
        data={stepData}
        onChange={handleChange(stepKey)}
        onNext={goNext}
        onPrev={goPrev}
      />
    </div>
  );
};

export default CVWizard; 