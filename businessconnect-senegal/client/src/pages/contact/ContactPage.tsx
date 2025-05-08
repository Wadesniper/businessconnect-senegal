import React, { useState } from 'react';
import { Layout, Row, Col, Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { EnvironmentOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { sendContactEmail } from '../../services/emailService';
import styles from './Contact.module.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface ContactForm {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ContactForm) => {
    setLoading(true);
    try {
      await sendContactEmail(values);
      message.success('Votre message a été envoyé avec succès !');
      form.resetFields();
    } catch (error) {
      message.error('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className={styles.container}>
      <Content>
        <div className={styles.heroSection}>
          <Title level={1}>Contactez-nous</Title>
          <Text className={styles.subtitle}>
            Nous sommes là pour vous aider et répondre à toutes vos questions
          </Text>
        </div>

        <Row gutter={[32, 32]} className={styles.mainContent}>
          <Col xs={24} md={10}>
            <Card className={styles.contactInfo}>
              <Title level={2}>Informations de contact</Title>
              <div className={styles.infoItem}>
                <EnvironmentOutlined className={styles.icon} />
                <div>
                  <Text strong>Adresse</Text>
                  <Text>Dakar, Sénégal</Text>
                  <Text>Plateau, Avenue de la République</Text>
                </div>
              </div>

              <div className={styles.infoItem}>
                <MailOutlined className={styles.icon} />
                <div>
                  <Text strong>Email</Text>
                  <Text>contact@businessconnectsenegal.com</Text>
                </div>
              </div>

              <div className={styles.infoItem}>
                <ClockCircleOutlined className={styles.icon} />
                <div>
                  <Text strong>Heures d'ouverture</Text>
                  <Text>Lundi - Vendredi: 9h - 18h</Text>
                  <Text>Samedi: 9h - 13h</Text>
                </div>
              </div>

              <div className={styles.mapContainer}>
                <iframe
                  title="Google Maps - Localisation BusinessConnect Sénégal"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.0517242430385!2d-17.4377!3d14.6937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQxJzM3LjMiTiAxN8KwMjYnMTUuNyJX!5e0!3m2!1sfr!2ssn!4v1635789012345!5m2!1sfr!2ssn"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card className={styles.contactForm}>
              <Title level={2}>Envoyez-nous un message</Title>
              <Text className={styles.formDescription}>
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </Text>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className={styles.form}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="nom"
                      label="Nom complet"
                      rules={[{ required: true, message: 'Veuillez saisir votre nom' }]}
                    >
                      <Input size="large" placeholder="Votre nom complet" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Veuillez saisir votre email' },
                        { type: 'email', message: 'Veuillez saisir un email valide' }
                      ]}
                    >
                      <Input size="large" placeholder="Votre adresse email" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="sujet"
                  label="Sujet"
                  rules={[{ required: true, message: 'Veuillez saisir le sujet' }]}
                >
                  <Input size="large" placeholder="Le sujet de votre message" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Message"
                  rules={[{ required: true, message: 'Veuillez saisir votre message' }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Votre message..."
                    className={styles.messageInput}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    className={styles.submitButton}
                  >
                    Envoyer le message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ContactPage; 