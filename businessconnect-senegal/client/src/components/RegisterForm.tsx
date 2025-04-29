import React, { useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      await authService.register(values);
      message.success('Inscription réussie !');
      navigate('/login');
    } catch (error) {
      message.error('Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="fullName"
        rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Nom complet"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Veuillez entrer votre email' },
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
        name="phoneNumber"
        rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="Numéro de téléphone"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Veuillez entrer votre mot de passe' },
          { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
        ]}
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
          S'inscrire
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm; 