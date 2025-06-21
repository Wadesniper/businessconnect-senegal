import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Typography, Row, Col, Select, Input, Empty, Tag, Tooltip, Button, Modal, Spin } from 'antd';
import { LockOutlined, StarOutlined } from '@ant-design/icons';
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
        <Row gutter={[12, 20]} style={{ margin: 0 }}>
          {filteredTemplates.map((template, idx) => (
            <Col xs={24} sm={12} md={8} lg={6} key={template.id} style={{ display: 'flex', alignItems: 'stretch' }}>
              <Card
                hoverable
                cover={
                  <div
                    style={{
                      position: 'relative',
                      background: '#fff',
                      width: '100%',
                      height: 'clamp(280px, 40vw, 340px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      boxShadow: '0 4px 16px #0001',
                      margin: '0 auto',
                      overflow: 'hidden',
                      padding: 6,
                    }}
                    className={`${styles.cvMiniature} appear`}
                  >
                    {template.previewImage ? (
                      <img
                        src={template.previewImage}
                        alt={template.name + ' preview'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top',
                          borderRadius: 6,
                          display: 'block',
                          background: '#fff',
                          margin: '0 auto',
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        overflow: 'hidden', 
                        position: 'relative', 
                        background: '#f0f2f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CVPreview
                          data={DEMO_PROFILES[template.id] || {
                            personalInfo: { firstName: '', lastName: '', title: '', email: '', phone: '', address: '', photo: '', summary: '' },
                            experience: [],
                            education: [],
                            skills: [],
                            languages: [],
                            certifications: [],
                            projects: [],
                            interests: [],
                          }}
                          template={template}
                          customization={defaultCustomization}
                          isPremium={true}
                          isMiniature={true}
                        />
                      </div>
                    )}
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
                  boxShadow: selected?.id === template.id ? '0 0 0 2px #1890ff33, 0 8px 32px #1890ff11' : '0 4px 18px #1890ff11',
                  cursor: isPremium ? 'pointer' : 'not-allowed',
                  borderRadius: 16,
                  transition: 'box-shadow 0.22s cubic-bezier(.4,2,.3,1), border 0.22s',
                  overflow: 'hidden',
                  background: '#fff',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
                bodyStyle={{ 
                  padding: '12px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1
                }}
              >
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', marginBottom: 12 }}>
                <Card.Meta
                  title={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontWeight: 600, 
                      fontSize: 'clamp(14px, 3vw, 16px)', 
                      whiteSpace: 'normal', 
                      lineHeight: '1.2',
                      wordBreak: 'break-word'
                    }}>
                      {template.name}
                      {template.premium && (
                        <Tooltip title="Template Premium">
                          <StarOutlined style={{ color: '#ffd700', flexShrink: 0 }} />
                        </Tooltip>
                      )}
                    </div>
                  }
                  description={
                    <>
                      <div style={{fontSize: 'clamp(12px, 2.5vw, 14px)'}}><b>Secteur :</b> {template.category}</div>
                      <div style={{ 
                        marginTop: 6, 
                        fontSize: 'clamp(11px, 2.5vw, 13px)', 
                        whiteSpace: 'normal',
                        lineHeight: '1.3',
                        wordBreak: 'break-word'
                      }}>{template.description}</div>
                      {template.features && (
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {template.features.map((feature, index) => (
                            <Tag key={index} color="blue" style={{ 
                              margin: 0,
                              fontSize: 'clamp(10px, 2.5vw, 12px)',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word'
                            }}>
                              {feature}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </>
                  }
                />
                </div>
                <div style={{ width: '100%', marginTop: 'auto' }}>
                {selected?.id === template.id && (
                    <div style={{ textAlign: 'center', marginTop: 0, marginBottom: 8 }}>
                    <Button type="primary" size="large" htmlType="button" onClick={onContinue} style={{ width: '100%' }}>
                      Utiliser ce modèle
                    </Button>
                  </div>
                )}
                <Button
                  type="default"
                  size="small"
                    style={{ width: '100%' }}
                  onClick={e => { e.stopPropagation(); setPreviewTemplate(template); }}
                >
                  Aperçu
                </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Modal de prévisualisation - Responsive */}
      <Modal
        open={!!previewTemplate}
        onCancel={() => setPreviewTemplate(null)}
        footer={null}
        width="95vw"
        style={{ 
          top: 20, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          maxWidth: '900px',
          margin: '0 auto'
        }}
        bodyStyle={{ 
          padding: 0, 
          background: '#f7faff', 
          borderRadius: 16, 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          overflowX: 'hidden', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
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