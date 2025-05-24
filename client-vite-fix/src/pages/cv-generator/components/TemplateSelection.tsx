import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

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
                  <div
                    style={{
                      position: 'relative',
                      background: '#fff',
                      width: 380,
                      height: 396,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      boxShadow: '0 4px 16px #0001',
                      margin: '0 auto',
                      overflow: 'hidden',
                      padding: 6,
                    }}
                    className={styles.cvMiniature}
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
                      <div
                        style={{
                          width: 794,
                          height: 1123,
                          transform: 'scale(0.31)',
                          transformOrigin: 'top left',
                          pointerEvents: 'none',
                          background: '#fff',
                          borderRadius: 12,
                          boxShadow: '0 2px 8px #0001',
                          border: '1px solid #eee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          padding: 0,
                        }}
                        className={styles.cvMiniature}
                      >
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
                    <Button type="primary" size="large" onClick={onContinue} style={{ width: '100%' }}>
                      Utiliser ce modèle
                    </Button>
                  </div>
                )}
                <Button
                  type="default"
                  size="small"
                  style={{ marginTop: 12, width: '100%' }}
                  onClick={e => { e.stopPropagation(); setPreviewTemplate(template); }}
                >
                  Aperçu
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        open={!!previewTemplate}
        onCancel={() => setPreviewTemplate(null)}
        footer={null}
        width={900}
        style={{ top: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        bodyStyle={{ padding: 0, background: '#f7faff', borderRadius: 16, maxHeight: '90vh', overflowY: 'auto', overflowX: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        destroyOnClose
      >
        {previewTemplate && (
          <div ref={modalContentRef} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0002', padding: 0, margin: 0, width: 794, height: 1123, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {previewTemplate.previewImage ? (
              <img
                src={previewTemplate.previewImage}
                alt={previewTemplate.name + ' preview'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', borderRadius: 12, display: 'block', background: '#fff' }}
              />
            ) : (
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
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplateSelection; 