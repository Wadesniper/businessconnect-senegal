import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Inscription réussie !');
      navigate('/');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Title level={2}>Inscription</Title>
      <Form name="register" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="fullName"
          rules={[{ required: true, message: 'Nom complet requis' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nom complet" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          rules={[{ required: true, message: 'Téléphone requis' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
        </Form.Item>
        <Form.Item name="email">
          <Input prefix={<MailOutlined />} placeholder="Email (optionnel)" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Mot de passe requis' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            S'inscrire
          </Button>
        </Form.Item>
        <Form.Item>
          <span>Déjà un compte ? <Link to="/auth/login">Connexion</Link></span>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register; 