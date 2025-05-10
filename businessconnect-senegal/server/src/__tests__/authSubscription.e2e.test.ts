import request from 'supertest';
import app from '../../src/index';
import { User } from '../models/UserModel';
import mongoose from 'mongoose';

let token = '';
let userId = '';

describe('Flux complet inscription > abonnement > accès', () => {
  beforeAll(async () => {
    // Connexion à la base de test
    await mongoose.connect(process.env.MONGODB_URI as string);
    await User.deleteMany({ phoneNumber: '771234567' });
  });

  afterAll(async () => {
    await User.deleteMany({ phoneNumber: '771234567' });
    await mongoose.disconnect();
  });

  it('Inscription et connexion automatique', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '771234567',
        password: 'Test1234!',
        role: 'etudiant'
      });
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
    userId = res.body.data.user.id;
  });

  it('Connexion', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        phoneNumber: '771234567',
        password: 'Test1234!'
      });
    // DEBUG
    // eslint-disable-next-line no-console
    console.log('TEST Connexion:', res.status, res.body);
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it('Accès refusé sans abonnement', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Job',
        company: 'TestCo',
        location: 'Dakar',
        description: 'Test',
        requirements: ['Test'],
        type: 'CDI',
        jobType: 'CDI',
        sector: 'Informatique',
        salary: { min: 1000, max: 2000, currency: 'XOF' },
        contactEmail: 'contact@testco.com'
      });
    // DEBUG
    // eslint-disable-next-line no-console
    console.log('TEST Accès refusé sans abonnement:', res.status, res.body);
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Abonnement requis/);
  });

  it('Activation abonnement (simulation)', async () => {
    await User.updateOne({ _id: userId }, {
      $set: {
        subscription: {
          status: 'active',
          expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        }
      }
    });
    const user = await User.findById(userId).lean();
    // DEBUG
    // eslint-disable-next-line no-console
    console.log('TEST DEBUG subscription:', user?.subscription);
    // Reconnexion pour obtenir un nouveau token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        phoneNumber: '771234567',
        password: 'Test1234!'
      });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    token = res.body.data.token;
  });

  it('Accès autorisé avec abonnement actif', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Job',
        company: 'TestCo',
        location: 'Dakar',
        description: 'Test',
        requirements: ['Test'],
        type: 'CDI',
        jobType: 'CDI',
        sector: 'Informatique',
        salary: { min: 1000, max: 2000, currency: 'XOF' },
        contactEmail: 'contact@testco.com'
      });
    // DEBUG
    // eslint-disable-next-line no-console
    console.log('TEST Accès autorisé avec abonnement actif:', res.status, res.body);
    expect(res.status).toBe(201);
    const jobTitle = res.body.title || res.body.data?.title;
    expect(jobTitle).toBe('Test Job');
  });

  it('Expiration abonnement (simulation)', async () => {
    await User.findByIdAndUpdate(userId, {
      subscription: {
        status: 'expired',
        expireAt: new Date(Date.now() - 1000)
      }
    });
  });

  it('Accès refusé après expiration', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Job 2',
        company: 'TestCo',
        location: 'Dakar',
        description: 'Test',
        requirements: ['Test'],
        type: 'CDI',
        jobType: 'CDI',
        sector: 'Informatique',
        salary: { min: 1000, max: 2000, currency: 'XOF' },
        contactEmail: 'contact@testco.com'
      });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Abonnement requis/);
  });
}); 