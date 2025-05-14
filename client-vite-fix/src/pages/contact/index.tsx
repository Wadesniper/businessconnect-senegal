import React, { useState } from 'react';
import { Form, Input, Button, Typography, Layout, message, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #ffffff 100%);
  padding: 60px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ContactCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
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

  const onFinish = async (values: ContactFormData) => {
    try {
      setLoading(true);
      await axios.post('/api/contact', values);
      message.success('Votre message a bien été envoyé !');
      form.resetFields();
    } catch (error) {
      message.error('Une erreur est survenue lors de l\'envoi du message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledLayout>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={1}>Contactez-nous</Title>
          <Paragraph style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
            Une question ? Un projet ? N'hésitez pas à nous contacter.
            Notre équipe vous répondra dans les plus brefs délais.
          </Paragraph>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: 40 }}>
          <InfoCard>
            <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
              <MailOutlined style={{ fontSize: 32, color: '#faad14' }} />
              <Title level={4}>Email</Title>
              <Text>
                <a href="mailto:contact@businessconnectsenegal.com">
                  contact@businessconnectsenegal.com
                </a>
              </Text>
            </Space>
          </InfoCard>
        </div>

        <ContactCard>
          <Title level={3} style={{ marginBottom: 30, textAlign: 'center' }}>
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
                rows={6}
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
        </ContactCard>
      </Container>
    </StyledLayout>
  );
};

export default ContactPage; 