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
  Spin
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  EuroOutlined
} from '@ant-design/icons';
import { marketplaceService } from '../../services/marketplaceService';
import type { MarketplaceItem } from '../../services/marketplaceService';
import { authService } from '../../services/authService';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';

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
  const [filters, setFilters] = useState({
    category: undefined as string | undefined,
    minPrice: 0,
    maxPrice: 10000,
    search: '',
    location: ''
  });
  const [subscription, setSubscription] = useState(authService.getCurrentUserSubscription());
  const { user } = useAuth();
  const { hasActiveSubscription, loading: loadingSub } = useSubscription();
  const userSubscription = subscription;

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

  const handleCreateAd = async (values: any) => {
    try {
      if (!user || !user.id) {
        message.error('Veuillez vous connecter pour créer une annonce');
        return;
      }
      const itemData = {
        ...values,
        userId: user.id,
        images: values.images?.fileList?.map((file: any) => file.url || file.thumbUrl) || []
      };
      await marketplaceService.createItem(itemData);
      message.success('Annonce créée avec succès');
      setIsModalVisible(false);
      form.resetFields();
      fetchItems();
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de la création de l\'annonce');
    }
  };

  // customRequest pour mocker l'upload
  const customUpload = async ({ file, onSuccess }: any) => {
    const url = await marketplaceService.uploadImage(file as File);
    onSuccess({ url }, file);
  };

  const refreshSubscription = () => {
    setSubscription(authService.getCurrentUserSubscription());
    fetchItems();
  };

  const handleRenew = () => {
    authService.renewCurrentUserSubscription();
    message.success('Abonnement renouvelé !');
    refreshSubscription();
  };

  const handleExpire = () => {
    authService.expireCurrentUserSubscription();
    message.warning('Abonnement expiré !');
    refreshSubscription();
  };

  if (loading) {
    return <div style={{ minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement des annonces..." /></div>;
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
                  <Col span={6}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        if (loadingSub) return;
                        if (!(user?.role === 'admin' || (hasActiveSubscription && userSubscription && userSubscription.type === 'annonceur'))) {
                          message.error('Seuls les annonceurs abonnés ou les admins peuvent publier une annonce.');
                          return;
                        }
                        setIsModalVisible(true);
                      }}
                    >
                      Créer une annonce
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

          {items.map(item => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                cover={
                  Array.isArray(item.images) && item.images[0] ? (
                    <Image
                      alt={item.title}
                      src={item.images[0]}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  ) : null
                }
                onClick={() => navigate(`/marketplace/${item.id}`)}
              >
                <div style={{ minHeight: 120 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</div>
                  <div style={{ margin: '8px 0' }}>{item.description.substring(0, 100)}...</div>
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
          ))}
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
              <textarea rows={4} placeholder="Description détaillée" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }} />
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
              name="price"
              label="Prix"
              rules={[{ required: true, message: 'Veuillez saisir un prix' }]}
            >
              <Input type="number" prefix={<EuroOutlined style={{ color: '#1890ff' }} />} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Localisation"
              rules={[{ required: true, message: 'Veuillez saisir une localisation' }]}
            >
              <Input prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />} />
            </Form.Item>

            <Form.Item
              name={['contactInfo', 'email']}
              label="Email"
              rules={[
                { required: true, message: 'Veuillez saisir un email' },
                { type: 'email', message: 'Email invalide' }
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name={['contactInfo', 'phone']}
              label="Téléphone (optionnel)"
            >
              <Input placeholder="Téléphone (optionnel)" />
            </Form.Item>

            <Form.Item
              name="images"
              label="Images"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                customRequest={customUpload}
                maxCount={5}
                showUploadList={{ showPreviewIcon: false }}
              >
                <div>
                  <span>{<UploadOutlined />}</span>
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Publier l'annonce
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default MarketplacePage; 