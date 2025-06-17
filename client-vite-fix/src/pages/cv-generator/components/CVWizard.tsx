import React, { useState } from 'react';
import type { CVData } from '../../../types/cv';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import LanguagesForm from './LanguagesForm';
import CertificationsForm from './CertificationsForm';
import ProjectsForm from './ProjectsForm';
import InterestsForm from './InterestsForm';
import PersonalInfoForm from './PersonalInfoForm';

interface CVWizardProps {
  initialData: CVData;
  onSubmit: (data: CVData) => void;
  current: number;
  setCurrent: (step: number) => void;
}

const steps = [
  { key: 'personalInfo', label: 'Informations personnelles', component: PersonalInfoForm },
  { key: 'experience', label: 'Expérience', component: ExperienceForm },
  { key: 'education', label: 'Formation', component: EducationForm },
  { key: 'skills', label: 'Compétences', component: SkillsForm },
  { key: 'languages', label: 'Langues', component: LanguagesForm },
  { key: 'certifications', label: 'Certifications', component: CertificationsForm },
  { key: 'projects', label: 'Projets', component: ProjectsForm },
  { key: 'interests', label: 'Centres d\'intérêt', component: InterestsForm },
];

const CVWizard: React.FC<CVWizardProps> = ({ initialData, onSubmit, current, setCurrent }) => {
  const [data, setData] = useState<CVData>(initialData);

  const goNext = () => setCurrent(current + 1);
  const goPrev = () => setCurrent(Math.max(current - 1, 0));

  const handleChange = (key: keyof CVData) => (value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(data);
  };

  const StepComponent = steps[current].component;
  const stepKey = steps[current].key as keyof CVData;
  let stepData: any = data[stepKey];
  if (stepData === undefined) {
    if (Array.isArray(data[stepKey])) stepData = [];
    else if (typeof data[stepKey] === 'object') stepData = {};
    else if (stepKey === 'personalInfo') stepData = { firstName: '', lastName: '', title: '', email: '', phone: '' };
    else stepData = '';
  }
  const handlePrev = () => { if (current > 0) goPrev(); };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #eee', padding: 32 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2>Étape {current + 1} / {steps.length} : {steps[current].label}</h2>
      </div>
      <StepComponent
        data={stepData}
        onChange={handleChange(stepKey)}
        onNext={goNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default CVWizard; 