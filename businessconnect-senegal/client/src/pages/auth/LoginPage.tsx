import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      await authService.login(values.email, values.password);
      message.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
          Connexion
        </Title>

        <Form<LoginFormValues>
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Veuillez saisir votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mot de passe"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
              size="large"
            >
              Se connecter
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            Pas encore inscrit ? <Link to="/register">S'inscrire</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 