import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Typography, Row, Col, Select, Input, Empty, Tag, Button, Modal, Spin } from 'antd';
import { StarOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Template } from '../../../types/cv';
import { CV_TEMPLATES } from '../components/data/templates';
import { DEMO_PROFILES } from '../CVPreviewGallery';
import { useAuth } from '../../../context/AuthContext';
import CVPreview from './CVPreview';
import { defaultCustomization } from '../context/CVContext';

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface TemplateSelectionProps {
  selected: Template | null;
  onSelect: (template: Template | null) => void;
  onContinue?: () => void;
  isPremium: boolean;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  selected,
  onSelect,
  onContinue,
  isPremium
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (previewTemplate && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [previewTemplate]);

  const categories = useMemo(() => {
    const cats = new Set(CV_TEMPLATES.map(t => t.category));
    return ['all', ...Array.from(cats)] as string[];
  }, []);

  const filteredTemplates = useMemo(() => {
    return CV_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleUseTemplate = (template: Template) => {
    // Logique simplifiée : tous les modèles sont premium.
    const canUse = isPremium || user?.role === 'admin';
    
    if (canUse) {
      onSelect(template);
      if (onContinue) onContinue();
    } else {
      setIsSubscriptionModalVisible(true);
    }
  };

  const renderCard = (template: Template) => {
    const isSelected = selected?.id === template.id;

    return (
      <Card
        key={template.id}
        hoverable
        className={isSelected ? 'template-card-selected' : ''}
        style={{
          border: isSelected ? '2px solid #1890ff' : '1px solid #e8e8e8',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%'
        }}
        bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}
        cover={
          <div style={{
            height: 'auto',
            overflow: 'hidden',
            position: 'relative',
            background: '#f5f5f5'
          }}>
            <img 
              src={template.previewImage} 
              alt={`Aperçu du CV ${template.name}`} 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              opacity: 0,
              transition: 'opacity 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '1'}
            onMouseOut={e => e.currentTarget.style.opacity = '0'}
            >
              <Button icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); }}>
                Aperçu
              </Button>
            </div>
            {/* Le tag Premium est toujours affiché car tous les modèles le sont */}
            <Tag icon={<StarOutlined />} color="gold" style={{ position: 'absolute', top: 8, right: 8 }}>
              Premium
            </Tag>
          </div>
        }
      >
        <div style={{ flexGrow: 1 }}>
          <Card.Meta
            title={template.name}
            description={`Secteur : ${template.category}`}
          />
        </div>
        <Button
          type="primary"
          block
          onClick={() => handleUseTemplate(template)}
          style={{ marginTop: '16px' }}
        >
          Utiliser ce modèle
        </Button>
      </Card>
    );
  };

  return (
    <div style={{ padding: '0 8px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Typography.Title level={2}>Galerie de modèles de CV</Typography.Title>
        <Typography.Text type="secondary">Explorez tous nos modèles professionnels.</Typography.Text>
      </div>
      
      <div style={{
        marginBottom: 24,
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Search
          placeholder="Rechercher un modèle..."
          style={{ flex: '1 1 250px', maxWidth: '400px' }}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ flex: '1 1 180px', maxWidth: '250px' }}
        >
          <Option value="all">Tous les secteurs</Option>
          {categories.filter(c => c !== 'all').map(cat => (
            <Option key={cat} value={cat}>{cat}</Option>
          ))}
        </Select>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <Empty description="Aucun modèle ne correspond à vos critères" style={{ margin: '40px 0' }} />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredTemplates.map((template) => (
            <Col xs={24} sm={12} md={8} lg={6} key={template.id} style={{ display: 'flex' }}>
              {renderCard(template)}
            </Col>
          ))}
        </Row>
      )}
      
      <Modal
        open={!!previewTemplate}
        onCancel={() => setPreviewTemplate(null)}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        bodyStyle={{ height: 'calc(90vh - 55px)', overflowY: 'auto' }}
        destroyOnClose
      >
        {previewTemplate && (
          <div ref={modalContentRef}>
            <CVPreview
              data={DEMO_PROFILES[previewTemplate.id] || { personalInfo: { firstName: 'John', lastName: 'Doe' }, experience: [], education: [], skills: [], languages: [], certifications: [], projects: [], interests: [] }}
              template={previewTemplate}
              customization={defaultCustomization}
              isPremium={true}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="Accès Premium Requis"
        open={isSubscriptionModalVisible}
        onCancel={() => setIsSubscriptionModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsSubscriptionModalVisible(false)}>
            Retour
          </Button>,
          <Button key="submit" type="primary" onClick={() => navigate('/pricing')}>
            Voir les abonnements
          </Button>,
        ]}
      >
        <p>Ce modèle de CV fait partie de nos offres Premium.</p>
        <p>Pour utiliser ce modèle et accéder à toutes nos fonctionnalités avancées, veuillez souscrire à un abonnement.</p>
      </Modal>
    </div>
  );
};

export default TemplateSelection;