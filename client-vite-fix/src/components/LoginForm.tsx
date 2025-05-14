import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Connexion</h2>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
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
          name="password"
          label="Mot de passe"
          rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
        >
          <Input.Password size="large" placeholder="Votre mot de passe" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Se connecter
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <a href="/register">Pas encore inscrit ? Créer un compte</a>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm; 