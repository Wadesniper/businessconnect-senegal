import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MarketplacePage from '../MarketplacePage';
import { marketplaceService } from '../../../services/marketplaceService';
import { authService } from '../../../services/authService';
import { MemoryRouter } from 'react-router-dom';
import { message } from 'antd';

// Mock dynamique pour simuler la base de données locale
let mockItems: any[];
const defaultItems = [
  {
    id: 1,
    title: 'Ordinateur portable HP',
    description: 'Ordinateur portable HP 15 pouces, 8Go RAM, 256Go SSD, très bon état.',
    price: 250000,
    location: 'Dakar',
    category: 'Informatique',
    image: 'img1.jpg',
    userId: 1,
    user: { id: 1, name: 'Alice', subscription: { status: 'active', expiresAt: '2025-06-06' } },
  },
  {
    id: 2,
    title: 'Robe de soirée',
    description: 'Robe de soirée élégante, taille 38, couleur bleue.',
    price: 40000,
    location: 'Dakar',
    category: 'Mode',
    image: 'img2.jpg',
    userId: 2,
    user: { id: 2, name: 'Bob', subscription: { status: 'active', expiresAt: '2025-06-06' } },
  },
];

jest.mock('../../../services/marketplaceService', () => ({
  getItems: jest.fn((filters) => {
    let items = [...mockItems];
    if (filters?.category) {
      items = items.filter((item) => item.category === filters.category);
    }
    if (filters?.search) {
      items = items.filter((item) => item.title.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters?.location) {
      items = items.filter((item) => item.location === filters.location);
    }
    return Promise.resolve(items);
  }),
  createItem: jest.fn((item) => {
    const newItem = { ...item, id: mockItems.length + 1 };
    mockItems.push(newItem);
    return Promise.resolve(newItem);
  }),
}));

const mockUser = { id: 'user1', fullName: 'Test User', phoneNumber: '771234567', email: 'test@email.com', createdAt: new Date().toISOString() };
const mockSubscription = { userId: 'user1', isActive: true, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() };

let messageErrorMock: jest.SpyInstance;
let messageSuccessMock: jest.SpyInstance;

beforeEach(() => {
  mockItems = JSON.parse(JSON.stringify(defaultItems));
  messageErrorMock = jest.spyOn(message, 'error').mockImplementation(() => ({} as any));
  messageSuccessMock = jest.spyOn(message, 'success').mockImplementation(() => ({} as any));
  jest.spyOn(marketplaceService, 'getItems').mockResolvedValue(mockItems);
  jest.spyOn(marketplaceService, 'createItem').mockImplementation((item) => Promise.resolve({ ...item, id: '3', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
  jest.spyOn(marketplaceService, 'uploadImage').mockResolvedValue('img3.jpg');
  jest.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
  jest.spyOn(authService, 'getCurrentUserSubscription').mockReturnValue(mockSubscription);
  jest.spyOn(authService, 'renewCurrentUserSubscription').mockImplementation(() => {});
  jest.spyOn(authService, 'expireCurrentUserSubscription').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('MarketplacePage', () => {
  it('affiche les annonces des utilisateurs abonnés', async () => {
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    );
    const cards = await screen.findAllByText(/Ordinateur portable HP/i);
    expect(cards.length).toBeGreaterThan(0);
    const robeCards = screen.getAllByText(/Robe de soirée/i);
    expect(robeCards.length).toBeGreaterThan(0);
  });

  it('permet de créer une annonce si abonnement actif', async () => {
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Créer une annonce/i));
    fireEvent.change(screen.getByPlaceholderText(/Titre de l'annonce/i), { target: { value: 'Test annonce' } });
    fireEvent.change(screen.getByPlaceholderText(/Description détaillée/i), { target: { value: 'Description test' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Téléphone \(optionnel\)/i), { target: { value: '771234567' } });
    fireEvent.change(screen.getByPlaceholderText(/Localisation/i), { target: { value: 'Dakar' } });
    fireEvent.change(screen.getByLabelText(/Prix/i), { target: { value: '1000' } });
    const selects = screen.getAllByRole('combobox');
    fireEvent.mouseDown(selects[1]);
    fireEvent.click(screen.getAllByText('Informatique')[0]);
    fireEvent.click(screen.getByText(/Publier l'annonce/i));
    const annonceCreee = await screen.findByText((content, node) => node?.textContent?.includes('Test annonce'));
    expect(annonceCreee).toBeInTheDocument();
  });

  it('refuse la création d\'annonce si abonnement expiré', async () => {
    jest.spyOn(authService, 'getCurrentUserSubscription').mockReturnValue({ ...mockSubscription, isActive: false });
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Créer une annonce/i));
    fireEvent.change(screen.getByPlaceholderText(/Titre de l'annonce/i), { target: { value: 'Test annonce' } });
    fireEvent.click(screen.getByText(/Publier l'annonce/i));
    await waitFor(() => {
      expect(messageSuccessMock).not.toHaveBeenCalled();
      expect(screen.queryByText(/Test annonce/i)).not.toBeInTheDocument();
    });
  });

  it('cache les annonces si abonnement expiré', async () => {
    jest.spyOn(authService, 'getCurrentUserSubscription').mockReturnValue({ ...mockSubscription, isActive: false });
    jest.spyOn(marketplaceService, 'getItems').mockResolvedValue([]);
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.queryByText(/Ordinateur portable HP/i)).not.toBeInTheDocument());
  });

  it('affiche les annonces après renouvellement abonnement', async () => {
    jest.spyOn(authService, 'getCurrentUserSubscription').mockReturnValue({ ...mockSubscription, isActive: false });
    jest.spyOn(marketplaceService, 'getItems').mockResolvedValue([]);
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Renouveler/i));
    jest.spyOn(authService, 'getCurrentUserSubscription').mockReturnValue({ ...mockSubscription, isActive: true });
    jest.spyOn(marketplaceService, 'getItems').mockResolvedValue(mockItems);
    fireEvent.click(screen.getByText(/Renouveler/i));
    await waitFor(() => expect(screen.getAllByText(/Ordinateur portable HP/i).length).toBeGreaterThan(0));
  });

  it('filtre les annonces par catégorie', async () => {
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    );
    const selects2 = screen.getAllByRole('combobox');
    fireEvent.mouseDown(selects2[0]);
    fireEvent.click(screen.getAllByText('Mode')[0]);
    await waitFor(() => expect(screen.getAllByText(/Robe de soirée/i).length).toBeGreaterThan(0));
    await waitFor(() => expect(screen.queryByText((content, node) => node?.textContent?.includes('Ordinateur portable HP'))).toBeNull());
  });

  it('affiche le formulaire de création', async () => {
    render(
      <MemoryRouter>
        <MarketplacePage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Créer une annonce/i));
    expect(screen.getByText(/Publier l'annonce/i)).toBeInTheDocument();
  });
}); 