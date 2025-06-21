import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Image,
  Divider,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Carousel,
  Select,
  Spin,
  Result,
} from 'antd';
import type { ImageProps } from 'antd';
import {
  EnvironmentOutlined,
  DollarCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  WhatsAppOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { marketplaceService } from '../../services/marketplaceService';
import type { MarketplaceItem } from '../../services/marketplaceService';
import { useAuth } from '../../context/AuthContext';
import styled from '@emotion/styled';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

// Styled components for better UI
const PageLayout = styled(Layout)`
  padding: 2rem;
  background: #f0f2f5;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: 1.5rem;
`;

const MainCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const ImageCarousel = styled(Carousel)`
  .slick-slide div {
    height: 500px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px 0 0 16px;
  }

  @media (max-width: 991px) {
    img {
      border-radius: 16px 16px 0 0;
    }
  }
`;

const InfoCol = styled(Col)`
  padding: 2rem !important;
  display: flex;
  flex-direction: column;
`;

const InfoTag = styled(Tag)`
  font-size: 0.9rem;
  padding: 0.3rem 0.7rem;
`;

const PriceText = styled(Text)`
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  font-weight: 700;
  color: #1ec773;
`;

const SectionDivider = styled(Divider)`
  margin: 1.5rem 0;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  color: #333;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
`;

const MarketplaceItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user, isAuthenticated } = useAuth();
  
  // Derived state is simpler and less prone to errors
  const isOwner = !!user && item?.userId === user.id;
  const isAdmin = user?.role === 'admin';

  const fetchItem = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await marketplaceService.getItem(id);
      setItem(data);
    } catch (error) {
      message.error("Erreur lors de la récupération de l'annonce");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleUpdate = async (values: any) => {
    if (!id) return;
    try {
      await marketplaceService.updateItem(id, values);
      message.success('Annonce mise à jour avec succès');
      setIsModalVisible(false);
      fetchItem();
    } catch (error) {
      message.error('Erreur lors de la mise à jour de l\'annonce');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await marketplaceService.deleteItem(id);
      message.success('Annonce supprimée avec succès');
      navigate('/marketplace');
    } catch (error) {
      message.error('Erreur lors de la suppression de l\'annonce');
    }
  };

  const formatPrice = (itemData: MarketplaceItem) => {
    if (!itemData) return 'Prix non disponible';
    switch (itemData.priceType) {
        case 'fixed':
            return itemData.price ? `${itemData.price.toLocaleString()} FCFA` : 'Prix fixe non spécifié';
        case 'range':
            return itemData.minPrice && itemData.maxPrice
                ? `Entre ${itemData.minPrice.toLocaleString()} et ${itemData.maxPrice.toLocaleString()} FCFA`
                : 'Fourchette de prix non définie';
        case 'negotiable':
            return 'Prix à négocier';
        case 'contact':
            return 'Contacter pour le prix';
        default:
            return 'Prix non spécifié';
    }
  };

  if (loading) {
    return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement de l'annonce..." /></div>;
  }

  if (!item) {
    return (
        <PageLayout>
            <Result
                status="404"
                title="Annonce non trouvée"
                subTitle="Désolé, l'annonce que vous recherchez n'existe pas ou a été supprimée."
                extra={<Button type="primary" onClick={() => navigate('/marketplace')}>Retour au Marketplace</Button>}
            />
        </PageLayout>
    );
  }

  const canManage = isAuthenticated && (isOwner || isAdmin);
  
  return (
    <PageLayout>
      <BackButton
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/marketplace')}
      >
        Retour au Marketplace
      </BackButton>
      
      <MainCard bodyStyle={{ padding: 0 }}>
        <Row>
          <Col xs={24} lg={12}>
            {Array.isArray(item.images) && item.images.length > 0 ? (
                <Image.PreviewGroup items={item.images}>
                    <ImageCarousel autoplay dotPosition="top">
                    {item.images.map((image, index) => (
                        <div key={index}>
                        <Image
                            src={image}
                            alt={`${item.title} - Image ${index + 1}`}
                        />
                        </div>
                    ))}
                    </ImageCarousel>
                </Image.PreviewGroup>
            ) : (
              <div style={{ height: 500, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px 0 0 16px' }}>
                <Text type="secondary">Aucune image disponible</Text>
              </div>
            )}
          </Col>

          <InfoCol xs={24} lg={12}>
            <Space direction="vertical" style={{ width: '100%', flexGrow: 1 }}>
              <Space wrap>
                {item.category && <InfoTag color="blue">{item.category}</InfoTag>}
                {item.status === 'approved' && <InfoTag icon={<SafetyCertificateOutlined/>} color="green">Vérifié</InfoTag>}
              </Space>

              <Title level={2} style={{ marginBottom: 0, marginTop: '0.5rem' }}>{item.title || 'Titre non disponible'}</Title>
              
              {item.location && (
                  <Space align="center" style={{ color: '#888', fontSize: '1rem' }}>
                    <EnvironmentOutlined />
                    <Text>{item.location}</Text>
                  </Space>
              )}
              
              <SectionDivider/>

              <Space align="center" >
                <DollarCircleOutlined style={{ fontSize: '2.2rem', color: '#1ec773' }}/>
                <PriceText>{formatPrice(item)}</PriceText>
              </Space>

              <SectionDivider />

              <Title level={4}>Description</Title>
              <Paragraph style={{ whiteSpace: 'pre-wrap', color: '#555' }}>
                  {item.description || 'Aucune description fournie.'}
              </Paragraph>

              <SectionDivider />

              <Title level={4}>Contacter le vendeur</Title>
              <Space direction="vertical" size="middle">
                {item.contactPhone && (
                  <ContactLink href={`tel:${item.contactPhone}`}>
                    <PhoneOutlined />
                    <Text>{item.contactPhone}</Text>
                  </ContactLink>
                )}
                {item.contactPhone && (
                   <ContactLink href={`https://wa.me/${item.contactPhone.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" style={{color: '#25D366'}}>
                     <WhatsAppOutlined />
                     <Text>Discuter sur WhatsApp</Text>
                   </ContactLink>
                )}
                {item.contactEmail && (
                  <ContactLink href={`mailto:${item.contactEmail}`}>
                    <MailOutlined />
                    <Text>{item.contactEmail}</Text>
                  </ContactLink>
                )}
                {!item.contactEmail && !item.contactPhone && (
                  <Text type="secondary">Aucune information de contact fournie.</Text>
                )}
              </Space>
            </Space>

            {canManage && (
              <>
                <SectionDivider />
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      form.setFieldsValue(item);
                      setIsModalVisible(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => Modal.confirm({
                        title: 'Êtes-vous sûr de vouloir supprimer cette annonce ?',
                        content: 'Cette action est irréversible.',
                        okText: 'Oui, supprimer',
                        cancelText: 'Annuler',
                        onOk: handleDelete,
                    })}
                  >
                    Supprimer
                  </Button>
                </Space>
              </>
            )}
          </InfoCol>
        </Row>
      </MainCard>

      <Modal
        title="Modifier l'annonce"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={item}
        >
          <Form.Item
            name="title"
            label="Titre"
            rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez saisir une description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Prix"
            rules={[{ required: true, message: 'Veuillez saisir un prix' }]}
          >
            <Input type="number" prefix={<DollarCircleOutlined />} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Statut"
            rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
          >
            <Select>
              <Select.Option value="approved">Disponible</Select.Option>
              <Select.Option value="sold">Vendu</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Enregistrer les modifications
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  );
};

export default MarketplaceItemPage; 