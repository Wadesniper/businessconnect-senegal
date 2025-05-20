import React, { useState, useMemo } from 'react';
import { Card, Typography, Row, Col, Select, Input, Empty, Tag, Tooltip, Button, Modal } from 'antd';
import { LockOutlined, StarOutlined } from '@ant-design/icons';
import type { Template } from '../../../types/cv';
import { CV_TEMPLATES } from '../components/data/templates';
import { useNavigate } from 'react-router-dom';
import { DEMO_PROFILES } from '../CVPreviewGallery';
import styles from './TemplateSelection.module.css';
import { useAuth } from '../../../hooks/useAuth';
import { hasPremiumAccess } from '../../../utils/premiumAccess';
import CVPreview from './CVPreview';
import { defaultCustomization } from '../context/CVContext';

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface TemplateSelectionProps {
  selected: Template | null;
  onSelect: (template: Template | null) => void;
  onContinue?: () => void;
  isSubscribed?: boolean;
  isPremium: boolean;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  selected,
  onSelect,
  onContinue,
  isSubscribed = false,
  isPremium
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      {/* Header premium modernisé */}
      <div style={{ textAlign: 'center', marginBottom: 18, marginTop: 0 }}>
        <span style={{ fontWeight: 600, color: '#1890ff', fontSize: 20, letterSpacing: 1 }}>
          Galerie de modèles de CV
        </span>
        <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
          Explorez tous nos modèles professionnels.
        </div>
      </div>
      {/* Filtres */}
      <div style={{ 
        marginTop: 8,
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
      </div>
      {/* Galerie de modèles */}
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
                  <div style={{ position: 'relative', background: '#f7faff', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      alt={template.name}
                      src={template.thumbnail}
                      style={{
                        width: '100%',
                        height: 220,
                        objectFit: 'cover',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8
                      }}
                    />
                    {/* Aperçu miniature du CV */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2, background: 'rgba(255,255,255,0.0)' }}>
                      <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400px', height: '600px', pointerEvents: 'none' }}>
                        <CVPreview
                          data={DEMO_PROFILES[template.id] || {}}
                          template={template}
                          customization={defaultCustomization}
                          isPremium={true}
                        />
                      </div>
                    </div>
                  </div>
                }
                onClick={() => {
                  if (!isPremium) {
                    Modal.info({
                      title: 'Fonctionnalité réservée',
                      content: 'Cette fonctionnalité est réservée aux abonnés. Abonnez-vous pour utiliser le générateur de CV.',
                      onOk: () => navigate('/subscription')
                    });
                    return;
                  }
                  onSelect(template);
                }}
                style={{
                  border: selected?.id === template.id ? '3px solid #1890ff' : '1px solid #eee',
                  boxShadow: selected?.id === template.id ? '0 0 0 2px #1890ff33' : '0 4px 18px #1890ff11',
                  cursor: isPremium ? 'pointer' : 'not-allowed',
                  borderRadius: 10,
                  transition: 'box-shadow 0.2s, border 0.2s',
                  overflow: 'hidden',
                  background: '#fff',
                  minHeight: 320
                }}
                bodyStyle={{ padding: 18 }}
              >
                <Card.Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: 18 }}>
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
                {selected?.id === template.id && isPremium && (
                  <div style={{ textAlign: 'center', marginTop: 18 }}>
                    <Button type="primary" size="large" onClick={onContinue}>
                      Commencer mon CV avec ce modèle
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TemplateSelection; 