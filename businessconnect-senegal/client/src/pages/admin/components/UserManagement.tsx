import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message, Tag } from 'antd';
import { adminService } from '../../../services/adminService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  subscriptionType?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchUsers = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(page, pageSize);
      setUsers(response.data);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } catch (error) {
      message.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      message.success('Statut mis à jour avec succès');
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (userId: string) => {
    Modal.confirm({
      title: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      content: 'Cette action est irréversible.',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk: async () => {
        try {
          await adminService.deleteUser(userId);
          message.success('Utilisateur supprimé avec succès');
          fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error('Erreur lors de la suppression');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rôle',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Type d\'abonnement',
      dataIndex: 'subscriptionType',
      key: 'subscriptionType',
      render: (type: string) => type || 'Aucun',
    },
    {
      title: 'Date d\'inscription',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type={record.status === 'active' ? 'default' : 'primary'}
            onClick={() => handleStatusChange(record.id, record.status === 'active' ? 'inactive' : 'active')}
          >
            {record.status === 'active' ? 'Désactiver' : 'Activer'}
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserManagement; 