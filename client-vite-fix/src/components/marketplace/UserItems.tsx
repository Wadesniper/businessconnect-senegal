import React, { useState, useEffect } from 'react';
import { marketplaceService } from '../../services/marketplaceService';
import type { MarketplaceItem } from '../../services/marketplaceService';

const UserItems: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Annonces</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Vous n'avez pas encore d'annonces</div>
          <button
            onClick={() => window.location.href = '/marketplace/create'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer une annonce
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.images.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(item)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.category}
                  </span>
                </div>

                {item.moderationComment && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-md">
                    <div className="text-sm font-medium text-gray-700 mb-1">Commentaire de modération:</div>
                    <div className="text-sm text-gray-600">{item.moderationComment}</div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{item.location}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => window.location.href = `/marketplace/edit/${item.id}`}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => window.location.href = `/marketplace/${item.id}`}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    Voir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserItems; 