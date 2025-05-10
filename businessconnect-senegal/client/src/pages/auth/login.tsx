import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values.identifier, values.password);
      message.success('Connexion réussie !');
      navigate('/');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Title level={2}>Connexion</Title>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="identifier"
          rules={[{ required: true, message: 'Téléphone ou nom complet requis' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Téléphone ou nom complet" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Mot de passe requis' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Se connecter
          </Button>
        </Form.Item>
        <Form.Item>
          <span>Pas encore de compte ? <Link to="/auth/register">Inscription</Link></span>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login; 