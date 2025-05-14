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
    padding: 16px 0 8px 0;
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
    padding: 0 6px;
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
    padding: 16px 4px;
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
    padding: 8px 0 4px 0;
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

  return (
    <StyledLayout>
      <Container>
        <div style={{ textAlign: 'left', marginBottom: 36, maxWidth: 600 }}>
          <MessageOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 8 }} />
          <Title level={1} style={{ marginBottom: 8 }}>Contactez-nous</Title>
          <Paragraph style={{ fontSize: '1.1rem', maxWidth: 600, margin: '0 0 0 0' }}>
            Une question ? Un projet ? N'hésitez pas à nous contacter.<br />Notre équipe vous répondra dans les plus brefs délais.
          </Paragraph>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: 24 }}>
          <InfoCard>
            <MailOutlined style={{ fontSize: 22, color: '#faad14', marginBottom: 2 }} />
            <Title level={5} style={{ margin: 0, fontSize: 17 }}>Email</Title>
            <Text>
              <a href="mailto:contact@businessconnectsenegal.com" style={{ fontWeight: 600, color: '#ad6800', fontSize: 15 }}>
                contact@businessconnectsenegal.com
              </a>
            </Text>
          </InfoCard>
        </div>
        <ContactCard>
          {sent ? (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
              <Title level={3} style={{ marginTop: 16 }}>Message envoyé !</Title>
              <Paragraph>Merci pour votre message, nous vous répondrons rapidement.</Paragraph>
            </div>
          ) : (
            <>
              <Title level={3} style={{ marginBottom: 18, textAlign: 'center' }}>
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
                  >
                    Envoyer le message
                  </Button>
                </Form.Item>
              </StyledForm>
            </>
          )}
        </ContactCard>
      </Container>
    </StyledLayout>
  );
};

export default ContactPage; 