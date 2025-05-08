import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  it('devrait inscrire un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        phoneNumber: '+221771234567'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/inscrit/i);
  });
}); 