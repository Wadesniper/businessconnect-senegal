import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Typography, Row, Col, Select, Input, Empty, Tag, Tooltip, Button, Modal, Spin, Carousel } from 'antd';
import { LockOutlined, StarOutlined, EyeOutlined } from '@ant-design/icons';
import type { Template } from '../../../types/cv';
import { CV_TEMPLATES } from '../components/data/templates';
import { useNavigate } from 'react-router-dom';
import { DEMO_PROFILES } from '../CVPreviewGallery';
import styles from './TemplateSelection.module.css';
import { useAuth } from '../../../context/AuthContext';
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
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (previewTemplate && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [previewTemplate]);

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

  const renderCard = (template: Template) => {
    const canSelect = user?.role === 'admin' || hasPremiumAccess(user) || !template.premium;
    const isSelected = selected?.id === template.id;

    return (
      <Card
        key={template.id}
        className={`${styles.templateCard} ${isSelected ? styles.selected : ''}`}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: isSelected ? '2px solid #1890ff' : '1px solid #e8e8e8'
        }}
        cover={
          <div className={styles.cardCover}>
            {template.previewImage ? (
              <img src={template.previewImage} alt={template.name} className={styles.previewImage} />
            ) : (
              <div className={styles.cvPreviewContainer}>
                <CVPreview
                  data={DEMO_PROFILES[template.id] || { personalInfo: { firstName: '', lastName: '', title: '', email: '', phone: '', address: '', photo: '', summary: '' }, experience: [], education: [], skills: [], languages: [], certifications: [], projects: [], interests: [] }}
                  template={template}
                  customization={defaultCustomization}
                  isPremium={true}
                  isMiniature={true}
                />
              </div>
            )}
            <div className={styles.overlay}>
              <Button icon={<EyeOutlined />} onClick={() => setPreviewTemplate(template)}>Aperçu</Button>
            </div>
            {template.premium && <Tag icon={<StarOutlined />} color="gold" className={styles.premiumTag}>Premium</Tag>}
          </div>
        }
      >
        <Card.Meta
          title={<span className={styles.cardTitle}>{template.name}</span>}
          description={
            <>
              <Text type="secondary">Secteur : {template.category}</Text>
              <p className={styles.cardDescription}>{template.description}</p>
            </>
          }
        />
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <Button
            type="primary"
            block
            disabled={!canSelect}
            onClick={() => {
              onSelect(template);
              if (onContinue) {
                onContinue();
              }
            }}
          >
            Utiliser ce modèle
          </Button>
        </div>
      </Card>
    );
  };

  if (!CV_TEMPLATES || CV_TEMPLATES.length === 0) {
    return <div style={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement de la galerie..." /></div>;
  }

  return (
    <div style={{ padding: '0 8px', width: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
      {/* Header premium modernisé */}
      <div style={{ textAlign: 'center', marginBottom: 18, marginTop: 0 }}>
        <span style={{ fontWeight: 600, color: '#1890ff', fontSize: 'clamp(18px, 4vw, 20px)', letterSpacing: 1 }}>
          Galerie de modèles de CV
        </span>
        <div style={{ color: '#888', fontSize: 'clamp(13px, 3vw, 15px)', marginBottom: 8 }}>
          Explorez tous nos modèles professionnels.
        </div>
      </div>
      
      {/* Filtres - Responsive amélioré */}
      <div style={{ 
        marginTop: 8,
        marginBottom: 24,
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <Search
          placeholder="Rechercher un modèle..."
          style={{ 
            flex: '2 1 250px',
            maxWidth: '100%'
          }}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ 
            flex: '1 1 180px',
            maxWidth: '100%'
          }}
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
        isMobile ? (
          <Carousel
            arrows
            dots={false}
            slidesToShow={1.2}
            slidesToScroll={1}
            infinite={false}
            style={{ padding: '0 20px' }}
            responsive={[
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1.1,
                },
              },
            ]}
          >
            {filteredTemplates.map((template) => (
              <div key={template.id} style={{ padding: '0 8px' }}>
                {renderCard(template)}
              </div>
            ))}
          </Carousel>
        ) : (
        <Row gutter={[12, 20]} style={{ margin: 0 }}>
          {filteredTemplates.map((template) => (
            <Col xs={24} sm={12} md={8} lg={6} key={template.id} style={{ display: 'flex', alignItems: 'stretch' }}>
              {renderCard(template)}
            </Col>
          ))}
        </Row>
        )
      )}
      
      {/* Modal de prévisualisation - Responsive */}
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
          <div 
            ref={modalContentRef} 
            style={{ 
              background: '#fff', 
              borderRadius: 16, 
              boxShadow: '0 4px 24px #0002', 
              padding: 0, 
              margin: 0, 
              width: '100%',
              maxWidth: '794px',
              height: 'auto',
              maxHeight: '80vh',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden',
              transform: 'scale(0.9)',
              transformOrigin: 'center center'
            }}
          >
            {previewTemplate.previewImage ? (
              <img
                src={previewTemplate.previewImage}
                alt={previewTemplate.name + ' preview'}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain', 
                  objectPosition: 'top', 
                  borderRadius: 12, 
                  display: 'block', 
                  background: '#fff' 
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <CVPreview
                  data={DEMO_PROFILES[previewTemplate.id] || {
                    personalInfo: { firstName: '', lastName: '', title: '', email: '', phone: '', address: '', photo: '', summary: '' },
                    experience: [],
                    education: [],
                    skills: [],
                    languages: [],
                    certifications: [],
                    projects: [],
                    interests: [],
                  }}
                  template={previewTemplate}
                  customization={defaultCustomization}
                  isPremium={true}
                  isMiniature={true}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplateSelection; 