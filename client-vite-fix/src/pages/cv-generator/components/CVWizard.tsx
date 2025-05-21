import React, { useState } from 'react';
import type { CVData } from '../../../types/cv';
import PersonalInfoForm from './PersonalInfoForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import LanguagesForm from './LanguagesForm';
import CertificationsForm from './CertificationsForm';
import ProjectsForm from './ProjectsForm';
import InterestsForm from './InterestsForm';

interface CVWizardProps {
  initialData: CVData;
  onSubmit: (data: CVData) => void;
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

const CVWizard: React.FC<CVWizardProps> = ({ initialData, onSubmit }) => {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<CVData>(initialData);

  const goNext = () => setCurrent((c) => Math.min(c + 1, steps.length - 1));
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const handleChange = (key: keyof CVData) => (value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(data);
  };

  const StepComponent = steps[current].component;
  const stepKey = steps[current].key as keyof CVData;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #eee', padding: 32 }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h2>Étape {current + 1} / {steps.length} : {steps[current].label}</h2>
      </div>
      <StepComponent
        data={data[stepKey]}
        onChange={handleChange(stepKey)}
        onNext={current === steps.length - 1 ? handleSubmit : goNext}
        onPrev={current === 0 ? undefined : goPrev}
      />
    </div>
  );
};

export default CVWizard; 