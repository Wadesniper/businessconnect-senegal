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
      await authService.login({ email: values.email, password: values.password });
      message.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1890ff 0%, #43e97b 100%)',
        padding: 0,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '40px 32px 32px 32px',
          borderRadius: 18,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <img src="/logo192.png" alt="Logo" style={{ width: 56, marginBottom: 8 }} />
          <div style={{ fontWeight: 600, fontSize: 20, color: '#1890ff', marginBottom: 2 }}>
            Bienvenue sur BusinessConnect Sénégal
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 10 }}>
            Connectez-vous pour accéder à votre espace personnel
          </div>
        </div>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>
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
            label={<span style={{ fontWeight: 500 }}>Email</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', borderRadius: 8, fontWeight: 600, fontSize: 16, height: 48 }}
              size="large"
            >
              Se connecter
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            Pas encore inscrit ? <Link to="/register">S'inscrire</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 