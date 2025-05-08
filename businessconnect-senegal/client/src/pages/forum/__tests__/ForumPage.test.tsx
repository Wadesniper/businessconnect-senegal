import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { message } from 'antd';
import ForumPage from '../ForumPage';
import { forumService } from '../../../services/forumService';
import { AuthProvider } from '../../../context/AuthContext';

// Mock des services
jest.mock('../../../services/forumService');
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      error: jest.fn(),
      warning: jest.fn(),
      success: jest.fn(),
    },
  };
});

const mockDiscussions = [
  {
    id: '1',
    title: 'Discussion test 1',
    content: 'Contenu test 1',
    category: 'emploi',
    author: {
      id: '1',
      name: 'User 1',
    },
    createdAt: '2024-03-15T10:00:00Z',
    repliesCount: 2,
    likesCount: 5,
    status: 'active',
    replies: []
  },
  {
    id: '2',
    title: 'Discussion test 2',
    content: 'Contenu test 2',
    category: 'formation',
    author: {
      id: '2',
      name: 'User 2',
    },
    createdAt: '2024-03-15T11:00:00Z',
    repliesCount: 0,
    likesCount: 1,
    status: 'active',
    replies: []
  }
];

describe('ForumPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (forumService.getDiscussions as jest.Mock).mockResolvedValue({
      discussions: mockDiscussions,
      total: mockDiscussions.length,
      page: 1,
      totalPages: 1
    });
  });

  const renderWithProviders = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <ForumPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('affiche la liste des discussions', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Discussion test 1')).toBeInTheDocument();
      expect(screen.getByText('Discussion test 2')).toBeInTheDocument();
    });
  });

  it('filtre les discussions par catégorie', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Discussion test 1')).toBeInTheDocument();
    });

    const emploiTab = screen.getByText('Emploi');
    fireEvent.click(emploiTab);

    expect(forumService.getDiscussions).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'emploi' })
    );
  });

  it('permet la recherche de discussions', async () => {
    renderWithProviders();
    
    const searchInput = screen.getByPlaceholderText('Rechercher une discussion...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(forumService.getDiscussions).toHaveBeenCalledWith(
      expect.objectContaining({ searchTerm: 'test' })
    );
  });

  it('affiche un message d\'erreur en cas d\'échec du chargement', async () => {
    (forumService.getDiscussions as jest.Mock).mockRejectedValueOnce(new Error('Erreur test'));
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Erreur lors du chargement des discussions');
    });
  });

  it('affiche un état vide quand il n\'y a pas de discussions', async () => {
    (forumService.getDiscussions as jest.Mock).mockResolvedValueOnce({
      discussions: [],
      total: 0,
      page: 1,
      totalPages: 1
    });
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Aucune discussion trouvée')).toBeInTheDocument();
    });
  });

  it('gère la pagination', async () => {
    (forumService.getDiscussions as jest.Mock).mockResolvedValueOnce({
      discussions: mockDiscussions,
      total: 20,
      page: 1,
      totalPages: 2
    });
    
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Discussion test 1')).toBeInTheDocument();
    });

    const nextPageButton = screen.getByTitle('2');
    fireEvent.click(nextPageButton);

    expect(forumService.getDiscussions).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });
}); 