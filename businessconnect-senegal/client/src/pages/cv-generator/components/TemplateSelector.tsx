import React, { useState } from 'react';
import { Card, Radio, Space, Tag, Image, Empty } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { Template } from '../../../types/cv';

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
    layout: 'modern'
  },
  {
    id: 'tech-2',
    name: 'Developer Classic',
    category: 'Tech',
    thumbnail: '/templates/tech-classic.png',
    premium: false,
    layout: 'classic'
  },
  {
    id: 'finance-1',
    name: 'Finance Pro',
    category: 'Finance',
    thumbnail: '/templates/finance-pro.png',
    premium: true,
    layout: 'classic'
  },
  {
    id: 'marketing-1',
    name: 'Creative Marketing',
    category: 'Marketing',
    thumbnail: '/templates/marketing-creative.png',
    premium: true,
    layout: 'creative'
  },
  {
    id: 'health-1',
    name: 'Medical Professional',
    category: 'Santé',
    thumbnail: '/templates/health-pro.png',
    premium: true,
    layout: 'classic'
  },
  {
    id: 'education-1',
    name: 'Teacher Classic',
    category: 'Education',
    thumbnail: '/templates/education-classic.png',
    premium: false,
    layout: 'classic'
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