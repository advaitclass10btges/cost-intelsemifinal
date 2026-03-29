import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

export interface Alert {
  id: string;
  type: 'cost' | 'idle' | 'anomaly' | 'savings';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resourceId?: string;
  estimatedSavings?: number;
  read: boolean;
}

const BACKEND_URL = 'http://localhost:3000';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial fetch
    fetch(`${BACKEND_URL}/api/alerts`)
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setUnreadCount(data.filter((a: Alert) => !a.read).length);
      })
      .catch(console.error);

    // Socket.io connection
    const socket = io(BACKEND_URL);

    socket.on('new_alert', (newAlert: Alert) => {
      setAlerts(prev => [newAlert, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast
      toast.error(newAlert.title, {
        description: newAlert.description,
        action: {
          label: 'View',
          onClick: () => console.log('Viewing alert:', newAlert.id)
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    setUnreadCount(0);
  };

  return { alerts, unreadCount, markAllAsRead };
};
