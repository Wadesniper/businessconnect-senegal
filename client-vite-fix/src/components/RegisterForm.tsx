import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRegistrationData } from '../types/user';

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
    fullName: string;
    phoneNumber: string;
    email?: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const [firstName, ...lastNameParts] = values.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ');

      const registrationData: UserRegistrationData = {
        firstName,
        lastName,
        phoneNumber: values.phoneNumber,
        password: values.password,
        email: values.email,
        role: 'etudiant' // Rôle par défaut
      };

      await register(registrationData);
      message.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error) {
      message.error('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+') && !/^7\d{8}$/.test(cleaned)) {
      setPhoneError("Merci d'entrer votre numéro au format international (ex : +221 771234567 ou +33 612345678).");
    } else {
      setPhoneError('');
    }
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
          name="fullName"
          label={<span style={{ fontWeight: 500 }}>Nom complet</span>}
          rules={[
            { required: true, message: 'Veuillez saisir votre nom complet' },
            { min: 3, message: 'Le nom doit contenir au moins 3 caractères' },
            { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le nom ne doit contenir que des lettres' }
          ]}
        >
          <Input size="large" placeholder="Prénom et Nom" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label={<span style={{ fontWeight: 500 }}>Numéro de téléphone</span>}
          rules={[
            { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
            { pattern: /^\+?[0-9]{8,15}$/, message: 'Numéro de téléphone invalide' }
          ]}
        >
          <Input
            size="large"
            placeholder="+221 XX XXX XX XX"
            style={{ borderRadius: 8 }}
            onBlur={e => validatePhone(e.target.value)}
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
          <Input size="large" placeholder="exemple@email.com" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          name="password"
          label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
          rules={[
            { required: true, message: 'Veuillez saisir un mot de passe' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
          ]}
        >
          <Input.Password size="large" placeholder="Votre mot de passe" style={{ borderRadius: 8 }} />
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
          <Input.Password size="large" placeholder="Confirmez votre mot de passe" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: '100%', borderRadius: 8, fontWeight: 600, fontSize: 16, height: 48 }}
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
    <div style={{
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
      <div style={{
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
            name="fullName"
            label={<span style={{ fontWeight: 500 }}>Nom complet</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre nom complet' },
              { min: 3, message: 'Le nom doit contenir au moins 3 caractères' },
              { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le nom ne doit contenir que des lettres' }
            ]}
          >
            <Input size="large" placeholder="Prénom et Nom" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={<span style={{ fontWeight: 500 }}>Numéro de téléphone</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
              { pattern: /^\+?[0-9]{8,15}$/, message: 'Numéro de téléphone invalide' }
            ]}
          >
            <Input
              size="large"
              placeholder="+221 XX XXX XX XX"
              style={{ borderRadius: 8 }}
              onBlur={e => validatePhone(e.target.value)}
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
            <Input size="large" placeholder="exemple@email.com" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 500 }}>Mot de passe</span>}
            rules={[
              { required: true, message: 'Veuillez saisir un mot de passe' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
            ]}
          >
            <Input.Password size="large" placeholder="Votre mot de passe" style={{ borderRadius: 8 }} />
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
            <Input.Password size="large" placeholder="Confirmez votre mot de passe" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100%', borderRadius: 8, fontWeight: 600, fontSize: 16, height: 48 }}
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