import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { authService, RegisterData } from '../../services/authService';

const { Title } = Typography;

interface FormValues extends Omit<RegisterData, 'name'> {
  fullName: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      const { fullName, confirmPassword, ...rest } = values;
      await authService.register({
        ...rest,
        fullName
      });
      message.success('Inscription réussie !');
      navigate('/login');
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de l\'inscription');
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
            Créez votre compte pour rejoindre la communauté
          </div>
        </div>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>
          Inscription
        </Title>
        <Form<FormValues>
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="fullName"
            label={<span style={{ fontWeight: 500 }}>Nom complet</span>}
            rules={[{ required: true, message: 'Veuillez saisir votre nom complet' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nom complet"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
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
            name="phoneNumber"
            label={<span style={{ fontWeight: 500 }}>Numéro de téléphone</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
              {
                pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,9}$/,
                message: 'Format de numéro de téléphone invalide'
              }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Numéro de téléphone (ex: +221 77 123 4567)"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre mot de passe' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mot de passe"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={<span style={{ fontWeight: 500 }}>Confirmer le mot de passe</span>}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirmer le mot de passe"
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
              S'inscrire
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage; 