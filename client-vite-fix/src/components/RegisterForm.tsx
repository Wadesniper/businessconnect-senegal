import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRegistrationData } from '../types/user';

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

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

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Inscription</h2>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="fullName"
          label="Nom complet"
          rules={[
            { required: true, message: 'Veuillez saisir votre nom complet' },
            { min: 3, message: 'Le nom doit contenir au moins 3 caractères' },
            { pattern: /^[a-zA-ZÀ-ÿ\s]+$/, message: 'Le nom ne doit contenir que des lettres' }
          ]}
        >
          <Input size="large" placeholder="Prénom et Nom" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Numéro de téléphone"
          rules={[
            { required: true, message: 'Veuillez saisir votre numéro de téléphone' },
            { pattern: /^\+?[0-9]{8,15}$/, message: 'Numéro de téléphone invalide' }
          ]}
        >
          <Input size="large" placeholder="+221 XX XXX XX XX" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email (optionnel)"
          rules={[
            { type: 'email', message: 'Email invalide' }
          ]}
        >
          <Input size="large" placeholder="exemple@email.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mot de passe"
          rules={[
            { required: true, message: 'Veuillez saisir un mot de passe' },
            { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
          ]}
        >
          <Input.Password size="large" placeholder="Votre mot de passe" />
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
          <Input.Password size="large" placeholder="Confirmez votre mot de passe" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            S'inscrire
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <a href="/login">Déjà inscrit ? Se connecter</a>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm; 