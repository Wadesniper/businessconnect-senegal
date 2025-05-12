import { test, expect } from '@playwright/test';

test.describe('Page d\'accueil BusinessConnect', () => {
  test('Affichage complet de la Home', async ({ page }) => {
    await page.goto('/');

    // Hero
    await expect(page.getByRole('heading', { name: /plateforme n°1/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /découvrir nos services/i })).toBeVisible();

    // Offres d'emploi récentes (au moins une)
    await expect(page.getByText(/offres d'emploi récentes/i)).toBeVisible();
    const offres = await page.locator('[data-testid="job-preview"]').count();
    expect(offres).toBeGreaterThan(0);

    // Bouton "Créer mon CV maintenant"
    await expect(page.getByRole('button', { name: /créer mon cv/i })).toBeVisible();

    // Carrousel des secteurs
    await expect(page.locator('[data-testid="sector-carousel"]')).toBeVisible();

    // Statistiques (présence des titres)
    await expect(page.getByText(/entreprises/i)).toBeVisible();
    await expect(page.getByText(/offres d'emploi/i)).toBeVisible();
    await expect(page.getByText(/membres/i)).toBeVisible();
    await expect(page.getByText(/secteurs/i)).toBeVisible();

    // Témoignages (présence d'au moins un nom connu)
    await expect(page.getByText(/Mamadou Diop|Awa Sarr|Fatou Bâ|Cheikh Ndiaye/)).toBeVisible();
  });
}); 