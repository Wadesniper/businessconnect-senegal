import React, { useState } from 'react';
import { Form, Input, Button, Typography, Layout, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #003366 100%);
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 8px;
  }

  .ant-btn {
    height: 45px;
    border-radius: 8px;
    font-weight: 600;
  }
`;

interface RegisterFormData {
  phoneNumber: string;
  fullName: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const onFinish = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      const { confirmPassword, fullName, ...registerData } = values;
      
      if (registerData.password !== confirmPassword) {
        message.error('Les mots de passe ne correspondent pas');
        return;
      }

      // Séparer le nom complet en prénom et nom
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;

      await register({
        ...registerData,
        firstName,
        lastName
      });
      
      message.success('Inscription réussie !');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLayout>
      <RegisterCard>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
          Inscription
        </Title>
        <StyledForm
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="fullName"
            label="Nom complet"
            rules={[{ required: true, message: 'Veuillez entrer votre nom complet' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nom complet" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email (optionnel)"
            rules={[
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Téléphone"
            rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[
              { required: true, message: 'Veuillez entrer votre mot de passe' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mot de passe" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmer le mot de passe"
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
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmer le mot de passe" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              S'inscrire
            </Button>
          </Form.Item>

          <Text>
            Déjà inscrit ? <Link to="/login">Connectez-vous</Link>
          </Text>
        </StyledForm>
      </RegisterCard>
    </StyledLayout>
  );
};

export default Register; 