import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Notification } from '../types/notification';

interface NotificationPanelProps {
  notifications: Notification[];
  onNotificationClick: (notificationId: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onNotificationClick,
}) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'subscription_expiration':
        return '⚠️';
      case 'new_offer':
        return '💼';
      case 'system':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onNotificationClick(notification.id);
    
    // Si c'est une notification d'expiration d'abonnement, rediriger vers la page de renouvellement
    if (notification.type === 'subscription_expiration' && notification.data?.action === 'renewal') {
      window.location.href = '/renouveler-abonnement';
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Aucune notification
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className={`
            p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50
            ${!notification.isRead ? 'bg-blue-50' : ''}
          `}
        >
          <div className="flex items-start">
            <span className="text-2xl mr-3">
              {getNotificationIcon(notification.type)}
            </span>
            <div className="flex-1">
              <h4 className={`font-semibold ${!notification.isRead ? 'text-blue-600' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {format(new Date(notification.createdAt), "d MMMM 'à' HH:mm", { locale: fr })}
              </p>
            </div>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel; 