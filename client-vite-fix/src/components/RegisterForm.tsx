import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRegistrationData } from '../types/user';

// Ajout des props
interface RegisterFormProps {
  noCard?: boolean;
  noBg?: boolean;
  hideLoginLink?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ noCard, noBg, hideLoginLink }) => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [phoneError, setPhoneError] = useState('');

  const onFinish = async (values: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      
      const registrationData: UserRegistrationData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phoneNumber,
        email: values.email,
        password: values.password
      };

      const response = await register(registrationData);
      
      if (response.success) {
        message.success(response.message);
        navigate('/login');
      } else {
        message.error(response.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneError('Le numéro de téléphone est requis');
      return;
    }
    
    // Nettoie le numéro en gardant uniquement les chiffres, les espaces et le +
    const cleaned = value.replace(/[^0-9\s+]/g, '');
    
    // Retire les espaces pour la validation
    const withoutSpaces = cleaned.replace(/\s/g, '');
    
    // Vérifie si c'est un numéro international sénégalais
    if (withoutSpaces.startsWith('+221')) {
      if (/^\+221[76]\d{8}$/.test(withoutSpaces)) {
        setPhoneError('');
        return;
      }
      setPhoneError('Le numéro doit commencer par 7 ou 6 et avoir 9 chiffres après +221');
      return;
    }
    
    // Vérifie si c'est un numéro sénégalais sans indicatif
    if (/^[76]\d{8}$/.test(withoutSpaces)) {
      setPhoneError('');
      return;
    }
    
    setPhoneError("Le numéro doit être au format sénégalais (+221 7X XXX XX XX ou 7X XXX XX XX)");
  };

  // Si noCard ou noBg, on affiche juste le formulaire sans fond ni card
  if (noCard || noBg) {
    return (
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="firstName"
          label={<span style={{ fontWeight: 500 }}>Prénom</span>}
          rules={[
            { required: true, message: 'Veuillez saisir votre prénom' },
            { min: 2, message: 'Le prénom doit contenir au moins 2 caractères' },
            { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le prénom ne doit contenir que des lettres' }
          ]}
        >
          <Input size="large" placeholder="Votre prénom" className="auth-full-width" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          name="lastName"
          label={<span style={{ fontWeight: 500 }}>Nom</span>}
          rules={[
            { required: true, message: 'Veuillez saisir votre nom' },
            { min: 2, message: 'Le nom doit contenir au moins 2 caractères' },
            { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le nom ne doit contenir que des lettres' }
          ]}
        >
          <Input size="large" placeholder="Votre nom" className="auth-full-width" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label={<span style={{ fontWeight: 500 }}>Numéro de téléphone</span>}
          rules={[
            { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
            { 
              pattern: /^(\+221[\s]*[76][0-9\s]{8}|[76][\s]*[0-9\s]{8})$/,
              message: 'Le numéro doit être au format sénégalais (+221 7X XXX XX XX ou 7X XXX XX XX)'
            }
          ]}
        >
          <Input
            size="large"
            placeholder="+221 7X XXX XX XX"
            className="auth-full-width"
            style={{ borderRadius: 8 }}
            onChange={e => validatePhone(e.target.value)}
          />
        </Form.Item>
        {phoneError && <div style={{ color: 'red', marginBottom: 12 }}>{phoneError}</div>}
        <Form.Item
          name="email"
          label={<span style={{ fontWeight: 500 }}>Email (optionnel)</span>}
          rules={[
            { type: 'email', message: 'Email invalide' }
          ]}
        >
          <Input size="large" placeholder="exemple@email.com" className="auth-full-width" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          name="password"
          label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
          rules={[
            { required: true, message: 'Veuillez saisir un mot de passe' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
          ]}
        >
          <Input.Password size="large" placeholder="Votre mot de passe" className="auth-full-width" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={<span style={{ fontWeight: 500 }}>Confirmer le mot de passe</span>}
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
          <Input.Password size="large" placeholder="Confirmez votre mot de passe" className="auth-full-width" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="auth-full-width"
            style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, height: 48 }}
            loading={loading}
          >
            S'inscrire
          </Button>
        </Form.Item>
        {!hideLoginLink && (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <a href="/login">Déjà inscrit ? Se connecter</a>
          </div>
        )}
      </Form>
    );
  }

  return (
    <div className="auth-card" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1890ff 0%, #43e97b 100%)',
      padding: typeof window !== 'undefined' && window.innerWidth <= 600 ? '0 0 0 0' : 0,
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>
      <div className="auth-card" style={{
        width: '100%',
        maxWidth: typeof window !== 'undefined' && window.innerWidth <= 600 ? '95vw' : 480,
        padding: typeof window !== 'undefined' && window.innerWidth <= 600 ? '12px 6px' : '40px 32px 32px 32px',
        borderRadius: typeof window !== 'undefined' && window.innerWidth <= 600 ? 10 : 18,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        background: '#fff',
        boxSizing: 'border-box',
        margin: typeof window !== 'undefined' && window.innerWidth <= 600 ? '0 auto' : undefined,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <img src="/logo192.png" alt="Logo" style={{ width: 56, marginBottom: 8 }} />
          <div style={{ fontWeight: 600, fontSize: 20, color: '#1890ff', marginBottom: 2 }}>
            Bienvenue sur BusinessConnect Sénégal
          </div>
          <div style={{ color: '#888', fontSize: 15, marginBottom: 10 }}>
            Créez votre compte pour rejoindre la communauté
          </div>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 700, letterSpacing: 1, fontSize: 28 }}>
          Inscription
        </h2>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="firstName"
            label={<span style={{ fontWeight: 500 }}>Prénom</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre prénom' },
              { min: 2, message: 'Le prénom doit contenir au moins 2 caractères' },
              { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le prénom ne doit contenir que des lettres' }
            ]}
          >
            <Input size="large" placeholder="Votre prénom" className="auth-full-width" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={<span style={{ fontWeight: 500 }}>Nom</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre nom' },
              { min: 2, message: 'Le nom doit contenir au moins 2 caractères' },
              { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le nom ne doit contenir que des lettres' }
            ]}
          >
            <Input size="large" placeholder="Votre nom" className="auth-full-width" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={<span style={{ fontWeight: 500 }}>Numéro de téléphone</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
              { 
                pattern: /^(\+221[\s]*[76][0-9\s]{8}|[76][\s]*[0-9\s]{8})$/,
                message: 'Le numéro doit être au format sénégalais (+221 7X XXX XX XX ou 7X XXX XX XX)'
              }
            ]}
          >
            <Input
              size="large"
              placeholder="+221 7X XXX XX XX"
              className="auth-full-width"
              style={{ borderRadius: 8 }}
              onChange={e => validatePhone(e.target.value)}
            />
          </Form.Item>
          {phoneError && <div style={{ color: 'red', marginBottom: 12 }}>{phoneError}</div>}
          <Form.Item
            name="email"
            label={<span style={{ fontWeight: 500 }}>Email (optionnel)</span>}
            rules={[
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input size="large" placeholder="exemple@email.com" className="auth-full-width" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
            rules={[
              { required: true, message: 'Veuillez saisir un mot de passe' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
            ]}
          >
            <Input.Password size="large" placeholder="Votre mot de passe" className="auth-full-width" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={<span style={{ fontWeight: 500 }}>Confirmer le mot de passe</span>}
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
            <Input.Password size="large" placeholder="Confirmez votre mot de passe" className="auth-full-width" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="auth-full-width"
              style={{ borderRadius: 8, fontWeight: 600, fontSize: 16, height: 48 }}
              loading={loading}
            >
              S'inscrire
            </Button>
          </Form.Item>
          {!hideLoginLink && (
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <a href="/login">Déjà inscrit ? Se connecter</a>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm; 