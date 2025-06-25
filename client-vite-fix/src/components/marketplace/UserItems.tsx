import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplaceService } from '../../services/marketplaceService';
import type { MarketplaceItem } from '../../services/marketplaceService';
import { useAuth } from '../../context/AuthContext';

const UserItems: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useAuth();

  useEffect(() => {
    loadUserItems();
  }, []);

  const loadUserItems = async () => {
    try {
      setLoading(true);
      const userItems = await marketplaceService.getUserItems();
      setItems(userItems);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      case 'suspended': return 'Suspendue';
      default: return status;
    }
  };

  const formatPrice = (item: MarketplaceItem) => {
    switch (item.priceType) {
      case 'fixed':
        return `${item.price?.toLocaleString()} FCFA`;
      case 'range':
        return `${item.minPrice?.toLocaleString()} - ${item.maxPrice?.toLocaleString()} FCFA`;
      case 'negotiable':
        return 'Négociable';
      default:
        return 'Non spécifié';
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.')) {
      return;
    }

    try {
      setDeletingItemId(itemId);
      await marketplaceService.deleteItem(itemId);
      // Recharger la liste après suppression
      await loadUserItems();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'annonce. Veuillez réessayer.');
    } finally {
      setDeletingItemId(null);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Mes Annonces</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Vous n'avez pas encore d'annonces</div>
          <button
            onClick={() => navigate('/marketplace/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer une annonce
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {items.map((item) => {
            const isOwner = user && (user.id === item.userId || user.id === item.sellerId);
            const isAdmin = user && user.role === 'admin';
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                {item.images.length > 0 && (
                  <div className="w-full h-56 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="object-contain w-full h-full"
                      style={{ maxHeight: 220 }}
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[70%]">{item.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-blue-600">{formatPrice(item)}</span>
                    <span className="text-sm text-gray-500 ml-2">{item.category}</span>
                  </div>
                  {item.moderationComment && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                      <div className="text-sm font-medium text-yellow-800 mb-1">Commentaire de modération:</div>
                      <div className="text-sm text-yellow-700">{item.moderationComment}</div>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-5">
                    <span>{item.location}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {isOwner && (
                      <>
                        <button
                          onClick={() => navigate(`/marketplace/edit/${item.id}`)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm min-w-[90px]"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingItemId === item.id}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm min-w-[90px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingItemId === item.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => navigate(`/marketplace/edit/${item.id}`)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm min-w-[90px]"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingItemId === item.id}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm min-w-[90px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingItemId === item.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate(`/marketplace/${item.id}`)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm min-w-[90px]"
                    >
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserItems; 