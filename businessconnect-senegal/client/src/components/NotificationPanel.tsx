import React from 'react';
import { List, Badge, Spin, Empty, message } from 'antd';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  onClose?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useAuth();

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      message.error('Erreur lors du chargement des notifications');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      if (onClose) {
        onClose();
      }
    } catch (error) {
      message.error('Erreur lors du marquage de la notification comme lue');
      console.error('Erreur:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({ ...notif, read: true }))
      );
      message.success('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      message.error('Erreur lors du marquage des notifications comme lues');
      console.error('Erreur:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notif => notif.id !== notificationId)
      );
      message.success('Notification supprimée');
    } catch (error) {
      message.error('Erreur lors de la suppression de la notification');
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spin />
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <Empty
        description="Aucune notification"
        className="p-4"
      />
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="m-0">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-blue-600 hover:text-blue-800"
        >
          Tout marquer comme lu
        </button>
      </div>
      <List
        dataSource={notifications}
        renderItem={(notification) => (
          <List.Item
            className={`cursor-pointer hover:bg-gray-50 ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
            actions={[
              <button
                key="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            ]}
          >
            <List.Item.Meta
              title={
                <div className="flex items-center">
                  {!notification.read && (
                    <Badge status="processing" className="mr-2" />
                  )}
                  {notification.title}
                </div>
              }
              description={notification.message}
            />
            <div className="text-sm text-gray-500">
              {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationPanel; 