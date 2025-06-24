import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Slider,
  Modal,
  Form,
  Upload,
  message,
  Image,
  Spin,
  Input as AntInput,
  Radio,
  InputNumber,
  Alert,
  Typography
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  EuroOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { marketplaceService } from '../../services/marketplaceService';
import type { MarketplaceItem } from '../../services/marketplaceService';
import { authService } from '../../services/authService';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../context/AuthContext';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import LazyImage from '../../components/LazyImage';

const categories = [
  'Informatique',
  'Électronique',
  'Mode',
  'Maison',
  'Véhicules',
  'Services',
  'Autres'
];

const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    minPrice: 0,
    maxPrice: 10000,
    search: '',
    location: ''
  });
  const { user, loading: loadingUser } = useAuth();
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();
  const isAdmin = user?.role === 'admin';
  const [subscription, setSubscription] = useState(
    isAdmin
      ? { status: 'active', endDate: '2999-12-31', type: 'admin' }
      : null
  );
  const userSubscription = subscription;
  const [priceType, setPriceType] = useState<'fixed' | 'range' | 'negotiable'>('fixed');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [editFileList, setEditFileList] = useState<UploadFile[]>([]);
  const [editUploadedUrls, setEditUploadedUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await marketplaceService.getItems(filters);
      setItems(data);
    } catch (error) {
      message.error('Erreur lors de la récupération des annonces');
    }
    setLoading(false);
  };

  const customUpload = async ({ file, onSuccess, onError }: any) => {
    try {
      const url = await marketplaceService.uploadImage(file);
      setUploadedUrls(prev => [...prev, url]);
      onSuccess({ url, name: file.name, status: 'done', uid: Date.now().toString() });
    } catch (err) {
      console.error('Erreur upload:', err);
      onError(err);
    }
  };

  const handleOpenModal = () => {
    if (loadingSub) return;
    if (!(user?.role === 'admin' || (hasActiveSubscription && user?.role === 'annonceur'))) {
      message.error('Seuls les annonceurs abonnés ou les admins peuvent publier une annonce.');
      return;
    }
    setFileList([]);
    setUploadedUrls([]);
    form.setFieldsValue({ images: [] });
    setIsModalVisible(true);
  };

  const handleCreateAd = async (values: any) => {
    try {
      if (!user?.id) {
        message.error('Veuillez vous connecter pour créer une annonce');
        return;
      }

      const { contactInfo, price, minPrice, maxPrice, ...restValues } = values;
      const itemData = {
        ...restValues,
        priceType,
        price: priceType === 'fixed' ? Number(price) : null,
        minPrice: priceType === 'range' ? Number(minPrice) : null,
        maxPrice: priceType === 'range' ? Number(maxPrice) : null,
        seller: user.id,
        contactEmail: contactInfo?.email || '',
        contactPhone: contactInfo?.phone || '',
        images: uploadedUrls
      };

      await marketplaceService.createItem(itemData);
      message.success('Annonce créée avec succès');
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      setUploadedUrls([]);
      fetchItems();
    } catch (error: any) {
      console.error('Erreur création annonce:', error);
      message.error(error?.response?.data?.error || error.message || 'Erreur lors de la création de l\'annonce');
    }
  };

  const refreshSubscription = () => {
    setSubscription(isAdmin ? { status: 'active', endDate: '2999-12-31', type: 'admin' } : null);
    fetchItems();
  };

  const handleRenew = async () => {
    try {
      await authService.updateSubscription('active');
      message.success('Abonnement renouvelé !');
      refreshSubscription();
    } catch (e) {
      message.error('Erreur lors du renouvellement');
    }
  };

  const handleExpire = async () => {
    try {
      await authService.updateSubscription('cancelled');
      message.warning('Abonnement expiré !');
      refreshSubscription();
    } catch (e) {
      message.error('Erreur lors de l\'expiration');
    }
  };

  const handleEdit = (item: MarketplaceItem) => {
    setEditingItem(item);
    const existingFileList = item.images?.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index + 1}`,
      status: 'done' as UploadFileStatus,
      url: url,
    })) || [];
    setEditFileList(existingFileList);
    setEditUploadedUrls(item.images || []);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!editingItem?.id) return;
    
    try {
      console.log('[DEBUG] Début modification annonce');
      console.log('[DEBUG] Values reçues:', values);
      let finalPrice;
      if (priceType === 'fixed') {
        const price = Number(values.price);
        if (isNaN(price) || price < 0) {
          message.error('Le prix doit être un nombre positif');
          return;
        }
        finalPrice = price;
      } else if (priceType === 'range') {
        const minPrice = Number(values.minPrice);
        const maxPrice = Number(values.maxPrice);
        if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < minPrice) {
          message.error('La fourchette de prix n\'est pas valide');
          return;
        }
        finalPrice = { min: minPrice, max: maxPrice };
      } else {
        finalPrice = 'Négociable';
      }

      const { contactInfo, price, minPrice, maxPrice, ...restValues } = values;
      const itemData = {
        ...restValues,
        price: finalPrice,
        contactEmail: contactInfo?.email || '',
        contactPhone: contactInfo?.phone || '',
        images: editUploadedUrls
      };

      console.log('[DEBUG] Données à envoyer:', itemData);
      console.log('[DEBUG] ID de l\'annonce:', editingItem.id);
      
      await marketplaceService.updateItem(editingItem.id, itemData);
      message.success('Annonce modifiée avec succès');
      setEditModalVisible(false);
      fetchItems();
    } catch (error: any) {
      console.error('[DEBUG] Erreur détaillée:', error);
      console.error('[DEBUG] Response:', error.response);
      message.error(error?.response?.data?.error || error.message || 'Erreur lors de la modification de l\'annonce');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await marketplaceService.deleteItem(id);
      message.success('Annonce supprimée avec succès');
      fetchItems();
    } catch (error) {
      message.error('Erreur lors de la suppression de l\'annonce');
    }
  };

  if (loadingUser || loadingSub) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement..." /></div>;
  }

  return (
    <Layout style={{ padding: '24px' }}>
      <Layout.Content>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <h2 style={{ marginBottom: 0 }}>Marketplace</h2>
                {subscription && (
                  <Space>
                    <span style={{ fontWeight: 'bold' }}>Abonnement : </span>
                    <span style={{ color: subscription.status === 'active' && new Date(subscription.endDate) > new Date() ? 'green' : 'red', fontWeight: 'bold' }}>
                      {subscription.status === 'active' && new Date(subscription.endDate) > new Date() ? 'Actif' : 'Expiré'}
                    </span>
                    <span>(Expire le : {new Date(subscription.endDate).toLocaleDateString()})</span>
                    <Button onClick={handleRenew}>Renouveler</Button>
                    <Button danger onClick={handleExpire}>Expirer</Button>
                  </Space>
                )}
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Catégorie"
                      onChange={(value) => setFilters({ ...filters, category: value })}
                      allowClear
                      value={filters.category}
                    >
                      {categories.map(category => (
                        <Select.Option key={category} value={category}>{category}</Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Input
                      placeholder="Localisation"
                      prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      value={filters.location}
                    />
                  </Col>
                  <Col span={6}>
                    <Input
                      placeholder="Rechercher..."
                      prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      value={filters.search}
                    />
                  </Col>
                  <Col span={6} style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleOpenModal}
                    >
                      Créer une annonce
                    </Button>
                    <Button
                      type="default"
                      icon={<ShopOutlined />}
                      onClick={() => navigate('/marketplace/user/items')}
                      style={{ marginLeft: 8 }}
                    >
                      Mes Annonces
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <span style={{ fontWeight: 'bold' }}>Prix :</span>
                    <Slider
                      range
                      min={0}
                      max={10000}
                      defaultValue={[0, 10000]}
                      onChange={(value: any) => setFilters({
                        ...filters,
                        minPrice: value[0],
                        maxPrice: value[1]
                      })}
                    />
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>

          {items.map(item => {
            const isOwner = !loadingUser && user && (user.id === item.userId || user.id === item.sellerId || user.id === item.seller);
            const isAdmin = !loadingUser && user && user.role === 'admin';
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  hoverable
                  cover={
                    Array.isArray(item.images) && item.images[0] ? (
                      <LazyImage
                        alt={item.title}
                        src={item.images[0]}
                        style={{ height: 200 }}
                      />
                    ) : <div style={{ height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pas d'image</div>
                  }
                  onClick={() => navigate(`/marketplace/${item.id}`)}
                  actions={[
                    <Button type="primary" onClick={(e) => { e.stopPropagation(); navigate(`/marketplace/${item.id}`)}}>Voir les détails</Button>,
                    ...(
                      (isAdmin || isOwner)
                        ? [
                            <Button onClick={(e) => { e.stopPropagation(); handleEdit(item)}}>Modifier</Button>,
                            <Button danger onClick={(e) => { e.stopPropagation(); handleDelete(item.id)}}>Supprimer</Button>
                          ]
                        : []
                    )
                  ]}
                >
                  <div style={{ minHeight: 120 }}>
                    <Typography.Title level={5}>{item.title}</Typography.Title>
                    <div style={{ margin: '8px 0' }}>{(item.description || '').substring(0, 100)}...</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{<EuroOutlined style={{ color: '#1890ff' }} />}</span>
                      <span style={{ fontWeight: 'bold' }}>{item.price}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{<EnvironmentOutlined style={{ color: '#1890ff' }} />}</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
          {items.length === 0 && (
            <Col span={24} style={{ textAlign: 'center', marginTop: 48, color: '#888', fontSize: 18 }}>
              Aucune annonce pour le moment.
            </Col>
          )}
        </Row>

        <Modal
          title="Créer une nouvelle annonce"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateAd}
            initialValues={{ images: [] }}
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
            >
              <Input placeholder="Titre de l'annonce" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez saisir une description' }]}
            >
              <AntInput.TextArea rows={4} placeholder="Description détaillée" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Catégorie"
              rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
            >
              <Select placeholder="Sélectionnez une catégorie">
                {categories.map(category => (
                  <Select.Option key={category} value={category}>{category}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              name="priceType"
              label="Type de prix"
              rules={[{ required: true, message: 'Veuillez sélectionner un type de prix' }]}
              initialValue="fixed"
            >
              <Radio.Group onChange={(e) => setPriceType(e.target.value)}>
                <Radio value="fixed">Prix fixe</Radio>
                <Radio value="range">Fourchette de prix</Radio>
                <Radio value="negotiable">Prix négociable</Radio>
              </Radio.Group>
            </Form.Item>

            {priceType === 'fixed' && (
              <Form.Item
                name="price"
                label="Prix"
                rules={[{ required: true, message: 'Veuillez saisir un prix' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix={<EuroOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Prix en FCFA"
                />
              </Form.Item>
            )}

            {priceType === 'range' && (
              <Form.Item label="Fourchette de prix" required>
                <Space>
                  <Form.Item
                    name="minPrice"
                    rules={[{ required: true, message: 'Prix minimum requis' }]}
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      prefix={<EuroOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Prix minimum"
                    />
                  </Form.Item>
                  <span>à</span>
                  <Form.Item
                    name="maxPrice"
                    rules={[{ required: true, message: 'Prix maximum requis' }]}
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      prefix={<EuroOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Prix maximum"
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
            )}

            {priceType === 'negotiable' && (
              <Form.Item>
                <Alert
                  message="Le prix sera affiché comme 'Prix négociable'"
                  type="info"
                  showIcon
                />
              </Form.Item>
            )}

            <Form.Item
              name="location"
              label="Localisation"
              rules={[{ required: true, message: 'Veuillez saisir une localisation' }]}
            >
              <Input prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />} />
            </Form.Item>

            <Form.Item
              name={["contactInfo", "email"]}
              label="Email (optionnel)"
              rules={[{ type: 'email', message: 'Email invalide' }]}
            >
              <Input placeholder="Email (optionnel)" />
            </Form.Item>
            <Form.Item
              name={["contactInfo", "phone"]}
              label="Téléphone"
              rules={[{ required: true, message: 'Veuillez saisir un numéro de téléphone' }, { pattern: /^\+?\d{7,15}$/, message: 'Numéro de téléphone invalide' }]}
            >
              <Input placeholder="Téléphone (obligatoire)" />
            </Form.Item>

            <Form.Item
              name="images"
              label="Images"
              rules={[{ required: true, message: 'Veuillez ajouter au moins une image' }]}
            >
              <Upload
                listType="picture-card"
                customRequest={customUpload}
                maxCount={5}
                fileList={fileList}
                onChange={({ fileList: newFileList }) => {
                  console.log('onChange newFileList:', newFileList);
                  setFileList(newFileList);
                }}
                onRemove={(file) => {
                  const url = file.url || (file.response && file.response.url);
                  if (url) {
                    setUploadedUrls(prev => prev.filter(u => u !== url));
                  }
                  return true;
                }}
              >
                {fileList.length < 5 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Publier l'annonce
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Modifier l'annonce"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              title: editingItem?.title,
              description: editingItem?.description,
              category: editingItem?.category,
              price: editingItem?.price,
              location: editingItem?.location,
              contactInfo: {
                email: editingItem?.contactEmail,
                phone: editingItem?.contactPhone
              },
              images: editingItem?.images || []
            }}
          >
            <Form.Item
              name="title"
              label="Titre"
              rules={[{ required: true, message: 'Veuillez saisir un titre' }]}
            >
              <Input placeholder="Titre de l'annonce" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Veuillez saisir une description' }]}
            >
              <Input.TextArea rows={4} placeholder="Description détaillée" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Catégorie"
              rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
            >
              <Select placeholder="Sélectionnez une catégorie">
                {categories.map(category => (
                  <Select.Option key={category} value={category}>{category}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              name="priceType"
              label="Type de prix"
              rules={[{ required: true, message: 'Veuillez sélectionner un type de prix' }]}
              initialValue="fixed"
            >
              <Radio.Group onChange={(e) => setPriceType(e.target.value)}>
                <Radio value="fixed">Prix fixe</Radio>
                <Radio value="range">Fourchette de prix</Radio>
                <Radio value="negotiable">Prix négociable</Radio>
              </Radio.Group>
            </Form.Item>

            {priceType === 'fixed' && (
              <Form.Item
                name="price"
                label="Prix"
                rules={[{ required: true, message: 'Veuillez saisir un prix' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  prefix={<EuroOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Prix en FCFA"
                />
              </Form.Item>
            )}

            {priceType === 'range' && (
              <Form.Item label="Fourchette de prix" required>
                <Space>
                  <Form.Item
                    name="minPrice"
                    rules={[{ required: true, message: 'Prix minimum requis' }]}
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      prefix={<EuroOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Prix minimum"
                    />
                  </Form.Item>
                  <span>à</span>
                  <Form.Item
                    name="maxPrice"
                    rules={[{ required: true, message: 'Prix maximum requis' }]}
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      prefix={<EuroOutlined style={{ color: '#1890ff' }} />}
                      placeholder="Prix maximum"
                    />
                  </Form.Item>
                </Space>
              </Form.Item>
            )}

            {priceType === 'negotiable' && (
              <Form.Item>
                <Alert
                  message="Le prix sera affiché comme 'Prix négociable'"
                  type="info"
                  showIcon
                />
              </Form.Item>
            )}

            <Form.Item
              name="location"
              label="Localisation"
              rules={[{ required: true, message: 'Veuillez saisir une localisation' }]}
            >
              <Input prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />} />
            </Form.Item>

            <Form.Item
              name={["contactInfo", "email"]}
              label="Email (optionnel)"
              rules={[{ type: 'email', message: 'Email invalide' }]}
            >
              <Input placeholder="Email (optionnel)" />
            </Form.Item>

            <Form.Item
              name={["contactInfo", "phone"]}
              label="Téléphone"
              rules={[{ required: true, message: 'Veuillez saisir un numéro de téléphone' }]}
            >
              <Input placeholder="Téléphone (obligatoire)" />
            </Form.Item>

            <Form.Item
              name="images"
              label="Images"
              rules={[{ required: true, message: 'Veuillez ajouter au moins une image' }]}
            >
              <Upload
                listType="picture-card"
                customRequest={customUpload}
                maxCount={5}
                fileList={editFileList}
                onChange={({ fileList: newFileList }) => {
                  console.log('onChange newFileList:', newFileList);
                  setEditFileList(newFileList);
                }}
                onRemove={(file) => {
                  const url = file.url || (file.response && file.response.url);
                  if (url) {
                    setEditUploadedUrls(prev => prev.filter(u => u !== url));
                  }
                  return true;
                }}
              >
                {editFileList.length < 5 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enregistrer les modifications
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default MarketplacePage; 