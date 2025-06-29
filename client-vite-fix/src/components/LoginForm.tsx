import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';
import './LoginForm.css';

const { Title } = Typography;

// Ajout des props
interface LoginFormProps {
  noCard?: boolean;
  noBg?: boolean;
  hideRegisterLink?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ noCard, noBg, hideRegisterLink }) => {
  const [form] = Form.useForm();
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [triedLogin, setTriedLogin] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  console.log('[DEBUG] Render LoginForm, forgotPasswordVisible =', forgotPasswordVisible);
  React.useEffect(() => {
    console.log('[DEBUG] LoginForm MOUNT');
    return () => {
      console.log('[DEBUG] LoginForm UNMOUNT');
    };
  }, []);

  useEffect(() => {
    if (!loading && triedLogin) {
      if (isAuthenticated) {
        message.success('Connexion réussie');
        navigate('/dashboard');
      } else {
        message.error('Erreur de connexion. Vérifiez vos identifiants.');
      }
      setTriedLogin(false);
    }
  }, [isAuthenticated, loading, triedLogin, navigate]);

  useEffect(() => {
    if (forgotPasswordVisible) {
      console.log('[DEBUG] ForgotPasswordModal rendu, visible = true');
    }
  }, [forgotPasswordVisible]);

  const onFinish = async (values: { phoneNumber: string; password: string }) => {
    setTriedLogin(true);
    try {
      // Nettoyage universel avant login
      const cleanedPhone = values.phoneNumber.replace(/[^\d+]/g, '');
      await login(cleanedPhone, values.password);
    } catch (error) {
      // L'erreur sera gérée dans le useEffect
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    
    // Enlève tout sauf les chiffres et le +
    const cleaned = value.replace(/[^0-9+]/g, '');
    
    // Format spécifique pour le Sénégal (+221)
    if (cleaned.startsWith('+221')) {
      const remaining = cleaned.slice(4); // Après +221
      if (remaining.length === 0) return '+221 ';
      if (remaining.length <= 2) return `+221 ${remaining}`;
      if (remaining.length <= 5) return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2)}`;
      if (remaining.length <= 7) return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2, 5)} ${remaining.slice(5)}`;
      return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2, 5)} ${remaining.slice(5, 7)} ${remaining.slice(7, 9)}`;
    }
    
    // Format générique pour les autres pays (pas d'espacement automatique)
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Si pas de +, on ajoute +221 et on applique le format sénégalais
    return formatPhoneNumber('+221' + cleaned);
  };

  // Styles responsives pour mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  const formContent = (
      <Form
      form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      className="login-form"
      >
        <Form.Item
          name="phoneNumber"
          rules={[
            { required: true, message: 'Veuillez entrer votre numéro de téléphone' },
            {
              validator: (_: any, value: string) => {
                if (!value) return Promise.reject('Le numéro de téléphone est requis');
                const cleaned = value.replace(/[^\d+]/g, '');
                if (!/^\+\d{11,15}$/.test(cleaned)) {
                  return Promise.reject('Le numéro doit être au format international (+XXX XXXXXXXXX)');
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Numéro de téléphone"
          />
        </Form.Item>

        <Form.Item
          name="password"
        rules={[{ required: true, message: 'Veuillez entrer votre mot de passe' }]}
        >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mot de passe"
        />
        </Form.Item>

      <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
          className="login-form-button"
            loading={loading}
          block
          >
            Se connecter
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <a 
            data-testid="forgot-password-btn"
            onClick={() => navigate('/auth/forgot-password')}
            style={{ 
              cursor: 'pointer', 
              color: '#666', 
              fontSize: 14,
              textDecoration: 'underline'
            }}
          >
            Mot de passe oublié ?
          </a>
        </div>

        {!hideRegisterLink && (
        <div className="register-link">
          Pas encore de compte ? <a onClick={() => navigate('/auth?tab=register')} style={{ cursor: 'pointer', color: '#1890ff' }}>Créer un compte</a>
          </div>
        )}
      </Form>
    );

  if (noCard) {
    return formContent;
  }

  return (
    <>
      <div className={`login-container ${noBg ? '' : 'with-bg'}`}>
        <Card className="login-card">
          <Title level={2} className="login-title">Connexion</Title>
          {formContent}
        </Card>
        <ForgotPasswordModal
          visible={forgotPasswordVisible}
          onClose={() => setForgotPasswordVisible(false)}
        />
      </div>
    </>
  );
};

export default LoginForm; 