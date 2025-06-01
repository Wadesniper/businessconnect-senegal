import React, { useState } from 'react';
import { Button, Card, Typography, Space, message, Spin } from 'antd';
import { api } from '../services/api';

const { Title, Paragraph, Text } = Typography;

const TestCinetPay: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const testCinetPayDebug = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/subscriptions/debug-cinetpay');
      setDebugInfo(response.data);
      message.info('Debug info récupérée');
    } catch (error: any) {
      message.error('Erreur debug: ' + error.message);
      console.error('Erreur debug:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCinetPayPayment = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/subscriptions/test-cinetpay');
      setTestResult(response.data);
      if (response.data.success) {
        message.success('Test réussi !');
        if (response.data.payment_url) {
          window.open(response.data.payment_url, '_blank');
        }
      } else {
        message.error('Test échoué: ' + response.data.error);
      }
    } catch (error: any) {
      message.error('Erreur test: ' + (error.response?.data?.error || error.message));
      console.error('Erreur test:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>Test CinetPay</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Actions de test">
          <Space>
            <Button 
              type="primary" 
              onClick={testCinetPayDebug}
              loading={loading}
            >
              Debug Configuration
            </Button>
            <Button 
              type="primary" 
              danger
              onClick={testCinetPayPayment}
              loading={loading}
            >
              Test Paiement (1000 FCFA)
            </Button>
          </Space>
        </Card>

        {debugInfo && (
          <Card title="Debug Information">
            <pre style={{ overflow: 'auto', maxHeight: 400 }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </Card>
        )}

        {testResult && (
          <Card title="Test Result">
            <pre style={{ overflow: 'auto', maxHeight: 400 }}>
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </Card>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        )}
      </Space>
    </div>
  );
};

export default TestCinetPay; 