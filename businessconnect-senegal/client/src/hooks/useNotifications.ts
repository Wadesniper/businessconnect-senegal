import { useState, useEffect } from 'react';
import { Notification } from '../types/notification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Charger les notifications au montage du composant
    fetchNotifications();

    // Mettre en place un polling pour vérifier les nouvelles notifications
    const interval = setInterval(fetchNotifications, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Mettre à jour le compteur de notifications non lues
    const count = notifications.filter(notification => !notification.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Erreur lors de la récupération des notifications');
      
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Erreur lors du marquage de la notification');

      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Erreur lors du marquage des notifications');

      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
}; 