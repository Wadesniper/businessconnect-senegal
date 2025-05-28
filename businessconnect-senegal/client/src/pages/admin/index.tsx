import React, { useEffect, useState } from 'react';
import { Table, Spin, Typography } from 'antd';
import { adminService } from '../../services/adminService';

const { Title } = Typography;

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(page, pageSize);
      setUsers(res.data);
      setPagination({ current: page, pageSize, total: res.total });
    } catch (error) {
      // Gestion d'erreur premium
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (pag: any) => {
    fetchUsers(pag.current, pag.pageSize);
  };

  const columns = [
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (email: string) => email || <span style={{color:'#aaa'}}>Aucun</span> },
    { title: 'Téléphone', dataIndex: 'phone', key: 'phone' },
    { title: 'Rôle', dataIndex: 'role', key: 'role' },
    { title: 'Statut abonnement', dataIndex: ['subscription', 'status'], key: 'subscription', render: (status: string) => status === 'active' ? <span style={{color:'green'}}>Actif</span> : <span style={{color:'red'}}>Aucun</span> },
    { title: 'Expire le', dataIndex: ['subscription', 'expireAt'], key: 'expireAt', render: (date: string) => date ? new Date(date).toLocaleDateString() : '-' },
  ];

  return (
    <div style={{ padding: 32 }}>
      <Title level={2}>Gestion des utilisateurs (admin)</Title>
      {loading ? <Spin size="large" /> : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />
      )}
    </div>
  );
};

export default AdminPage; 