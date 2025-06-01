import React, { useState } from 'react';
import { Button, Card, Typography, Space, Alert } from 'antd';

const { Title } = Typography;

const TestCinetPayPublic: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testCinetPay = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://businessconnect-senegal-api-production.up.railway.app'}/api/subscriptions/test-public`);
      const data = await response.json();
      
      setResult(data);
      
      if (data.success && data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Erreur de connexion au serveur'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Test CinetPay (Public)</Title>
      
      <Alert
        message="Page de test"
        description="Cette page permet de tester la configuration CinetPay sans authentification."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={testCinetPay}
            loading={loading}
            block
          >
            Tester CinetPay (100 FCFA)
          </Button>
          
          {result && (
            <div>
              {result.success ? (
                <Alert
                  message="Test réussi !"
                  description={`Transaction ID: ${result.transactionId}`}
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  message="Erreur"
                  description={result.error || result.message}
                  type="error"
                  showIcon
                />
              )}
              
              {result.config && (
                <Card size="small" style={{ marginTop: 16 }}>
                  <pre style={{ margin: 0, fontSize: 12 }}>
                    {JSON.stringify(result.config, null, 2)}
                  </pre>
                </Card>
              )}
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default TestCinetPayPublic; 