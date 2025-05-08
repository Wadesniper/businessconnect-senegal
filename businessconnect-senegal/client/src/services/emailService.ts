import axios from 'axios';

interface EmailData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export const sendContactEmail = async (data: EmailData): Promise<void> => {
  try {
    const response = await axios.post('/api/contact/send-email', {
      to: 'contact@businessconnectsenegal.com',
      from: data.email,
      subject: `Contact - ${data.sujet}`,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom:</strong> ${data.nom}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Sujet:</strong> ${data.sujet}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `
    });

    if (!response.data.success) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}; 