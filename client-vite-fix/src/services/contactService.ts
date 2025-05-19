import axios from 'axios';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error('REACT_APP_API_URL n\'est pas définie dans les variables d\'environnement !');
}

export const contactService = {
  sendContactEmail: async (formData: ContactFormData) => {
    try {
      const response = await axios.post(`${API_URL}/contact`, formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default contactService; 