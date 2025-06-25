import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, message, Input, Space, Typography, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { marketplaceService } from '../../services/marketplaceService';

const { Title } = Typography;

interface AdminMarketplaceItem {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  priceType: 'fixed' | 'range' | 'negotiable';
  minPrice?: number | null;
  maxPrice?: number | null;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  images: string[];
  contactEmail?: string;
  contactPhone: string;
  location: string;
  createdAt: string;
  moderationComment?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  seller: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ModerationStats {
  pending?: number;
  approved?: number;
  rejected?: number;
  suspended?: number;
}

const statusColors: Record<string, string> = {
  approved: 'green',
  pending: 'gold',
  rejected: 'red',
  suspended: 'orange',
};

const MarketplaceModeration: React.FC = () => {
  const [items, setItems] = useState<AdminMarketplaceItem[]>([]);
  const [stats, setStats] = useState<ModerationStats>({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'suspended'>('all');
  const [moderationComment, setModerationComment] = useState('');
  const [modal, setModal] = useState<{visible: boolean, item?: AdminMarketplaceItem, action?: string}>({visible: false});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, statsData] = await Promise.all([
        marketplaceService.getAllItemsAdmin(),
        marketplaceService.getModerationStats()
      ]);
      setItems(itemsData as unknown as AdminMarketplaceItem[]);
      setStats(statsData);
    } catch (error) {
      message.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (item: AdminMarketplaceItem, status: string) => {
    try {
      await marketplaceService.updateItemStatus(item.id, status, moderationComment);
      setModerationComment('');
      setModal({visible: false});
      await loadData();
      message.success(`Statut mis à jour : ${status}`);
    } catch (error) {
      message.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (item: AdminMarketplaceItem) => {
    try {
      await marketplaceService.deleteItemAdmin(item.id);
      setModal({visible: false});
      await loadData();
      message.success('Annonce supprimée');
    } catch (error) {
      message.error('Erreur lors de la suppression');
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedStatus === 'all') return true;
    return item.status === selectedStatus;
  });

  const formatPrice = (item: AdminMarketplaceItem) => {
    switch (item.priceType) {
      case 'fixed':
        return item.price ? `${item.price.toLocaleString()} FCFA` : 'Non spécifié';
      case 'range':
        return item.minPrice && item.maxPrice 
          ? `${item.minPrice.toLocaleString()} - ${item.maxPrice.toLocaleString()} FCFA`
          : 'Non spécifié';
      case 'negotiable':
        return 'Négociable';
      default:
        return 'Non spécifié';
    }
  };

  const columns = [
    {
      title: 'Annonce',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, item: AdminMarketplaceItem) => (
        <Space>
          {item.images.length > 0 && (
            <img src={item.images[0]} alt={item.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{item.title}</div>
            <div style={{ color: '#888', fontSize: 12 }}>{item.category}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Vendeur',
      dataIndex: 'seller',
      key: 'seller',
      render: (seller: AdminMarketplaceItem['seller']) => (
        <div>
          <div>{seller.firstName} {seller.lastName}</div>
          <div style={{ color: '#888', fontSize: 12 }}>{seller.email}</div>
        </div>
      )
    },
    {
      title: 'Prix',
      dataIndex: 'price',
      key: 'price',
      render: (_: any, item: AdminMarketplaceItem) => formatPrice(item)
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={statusColors[status] || 'default'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, item: AdminMarketplaceItem) => (
        <Space>
          <Button type="primary" onClick={() => setModal({visible: true, item, action: 'moderate'})}>Modérer</Button>
          <Popconfirm
            title="Supprimer cette annonce ?"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDelete(item)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger>Supprimer</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 32 }}>
      <Title level={2} style={{ marginBottom: 32 }}>Modération Marketplace</Title>
      <Space size={24} style={{ marginBottom: 32 }}>
        <div>
          <Tag color="gold">En attente : {stats.pending || 0}</Tag>
          <Tag color="green">Approuvées : {stats.approved || 0}</Tag>
          <Tag color="red">Rejetées : {stats.rejected || 0}</Tag>
          <Tag color="orange">Suspendues : {stats.suspended || 0}</Tag>
        </div>
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value as any)}
          style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #d9d9d9', fontSize: 15 }}
        >
          <option value="all">Toutes les annonces</option>
          <option value="pending">En attente</option>
          <option value="suspended">Suspendues</option>
        </select>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredItems}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
      />
      <Modal
        title="Modérer l'annonce"
        open={modal.visible && modal.action === 'moderate'}
        onCancel={() => setModal({visible: false})}
        onOk={() => {
          if (!modal.item) return;
          Modal.confirm({
            title: 'Confirmer la modération',
            icon: <ExclamationCircleOutlined />,
            content: 'Êtes-vous sûr de vouloir appliquer ce statut ?',
            onOk: () => handleStatusUpdate(modal.item!, moderationComment || 'approved'),
          });
        }}
        okText="Approuver"
        cancelText="Annuler"
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <Input.TextArea
            rows={3}
            placeholder="Commentaire de modération (optionnel)"
            value={moderationComment}
            onChange={e => setModerationComment(e.target.value)}
          />
        </div>
        <Space>
          <Button type="primary" onClick={() => handleStatusUpdate(modal.item!, 'approved')}>Approuver</Button>
          <Button danger onClick={() => handleStatusUpdate(modal.item!, 'rejected')}>Rejeter</Button>
          <Button onClick={() => handleStatusUpdate(modal.item!, 'suspended')}>Suspendre</Button>
        </Space>
      </Modal>
    </div>
  );
};

export default MarketplaceModeration; 