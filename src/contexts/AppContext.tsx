import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Agreement,
  AgreementFilters,
  ModificationRequest,
  Notification,
} from '../types';

interface AppContextType {
  // Agreement State
  selectedAgreement: Agreement | null;
  setSelectedAgreement: (agreement: Agreement | null) => void;
  
  // Filters
  filters: AgreementFilters;
  setFilters: (filters: AgreementFilters) => void;
  resetFilters: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Pending Modifications
  pendingModifications: ModificationRequest[];
  setPendingModifications: (modifications: ModificationRequest[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialFilters: AgreementFilters = {
  status: undefined,
  agreementType: undefined,
  clientName: undefined,
  dateFrom: undefined,
  dateTo: undefined,
  searchTerm: undefined,
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [filters, setFilters] = useState<AgreementFilters>(initialFilters);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingModifications, setPendingModifications] = useState<ModificationRequest[]>([]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: AppContextType = {
    selectedAgreement,
    setSelectedAgreement,
    filters,
    setFilters,
    resetFilters,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    isLoading,
    setIsLoading,
    pendingModifications,
    setPendingModifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
