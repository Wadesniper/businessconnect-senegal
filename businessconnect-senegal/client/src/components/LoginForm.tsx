import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await authService.login({ email: values.email, password: values.password });
      message.success('Connexion réussie !');
      navigate('/');
    } catch (error) {
      message.error('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Veuillez entrer votre email' },
          { type: 'email', message: 'Email invalide' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
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
          block
          size="large"
        >
          Se connecter
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm; 