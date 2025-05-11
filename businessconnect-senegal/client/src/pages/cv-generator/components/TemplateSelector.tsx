import React, { useState } from 'react';
import { Card, Radio, Space, Tag, Image, Empty } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { Template } from '../../../types/cv';
import { CV_TEMPLATES } from './data/templates';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  selectedTemplate: Template | null;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  selectedTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'Tous les modèles' },
    ...Array.from(new Set(CV_TEMPLATES.map(t => t.category))).map(cat => ({ value: cat, label: cat }))
  ];

  const filteredTemplates = CV_TEMPLATES.filter(
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
                  <img
                    alt={template.name}
                    src={template.thumbnail}
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
                  <Space direction="vertical">
                    <Tag color="blue">{template.category}</Tag>
                    {template.features && template.features.map((f, i) => (
                      <Tag key={i} color="cyan">{f}</Tag>
                    ))}
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