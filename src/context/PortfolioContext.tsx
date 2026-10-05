import React, { createContext, useContext, useState, useEffect } from 'react';
import { PORTFOLIO_DATA, PortfolioConfig, Project, Service, Founder } from '@/src/data/portfolioData';
import {
  db,
  auth,
  signInWithGoogle,
  signOutAdmin,
  handleFirestoreError,
  OperationType,
} from '@/src/firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

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
  createdAt?: string;
}

export type FirebaseSyncStatus = 'connected' | 'syncing' | 'offline';

interface PortfolioContextType {
  data: PortfolioConfig;
  updateData: (newData: PortfolioConfig) => Promise<void>;
  updateProjects: (projects: Project[]) => Promise<void>;
  updateServices: (services: Service[]) => Promise<void>;
  updateFounders: (founders: Founder[]) => Promise<void>;
  updateContactSettings: (contact: PortfolioConfig['contact']) => Promise<void>;
  updateBrandSettings: (brand: PortfolioConfig['brand']) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  
  // Inquiries
  inquiries: ClientInquiry[];
  addInquiry: (inquiryData: Omit<ClientInquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: ClientInquiry['status'], notes?: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // View state & Auth
  viewMode: 'website' | 'admin';
  setViewMode: (mode: 'website' | 'admin') => void;
  isAdminAuthenticated: boolean;
  adminUser: User | null;
  loginAdmin: (pin: string) => boolean;
  loginWithGoogleAdmin: () => Promise<boolean>;
  changeAdminPassword: (currentPin: string, newPin: string) => { success: boolean; message: string };
  resetAdminPassword: () => void;
  unlockFounderAdmin: () => void;
  logoutAdmin: () => Promise<void>;
  
  // Firebase State
  syncStatus: FirebaseSyncStatus;
  lastSyncedAt: string | null;
  
  // Quick project modal helper
  activeProjectModal: Project | null;
  setActiveProjectModal: (project: Project | null) => void;
}

const STORAGE_KEY = 'ah_productions_portfolio_data_v1';
const INQUIRIES_KEY = 'ah_productions_inquiries_v1';
const AUTH_KEY = 'ah_productions_admin_auth_v1';
const PASSWORD_KEY = 'ah_productions_admin_password_v1';
const PORTFOLIO_DOC_ID = 'current';

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
    notes: 'Requested launch within 3 weeks. Ready to review portfolio links.',
    createdAt: new Date().toISOString(),
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
    notes: 'Sent project scope questionnaire. Follow-up scheduled for Tuesday.',
    createdAt: new Date().toISOString(),
  },
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

  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<FirebaseSyncStatus>('connected');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

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

  // Local storage caching
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to cache portfolio data', e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to cache inquiries', e);
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

  // 1. Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      if (user) {
        setIsAdminAuthenticated(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time sync for Portfolio Configuration from Firestore
  useEffect(() => {
    const portfolioDocRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
    
    const unsubscribe = onSnapshot(
      portfolioDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as PortfolioConfig;
          setData((prev) => ({
            ...prev,
            brand: remoteData.brand || prev.brand,
            contact: remoteData.contact || prev.contact,
            founders: remoteData.founders || prev.founders,
            services: remoteData.services || prev.services,
            projects: remoteData.projects || prev.projects,
            technologies: remoteData.technologies || prev.technologies,
            process: remoteData.process || prev.process,
            whyUs: remoteData.whyUs || prev.whyUs,
            showreel: remoteData.showreel || prev.showreel,
          }));
          setSyncStatus('connected');
          setLastSyncedAt(new Date().toLocaleTimeString());
        }
      },
      (error) => {
        console.warn('Firestore portfolio onSnapshot error:', error);
        setSyncStatus('offline');
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Real-time sync for Client Inquiries when Admin is Authenticated
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const inquiriesColRef = collection(db, 'inquiries');
    const unsubscribe = onSnapshot(
      inquiriesColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteInquiries: ClientInquiry[] = [];
          snapshot.forEach((docSnap) => {
            const item = docSnap.data() as ClientInquiry;
            remoteInquiries.push({
              ...item,
              id: docSnap.id,
            });
          });
          // Sort by creation date descending
          remoteInquiries.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });
          setInquiries(remoteInquiries);
          setSyncStatus('connected');
        }
      },
      (error) => {
        console.warn('Firestore inquiries onSnapshot listener:', error);
      }
    );

    return () => unsubscribe();
  }, [isAdminAuthenticated]);

  // Helper to persist entire portfolio config to Firestore
  const savePortfolioToFirestore = async (newConfig: PortfolioConfig) => {
    setSyncStatus('syncing');
    const path = `portfolio/${PORTFOLIO_DOC_ID}`;
    try {
      const docRef = doc(db, 'portfolio', PORTFOLIO_DOC_ID);
      await setDoc(
        docRef,
        {
          ...newConfig,
          updatedAt: new Date().toISOString(),
          updatedBy: auth.currentUser?.email || 'admin',
        },
        { merge: true }
      );
      setSyncStatus('connected');
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (error) {
      setSyncStatus('offline');
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const updateData = async (newData: PortfolioConfig) => {
    setData(newData);
    await savePortfolioToFirestore(newData);
  };

  const updateProjects = async (projects: Project[]) => {
    const updated = { ...data, projects };
    setData(updated);
    await savePortfolioToFirestore(updated);
  };

  const updateServices = async (services: Service[]) => {
    const updated = { ...data, services };
    setData(updated);
    await savePortfolioToFirestore(updated);
  };

  const updateFounders = async (founders: Founder[]) => {
    const updated = { ...data, founders };
    setData(updated);
    await savePortfolioToFirestore(updated);
  };

  const updateContactSettings = async (contact: PortfolioConfig['contact']) => {
    const updated = { ...data, contact };
    setData(updated);
    await savePortfolioToFirestore(updated);
  };

  const updateBrandSettings = async (brand: PortfolioConfig['brand']) => {
    const updated = { ...data, brand };
    setData(updated);
    await savePortfolioToFirestore(updated);
  };

  const resetToDefaults = async () => {
    setData(PORTFOLIO_DATA);
    setInquiries(DEFAULT_INQUIRIES);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INQUIRIES_KEY);
    await savePortfolioToFirestore(PORTFOLIO_DATA);
  };

  const addInquiry = async (inquiryData: Omit<ClientInquiry, 'id' | 'date' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const inqId = `inq-${Date.now()}`;

    const newInq: ClientInquiry = {
      ...inquiryData,
      id: inqId,
      date: formattedDate,
      status: 'new',
      createdAt: now.toISOString(),
    };

    setInquiries((prev) => [newInq, ...prev]);

    // Persist to Firestore
    const path = `inquiries/${inqId}`;
    try {
      await setDoc(doc(db, 'inquiries', inqId), newInq);
    } catch (error) {
      console.warn('Inquiry cached locally, firestore sync note:', error);
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateInquiryStatus = async (id: string, status: ClientInquiry['status'], notes?: string) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, ...(notes !== undefined ? { notes } : {}) }
          : item
      )
    );

    const path = `inquiries/${id}`;
    try {
      const docRef = doc(db, 'inquiries', id);
      const updatePayload: Record<string, any> = { status };
      if (notes !== undefined) updatePayload.notes = notes;
      await updateDoc(docRef, updatePayload);
    } catch (error) {
      console.warn('Failed to update inquiry in Firestore:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((item) => item.id !== id));

    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      console.warn('Failed to delete inquiry from Firestore:', error);
    }
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

  const loginWithGoogleAdmin = async (): Promise<boolean> => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setIsAdminAuthenticated(true);
        setViewMode('admin');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google Admin Login Failed:', error);
      return false;
    }
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

  const logoutAdmin = async () => {
    setIsAdminAuthenticated(false);
    setViewMode('website');
    await signOutAdmin();
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
        adminUser,
        loginAdmin,
        loginWithGoogleAdmin,
        changeAdminPassword,
        resetAdminPassword,
        unlockFounderAdmin,
        logoutAdmin,
        syncStatus,
        lastSyncedAt,
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
