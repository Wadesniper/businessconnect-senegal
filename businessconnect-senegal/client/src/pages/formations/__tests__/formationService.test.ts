import FormationService from '../services/formationService';
import { Formation } from '../types';

describe('FormationService', () => {
  const mockFormation: Formation = {
    id: '1',
    titre: 'Formation Test',
    description: 'Description test',
    niveau: 'Débutant',
    duree: '10h',
    prix: 50000,
    categorie: 'Développement Web',
    image: 'https://example.com/image.jpg',
    formateur: 'John Doe',
    note: 4.5,
    nombreInscrits: 100,
    tags: ['JavaScript', 'React'],
    dateCreation: '2024-03-15',
    dateMiseAJour: '2024-03-15',
    objectifs: ['Objectif 1', 'Objectif 2'],
    prerequis: ['Prérequis 1'],
    programme: [
      {
        titre: 'Module 1',
        description: 'Description module 1',
        duree: '2h'
      }
    ],
    competencesAcquises: ['Compétence 1'],
    certificat: {
      type: 'Professionnel',
      description: 'Certificat professionnel'
    }
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getFormations', () => {
    it('devrait récupérer la liste des formations avec succès', async () => {
      const mockResponse = {
        formations: [mockFormation],
        total: 1,
        page: 1,
        pageSize: 10
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await FormationService.getFormations({
        searchTerm: 'test',
        categorie: 'Développement Web',
        niveau: 'Débutant',
        page: 1,
        pageSize: 10
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/formations?'),
        expect.any(Object)
      );
    });

    it('devrait gérer les erreurs de récupération', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(FormationService.getFormations()).rejects.toThrow();
    });
  });

  describe('getFormationById', () => {
    it('devrait récupérer une formation par ID avec succès', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFormation)
      });

      const result = await FormationService.getFormationById('1');
      expect(result).toEqual(mockFormation);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/formations/1',
        expect.any(Object)
      );
    });

    it('devrait gérer les erreurs de récupération par ID', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(FormationService.getFormationById('1')).rejects.toThrow();
    });
  });

  describe('inscrireFormation', () => {
    it('devrait inscrire à une formation avec succès', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await FormationService.inscrireFormation('1');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/formations/1/inscription',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    it('devrait gérer les erreurs d\'inscription', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(FormationService.inscrireFormation('1')).rejects.toThrow();
    });
  });

  describe('noterFormation', () => {
    it('devrait noter une formation avec succès', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true
      });

      await FormationService.noterFormation('1', 5);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/formations/1/note',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ note: 5 })
        })
      );
    });

    it('devrait gérer les erreurs de notation', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(FormationService.noterFormation('1', 5)).rejects.toThrow();
    });
  });
}); 