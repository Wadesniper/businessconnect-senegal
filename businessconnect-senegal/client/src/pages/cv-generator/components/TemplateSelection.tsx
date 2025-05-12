import React, { useState, useMemo } from 'react';
import { Card, Typography, Row, Col, Select, Input, Empty, Tag, Tooltip, Button } from 'antd';
import { LockOutlined, StarOutlined } from '@ant-design/icons';
import { Template } from '../../../types/cv';
import { CV_TEMPLATES } from '../components/data/templates';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface TemplateSelectionProps {
  selected: Template | null;
  onSelect: (template: Template) => void;
  isSubscribed?: boolean;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  selected,
  onSelect,
  isSubscribed = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Extraction des catégories uniques
  const categories = useMemo(() => {
    const cats = new Set(CV_TEMPLATES.map(t => t.category));
    return ['all', ...Array.from(cats)] as string[];
  }, []);

  // Filtrage des templates
  const filteredTemplates = useMemo(() => {
    return CV_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      const matchesPremium = !showPremiumOnly || template.premium;

      return matchesSearch && matchesCategory && matchesPremium;
    });
  }, [searchTerm, selectedCategory, showPremiumOnly]);

  return (
    <div>
      <Title level={3}>Choisissez votre modèle de CV</Title>
      <Text>Sélectionnez un modèle professionnel adapté à votre secteur. Un abonnement est requis pour utiliser le générateur de CV.</Text>

      <div style={{ 
        marginTop: 24,
        marginBottom: 24,
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Search
          placeholder="Rechercher un modèle..."
          style={{ width: 300 }}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: 200 }}
        >
          {categories.map(cat => (
            <Option key={cat} value={cat}>
              {cat === 'all' ? 'Tous les secteurs' : cat}
            </Option>
          ))}
        </Select>
        <Button
          type={showPremiumOnly ? 'primary' : 'default'}
          icon={<StarOutlined />}
          onClick={() => setShowPremiumOnly(!showPremiumOnly)}
          style={{ display: 'none' }}
        >
          Premium uniquement
        </Button>
      </div>

      {filteredTemplates.length === 0 ? (
        <Empty
          description="Aucun modèle ne correspond à vos critères"
          style={{ margin: '40px 0' }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredTemplates.map(template => (
            <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={template.name}
                      src={template.thumbnail}
                      style={{
                        width: '100%',
                        height: 220,
                        objectFit: 'cover'
                      }}
                    />
                    {template.premium && !isSubscribed && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.7)',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <LockOutlined />
                        Premium
                      </div>
                    )}
                  </div>
                }
                onClick={() => {
                  if (!template.premium || isSubscribed) {
                    onSelect(template);
                  }
                }}
                style={{
                  border: selected?.id === template.id ? '2px solid #1890ff' : undefined,
                  cursor: template.premium && !isSubscribed ? 'not-allowed' : 'pointer'
                }}
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {template.name}
                      {template.premium && (
                        <Tooltip title="Template Premium">
                          <StarOutlined style={{ color: '#ffd700' }} />
                        </Tooltip>
                      )}
                    </div>
                  }
                  description={
                    <>
                      <div><b>Secteur :</b> {template.category}</div>
                      <div style={{ marginTop: 8 }}>{template.description}</div>
                      {template.features && (
                        <div style={{ marginTop: 8 }}>
                          {template.features.map((feature, index) => (
                            <Tag key={index} color="blue" style={{ margin: '4px' }}>
                              {feature}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TemplateSelection; 