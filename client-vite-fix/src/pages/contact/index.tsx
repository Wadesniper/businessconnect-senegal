import React, { useState } from 'react';
import { Form, Input, Button, Typography, Layout, message, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, UserOutlined, CheckCircleTwoTone, MessageOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  padding: 40px 4vw 20px 4vw;
  @media (max-width: 600px) {
    padding: 20px 16px 16px 16px;
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0 24px;
  @media (max-width: 900px) {
    max-width: 100vw;
  }
  @media (max-width: 600px) {
    margin: 0 auto;
    padding: 0 8px;
    max-width: 100vw;
  }
`;

const ContactCard = styled.div`
  background: white;
  padding: 32px 18px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-top: 24px;
  @media (max-width: 600px) {
    padding: 20px 16px;
    border-radius: 12px;
    margin-top: 12px;
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(90deg, #fffbe6 0%, #fff1b8 100%);
  padding: 12px 0 8px 0;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(250,173,20,0.06);
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 600px) {
    padding: 12px 8px 8px 8px;
    border-radius: 8px;
    margin-bottom: 6px;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input, .ant-input-affix-wrapper {
    padding: 12px;
    border-radius: 8px;
  }

  .ant-btn {
    height: 45px;
    border-radius: 8px;
    font-weight: 600;
  }

  textarea.ant-input {
    min-height: 120px;
  }
`;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await axios.post('/api/contact', values);
      setSent(true);
      message.success('Votre message a bien été envoyé !');
      form.resetFields();
      setTimeout(() => setSent(false), 3500);
    } catch (error) {
      message.error('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  // Responsive : deux colonnes sur desktop, une sur mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;

  return (
    <StyledLayout>
      <Container>
        {/* Header visuel premium */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8
          }}>
            <MessageOutlined style={{ fontSize: 54, color: '#1890ff', marginBottom: 8, background: 'linear-gradient(135deg, #e6fff2 0%, #1890ff22 100%)', borderRadius: 18, padding: 10 }} />
          </div>
          <Title level={1} style={{ marginBottom: 8, fontWeight: 800, color: '#1890ff', letterSpacing: 1, fontSize: 36 }}>Contactez-nous</Title>
          <Paragraph style={{ fontSize: '1.18rem', color: '#555', maxWidth: 600, margin: '0 auto' }}>
            Une question, un projet, un besoin&nbsp;? <b>Notre équipe vous répond sous 24h</b>.<br />Nous sommes à votre écoute pour vous accompagner.
          </Paragraph>
        </div>
        {/* Disposition deux colonnes */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 0 : 48,
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          {/* Colonne gauche : infos et réassurance */}
          <div style={{ 
            flex: 1, 
            minWidth: isMobile ? '100%' : 260, 
            maxWidth: isMobile ? '100%' : 370, 
            marginBottom: isMobile ? 32 : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start'
          }}>
            <InfoCard>
              <MailOutlined style={{ fontSize: 22, color: '#faad14', marginBottom: 2 }} />
              <Title level={5} style={{ margin: 0, fontSize: 17 }}>Email</Title>
              <Text>
                <a href="mailto:contact@businessconnectsenegal.com" style={{ fontWeight: 600, color: '#ad6800', fontSize: 15 }}>
                  contact@businessconnectsenegal.com
                </a>
              </Text>
            </InfoCard>
            <InfoCard style={{ background: 'linear-gradient(90deg, #f0f5ff 0%, #e6fff2 100%)', boxShadow: '0 2px 8px #1890ff11' }}>
              <EnvironmentOutlined style={{ fontSize: 20, color: '#1890ff', marginBottom: 2 }} />
              <Title level={5} style={{ margin: 0, fontSize: 17 }}>Adresse</Title>
              <Text style={{ color: '#1890ff', fontWeight: 600, fontSize: 15 }}>Dakar, Sénégal</Text>
            </InfoCard>
            <InfoCard style={{ background: 'linear-gradient(90deg, #e6fff2 0%, #fffbe6 100%)', boxShadow: '0 2px 8px #faad1411' }}>
              <CheckCircleTwoTone twoToneColor="#1ec773" style={{ fontSize: 20, marginBottom: 2 }} />
              <Text style={{ color: '#1ec773', fontWeight: 600, fontSize: 15 }}>Réponse sous 24h</Text>
            </InfoCard>
            <InfoCard style={{ background: 'linear-gradient(90deg, #f0f5ff 0%, #fffbe6 100%)', boxShadow: '0 2px 8px #faad1411' }}>
              <UserOutlined style={{ fontSize: 20, color: '#faad14', marginBottom: 2 }} />
              <Text style={{ color: '#faad14', fontWeight: 600, fontSize: 15 }}>Support humain & personnalisé</Text>
            </InfoCard>
            <InfoCard style={{ background: 'linear-gradient(90deg, #e6fff2 0%, #f0f5ff 100%)', boxShadow: '0 2px 8px #1ec77311' }}>
              <MessageOutlined style={{ fontSize: 20, color: '#1890ff', marginBottom: 2 }} />
              <Text style={{ color: '#1890ff', fontWeight: 600, fontSize: 15 }}>Vos données sont confidentielles</Text>
            </InfoCard>
          </div>
          {/* Colonne droite : formulaire premium */}
          <div style={{ 
            flex: 2, 
            minWidth: isMobile ? '100%' : 320, 
            maxWidth: isMobile ? '100%' : 600,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <ContactCard style={{ boxShadow: '0 8px 32px rgba(24, 144, 255, 0.10)', border: '1.5px solid #e6f7ff', marginTop: 0 }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: 32 }}>
                  <CheckCircleTwoTone twoToneColor="#1ec773" style={{ fontSize: 54 }} />
                  <Title level={3} style={{ marginTop: 16, color: '#1ec773' }}>Message envoyé !</Title>
                  <Paragraph style={{ color: '#555' }}>Merci pour votre message, nous vous répondrons rapidement.</Paragraph>
                </div>
              ) : (
                <>
                  <Title level={3} style={{ marginBottom: 18, textAlign: 'center', color: '#1890ff', fontWeight: 700 }}>
                    Envoyez-nous un message
                  </Title>
                  <StyledForm
                    form={form}
                    name="contact"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                  >
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Votre nom complet"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Veuillez saisir votre email' },
                        { type: 'email', message: 'Email invalide' }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="Votre email"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="subject"
                      rules={[{ required: true, message: 'Veuillez saisir l\'objet de votre message' }]}
                    >
                      <Input
                        placeholder="Objet de votre message"
                        size="large"
                      />
                    </Form.Item>
                    <Form.Item
                      name="message"
                      rules={[{ required: true, message: 'Veuillez saisir votre message' }]}
                    >
                      <TextArea
                        placeholder="Votre message"
                        rows={5}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                        style={{
                          background: 'linear-gradient(90deg, #1890ff 0%, #1ec773 100%)',
                          border: 'none',
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 18,
                          height: 52,
                          boxShadow: '0 2px 12px #1890ff22',
                        }}
                      >
                        Envoyer
                      </Button>
                    </Form.Item>
                  </StyledForm>
                </>
              )}
            </ContactCard>
          </div>
        </div>
      </Container>
    </StyledLayout>
  );
};

export default ContactPage; 