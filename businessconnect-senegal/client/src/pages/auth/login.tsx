import React from 'react';
import { Form, Input, Button, Typography, Layout, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #003366 100%);
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 20px;
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

interface LoginFormData {
  identifier: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormData) => {
    try {
      await login(values.identifier, values.password);
      message.success('Connexion réussie !');
      navigate('/');
    } catch (error) {
      message.error('Identifiant ou mot de passe incorrect');
    }
  };

  return (
    <StyledLayout>
      <LoginCard>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
          Connexion
        </Title>

        <StyledForm
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="identifier"
            rules={[
              { required: true, message: 'Veuillez saisir votre numéro de téléphone ou nom complet' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Numéro de téléphone ou nom complet"
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
            <Button type="primary" htmlType="submit" block size="large">
              Se connecter
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/auth/forgot-password" style={{ color: '#1890ff' }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            Pas encore de compte ?{' '}
            <Link to="/auth/register" style={{ color: '#1890ff', fontWeight: 600 }}>
              S'inscrire
            </Link>
          </div>
        </StyledForm>
      </LoginCard>
    </StyledLayout>
  );
};

export default LoginPage; 