import { sendEmail } from '../emailService';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('Service Email', () => {
  let mockSendMail: jest.Mock;

  beforeEach(() => {
    mockSendMail = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait envoyer un email avec succès', async () => {
    const emailOptions = {
      to: 'test@example.com',
      from: 'noreply@businessconnect.sn',
      subject: 'Test Email',
      html: '<p>Test content</p>'
    };

    mockSendMail.mockResolvedValueOnce({ messageId: 'test-id' });

    await expect(sendEmail(emailOptions)).resolves.not.toThrow();
    expect(mockSendMail).toHaveBeenCalledWith({
      ...emailOptions,
      from: '88ccee002@smtp-brevo.com' // Vérifie que l'adresse d'expédition est remplacée
    });
  });

  it('devrait gérer les erreurs d\'envoi', async () => {
    const emailOptions = {
      to: 'test@example.com',
      from: 'noreply@businessconnect.sn',
      subject: 'Test Email',
      html: '<p>Test content</p>'
    };

    mockSendMail.mockRejectedValueOnce(new Error('Erreur SMTP'));

    await expect(sendEmail(emailOptions)).rejects.toThrow('Échec de l\'envoi de l\'email');
  });
}); 