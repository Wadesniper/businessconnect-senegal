import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaStore, FaComments, FaUserEdit, FaFileDownload } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'pending':
        return 'En attente';
      case 'expired':
        return 'Expiré';
      default:
        return 'Inconnu';
    }
  };

  const quickAccessItems = [
    {
      icon: <FaBriefcase className="w-8 h-8" />,
      title: 'Offres d\'emploi',
      description: 'Consultez les dernières offres',
      link: '/offres'
    },
    {
      icon: <FaStore className="w-8 h-8" />,
      title: 'Marketplace',
      description: 'Découvrez les produits et services',
      link: '/marketplace'
    },
    {
      icon: <FaComments className="w-8 h-8" />,
      title: 'Forum',
      description: 'Échangez avec la communauté',
      link: '/forum'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête du tableau de bord */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenue, {user?.name}
            </h1>
            <p className="text-gray-600">
              {user?.email}
            </p>
          </div>
          <Link
            to="/profil/edit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaUserEdit className="mr-2" />
            Modifier le profil
          </Link>
        </div>
      </div>

      {/* Informations sur l'abonnement */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Statut de l'abonnement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Statut actuel</p>
            <p className={`text-lg font-semibold ${getStatusColor(subscription?.status || 'expired')}`}>
              {getStatusText(subscription?.status || 'expired')}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Type d'abonnement</p>
            <p className="text-lg font-semibold text-gray-900">
              {subscription?.type || 'Aucun abonnement'}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Date d'expiration</p>
            <p className="text-lg font-semibold text-gray-900">
              {subscription?.endDate
                ? new Date(subscription.endDate).toLocaleDateString('fr-FR')
                : 'Non applicable'}
            </p>
          </div>
        </div>
      </div>

      {/* Accès rapide */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Accès rapide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickAccessItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 text-blue-600">
                {item.icon}
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Actions supplémentaires */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => window.location.href = '/cv/download'}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FaFileDownload className="mr-2" />
            Télécharger mon CV
          </button>
          <Link
            to="/cv/edit"
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FaUserEdit className="mr-2" />
            Modifier mon CV
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 