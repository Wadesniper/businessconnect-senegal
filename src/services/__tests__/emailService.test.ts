import { sendVerificationEmail } from '../emailService';

describe('Email Service', () => {
  it('should send verification email', async () => {
    const email = 'test@example.com';
    const token = 'test-token';
    
    const result = await sendVerificationEmail(email, token);
    expect(result).toBeDefined();
  });
}); 