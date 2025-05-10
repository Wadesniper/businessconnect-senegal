import mongoose from 'mongoose';
import { FormationService } from '../formationService';
import { CacheService } from '../cacheService';
import { Formation } from '../../models/formation.model';
import { redisMock } from '../../tests/setup';
import { NotFoundError, ValidationError } from '../../utils/errors';

describe('FormationService', () => {
  let formationService: FormationService;
  let cacheService: CacheService;

  beforeAll(() => {
    cacheService = new CacheService({
      host: 'localhost',
      port: 6379,
      password: 'test-password'
    });
    formationService = new FormationService(cacheService);
  });

  beforeEach(async () => {
    await Formation.deleteMany({});
    await redisMock.flushall();
  });

  describe('createFormation', () => {
    it('devrait créer une nouvelle formation', async () => {
      const formationData = {
        titre: 'Formation Test',
        description: 'Description de test',
        prix: 99.99,
        duree: 10,
        niveau: 'Débutant',
        categorie: 'Développement Web',
        instructeur: new mongoose.Types.ObjectId(),
        statut: 'actif'
      };

      const formation = await formationService.createFormation(formationData);

      expect(formation).toBeDefined();
      expect(formation.titre).toBe(formationData.titre);
      expect(formation.prix).toBe(formationData.prix);

      // Vérifier que la formation est en cache
      const cachedFormation = await cacheService.get(`formation:${formation._id}`);
      expect(cachedFormation).toBeDefined();
    });

    it('devrait rejeter une formation invalide', async () => {
      const formationData = {
        titre: '', // Titre invalide
        prix: -10, // Prix invalide
      };

      await expect(formationService.createFormation(formationData))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('getFormation', () => {
    it('devrait récupérer une formation par son ID', async () => {
      const formation = await Formation.create({
        titre: 'Formation Test',
        description: 'Description de test',
        prix: 99.99,
        duree: 10,
        niveau: 'Débutant',
        categorie: 'Développement Web',
        instructeur: new mongoose.Types.ObjectId(),
        statut: 'actif'
      });

      const retrievedFormation = await formationService.getFormation(formation._id.toString());
      expect(retrievedFormation._id).toEqual(formation._id);
    });

    it('devrait retourner une erreur pour un ID invalide', async () => {
      await expect(formationService.getFormation('invalid-id'))
        .rejects
        .toThrow(NotFoundError);
    });
  });

  describe('searchFormations', () => {
    beforeEach(async () => {
      await Formation.create([
        {
          titre: 'JavaScript Avancé',
          description: 'Formation JS',
          prix: 199.99,
          duree: 20,
          niveau: 'Avancé',
          categorie: 'Programmation',
          instructeur: new mongoose.Types.ObjectId(),
          statut: 'actif'
        },
        {
          titre: 'Python Débutant',
          description: 'Formation Python',
          prix: 99.99,
          duree: 15,
          niveau: 'Débutant',
          categorie: 'Programmation',
          instructeur: new mongoose.Types.ObjectId(),
          statut: 'actif'
        }
      ]);
    });

    it('devrait rechercher des formations par critères', async () => {
      const filters = {
        niveau: 'Débutant',
        prix: { min: 50, max: 150 }
      };

      const formations = await formationService.searchFormations(filters);
      expect(formations).toHaveLength(1);
      expect(formations[0].titre).toBe('Python Débutant');
    });

    it('devrait rechercher des formations par terme', async () => {
      const filters = {
        recherche: 'JavaScript'
      };

      const formations = await formationService.searchFormations(filters);
      expect(formations).toHaveLength(1);
      expect(formations[0].titre).toBe('JavaScript Avancé');
    });
  });

  describe('getFormationStats', () => {
    it('devrait retourner les statistiques d\'une formation', async () => {
      const formation = await Formation.create({
        titre: 'Formation Test',
        description: 'Description de test',
        prix: 99.99,
        duree: 10,
        niveau: 'Débutant',
        categorie: 'Développement Web',
        instructeur: new mongoose.Types.ObjectId(),
        statut: 'actif',
        participants: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
        notes: [
          { utilisateur: new mongoose.Types.ObjectId(), valeur: 4 },
          { utilisateur: new mongoose.Types.ObjectId(), valeur: 5 }
        ]
      });

      const stats = await formationService.getFormationStats(formation._id.toString());
      expect(stats.totalParticipants).toBe(2);
      expect(stats.noteMoyenne).toBe(4.5);
      expect(stats.totalCommentaires).toBe(2);
    });
  });
}); 