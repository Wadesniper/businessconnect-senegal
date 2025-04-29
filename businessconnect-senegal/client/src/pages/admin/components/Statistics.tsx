import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography,
  DatePicker,
  Select,
  Space,
  Spin
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  MessageOutlined,
  CrownOutlined,
  DollarOutlined,
  RiseOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { adminService } from '../../../services/adminService';
import { Line, Pie } from '@ant-design/plots';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface StatData {
  users: number;
  jobs: number;
  subscriptions: number;
  revenue: number;
  userGrowth: { date: string; count: number }[];
  subscriptionDistribution: { type: string; count: number }[];
}

const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [stats, setStats] = useState<StatData | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStatistics(
        dateRange ? { start: dateRange[0], end: dateRange[1] } : undefined,
        viewType
      );
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange, viewType]);

  if (loading || !stats) {
    return <Spin size="large" />;
  }

  const userGrowthConfig = {
    data: stats.userGrowth,
    xField: 'date',
    yField: 'count',
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  const subscriptionConfig = {
    data: stats.subscriptionDistribution,
    angleField: 'count',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col>
            <RangePicker
              onChange={(dates) => setDateRange(dates as [Date, Date])}
              style={{ marginRight: 16 }}
            />
          </Col>
          <Col>
            <Select
              value={viewType}
              onChange={setViewType}
              style={{ width: 120 }}
              options={[
                { value: 'day', label: 'Par jour' },
                { value: 'week', label: 'Par semaine' },
                { value: 'month', label: 'Par mois' },
              ]}
            />
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="Utilisateurs totaux">
            <h2>{stats.users}</h2>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Offres d'emploi">
            <h2>{stats.jobs}</h2>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Abonnements actifs">
            <h2>{stats.subscriptions}</h2>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Revenus (FCFA)">
            <h2>{stats.revenue.toLocaleString()}</h2>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Croissance des utilisateurs">
            <Line {...userGrowthConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Distribution des abonnements">
            <Pie {...subscriptionConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 