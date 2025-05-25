import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Tag, Select, Spin } from 'antd';
import { adminService } from '../../../services/adminService';

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  type: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchSubscriptions = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await adminService.getSubscriptions(page, pageSize);
      setSubscriptions(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } catch (error) {
      message.error('Erreur lors du chargement des abonnements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchSubscriptions(pagination.current, pagination.pageSize);
  };

  const handleStatusChange = async (subscriptionId: string, status: string) => {
    try {
      await adminService.updateSubscription(subscriptionId, { status });
      message.success('Statut mis à jour avec succès');
      fetchSubscriptions(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'expired':
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Utilisateur',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type}</Tag>
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
      title: 'Date de début',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Date de fin',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} FCFA`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Subscription) => (
        <Space>
          <Select
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 120 }}
          >
            <Select.Option value="active">Actif</Select.Option>
            <Select.Option value="cancelled">Annulé</Select.Option>
            <Select.Option value="expired">Expiré</Select.Option>
          </Select>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" tip="Chargement des abonnements..." /></div>;
  }

  return (
    <div>
      <h2>Gestion des abonnements</h2>
      <Table
        columns={columns}
        dataSource={subscriptions}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default SubscriptionManagement; 