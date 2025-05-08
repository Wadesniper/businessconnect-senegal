import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { authService, RegisterData } from '../../services/authService';
import styles from './styles/Auth.module.css';

const { Title } = Typography;

// Styles pour les icônes
const iconStyle = {
  fontSize: 20,
  color: '#1890ff',
};

const eyeIconStyle = {
  fontSize: 18,
  color: '#aaa',
};

interface FormValues extends Omit<RegisterData, 'name'> {
  fullName: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      const { fullName, confirmPassword, ...rest } = values;
      await authService.register({
        ...rest,
        name: fullName
      });
      message.success('Inscription réussie !');
      navigate('/login');
    } catch (error: any) {
      message.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <Title level={2} className={styles.title}>
          Inscription
        </Title>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className={styles.form}
        >
          <Form.Item
            name="fullName"
            rules={[{ required: true, message: 'Veuillez saisir votre nom complet' }]}
          >
            <Input 
              prefix={<UserOutlined {...iconStyle} />}
              placeholder="Nom complet"
              size="large"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
              {
                pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,9}$/,
                message: 'Format de numéro de téléphone invalide'
              }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined {...iconStyle} />}
              placeholder="Numéro de téléphone (ex: +221 77 123 4567)"
              size="large"
              autoComplete="tel"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input 
              prefix={<MailOutlined {...iconStyle} />}
              placeholder="Email (optionnel)"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Veuillez saisir votre mot de passe' },
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
            ]}
          >
            <Input
              prefix={<LockOutlined {...iconStyle} />}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              size="large"
              autoComplete="new-password"
              className={styles.passwordInput}
              suffix={
                <div onClick={() => togglePasswordVisibility('password')}>
                  {showPassword ? 
                    <EyeInvisibleOutlined {...eyeIconStyle} /> : 
                    <EyeOutlined {...eyeIconStyle} />
                  }
                </div>
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
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
            <Input
              prefix={<LockOutlined {...iconStyle} />}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmer le mot de passe"
              size="large"
              autoComplete="new-password"
              className={styles.passwordInput}
              suffix={
                <div onClick={() => togglePasswordVisibility('confirm')}>
                  {showConfirmPassword ? 
                    <EyeInvisibleOutlined {...eyeIconStyle} /> : 
                    <EyeOutlined {...eyeIconStyle} />
                  }
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
              S'inscrire
            </Button>
          </Form.Item>

          <div className={styles.linkText}>
            Déjà inscrit ?
            <Link to="/login">Se connecter</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage; 