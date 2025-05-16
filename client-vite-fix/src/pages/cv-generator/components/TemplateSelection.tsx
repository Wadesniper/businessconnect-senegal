import React, { useState, useMemo } from 'react';
import { Card, Typography, Row, Col, Select, Input, Empty, Tag, Tooltip, Button, Modal } from 'antd';
import { LockOutlined, StarOutlined } from '@ant-design/icons';
import type { Template } from '../../../types/cv';
import { CV_TEMPLATES } from '../components/data/templates';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
      <div style={{ textAlign: 'center', marginBottom: 32, marginTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <img src="/logo192.png" alt="Logo" style={{ width: 48, marginBottom: 4 }} />
          <Title level={2} style={{ fontWeight: 800, color: '#1890ff', letterSpacing: 1, marginBottom: 0 }}>
            Galerie de modèles de CV
          </Title>
          <div style={{ color: '#888', fontSize: 17, marginBottom: 8 }}>
            Explorez tous nos modèles professionnels. <br />
            <span style={{ color: '#1ec773', fontWeight: 600 }}>Abonnez-vous pour créer et exporter votre CV !</span>
          </div>
          {!isSubscribed && (
            <div style={{
              background: 'linear-gradient(90deg, #e6fff2 0%, #f0f5ff 100%)',
              borderRadius: 10,
              padding: '10px 18px',
              color: '#1ec773',
              fontWeight: 600,
              fontSize: 15,
              boxShadow: '0 2px 8px #1ec77311',
              marginBottom: 8,
              display: 'inline-block'
            }}>
              Découvrez tous nos modèles. <span style={{ color: '#1890ff' }}>Abonnez-vous pour créer et exporter votre CV.</span>
            </div>
          )}
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
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={template.name}
                      src={template.thumbnail}
                      style={{
                        width: '100%',
                        height: 220,
                        objectFit: 'cover',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        filter: template.premium && !isSubscribed ? 'grayscale(0.2)' : undefined,
                        opacity: template.premium && !isSubscribed ? 0.92 : 1
                      }}
                    />
                    {template.premium && !isSubscribed && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #222 60%, #1890ff99 100%)',
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 18,
                        zIndex: 2
                      }}>
                        <LockOutlined style={{ fontSize: 28, marginBottom: 6 }} />
                        Premium
                        <Button
                          type="primary"
                          size="small"
                          style={{
                            marginTop: 10,
                            background: 'linear-gradient(90deg, #1890ff 0%, #1ec773 100%)',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 700
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            navigate('/subscription');
                          }}
                        >
                          S'abonner
                        </Button>
                      </div>
                    )}
                  </div>
                }
                onClick={() => {
                  if (!isSubscribed) {
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
                  border: selected?.id === template.id ? '2px solid #1890ff' : undefined,
                  cursor: template.premium && !isSubscribed ? 'not-allowed' : 'pointer',
                  borderRadius: 10,
                  boxShadow: '0 4px 18px #1890ff11',
                  transition: 'box-shadow 0.2s',
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
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TemplateSelection; 