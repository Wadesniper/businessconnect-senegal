import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Notification } from '../types/notification';

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
      const response = await api.get<Notification[]>('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);

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
      await api.put('/api/notifications/mark-all-read');

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