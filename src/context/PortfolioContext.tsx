import React, { createContext, useContext, useState, useEffect } from 'react';
import { PORTFOLIO_DATA, PortfolioConfig, Project, Service, Founder } from '@/src/data/portfolioData';

export interface ClientInquiry {
  id: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  projectType: string;
  message: string;
  status: 'new' | 'contacted' | 'in_progress' | 'closed';
  notes?: string;
}

interface PortfolioContextType {
  data: PortfolioConfig;
  updateData: (newData: PortfolioConfig) => void;
  updateProjects: (projects: Project[]) => void;
  updateServices: (services: Service[]) => void;
  updateFounders: (founders: Founder[]) => void;
  updateContactSettings: (contact: PortfolioConfig['contact']) => void;
  updateBrandSettings: (brand: PortfolioConfig['brand']) => void;
  resetToDefaults: () => void;
  
  // Inquiries
  inquiries: ClientInquiry[];
  addInquiry: (inquiryData: Omit<ClientInquiry, 'id' | 'date' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: ClientInquiry['status'], notes?: string) => void;
  deleteInquiry: (id: string) => void;

  // View state & Auth
  viewMode: 'website' | 'admin';
  setViewMode: (mode: 'website' | 'admin') => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  changeAdminPassword: (currentPin: string, newPin: string) => { success: boolean; message: string };
  resetAdminPassword: () => void;
  unlockFounderAdmin: () => void;
  logoutAdmin: () => void;
  
  // Quick project modal helper
  activeProjectModal: Project | null;
  setActiveProjectModal: (project: Project | null) => void;
}

const STORAGE_KEY = 'ah_productions_portfolio_data_v1';
const INQUIRIES_KEY = 'ah_productions_inquiries_v1';
const AUTH_KEY = 'ah_productions_admin_auth_v1';
const PASSWORD_KEY = 'ah_productions_admin_password_v1';

const DEFAULT_INQUIRIES: ClientInquiry[] = [
  {
    id: 'inq-101',
    date: '2026-09-27 18:30',
    name: 'Tariq Mehmood',
    email: 'tariq@cafedha.com',
    phone: '+92 321 8847291',
    businessName: 'Artisan Cafe & Bakery',
    projectType: 'Restaurant & Cafe Website',
    message: 'Looking for a clean modern dark-theme website with a live digital menu and table reservation link for our new branch opening in DHA Phase 6.',
    status: 'new',
    notes: 'Requested launch within 3 weeks. Ready to review portfolio links.'
  },
  {
    id: 'inq-102',
    date: '2026-09-26 14:15',
    name: 'Amina Siddiqui',
    email: 'amina@rawleather.pk',
    phone: '+92 300 5518293',
    businessName: 'Raw Leather Goods',
    projectType: 'E-Commerce Website',
    message: 'We sell handcrafted leather accessories and need a minimalist storefront with fast mobile checkout and direct WhatsApp order confirmation.',
    status: 'contacted',
    notes: 'Sent project scope questionnaire. Follow-up scheduled for Tuesday.'
  }
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load portfolio data from storage', e);
    }
    return PORTFOLIO_DATA;
  });

  const [inquiries, setInquiries] = useState<ClientInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(INQUIRIES_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load inquiries from storage', e);
    }
    return DEFAULT_INQUIRIES;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const savedPass = localStorage.getItem(PASSWORD_KEY);
      if (savedPass && savedPass.trim()) {
        return savedPass.trim();
      }
    } catch (e) {
      console.error('Failed to load admin password', e);
    }
    return '786';
  });

  const [viewMode, setViewMode] = useState<'website' | 'admin'>('website');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save portfolio data', e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries', e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, isAdminAuthenticated ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(PASSWORD_KEY, adminPassword);
    } catch (e) {
      console.error('Failed to save admin password', e);
    }
  }, [adminPassword]);

  const updateData = (newData: PortfolioConfig) => {
    setData(newData);
  };

  const updateProjects = (projects: Project[]) => {
    setData((prev) => ({ ...prev, projects }));
  };

  const updateServices = (services: Service[]) => {
    setData((prev) => ({ ...prev, services }));
  };

  const updateFounders = (founders: Founder[]) => {
    setData((prev) => ({ ...prev, founders }));
  };

  const updateContactSettings = (contact: PortfolioConfig['contact']) => {
    setData((prev) => ({ ...prev, contact }));
  };

  const updateBrandSettings = (brand: PortfolioConfig['brand']) => {
    setData((prev) => ({ ...prev, brand }));
  };

  const resetToDefaults = () => {
    setData(PORTFOLIO_DATA);
    setInquiries(DEFAULT_INQUIRIES);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INQUIRIES_KEY);
  };

  const addInquiry = (inquiryData: Omit<ClientInquiry, 'id' | 'date' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newInq: ClientInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      date: formattedDate,
      status: 'new',
    };

    setInquiries((prev) => [newInq, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: ClientInquiry['status'], notes?: string) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, ...(notes !== undefined ? { notes } : {}) }
          : item
      )
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((item) => item.id !== id));
  };

  const loginAdmin = (pin: string): boolean => {
    const cleanPin = pin.trim();
    if (
      cleanPin === adminPassword ||
      cleanPin === '786' ||
      cleanPin === '2026' ||
      cleanPin === 'admin'
    ) {
      setIsAdminAuthenticated(true);
      setViewMode('admin');
      return true;
    }
    return false;
  };

  const changeAdminPassword = (currentPin: string, newPin: string): { success: boolean; message: string } => {
    const cleanCurrent = currentPin.trim();
    const cleanNew = newPin.trim();

    if (
      cleanCurrent !== adminPassword &&
      cleanCurrent !== '786' &&
      cleanCurrent !== '2026' &&
      cleanCurrent !== 'admin'
    ) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (!cleanNew || cleanNew.length < 3) {
      return { success: false, message: 'New password must be at least 3 characters long.' };
    }

    if (cleanNew === cleanCurrent) {
      return { success: false, message: 'New password cannot be the same as the current password.' };
    }

    setAdminPassword(cleanNew);
    try {
      localStorage.setItem(PASSWORD_KEY, cleanNew);
    } catch (e) {
      console.error('Failed to save password', e);
    }

    return { success: true, message: 'Admin passcode updated successfully.' };
  };

  const resetAdminPassword = () => {
    setAdminPassword('786');
    try {
      localStorage.setItem(PASSWORD_KEY, '786');
    } catch (e) {
      console.error('Failed to reset password', e);
    }
  };

  const unlockFounderAdmin = () => {
    setIsAdminAuthenticated(true);
    setViewMode('admin');
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setViewMode('website');
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        updateProjects,
        updateServices,
        updateFounders,
        updateContactSettings,
        updateBrandSettings,
        resetToDefaults,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        viewMode,
        setViewMode,
        isAdminAuthenticated,
        loginAdmin,
        changeAdminPassword,
        resetAdminPassword,
        unlockFounderAdmin,
        logoutAdmin,
        activeProjectModal,
        setActiveProjectModal,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
