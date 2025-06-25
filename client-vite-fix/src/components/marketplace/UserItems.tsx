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
    <div className="max-w-6xl mx-auto p-6 user-items-fallback-style">
      <style>{`
        .user-items-fallback-style .user-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
        }
        .user-items-fallback-style .user-item-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 16px #e5e7eb;
          border: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .user-items-fallback-style .user-item-card:hover {
          box-shadow: 0 8px 32px #e5e7eb;
        }
        .user-items-fallback-style .user-item-img {
          width: 100%;
          height: 220px;
          object-fit: contain;
          background: #f9fafb;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-items-fallback-style .user-item-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .user-items-fallback-style .user-item-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
          max-width: 70%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-items-fallback-style .user-item-status {
          font-size: 0.85rem;
          padding: 0.2rem 0.7rem;
          border-radius: 999px;
          font-weight: 500;
        }
        .user-items-fallback-style .user-item-desc {
          color: #4b5563;
          font-size: 0.97rem;
          margin-bottom: 1rem;
          min-height: 40px;
        }
        .user-items-fallback-style .user-item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .user-items-fallback-style .user-item-meta span {
          font-size: 1rem;
        }
        .user-items-fallback-style .user-item-btns {
          margin-top: auto;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .user-items-fallback-style .user-item-btns button {
          min-width: 90px;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          font-size: 0.97rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .user-items-fallback-style .user-item-btns .edit {
          background: #2563eb;
          color: #fff;
        }
        .user-items-fallback-style .user-item-btns .edit:hover {
          background: #1d4ed8;
        }
        .user-items-fallback-style .user-item-btns .delete {
          background: #dc2626;
          color: #fff;
        }
        .user-items-fallback-style .user-item-btns .delete:hover {
          background: #b91c1c;
        }
        .user-items-fallback-style .user-item-btns .view {
          background: #374151;
          color: #fff;
        }
        .user-items-fallback-style .user-item-btns .view:hover {
          background: #111827;
        }
      `}</style>
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
        <div className="user-items-grid">
          {items.map((item) => {
            const isOwner = user && (user.id === item.userId || user.id === item.sellerId);
            const isAdmin = user && user.role === 'admin';
            return (
              <div key={item.id} className="user-item-card">
                {item.images.length > 0 && (
                  <div className="user-item-img">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{ maxHeight: 220, maxWidth: '100%' }}
                    />
                  </div>
                )}
                <div className="user-item-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div className="user-item-title">{item.title}</div>
                    <span className={`user-item-status ${getStatusColor(item.status)}`}>{getStatusText(item.status)}</span>
                  </div>
                  <div className="user-item-desc">{item.description}</div>
                  <div className="user-item-meta">
                    <span style={{ color: '#2563eb', fontWeight: 700 }}>{formatPrice(item)}</span>
                    <span style={{ color: '#6b7280', marginLeft: 8 }}>{item.category}</span>
                  </div>
                  {item.moderationComment && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#fef9c3', borderRadius: 8, border: '1px solid #fde68a' }}>
                      <div style={{ fontWeight: 600, color: '#b45309', marginBottom: 4 }}>Commentaire de modération:</div>
                      <div style={{ color: '#92400e' }}>{item.moderationComment}</div>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#9ca3af', marginBottom: 18 }}>
                    <span>{item.location}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="user-item-btns">
                    {isOwner && (
                      <>
                        <button
                          onClick={() => navigate(`/marketplace/edit/${item.id}`)}
                          className="edit"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingItemId === item.id}
                          className="delete"
                        >
                          {deletingItemId === item.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => navigate(`/marketplace/edit/${item.id}`)}
                          className="edit"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={deletingItemId === item.id}
                          className="delete"
                        >
                          {deletingItemId === item.id ? 'Suppression...' : 'Supprimer'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate(`/marketplace/${item.id}`)}
                      className="view"
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