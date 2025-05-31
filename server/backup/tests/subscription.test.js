"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const subscriptionService_1 = require("../services/subscriptionService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const globals_1 = require("@jest/globals");
const pg_1 = require("pg");
const config_1 = require("../config");
const uuid_1 = require("uuid");
const pool = new pg_1.Pool({
    connectionString: config_1.config.DATABASE_URL
});
const subscriptionService = new subscriptionService_1.SubscriptionService();
(0, globals_1.beforeAll)(async () => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      payment_id UUID,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});
(0, globals_1.beforeEach)(async () => {
    await pool.query('DELETE FROM subscriptions');
});
(0, globals_1.afterAll)(async () => {
    await pool.query('DROP TABLE IF EXISTS subscriptions');
    await pool.end();
});
(0, globals_1.describe)('Routes d\'abonnement', () => {
    function getAuth(userId) {
        const jwtSecret = process.env.JWT_SECRET || 'default_secret';
        const jwtExpire = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d';
        const options = { expiresIn: jwtExpire };
        return jsonwebtoken_1.default.sign({ id: userId }, jwtSecret, options);
    }
    (0, globals_1.describe)('GET /:userId', () => {
        (0, globals_1.it)('devrait retourner un abonnement existant', async () => {
            const userId = (0, uuid_1.v4)();
            const authToken = getAuth(userId);
            const created = await subscriptionService.createSubscription(userId, 'etudiant');
            await subscriptionService.updateSubscriptionStatus(created.id, 'active');
            console.log('[TEST] Abonnement inséré via service', created);
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/subscriptions/${userId}`)
                .set('Authorization', `Bearer ${authToken}`);
            console.log('[TEST] Réponse GET /:userId', response.status, response.body);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('id');
            (0, globals_1.expect)(response.body).toHaveProperty('user_id', userId);
            (0, globals_1.expect)(response.body).toHaveProperty('type');
            (0, globals_1.expect)(response.body).toHaveProperty('status');
        });
        (0, globals_1.it)('devrait retourner 404 pour un utilisateur sans abonnement', async () => {
            const userId = (0, uuid_1.v4)();
            const authToken = getAuth(userId);
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/subscriptions/${userId}`)
                .set('Authorization', `Bearer ${authToken}`);
            (0, globals_1.expect)(response.status).toBe(404);
            (0, globals_1.expect)(response.body).toHaveProperty('error', 'Abonnement non trouvé');
        });
        (0, globals_1.it)('devrait retourner 401 sans token d\'authentification', async () => {
            const userId = (0, uuid_1.v4)();
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/subscriptions/${userId}`);
            (0, globals_1.expect)(response.status).toBe(401);
            (0, globals_1.expect)(response.body).toHaveProperty('error');
        });
    });
    (0, globals_1.describe)('POST /initiate', () => {
        (0, globals_1.it)('devrait initier un nouvel abonnement', async () => {
            const userId = (0, uuid_1.v4)();
            const authToken = getAuth(userId);
            const subscriptionData = {
                userId,
                subscriptionType: 'etudiant',
                customer_name: 'Test',
                customer_surname: 'User',
                customer_email: 'test@example.com',
                customer_phone_number: '770000000'
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/subscriptions/initiate')
                .set('Authorization', `Bearer ${authToken}`)
                .send(subscriptionData);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('paymentUrl');
        });
        (0, globals_1.it)('devrait retourner 400 pour des données invalides', async () => {
            const userId = (0, uuid_1.v4)();
            const authToken = getAuth(userId);
            const invalidData = {
                userId
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/subscriptions/initiate')
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidData);
            (0, globals_1.expect)(response.status).toBe(400);
            (0, globals_1.expect)(response.body).toHaveProperty('error', 'Paramètres manquants');
        });
    });
    (0, globals_1.describe)('POST /payment-callback', () => {
        (0, globals_1.it)('devrait activer l\'abonnement après un paiement réussi', async () => {
            const userId = (0, uuid_1.v4)();
            const created = await subscriptionService.createSubscription(userId, 'etudiant');
            console.log('[TEST] Abonnement pending inséré via service', created);
            const callbackData = {
                reference: 'REF123',
                status: 'success',
                userId
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/subscriptions/payment-callback')
                .send(callbackData);
            console.log('[TEST] Réponse POST /payment-callback success', response.status, response.body);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('message', 'Abonnement activé');
        });
        (0, globals_1.it)('devrait marquer l\'abonnement comme expiré après un échec de paiement', async () => {
            const userId = (0, uuid_1.v4)();
            const created = await subscriptionService.createSubscription(userId, 'etudiant');
            console.log('[TEST] Abonnement pending inséré via service', created);
            const callbackData = {
                reference: 'REF124',
                status: 'failed',
                userId
            };
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/subscriptions/payment-callback')
                .send(callbackData);
            console.log('[TEST] Réponse POST /payment-callback failed', response.status, response.body);
            (0, globals_1.expect)(response.status).toBe(400);
            (0, globals_1.expect)(response.body).toHaveProperty('error', 'Paiement échoué, abonnement expiré');
        });
    });
    (0, globals_1.describe)('GET /:userId/status', () => {
        (0, globals_1.it)('devrait retourner le statut de l\'abonnement', async () => {
            const userId = (0, uuid_1.v4)();
            const authToken = getAuth(userId);
            const created = await subscriptionService.createSubscription(userId, 'etudiant');
            await subscriptionService.updateSubscriptionStatus(created.id, 'active');
            console.log('[TEST] Abonnement actif inséré via service', created);
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/subscriptions/${userId}/status`)
                .set('Authorization', `Bearer ${authToken}`);
            console.log('[TEST] Réponse GET /:userId/status', response.status, response.body);
            (0, globals_1.expect)(response.status).toBe(200);
            (0, globals_1.expect)(response.body).toHaveProperty('isActive');
            (0, globals_1.expect)(response.body.isActive).toBe(true);
        });
    });
});
(0, globals_1.describe)('Subscription Service', () => {
    let testUserId;
    (0, globals_1.beforeEach)(() => {
        testUserId = (0, uuid_1.v4)();
    });
    test('should create a new subscription', async () => {
        const subscription = await subscriptionService.createSubscription(testUserId, 'etudiant');
        console.log('[TEST] Service createSubscription', subscription);
        (0, globals_1.expect)(subscription).toBeDefined();
        (0, globals_1.expect)(subscription.type).toBe('etudiant');
        (0, globals_1.expect)(subscription.status).toBe('pending');
    });
    test('should get active subscription', async () => {
        const created = await subscriptionService.createSubscription(testUserId, 'etudiant');
        await subscriptionService.updateSubscriptionStatus(created.id, 'active');
        const subscription = await subscriptionService.getActiveSubscription(testUserId);
        console.log('[TEST] Service getActiveSubscription', subscription);
        (0, globals_1.expect)(subscription).toBeDefined();
        if (subscription) {
            (0, globals_1.expect)(subscription.status).toBe('active');
        }
    });
});
//# sourceMappingURL=subscription.test.js.map