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
      const phone = typeof values.phoneNumber === 'string' ? values.phoneNumber : '';
      // Nettoyage universel avant validation/envoi
      const cleanedPhone = phone.replace(/[^\d+]/g, '');
      // Validation du format du numéro de téléphone
      if (!/^\+\d{11,15}$/.test(cleanedPhone)) {
        message.error('Le numéro doit être au format international (+XXX XXXXXXXXX)');
        setLoading(false);
        return;
      }
      const result = await authService.login({ 
        phoneNumber: cleanedPhone, 
        password: values.password 
      });

      if (result && result.token && result.user) {
        message.success('Connexion réussie !');
        navigate('/dashboard');
      } else {
        message.error('Erreur de connexion. Vérifiez vos identifiants.');
      }
    } catch (error: any) {
      // Messages d'erreur plus spécifiques
      if (error.message.includes('format international')) {
        message.error('Le numéro doit être au format international (+XXX XXXXXXXXX)');
      } else if (error.message.includes('Identifiants invalides')) {
        message.error('Numéro de téléphone ou mot de passe incorrect');
      } else if (error.message.includes('incomplètes')) {
        message.error('Erreur de données utilisateur. Veuillez réessayer.');
      } else {
        message.error(error.message || 'Erreur lors de la connexion');
      }
      console.error('Erreur dans onFinish:', error);
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
              {
                validator: (_, value) => {
                  if (!value) return Promise.reject('Veuillez saisir votre numéro de téléphone');
                  // Nettoie tout sauf + et chiffres
                  const cleaned = value.replace(/[^\d+]/g, '');
                  if (!/^\+\d{11,15}$/.test(cleaned)) {
                    return Promise.reject('Format international requis (+XXX XXXXXXXXX)');
                  }
                  return Promise.resolve();
                }
              }
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