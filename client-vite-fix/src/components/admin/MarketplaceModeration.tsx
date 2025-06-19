import React, { useState, useEffect } from 'react';
import { marketplaceService } from '../../services/marketplaceService';

interface AdminMarketplaceItem {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  priceType: 'fixed' | 'range' | 'negotiable';
  minPrice?: number | null;
  maxPrice?: number | null;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  images: string[];
  contactEmail?: string;
  contactPhone: string;
  location: string;
  createdAt: string;
  moderationComment?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  seller: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ModerationStats {
  pending?: number;
  approved?: number;
  rejected?: number;
  suspended?: number;
}

const MarketplaceModeration: React.FC = () => {
  const [items, setItems] = useState<AdminMarketplaceItem[]>([]);
  const [stats, setStats] = useState<ModerationStats>({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'suspended'>('all');
  const [moderationComment, setModerationComment] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, statsData] = await Promise.all([
        marketplaceService.getAllItemsAdmin(),
        marketplaceService.getModerationStats()
      ]);
      setItems(itemsData as unknown as AdminMarketplaceItem[]);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (itemId: string, status: string) => {
    try {
      await marketplaceService.updateItemStatus(itemId, status, moderationComment);
      setModerationComment('');
      setSelectedItem(null);
      await loadData(); // Recharger les données
      alert(`Statut mis à jour avec succès: ${status}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await marketplaceService.deleteItemAdmin(itemId);
        await loadData();
        alert('Annonce supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const filteredItems = items.filter(item => {
    if (selectedStatus === 'all') return true;
    return item.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatPrice = (item: AdminMarketplaceItem) => {
    switch (item.priceType) {
      case 'fixed':
        return item.price ? `${item.price.toLocaleString()} FCFA` : 'Non spécifié';
      case 'range':
        return item.minPrice && item.maxPrice 
          ? `${item.minPrice.toLocaleString()} - ${item.maxPrice.toLocaleString()} FCFA`
          : 'Non spécifié';
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Modération Marketplace</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">En attente</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Approuvées</h3>
          <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Rejetées</h3>
          <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Suspendues</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.suspended || 0}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Toutes les annonces</option>
          <option value="pending">En attente</option>
          <option value="suspended">Suspendues</option>
        </select>
      </div>

      {/* Liste des annonces */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annonce
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.images.length > 0 && (
                        <img
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                          src={item.images[0]}
                          alt={item.title}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.seller.firstName} {item.seller.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{item.seller.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(item)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Modérer
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de modération */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Modérer l'annonce</h3>
              <textarea
                value={moderationComment}
                onChange={(e) => setModerationComment(e.target.value)}
                placeholder="Commentaire de modération (optionnel)"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate(selectedItem, 'approved')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedItem, 'rejected')}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedItem, 'suspended')}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                >
                  Suspendre
                </button>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="mt-4 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceModeration; 