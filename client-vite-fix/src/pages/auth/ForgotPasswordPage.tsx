import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const cleaned = value.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+221')) {
      const remaining = cleaned.slice(4);
      if (remaining.length === 0) return '+221 ';
      if (remaining.length <= 2) return `+221 ${remaining}`;
      if (remaining.length <= 5) return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2)}`;
      if (remaining.length <= 7) return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2, 5)} ${remaining.slice(5)}`;
      return `+221 ${remaining.slice(0, 2)} ${remaining.slice(2, 5)} ${remaining.slice(5, 7)} ${remaining.slice(7, 9)}`;
    }
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    return formatPhoneNumber('+221' + cleaned);
  };

  const handleRequestCode = async (values: { phoneNumber: string }) => {
    setLoading(true);
    try {
      const cleanedPhone = values.phoneNumber.replace(/[^0-9+]/g, '');
      await authService.forgotPassword(cleanedPhone);
      setPhoneNumber(cleanedPhone);
      setStep('code');
      message.success('Code SMS envoyé ! Vérifiez votre téléphone.');
    } catch (error: any) {
      message.error(error.response?.data?.message || "Erreur lors de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: { code: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(phoneNumber, values.code, values.password);
      message.success('Mot de passe réinitialisé avec succès !');
      navigate('/auth');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 32, width: 360, maxWidth: '95vw' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>Mot de passe oublié</Title>
          <Text type="secondary">
            {step === 'phone' ? 'Entrez votre numéro de téléphone' : 'Entrez le code reçu par SMS'}
          </Text>
        </div>
        {step === 'phone' ? (
          <Form
            form={form}
            onFinish={handleRequestCode}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: 'Veuillez entrer votre numéro de téléphone' },
                {
                  validator: (_: any, value: string) => {
                    if (!value) return Promise.reject('Le numéro de téléphone est requis');
                    const cleaned = value.replace(/[^0-9+]/g, '');
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
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  form.setFieldsValue({ phoneNumber: formatted });
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: 40 }}
              >
                Envoyer le code SMS
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={form}
            onFinish={handleResetPassword}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="code"
              rules={[
                { required: true, message: 'Veuillez entrer le code SMS' },
                { len: 6, message: 'Le code doit contenir 6 chiffres' }
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="Code SMS (6 chiffres)"
                maxLength={6}
                style={{ textAlign: 'center', fontSize: 18, letterSpacing: 4 }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Veuillez entrer le nouveau mot de passe' },
                { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nouveau mot de passe"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: 'Veuillez confirmer le mot de passe' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Les mots de passe ne correspondent pas');
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirmer le mot de passe"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: 40 }}
              >
                Réinitialiser le mot de passe
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="link" onClick={() => { setStep('phone'); form.resetFields(); }}>
                ← Retour
              </Button>
              <Button type="link" onClick={() => navigate('/auth')}>
                Retour à la connexion
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 