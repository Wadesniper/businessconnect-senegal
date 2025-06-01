import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Ajout des props
interface LoginFormProps {
  noCard?: boolean;
  noBg?: boolean;
  hideRegisterLink?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ noCard, noBg, hideRegisterLink }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState('');
  const [form] = Form.useForm();

  const onFinish = async (values: { phoneNumber: string; password: string }) => {
    try {
      setLoading(true);
      await login(values.phoneNumber, values.password);
      message.success('Connexion réussie');
      navigate('/dashboard');
    } catch (error) {
      message.error('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneError('Le numéro de téléphone est requis');
      return;
    }
    
    // Nettoie le numéro en gardant uniquement les chiffres et le +
    const cleaned = value.replace(/[^0-9+]/g, '');
    
    // Format international : +XXXXXXXXXXXXX (minimum 10 chiffres après l'indicatif)
    if (/^\+\d{1,4}\d{10,}$/.test(cleaned)) {
      setPhoneError('');
      return;
    }
    
    setPhoneError("Le numéro doit être au format international (+XXX XXXXXXXXX)");
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

  // Si noCard ou noBg, on affiche juste le formulaire sans fond ni card
  if (noCard || noBg) {
    return (
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
        style={{ boxSizing: 'border-box', overflowX: 'hidden' }}
      >
        <Form.Item
          name="phoneNumber"
          label={<span style={{ fontWeight: 500 }}>Numéro de téléphone</span>}
          rules={[
            { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
            { 
              validator: async (_, value) => {
                if (!value) {
                  throw new Error('Veuillez saisir votre numéro de téléphone');
                }
                
                const cleaned = value.replace(/[^0-9+]/g, '');
                
                // Format international : +XXXXXXXXXXXXX
                if (!/^\+\d{1,4}\d{10,}$/.test(cleaned)) {
                  throw new Error('Le numéro doit être au format international (+XXX XXXXXXXXX)');
                }
              }
            }
          ]}
          validateTrigger={['onBlur', 'onChange']}
        >
          <Input
            size="large"
            placeholder="+XXX XXXXXXXXX"
            className="auth-full-width"
            style={{ borderRadius: 8 }}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              form.setFieldsValue({ phoneNumber: formatted });
              validatePhone(formatted);
            }}
            onBlur={(e) => validatePhone(e.target.value)}
          />
        </Form.Item>
        {phoneError && <div style={{ color: 'red', marginBottom: 12 }}>{phoneError}</div>}
        <Form.Item
          name="password"
          label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
          rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
        >
          <Input.Password size="large" placeholder="Votre mot de passe" className="auth-full-width" style={{ borderRadius: 8, width: '100% !important' }} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="auth-full-width"
            style={{ width: '100% !important', borderRadius: 8, fontWeight: 600, fontSize: 16, height: 48 }}
            loading={loading}
          >
            Se connecter
          </Button>
        </Form.Item>
        {!hideRegisterLink && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <a href="/register">Pas encore inscrit ? Créer un compte</a>
          </div>
        )}
      </Form>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1890ff 0%, #43e97b 100%)',
      padding: isMobile ? '0 0 0 0' : 0,
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      <div className="auth-card" style={{
        width: '100%',
        maxWidth: isMobile ? '95vw' : 420,
        padding: isMobile ? '12px 6px' : '40px 32px 32px 32px',
        borderRadius: isMobile ? 10 : 18,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        background: '#fff',
        boxSizing: 'border-box',
        margin: isMobile ? '0 auto' : undefined,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 20, color: '#1890ff', marginBottom: 2 }}>
            Bienvenue sur BusinessConnect Sénégal
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 10 }}>
            Connectez-vous pour accéder à votre espace personnel
          </div>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: isMobile ? 12 : 24, fontWeight: 700, letterSpacing: 1, fontSize: isMobile ? 20 : 28 }}>
          Connexion
        </h2>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          style={{ boxSizing: 'border-box', overflowX: 'hidden' }}
        >
          <Form.Item
            name="phoneNumber"
            label={<span style={{ fontWeight: 500 }}>Numéro de téléphone</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
              { 
                validator: async (_, value) => {
                  if (!value) {
                    throw new Error('Veuillez saisir votre numéro de téléphone');
                  }
                  
                  const cleaned = value.replace(/[^0-9+]/g, '');
                  
                  // Format international : +XXXXXXXXXXXXX
                  if (!/^\+\d{1,4}\d{10,}$/.test(cleaned)) {
                    throw new Error('Le numéro doit être au format international (+XXX XXXXXXXXX)');
                  }
                }
              }
            ]}
            validateTrigger={['onBlur', 'onChange']}
          >
            <Input
              size="large"
              placeholder="+XXX XXXXXXXXX"
              className="auth-full-width"
              style={{ borderRadius: 8 }}
              onChange={(e) => {
                const formatted = formatPhoneNumber(e.target.value);
                form.setFieldsValue({ phoneNumber: formatted });
                validatePhone(formatted);
              }}
              onBlur={(e) => validatePhone(e.target.value)}
            />
          </Form.Item>
          {phoneError && <div style={{ color: 'red', marginBottom: 12 }}>{phoneError}</div>}
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
          >
            <Input.Password size="large" placeholder="Votre mot de passe" className="auth-full-width" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="auth-full-width"
              style={{ borderRadius: 8, fontWeight: 600, fontSize: isMobile ? 15 : 16, height: isMobile ? 40 : 48 }}
              loading={loading}
            >
              Se connecter
            </Button>
          </Form.Item>
          {!hideRegisterLink && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <a href="/register">Pas encore inscrit ? Créer un compte</a>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default LoginForm; 