import React, { useState } from 'react';
import { Card, Radio, Space, Tag, Image, Empty } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import type { Template } from '../../../types/cv';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  selectedTemplate: Template | null;
}

const templates: Template[] = [
  {
    id: 'tech-1',
    name: 'Tech Modern',
    category: 'Tech',
    thumbnail: '/templates/tech-modern.png',
    premium: true,
    layout: 'modern',
    previewImage: '/templates/tech-modern-preview.png',
    description: 'Un modèle moderne pour les profils tech.',
    features: ['Design moderne', 'Section projets', 'Compétences techniques'],
    profileImage: '/templates/tech-modern-profile.png',
    sampleData: {
      title: 'Développeur Fullstack',
      experience: ['Expérience 1', 'Expérience 2'],
      education: ['Diplôme 1', 'Diplôme 2'],
      skills: ['React', 'Node.js']
    }
  },
  {
    id: 'tech-2',
    name: 'Developer Classic',
    category: 'Tech',
    thumbnail: '/templates/tech-classic.png',
    premium: false,
    layout: 'classic',
    previewImage: '/templates/tech-classic-preview.png',
    description: 'Un modèle classique pour développeur.',
    features: ['Design classique', 'Section expérience'],
    profileImage: '/templates/tech-classic-profile.png',
    sampleData: {
      title: 'Développeur',
      experience: ['Expérience 1'],
      education: ['Diplôme 1'],
      skills: ['JavaScript']
    }
  },
  {
    id: 'finance-1',
    name: 'Finance Pro',
    category: 'Finance',
    thumbnail: '/templates/finance-pro.png',
    premium: true,
    layout: 'classic',
    previewImage: '/templates/finance-pro-preview.png',
    description: 'Modèle premium pour la finance.',
    features: ['Section finance', 'Design épuré'],
    profileImage: '/templates/finance-pro-profile.png',
    sampleData: {
      title: 'Analyste financier',
      experience: ['Expérience finance'],
      education: ['Master Finance'],
      skills: ['Excel', 'Analyse']
    }
  },
  {
    id: 'marketing-1',
    name: 'Creative Marketing',
    category: 'Marketing',
    thumbnail: '/templates/marketing-creative.png',
    premium: true,
    layout: 'creative',
    previewImage: '/templates/marketing-creative-preview.png',
    description: 'Modèle créatif pour le marketing.',
    features: ['Design créatif', 'Section portfolio'],
    profileImage: '/templates/marketing-creative-profile.png',
    sampleData: {
      title: 'Responsable marketing',
      experience: ['Expérience marketing'],
      education: ['Licence Marketing'],
      skills: ['SEO', 'Communication']
    }
  },
  {
    id: 'health-1',
    name: 'Medical Professional',
    category: 'Santé',
    thumbnail: '/templates/health-pro.png',
    premium: true,
    layout: 'classic',
    previewImage: '/templates/health-pro-preview.png',
    description: 'Modèle pour les professionnels de santé.',
    features: ['Section santé', 'Design sobre'],
    profileImage: '/templates/health-pro-profile.png',
    sampleData: {
      title: 'Médecin',
      experience: ['Expérience santé'],
      education: ['Doctorat Médecine'],
      skills: ['Diagnostic', 'Soins']
    }
  },
  {
    id: 'education-1',
    name: 'Teacher Classic',
    category: 'Education',
    thumbnail: '/templates/education-classic.png',
    premium: false,
    layout: 'classic',
    previewImage: '/templates/education-classic-preview.png',
    description: 'Modèle classique pour enseignants.',
    features: ['Section enseignement', 'Design clair'],
    profileImage: '/templates/education-classic-profile.png',
    sampleData: {
      title: 'Professeur',
      experience: ['Expérience enseignement'],
      education: ['CAPES'],
      skills: ['Pédagogie']
    }
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  selectedTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Tous les modèles' },
    { value: 'Tech', label: 'Tech / IT' },
    { value: 'Finance', label: 'Finance / Banque' },
    { value: 'Marketing', label: 'Marketing / Communication' },
    { value: 'Santé', label: 'Santé' },
    { value: 'Education', label: 'Education' },
    { value: 'Commerce', label: 'Commerce / Vente' },
    { value: 'Administration', label: 'Administration / RH' }
  ];

  const filteredTemplates = templates.filter(
    template => selectedCategory === 'all' || template.category === selectedCategory
  );

  return (
    <div>
      <Radio.Group
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
        buttonStyle="solid"
        style={{ marginBottom: '2rem' }}
      >
        <Space wrap>
          {categories.map(category => (
            <Radio.Button key={category.value} value={category.value}>
              {category.label}
            </Radio.Button>
          ))}
        </Space>
      </Radio.Group>

      {filteredTemplates.length === 0 ? (
        <Empty
          description="Aucun modèle disponible pour cette catégorie"
          style={{ margin: '2rem 0' }}
        />
      ) : (
        <Space wrap size="large" style={{ width: '100%' }}>
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              hoverable
              style={{
                width: 240,
                border: selectedTemplate?.id === template.id ? '2px solid #1890ff' : undefined
              }}
              onClick={() => onSelect(template)}
              cover={
                <div style={{ position: 'relative' }}>
                  <Image
                    alt={template.name}
                    src={template.thumbnail}
                    preview={false}
                    style={{ height: 320, objectFit: 'cover' }}
                  />
                  {template.premium && (
                    <Tag
                      icon={<CrownOutlined />}
                      color="gold"
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8
                      }}
                    >
                      Premium
                    </Tag>
                  )}
                </div>
              }
            >
              <Card.Meta
                title={template.name}
                description={
                  <Space>
                    <Tag color="blue">{template.category}</Tag>
                    <Tag color="cyan">{template.layout}</Tag>
                  </Space>
                }
              />
            </Card>
          ))}
        </Space>
      )}
    </div>
  );
};

export default TemplateSelector; 