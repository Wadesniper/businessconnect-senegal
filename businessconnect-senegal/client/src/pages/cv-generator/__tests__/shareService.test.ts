import { ShareService } from '../services/shareService';

describe('ShareService', () => {
  const mockCvId = 'test-cv-id';
  const mockEmail = 'test@example.com';
  const mockMessage = 'Test message';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('generateShareLink', () => {
    it('devrait générer un lien de partage avec succès', async () => {
      const mockShareLink = 'https://example.com/share/123';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ shareLink: mockShareLink }),
      });

      const result = await ShareService.generateShareLink(mockCvId);
      expect(result).toBe(mockShareLink);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/cv/share/link/${mockCvId}`),
        expect.any(Object)
      );
    });

    it('devrait gérer les erreurs de génération de lien', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(ShareService.generateShareLink(mockCvId)).rejects.toThrow();
    });
  });

  describe('shareByEmail', () => {
    it('devrait partager par email avec succès', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await ShareService.shareByEmail(mockCvId, mockEmail, mockMessage);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/cv/share/email'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            cvId: mockCvId,
            recipientEmail: mockEmail,
            message: mockMessage,
          }),
        })
      );
    });

    it('devrait gérer les erreurs de partage par email', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(ShareService.shareByEmail(mockCvId, mockEmail)).rejects.toThrow();
    });
  });

  describe('shareOnSocialMedia', () => {
    it('devrait partager sur LinkedIn avec succès', async () => {
      const mockShareUrl = 'https://linkedin.com/share/123';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ shareUrl: mockShareUrl }),
      });

      const result = await ShareService.shareOnSocialMedia(mockCvId, 'linkedin');
      expect(result).toBe(mockShareUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/cv/share/social/linkedin/${mockCvId}`),
        expect.any(Object)
      );
    });

    it('devrait gérer les erreurs de partage sur les réseaux sociaux', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(ShareService.shareOnSocialMedia(mockCvId, 'twitter')).rejects.toThrow();
    });
  });
}); 