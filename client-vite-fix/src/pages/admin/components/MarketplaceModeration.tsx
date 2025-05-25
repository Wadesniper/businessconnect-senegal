import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  message, 
  Tag, 
  Input,
  Typography,
  Card,
  Image,
  Spin
} from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  EyeOutlined,
  SearchOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { adminService } from '../../../services/adminService';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
  createdAt: string;
  reports: number;
}

const MarketplaceModeration: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchItems = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await adminService.getMarketplaceItems(page, pageSize);
      setItems(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } catch (error) {
      message.error('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchItems(pagination.current, pagination.pageSize);
  };

  const handleModeration = async (itemId: string, action: 'approve' | 'reject') => {
    try {
      await adminService.moderateItem(itemId, action, action === 'reject' ? rejectReason : undefined);
      message.success(`Article ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
      setIsModalVisible(false);
      setRejectReason('');
      fetchItems(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Erreur lors de la modération');
    }
  };

  const showRejectModal = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'orange';
    }
  };

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Vendeur',
      dataIndex: 'seller',
      key: 'seller',
    },
    {
      title: 'Prix',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString()} FCFA`,
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Signalements',
      dataIndex: 'reports',
      key: 'reports',
      render: (reports: number) => (
        <Tag color={reports > 0 ? 'red' : 'green'}>{reports}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MarketplaceItem) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleModeration(record.id, 'approve')}
            disabled={record.status === 'approved'}
          >
            Approuver
          </Button>
          <Button
            danger
            onClick={() => showRejectModal(record)}
            disabled={record.status === 'rejected'}
          >
            Rejeter
          </Button>
          <Button
            onClick={() => Modal.info({
              title: 'Détails de l\'article',
              content: (
                <div>
                  <p><strong>Titre:</strong> {record.title}</p>
                  <p><strong>Prix:</strong> {record.price.toLocaleString()} FCFA</p>
                  <p><strong>Description:</strong></p>
                  <p>{record.description}</p>
                </div>
              ),
              width: 600,
            })}
          >
            Voir les détails
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement des articles..." /></div>;
  }

  return (
    <div>
      <Title level={4}>Modération du Marketplace</Title>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title="Raison du rejet"
        visible={isModalVisible}
        onOk={() => selectedItem && handleModeration(selectedItem.id, 'reject')}
        onCancel={() => {
          setIsModalVisible(false);
          setRejectReason('');
        }}
        okText="Confirmer"
        cancelText="Annuler"
      >
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Veuillez indiquer la raison du rejet..."
        />
      </Modal>
    </div>
  );
};

export default MarketplaceModeration; 