import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { authService } from '../services/authService';

const { Title, Text } = Typography;

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

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
    
    // Format générique pour les autres pays
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // Si pas de +, on ajoute +221 et on applique le format sénégalais
    return formatPhoneNumber('+221' + cleaned);
  };

  const handleRequestCode = async (values: { phoneNumber: string }) => {
    setLoading(true);
    try {
      // Nettoyage du numéro de téléphone
      const cleanedPhone = values.phoneNumber.replace(/[^\d+]/g, '');
      
      await authService.forgotPassword(cleanedPhone);
      setPhoneNumber(cleanedPhone);
      setStep('code');
      message.success('Code SMS envoyé ! Vérifiez votre téléphone.');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de l\'envoi du code');
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
      onClose();
      form.resetFields();
      setStep('phone');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    form.resetFields();
    setStep('phone');
    setPhoneNumber('');
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Mot de passe oublié
          </Title>
          <Text type="secondary">
            {step === 'phone' ? 'Entrez votre numéro de téléphone' : 'Entrez le code reçu par SMS'}
          </Text>
        </div>
      }
      visible={visible}
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
    >
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
            <Button
              type="link"
              onClick={() => {
                setStep('phone');
                form.resetFields();
              }}
            >
              ← Retour
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal; 