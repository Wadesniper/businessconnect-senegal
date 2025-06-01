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
      
      // Vérification des champs obligatoires
      if (!values.firstName || !values.lastName || !values.phoneNumber || !values.password) {
        message.error('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }

      // Validation du numéro de téléphone
      const cleaned = values.phoneNumber.replace(/[^0-9+]/g, '');
      
      // Vérifier si c'est un format valide
      const isSenegalese = cleaned.startsWith('+221') && /^\+2217\d{8}$/.test(cleaned);
      const isInternational = /^\+\d{1,4}\d{10,}$/.test(cleaned);
      
      if (!isSenegalese && !isInternational) {
        message.error('Format de numéro de téléphone invalide');
        setLoading(false);
        return;
      }
      
      const registrationData: UserRegistrationData = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phoneNumber: cleaned,
        email: values.email,
        password: values.password
      };

      console.log('Envoi des données:', registrationData);
      const response = await register(registrationData);
      console.log('Réponse:', response);
      
      message.success('Inscription réussie ! Bienvenue sur BusinessConnect Sénégal 🎉');
      
      // Redirection vers le dashboard après inscription réussie
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erreur complète:', error);
      
      // Gestion des erreurs de validation du serveur
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errors.forEach((err: any) => {
            message.error(err.message || err);
          });
        } else {
          message.error(errors.message || 'Erreur de validation');
        }
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Une erreur est survenue lors de l\'inscription');
      }
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
    
    // Si l'utilisateur supprime tout, on retourne une chaîne vide
    if (value.length === 0) return '';
    
    // Enlève tout sauf les chiffres et le +
    const cleaned = value.replace(/[^0-9+]/g, '');
    
    // Si l'utilisateur a juste tapé "+", on le laisse faire
    if (cleaned === '+') return '+';
    
    // Format spécifique pour le Sénégal (+221) - OPTIONNEL
    if (cleaned.startsWith('+221') && cleaned.length > 4) {
      const remaining = cleaned.slice(4); // Après +221
      if (remaining.length <= 2) return `+221 ${remaining}`;
      if (remaining.length <= 5) return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2)}`;
      if (remaining.length <= 7) return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2, 5)} ${remaining.slice(5)}`;
      return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2, 5)} ${remaining.slice(5, 7)} ${remaining.slice(7, 9)}`;
    }
    
    // Pour les autres formats internationaux, on garde tel quel
    return cleaned;
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
          help={phoneError}
          validateStatus={phoneError ? 'error' : undefined}
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
          validateTrigger={['onBlur', 'onChange']}
        >
          <Form.Item
            name="firstName"
            label={<span style={{ fontWeight: 500 }}>Prénom</span>}
            rules={[
              { required: true, message: 'Veuillez saisir votre prénom' },
              { min: 2, message: 'Le prénom doit contenir au moins 2 caractères' },
              { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le prénom ne doit contenir que des lettres' }
            ]}
            validateTrigger={['onBlur', 'onChange']}
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
            validateTrigger={['onBlur', 'onChange']}
          >
            <Input size="large" placeholder="Votre nom" className="auth-full-width" style={{ borderRadius: 8 }} />
          </Form.Item>
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
            help={phoneError}
            validateStatus={phoneError ? 'error' : undefined}
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
            name="email"
            label={<span style={{ fontWeight: 500 }}>Email (optionnel)</span>}
            rules={[
              { type: 'email', message: 'Email invalide' }
            ]}
            validateTrigger={['onBlur', 'onChange']}
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
            validateTrigger={['onBlur', 'onChange']}
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
            validateTrigger={['onBlur', 'onChange']}
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