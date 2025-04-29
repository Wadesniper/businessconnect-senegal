import React, { useState } from 'react';
import { Form, Input, Button, Typography, Row, Col, message, Card } from 'antd';
import { MailOutlined, SendOutlined } from '@ant-design/icons';
import { contactService } from '../../services/contactService';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await contactService.sendContactEmail(values);
      message.success('Message envoyé avec succès !');
      form.resetFields();
    } catch (error) {
      message.error('Une erreur est survenue lors de l\'envoi du message.');
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Row gutter={[32, 32]} justify="center">
        <Col xs={24} lg={12}>
          <Title level={2}>Contactez-nous</Title>
          <Paragraph>
            Vous avez des questions ? N'hésitez pas à nous contacter. Notre équipe vous répondra dans les plus brefs délais.
          </Paragraph>

          <Card style={{ marginBottom: '2rem' }}>
            <Title level={4}>
              <MailOutlined /> Email
            </Title>
            <Paragraph>
              <a href="mailto:contact@businessconnect-senegal.com">
                contact@businessconnect-senegal.com
              </a>
            </Paragraph>
          </Card>

          <Form
            form={form}
            name="contact"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label="Nom complet"
              rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
            >
              <Input placeholder="Votre nom complet" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Veuillez entrer votre email' },
                { type: 'email', message: 'Veuillez entrer un email valide' }
              ]}
            >
              <Input placeholder="Votre adresse email" />
            </Form.Item>

            <Form.Item
              name="subject"
              label="Sujet"
              rules={[{ required: true, message: 'Veuillez entrer un sujet' }]}
            >
              <Input placeholder="Le sujet de votre message" />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[{ required: true, message: 'Veuillez entrer votre message' }]}
            >
              <TextArea
                placeholder="Votre message"
                rows={6}
                style={{ resize: 'none' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={loading}
                size="large"
              >
                Envoyer le message
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Col xs={24} lg={12}>
          <div style={{ height: '400px', marginBottom: '2rem' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123857.89774213466!2d-17.544236799999998!3d14.716677600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xec172f5b3c5bb71%3A0xb17c17d92d5db21f!2sDakar%2C%20S%C3%A9n%C3%A9gal!5e0!3m2!1sfr!2sfr!4v1647887648772!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <Card>
            <Title level={4}>Nos bureaux</Title>
            <Paragraph>
              Dakar, Sénégal
            </Paragraph>
            <Paragraph type="secondary">
              Notre équipe est présente à Dakar pour mieux servir nos clients et partenaires.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage; 