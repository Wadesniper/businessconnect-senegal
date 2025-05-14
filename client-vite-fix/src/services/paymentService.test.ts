import { paymentService } from './paymentService';

describe('PaymentService', () => {
  const mockPaymentRequest = {
    amount: 15000,
    currency: 'XOF',
    description: 'Test Abonnement Premium',
    customerId: 'test-user-123',
    customerEmail: 'test@example.com',
    customerFullName: 'Test User',
    subscriptionType: 'premium' as const
  };

  beforeEach(() => {
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('devrait initialiser un paiement avec succès', async () => {
    const mockResponse = {
      success: true,
      redirect_url: 'https://cinetpay.com/payment/test-123'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await paymentService.initiateSubscriptionPayment(mockPaymentRequest);
    expect(result).toBe(mockResponse.redirect_url);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/payment/request-payment'),
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': expect.any(String),
          'API-SECRET': expect.any(String)
        }
      })
    );
  });

  it('devrait vérifier un paiement avec succès', async () => {
    const mockResponse = {
      success: true,
      status: 'completed'
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await paymentService.verifyPayment('test-token-123');
    expect(result).toBe(true);
  });

  it('devrait retourner le bon montant pour chaque type d\'abonnement', () => {
    expect(paymentService.getSubscriptionAmount('premium')).toBe(15000);
    expect(paymentService.getSubscriptionAmount('enterprise')).toBe(50000);
  });
}); 