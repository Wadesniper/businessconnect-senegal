import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import styles from './styles/Auth.module.css';

const { Title, Text } = Typography;

interface LoginFormValues {
  phoneNumber: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      await authService.login({ phoneNumber: values.phoneNumber, password: values.password });
      message.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <Title level={2} className={styles.title}>
          Connexion
        </Title>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className={styles.form}
        >
          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
              { pattern: /^\+\d{1,4}\d{10,}$/, message: 'Format international requis (+XXX XXXXXXXXX)' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="Numéro de téléphone (format international)"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
          >
            <Input
              prefix={<LockOutlined className={styles.inputIcon} />}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              size="large"
              autoComplete="current-password"
              className={styles.passwordInput}
              suffix={
                <div 
                  onClick={togglePasswordVisibility}
                  className={styles.togglePassword}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </div>
              }
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.submitButton}
            >
              Se connecter
            </Button>
          </Form.Item>

          <div className={styles.linkText}>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
          </div>
          
          <div className={styles.linkText}>
            Pas encore inscrit ?
            <Link to="/register">S'inscrire</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 