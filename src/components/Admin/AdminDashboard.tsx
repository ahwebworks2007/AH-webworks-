import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Layers,
  PhoneCall,
  Users,
  FileCode,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  Copy,
  MessageCircle,
  Mail,
  Search,
  RefreshCw,
  LogOut,
  Globe,
  Sliders,
  Download,
  ArrowUp,
  ArrowDown,
  Linkedin,
  Github,
  CheckCircle2,
  AlertCircle,
  Camera,
  Undo,
  ArrowUpRight,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Shield,
} from 'lucide-react';
import { usePortfolio, ClientInquiry } from '@/src/context/PortfolioContext';
import {
  Project,
  Service,
  Founder,
  PORTFOLIO_DATA,
  DEFAULT_FOUNDER_AVATARS,
} from '@/src/data/portfolioData';
import { AdminImageModal } from './AdminImageModal';
import { AdminFounderLinksModal } from './AdminFounderLinksModal';
import { getServiceIcon } from '../Services';

type AdminTab =
  | 'overview'
  | 'inquiries'
  | 'projects'
  | 'services'
  | 'brand'
  | 'contact'
  | 'team'
  | 'security'
  | 'export';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    updateData,
    updateProjects,
    updateServices,
    updateFounders,
    updateContactSettings,
    updateBrandSettings,
    resetToDefaults,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    setViewMode,
    logoutAdmin,
    changeAdminPassword,
    resetAdminPassword,
    syncStatus,
    lastSyncedAt,
    adminUser,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Password / Security Management State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Draft States for Explicit "Save Changes" Confirmation per Panel
  const [draftBrand, setDraftBrand] = useState(data.brand);
  const [draftContact, setDraftContact] = useState(data.contact);
  const [draftFounders, setDraftFounders] = useState<Founder[]>(data.founders);
  const [draftServices, setDraftServices] = useState<Service[]>(data.services);

  // Sync draft states when external data changes
  useEffect(() => {
    setDraftBrand(data.brand);
  }, [data.brand]);

  useEffect(() => {
    setDraftContact(data.contact);
  }, [data.contact]);

  useEffect(() => {
    setDraftFounders(data.founders);
  }, [data.founders]);

  useEffect(() => {
    setDraftServices(data.services);
  }, [data.services]);

  // Dirty Checks for Unsaved Changes
  const isBrandDirty = JSON.stringify(draftBrand) !== JSON.stringify(data.brand);
  const isContactDirty = JSON.stringify(draftContact) !== JSON.stringify(data.contact);
  const isFoundersDirty = JSON.stringify(draftFounders) !== JSON.stringify(data.founders);
  const isServicesDirty = JSON.stringify(draftServices) !== JSON.stringify(data.services);

  const hasAnyUnsavedChanges =
    isBrandDirty || isContactDirty || isFoundersDirty || isServicesDirty;

  // Inquiries State
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<
    'all' | 'new' | 'contacted' | 'in_progress' | 'closed'
  >('all');
  const [inquiryNotesMap, setInquiryNotesMap] = useState<{ [id: string]: string }>({});

  // Project Editor State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});
  const [techInput, setTechInput] = useState('');
  const [delivInput, setDelivInput] = useState('');

  // Service Editor State
  const [editingServiceIdx, setEditingServiceIdx] = useState<number | null>(null);
  const [isAddingNewService, setIsAddingNewService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<Service>>({});
  const [serviceHighlightsInput, setServiceHighlightsInput] = useState('');

  // Founder Photo & Links Editor State
  const [photoModalFounderIdx, setPhotoModalFounderIdx] = useState<number | null>(null);
  const [linksModalFounderIdx, setLinksModalFounderIdx] = useState<number | null>(null);
  const [founderUrlInputs, setFounderUrlInputs] = useState<{ [key: number]: string }>({});
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Feedback & Save Toasts
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveToastMsg, setSaveToastMsg] = useState('Changes saved & confirmed!');

  const showSaveNotification = (msg = 'Changes saved & confirmed!') => {
    setSaveToastMsg(msg);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2600);
  };

  const AVAILABLE_SERVICE_ICONS = [
    'Briefcase',
    'Utensils',
    'ShoppingBag',
    'Code2',
    'Layout',
    'Wrench',
    'Sparkles',
    'Smartphone',
    'Globe',
    'Database',
    'Shield',
    'Zap',
    'Cloud',
    'Cpu',
    'Layers',
    'Bot',
    'Palette',
    'Search',
    'Gauge',
    'Terminal',
    'Rocket',
    'BarChart',
    'FileText',
  ];

  // Inquiries Filtering
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = inquiryFilter === 'all' || inq.status === inquiryFilter;
    const matchesSearch =
      inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.businessName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.projectType.toLowerCase().includes(inquirySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'in_progress').length;

  // -------------------------------------------------------------
  // SAVE HANDLERS FOR EACH PANEL
  // -------------------------------------------------------------

  // Save Brand Panel
  const handleSaveBrandPanel = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateBrandSettings(draftBrand);
    showSaveNotification('Brand headlines & copy saved successfully!');
  };

  const handleDiscardBrandChanges = () => {
    setDraftBrand(data.brand);
    showSaveNotification('Brand changes discarded.');
  };

  // Save Contact Panel
  const handleSaveContactPanel = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateContactSettings(draftContact);
    showSaveNotification('Contact & Social settings saved successfully!');
  };

  const handleDiscardContactChanges = () => {
    setDraftContact(data.contact);
    showSaveNotification('Contact changes discarded.');
  };

  // Save Team / Founders Panel
  const handleSaveTeamPanel = () => {
    updateFounders(draftFounders);
    showSaveNotification('Founder profiles & team settings saved successfully!');
  };

  const handleDiscardTeamChanges = () => {
    setDraftFounders(data.founders);
    showSaveNotification('Team changes discarded.');
  };

  // Save Services Panel
  const handleSaveServicesPanel = () => {
    updateServices(draftServices);
    showSaveNotification('Services list saved successfully!');
  };

  const handleDiscardServicesChanges = () => {
    setDraftServices(data.services);
    showSaveNotification('Services changes discarded.');
  };

  // Save Global All Changes
  const handleSaveAllPanels = () => {
    updateData({
      ...data,
      brand: draftBrand,
      contact: draftContact,
      founders: draftFounders,
      services: draftServices,
    });
    showSaveNotification('All admin panel changes saved & confirmed!');
  };

  // Change Password Handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPass.trim()) {
      setPassError('Please enter your current admin password.');
      return;
    }
    if (!newPass.trim()) {
      setPassError('Please enter a new admin password.');
      return;
    }
    if (newPass.trim().length < 3) {
      setPassError('New password must be at least 3 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New password and confirmation password do not match.');
      return;
    }

    const res = changeAdminPassword(currentPass, newPass);
    if (res.success) {
      setPassSuccess(res.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      showSaveNotification('Admin passcode updated successfully!');
    } else {
      setPassError(res.message);
    }
  };

  const handleResetPasswordToDefault = () => {
    if (confirm('Reset admin passcode to default (786)?')) {
      resetAdminPassword();
      setPassSuccess('Passcode restored to default (786).');
      setPassError('');
      showSaveNotification('Admin passcode reset to 786.');
    }
  };

  // -------------------------------------------------------------
  // PROJECT HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setIsAddingNewProject(true);
    setEditingProject(null);
    setProjectForm({
      id: `project-${Date.now()}`,
      number: String(data.projects.length + 1).padStart(2, '0'),
      name: '',
      category: 'Business Website',
      tagline: '',
      description: '',
      image: data.projects[0]?.image || '',
      liveUrl: 'https://',
      githubUrl: '',
      featured: true,
      technologies: ['React', 'Tailwind CSS', 'JavaScript'],
      clientType: 'General Business',
      deliverables: ['Custom UI', 'Responsive Design', 'SEO Optimization'],
      caseStudy: {
        challenge: 'Describe the client requirements and initial problem statement...',
        solution: 'Explain the technical architecture and interface design engineered...',
        result: 'Highlight the final outcome and value delivered to the client.',
      },
    });
    setTechInput('React, Tailwind CSS, JavaScript');
    setDelivInput('Custom UI, Responsive Design, SEO Optimization');
  };

  const handleOpenEditProject = (proj: Project) => {
    setIsAddingNewProject(false);
    setEditingProject(proj);
    setProjectForm({ ...proj });
    setTechInput(proj.technologies.join(', '));
    setDelivInput(proj.deliverables.join(', '));
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.liveUrl) return;

    const formattedTech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const formattedDeliv = delivInput
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const fullProject: Project = {
      id: projectForm.id || `project-${Date.now()}`,
      number: projectForm.number || String(data.projects.length + 1).padStart(2, '0'),
      name: projectForm.name.trim(),
      category: projectForm.category || 'Business Website',
      tagline: projectForm.tagline?.trim() || '',
      description: projectForm.description?.trim() || '',
      image: projectForm.image || data.projects[0]?.image || '',
      liveUrl: projectForm.liveUrl.trim(),
      githubUrl: projectForm.githubUrl?.trim() || undefined,
      featured: projectForm.featured ?? true,
      technologies: formattedTech.length > 0 ? formattedTech : ['React', 'Tailwind CSS'],
      clientType: projectForm.clientType?.trim() || 'Business',
      deliverables: formattedDeliv.length > 0 ? formattedDeliv : ['Responsive Web'],
      caseStudy: {
        challenge: projectForm.caseStudy?.challenge || '',
        solution: projectForm.caseStudy?.solution || '',
        result: projectForm.caseStudy?.result || '',
      },
    };

    if (isAddingNewProject) {
      updateProjects([...data.projects, fullProject]);
    } else if (editingProject) {
      updateProjects(data.projects.map((p) => (p.id === editingProject.id ? fullProject : p)));
    }

    setEditingProject(null);
    setIsAddingNewProject(false);
    showSaveNotification('Project saved to portfolio!');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project from the portfolio?')) {
      updateProjects(data.projects.filter((p) => p.id !== id));
      showSaveNotification('Project removed from portfolio.');
    }
  };

  // -------------------------------------------------------------
  // SERVICES INLINE & MODAL HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddService = () => {
    setIsAddingNewService(true);
    setEditingServiceIdx(null);
    const nextNum = String(draftServices.length + 1).padStart(2, '0');
    setServiceForm({
      number: nextNum,
      title: '',
      description: '',
      highlights: ['Responsive engineering', 'Modern UI architecture'],
      iconName: 'Code2',
    });
    setServiceHighlightsInput('Responsive engineering, Modern UI architecture');
  };

  const handleOpenEditService = (idx: number) => {
    const s = draftServices[idx];
    if (!s) return;
    setIsAddingNewService(false);
    setEditingServiceIdx(idx);
    setServiceForm({ ...s });
    setServiceHighlightsInput(s.highlights?.join(', ') || '');
  };

  const handleSaveServiceModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title?.trim()) return;

    const highlights = serviceHighlightsInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const newService: Service = {
      number:
        serviceForm.number ||
        String(
          (editingServiceIdx !== null ? editingServiceIdx : draftServices.length) + 1
        ).padStart(2, '0'),
      title: serviceForm.title.trim().toUpperCase(),
      description: serviceForm.description?.trim() || '',
      highlights: highlights.length > 0 ? highlights : ['Custom development', 'High performance'],
      iconName: serviceForm.iconName || 'Code2',
    };

    let updatedList: Service[];
    if (isAddingNewService) {
      updatedList = [...draftServices, newService];
    } else if (editingServiceIdx !== null) {
      updatedList = [...draftServices];
      updatedList[editingServiceIdx] = newService;
    } else {
      updatedList = draftServices;
    }

    setDraftServices(updatedList);
    updateServices(updatedList);
    setIsAddingNewService(false);
    setEditingServiceIdx(null);
    showSaveNotification('Service saved successfully!');
  };

  const handleDeleteService = (idx: number) => {
    const s = draftServices[idx];
    if (!s) return;
    if (confirm(`Are you sure you want to remove the service "${s.title}"?`)) {
      const updated = draftServices
        .filter((_, i) => i !== idx)
        .map((item, i) => ({
          ...item,
          number: String(i + 1).padStart(2, '0'),
        }));
      setDraftServices(updated);
      updateServices(updated);
      if (editingServiceIdx === idx) {
        setEditingServiceIdx(null);
        setIsAddingNewService(false);
      }
      showSaveNotification('Service removed.');
    }
  };

  const handleMoveService = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= draftServices.length) return;

    const updated = [...draftServices];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const renumbered = updated.map((item, i) => ({
      ...item,
      number: String(i + 1).padStart(2, '0'),
    }));

    setDraftServices(renumbered);
    updateServices(renumbered);
    showSaveNotification('Service order updated!');
  };

  const handleResetServices = () => {
    if (confirm('Restore the default 6 studio services?')) {
      setDraftServices(PORTFOLIO_DATA.services);
      updateServices(PORTFOLIO_DATA.services);
      showSaveNotification('Restored default studio services.');
    }
  };

  // -------------------------------------------------------------
  // FOUNDER AVATAR & TEAM HANDLERS
  // -------------------------------------------------------------
  const handleDraftFounderChange = (index: number, field: keyof Founder, val: any) => {
    const updated = [...draftFounders];
    updated[index] = { ...updated[index], [field]: val };
    setDraftFounders(updated);
  };

  const handleFounderAvatarUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        handleDraftFounderChange(index, 'avatar', result);
        showSaveNotification('Photo uploaded in draft! Click "Save Changes" to confirm.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyFounderUrl = (index: number) => {
    const url = (founderUrlInputs[index] || '').trim();
    if (!url) return;
    handleDraftFounderChange(index, 'avatar', url);
    setFounderUrlInputs((prev) => ({ ...prev, [index]: '' }));
    showSaveNotification('Image URL applied to draft! Click "Save Changes" to confirm.');
  };

  const handleDeleteFounderAvatar = (index: number) => {
    const founderName = draftFounders[index]?.name || 'Admin';
    if (
      confirm(
        `Remove the photo for ${founderName}? Click "Save Changes" after confirming to apply.`
      )
    ) {
      handleDraftFounderChange(index, 'avatar', '');
      showSaveNotification('Photo removed in draft.');
    }
  };

  const handleRestoreFounderDefault = (index: number) => {
    const defaultImg =
      index === 0 ? DEFAULT_FOUNDER_AVATARS.hamdan : DEFAULT_FOUNDER_AVATARS.ahad;
    handleDraftFounderChange(index, 'avatar', defaultImg);
    showSaveNotification('Default portrait loaded in draft.');
  };

  const handleAddNewFounder = () => {
    const newFounder: Founder = {
      name: 'NEW TEAM MEMBER',
      role: 'Web Developer & Designer',
      bio: 'Creates performant and engaging digital web experiences.',
      focus: ['Web Development', 'UI/UX Design', 'Frontend'],
      avatar: '',
      email: draftContact.email,
      github: 'https://github.com',
    };
    const updated = [...draftFounders, newFounder];
    setDraftFounders(updated);
    showSaveNotification('New member profile created in draft. Click "Save Changes" to confirm.');
  };

  const handleDeleteFounder = (index: number) => {
    const founder = draftFounders[index];
    if (confirm(`Are you sure you want to delete ${founder.name} from the studio team?`)) {
      const updated = draftFounders.filter((_, i) => i !== index);
      setDraftFounders(updated);
      showSaveNotification('Team member removed from draft. Click "Save Changes" to confirm.');
    }
  };

  // Export JSON / Backup Download
  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadBackup = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ah_productions_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showSaveNotification('Backup file downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-body selection:bg-amber-400 selection:text-black">
      {/* Save Notification Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-zinc-950 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-zinc-950" />
          <span>{saveToastMsg}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar with Global Sync / Save All Status */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Breadcrumb & Return to Site */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setViewMode('website')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors border border-zinc-700/60 cursor-pointer"
            title="Return to public portfolio view"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Live Site</span>
            <span className="sm:hidden">Site</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden md:block" />

          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display font-bold text-white text-sm tracking-tight hidden sm:inline">
              AH PRODUCTIONS
            </span>
            <span className="text-zinc-600 hidden sm:inline">/</span>
            <span className="text-amber-400 font-semibold uppercase">{activeTab}</span>
          </div>

          {/* Firebase Connection Status */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[11px] font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                syncStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-400 animate-spin'
                  : 'bg-zinc-500'
              }`}
            />
            <span className="text-zinc-400">
              {syncStatus === 'connected'
                ? 'Firestore Live'
                : syncStatus === 'syncing'
                ? 'Syncing to Cloud...'
                : 'Offline Cache'}
            </span>
            {adminUser?.email && (
              <span className="text-amber-400/90 pl-1 border-l border-zinc-800 truncate max-w-[140px]">
                {adminUser.email}
              </span>
            )}
          </div>
        </div>

        {/* Right: Unsaved Indicator, Save All Button & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasAnyUnsavedChanges && (
            <button
              onClick={handleSaveAllPanels}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-lg shadow-emerald-400/20 cursor-pointer animate-pulse"
              title="Save all pending panel changes to live site"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save All Changes</span>
            </button>
          )}

          <button
            onClick={() => setViewMode('website')}
            className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-md shadow-amber-400/10 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Site</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Log out of Studio Admin Suite"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Studio Console Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          {/* Group 1: Studio Operations */}
          <div>
            <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 font-semibold tracking-wider uppercase mb-1">
              STUDIO OPERATIONS
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Client Inquiries</span>
                </div>
                {newInquiriesCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === 'inquiries'
                        ? 'bg-zinc-950 text-amber-400'
                        : 'bg-amber-400 text-zinc-950'
                    }`}
                  >
                    {newInquiriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-4 h-4" />
                  <span>Projects Portfolio</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">{data.projects.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Services & Skills</span>
                </div>
                <div className="flex items-center gap-1">
                  {isServicesDirty && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  <span className="text-[10px] font-mono opacity-80">{draftServices.length}</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Group 2: Brand & Identity */}
          <div className="pt-2 border-t border-zinc-900">
            <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 font-semibold tracking-wider uppercase mb-1">
              BRAND & TEAM
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'team'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Founders & Team</span>
                </div>
                <div className="flex items-center gap-1">
                  {isFoundersDirty && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  <span className="text-[10px] font-mono opacity-80">{draftFounders.length}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'contact'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4" />
                  <span>Contact & Socials</span>
                </div>
                {isContactDirty && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('brand')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'brand'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4" />
                  <span>Headlines & Copy</span>
                </div>
                {isBrandDirty && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </nav>
          </div>

          {/* Group 3: System & Security */}
          <div className="pt-2 border-t border-zinc-900">
            <div className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 font-semibold tracking-wider uppercase mb-1">
              SYSTEM & SECURITY
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4" />
                  <span>Security & Passcode</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'export'
                    ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCode className="w-4 h-4" />
                  <span>Backup & Export</span>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 sm:p-7">
          {/* ============================================================== */}
          {/* TAB 0: OVERVIEW PANEL */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    Studio Console Overview
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Live operational status, inbound project brief activity, and website
                    configuration.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveAllPanels}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md shadow-amber-400/10 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Portfolio State</span>
                  </button>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-400/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                    <span>INBOUND BRIEFS</span>
                    <Inbox className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-display font-bold text-white font-mono-data">
                    {inquiries.length}
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                    {newInquiriesCount > 0 ? (
                      <span className="text-amber-400 font-semibold">
                        {newInquiriesCount} new briefs
                      </span>
                    ) : (
                      <span>All briefs reviewed</span>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('projects')}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-400/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                    <span>CASE STUDIES</span>
                    <FolderKanban className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-display font-bold text-white font-mono-data">
                    {data.projects.length}
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-zinc-500">
                    Featured builds live
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('services')}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-400/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                    <span>CAPABILITIES</span>
                    <Layers className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-display font-bold text-white font-mono-data">
                    {draftServices.length}
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-zinc-500">
                    Active studio services
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('team')}
                  className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 hover:border-amber-400/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                    <span>TEAM & ADMINS</span>
                    <Users className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-3 text-2xl sm:text-3xl font-display font-bold text-white font-mono-data">
                    {draftFounders.length}
                  </div>
                  <div className="mt-1 text-[11px] font-mono text-zinc-500">
                    Co-Founders & Devs
                  </div>
                </div>
              </div>

              {/* Quick Action Station */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  QUICK MANAGEMENT LAUNCHER
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('projects');
                      handleOpenAddProject();
                    }}
                    className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Plus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-zinc-500">PROJECTS</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Add New Project</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Publish website build</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('services');
                      handleOpenAddService();
                    }}
                    className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Plus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-zinc-500">SERVICES</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Add Capability</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Offer new web service</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('team')}
                    className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <Camera className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-zinc-500">PROFILES</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Manage Avatars</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Upload photos & accounts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <PhoneCall className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-zinc-500">CONTACT</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">WhatsApp & Links</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Adjust routing channels</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className="p-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-left transition-all flex flex-col justify-between space-y-2 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <KeyRound className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-mono text-zinc-500">SECURITY</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Change Passcode</div>
                      <div className="text-xs text-zinc-400 mt-0.5">Update admin password</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Inbound Leads Preview */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    RECENT INBOUND PROJECT LEADS
                  </div>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs font-mono text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all briefs ({inquiries.length})</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-500 font-mono text-xs">
                    No inquiries received yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs font-mono">
                            {inq.status === 'new' && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-zinc-950 font-bold text-[10px]">
                                NEW
                              </span>
                            )}
                            <span className="text-zinc-500">{inq.date}</span>
                            <span className="text-zinc-700">·</span>
                            <span className="text-amber-400 font-semibold">{inq.projectType}</span>
                          </div>
                          <div className="mt-1 text-sm font-bold text-white">
                            {inq.name}{' '}
                            {inq.businessName && (
                              <span className="text-zinc-400 font-normal">
                                ({inq.businessName})
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-zinc-400 line-clamp-1">{inq.message}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setActiveTab('inquiries')}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: INQUIRIES & PROJECT BRIEFS */}
          {/* ============================================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    Client Inquiries & Project Briefs
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage incoming project leads submitted from the website contact form.
                  </p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Search briefs..."
                      className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 w-44 sm:w-52"
                    />
                  </div>

                  <select
                    value={inquiryFilter}
                    onChange={(e: any) => setInquiryFilter(e.target.value)}
                    className="py-1.5 px-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">All Statuses ({inquiries.length})</option>
                    <option value="new">New ({newInquiriesCount})</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress ({inProgressCount})</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 text-xs font-mono">
                  No inquiries match the current filter or search criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredInquiries.map((inq) => {
                    const isNew = inq.status === 'new';
                    const whatsappQuickUrl = `https://wa.me/${inq.phone.replace(
                      /[^0-9]/g,
                      ''
                    )}?text=${encodeURIComponent(
                      `Hi ${inq.name}, Hamdan & Ahad from AH Productions here regarding your project inquiry for "${
                        inq.businessName || inq.projectType
                      }".`
                    )}`;

                    return (
                      <div
                        key={inq.id}
                        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                          isNew
                            ? 'bg-zinc-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                            : 'bg-zinc-950/80 border-zinc-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {isNew && (
                                <span className="px-2 py-0.5 rounded bg-amber-400 text-zinc-950 text-[10px] font-mono font-bold">
                                  NEW BRIEF
                                </span>
                              )}
                              <span className="text-xs font-mono text-zinc-500">{inq.date}</span>
                              <span className="text-zinc-700">·</span>
                              <span className="text-xs font-semibold text-amber-400">
                                {inq.projectType}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-white">
                              {inq.name}{' '}
                              {inq.businessName && (
                                <span className="text-zinc-400 font-normal">
                                  ({inq.businessName})
                                </span>
                              )}
                            </h3>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-1">
                              <span>{inq.email}</span>
                              {inq.phone && (
                                <>
                                  <span className="text-zinc-700">·</span>
                                  <span>{inq.phone}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Status Selector & Trash */}
                          <div className="flex items-center gap-2 shrink-0">
                            <select
                              value={inq.status}
                              onChange={(e: any) => {
                                updateInquiryStatus(inq.id, e.target.value);
                                showSaveNotification(`Status updated to ${e.target.value}`);
                              }}
                              className="py-1 px-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 focus:border-amber-400 focus:outline-none cursor-pointer"
                            >
                              <option value="new">Status: New</option>
                              <option value="contacted">Status: Contacted</option>
                              <option value="in_progress">Status: In Progress</option>
                              <option value="closed">Status: Closed</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete inquiry from ${inq.name}?`)) {
                                  deleteInquiry(inq.id);
                                  showSaveNotification('Inquiry deleted.');
                                }
                              }}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Delete inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Client Message */}
                        <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed">
                          <span className="text-zinc-500 font-mono block mb-1">
                            CLIENT BRIEF / MESSAGE:
                          </span>
                          {inq.message}
                        </div>

                        {/* Direct Reply Actions & Internal Notes */}
                        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {inq.phone && (
                              <a
                                href={whatsappQuickUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp Client</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${inq.email}?subject=AH%20Productions%20Project%20Response%20for%20${encodeURIComponent(
                                inq.name
                              )}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email Reply</span>
                            </a>
                          </div>

                          {inq.notes ? (
                            <div className="text-[11px] text-zinc-400 font-mono italic">
                              Note: {inq.notes}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={inquiryNotesMap[inq.id] || ''}
                                onChange={(e) =>
                                  setInquiryNotesMap({
                                    ...inquiryNotesMap,
                                    [inq.id]: e.target.value,
                                  })
                                }
                                placeholder="Add internal studio note..."
                                className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (inquiryNotesMap[inq.id]) {
                                    updateInquiryStatus(
                                      inq.id,
                                      inq.status,
                                      inquiryNotesMap[inq.id]
                                    );
                                    showSaveNotification('Note saved!');
                                  }
                                }}
                                className="px-2.5 py-1 bg-amber-400 text-zinc-950 text-xs font-bold rounded cursor-pointer"
                              >
                                Save Note
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PROJECTS PORTFOLIO */}
          {/* ============================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    Projects & Case Studies Manager
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add new client websites, edit case studies, manage screenshots, and live demo
                    links.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenAddProject}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Project Editor Form */}
              {(isAddingNewProject || editingProject) && (
                <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-400/40 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h3 className="text-lg font-display font-bold text-white">
                      {isAddingNewProject
                        ? 'Create New Portfolio Project'
                        : `Edit Project: ${projectForm.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewProject(false);
                        setEditingProject(null);
                      }}
                      className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Project Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.number || ''}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, number: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.name || ''}
                          onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Category / Industry *
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.category || ''}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, category: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Live Demo URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={projectForm.liveUrl || ''}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, liveUrl: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Project Tagline
                        </label>
                        <input
                          type="text"
                          value={projectForm.tagline || ''}
                          onChange={(e) =>
                            setProjectForm({ ...projectForm, tagline: e.target.value })
                          }
                          placeholder="Brief value statement..."
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Screenshot Image URL
                      </label>
                      <input
                        type="text"
                        value={projectForm.image || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        rows={3}
                        value={projectForm.description || ''}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, description: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Technologies Used (comma separated)
                        </label>
                        <input
                          type="text"
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          placeholder="React, TypeScript, Tailwind CSS"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Deliverables (comma separated)
                        </label>
                        <input
                          type="text"
                          value={delivInput}
                          onChange={(e) => setDelivInput(e.target.value)}
                          placeholder="Responsive Design, CMS Integration, SEO"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Case Study Fields */}
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                      <div className="text-xs font-mono text-amber-400 font-semibold">
                        CASE STUDY BREAKDOWN
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                            The Challenge
                          </label>
                          <textarea
                            rows={2}
                            value={projectForm.caseStudy?.challenge || ''}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                caseStudy: {
                                  challenge: e.target.value,
                                  solution: projectForm.caseStudy?.solution || '',
                                  result: projectForm.caseStudy?.result || '',
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                            The Engineering Solution
                          </label>
                          <textarea
                            rows={2}
                            value={projectForm.caseStudy?.solution || ''}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                caseStudy: {
                                  challenge: projectForm.caseStudy?.challenge || '',
                                  solution: e.target.value,
                                  result: projectForm.caseStudy?.result || '',
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                            Client Result & Impact
                          </label>
                          <textarea
                            rows={2}
                            value={projectForm.caseStudy?.result || ''}
                            onChange={(e) =>
                              setProjectForm({
                                ...projectForm,
                                caseStudy: {
                                  challenge: projectForm.caseStudy?.challenge || '',
                                  solution: projectForm.caseStudy?.solution || '',
                                  result: e.target.value,
                                },
                              })
                            }
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewProject(false);
                          setEditingProject(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md shadow-amber-400/10 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Project</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-400">
                              #{proj.number}
                            </span>
                            <span className="text-zinc-600">·</span>
                            <span className="text-[11px] font-mono text-zinc-400 uppercase">
                              {proj.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-display font-bold text-white tracking-tight mt-0.5">
                            {proj.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProject(proj)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2">{proj.description}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Live Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <span className="text-zinc-500 text-[11px]">
                        {proj.featured ? 'Featured on Home' : 'Standard'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: SERVICES & SKILLS */}
          {/* ============================================================== */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Header with Save Changes Option */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                      Services & Capabilities Manager
                    </h2>
                    {isServicesDirty && (
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px] font-mono font-bold">
                        Unsaved Changes
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add new studio services, customize icons, and reorder offerings.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isServicesDirty && (
                    <button
                      type="button"
                      onClick={handleDiscardServicesChanges}
                      className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Discard
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetServices}
                    className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    title="Restore standard 6 services"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddService}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Service</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveServicesPanel}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {/* Service Editor Form */}
              {(isAddingNewService || editingServiceIdx !== null) && (
                <div className="p-6 rounded-2xl bg-zinc-950 border border-amber-400/40 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                        {getServiceIcon(serviceForm.iconName || 'Code2', 'w-4 h-4 text-amber-400')}
                      </div>
                      <h3 className="text-lg font-display font-bold text-white">
                        {isAddingNewService
                          ? 'Create New Service'
                          : `Edit Service #${serviceForm.number}`}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewService(false);
                        setEditingServiceIdx(null);
                      }}
                      className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveServiceModal} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Display Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={serviceForm.number || ''}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, number: e.target.value })
                          }
                          placeholder="e.g. 01, 07"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Service Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={serviceForm.title || ''}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, title: e.target.value })
                          }
                          placeholder="e.g. AI AUTOMATIONS & CHATBOTS"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white uppercase focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Icon Picker */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono text-amber-400 font-semibold">
                          SERVICE ICON ({serviceForm.iconName || 'Code2'})
                        </label>
                        <span className="text-[11px] font-mono text-zinc-500">
                          Select visual badge
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-36 overflow-y-auto pr-1">
                        {AVAILABLE_SERVICE_ICONS.map((iconKey) => {
                          const isSelected = (serviceForm.iconName || 'Code2') === iconKey;
                          return (
                            <button
                              key={iconKey}
                              type="button"
                              onClick={() => setServiceForm({ ...serviceForm, iconName: iconKey })}
                              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-400/20 border-amber-400 text-amber-400'
                                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                              }`}
                              title={iconKey}
                            >
                              {getServiceIcon(
                                iconKey,
                                isSelected ? 'w-4 h-4 text-amber-400' : 'w-4 h-4'
                              )}
                              <span className="text-[9px] font-mono truncate w-full text-center">
                                {iconKey}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Service Description *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={serviceForm.description || ''}
                        onChange={(e) =>
                          setServiceForm({ ...serviceForm, description: e.target.value })
                        }
                        placeholder="Comprehensive summary of what client receives..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Highlights & Feature Bullets (comma separated)
                      </label>
                      <input
                        type="text"
                        value={serviceHighlightsInput}
                        onChange={(e) => setServiceHighlightsInput(e.target.value)}
                        placeholder="Fast loading times, SEO ready architecture, Lead capture forms"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNewService(false);
                          setEditingServiceIdx(null);
                        }}
                        className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md shadow-amber-400/10 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Confirm Service</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Services List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draftServices.map((service, idx) => (
                  <div
                    key={service.number + service.title + idx}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-400">
                            {getServiceIcon(service.iconName)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-amber-400">
                                #{service.number}
                              </span>
                              <span className="text-zinc-600">·</span>
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                                {service.iconName || 'Code2'}
                              </span>
                            </div>
                            <h3 className="text-base font-display font-bold text-white tracking-tight">
                              {service.title}
                            </h3>
                          </div>
                        </div>

                        {/* Reordering & Action Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveService(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveService(idx, 'down')}
                            disabled={idx === draftServices.length - 1}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditService(idx)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors ml-1 cursor-pointer"
                            title="Edit service details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteService(idx)}
                            className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed">{service.description}</p>

                      {service.highlights && service.highlights.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {service.highlights.map((h) => (
                            <span
                              key={h}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sticky Save Changes Action Bar for Services */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-500">
                  {isServicesDirty ? (
                    <span className="text-amber-400">● Unsaved services changes detected</span>
                  ) : (
                    <span>All services synced</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isServicesDirty && (
                    <button
                      type="button"
                      onClick={handleDiscardServicesChanges}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Discard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveServicesPanel}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: FOUNDERS & TEAM PROFILES */}
          {/* ============================================================== */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Header with Save Changes Option */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                      Co-Founders & Team Profiles
                    </h2>
                    {isFoundersDirty && (
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px] font-mono font-bold">
                        Unsaved Changes
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage admin photos, biographies, expertise tags, and attached GitHub /
                    LinkedIn accounts.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isFoundersDirty && (
                    <button
                      type="button"
                      onClick={handleDiscardTeamChanges}
                      className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Discard
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleAddNewFounder}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveTeamPanel}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              {/* Founder Cards List */}
              <div className="space-y-6">
                {draftFounders.map((founder, idx) => (
                  <div
                    key={founder.name + idx}
                    className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Avatar Management Column */}
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0 group">
                          {founder.avatar ? (
                            <img
                              src={founder.avatar}
                              alt={founder.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-amber-400 font-display font-bold text-xl">
                              {founder.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setPhotoModalFounderIdx(idx)}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-[10px] font-mono text-amber-400 transition-opacity cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>Photo Suite</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-mono text-amber-400 font-semibold">
                              CO-FOUNDER #{idx + 1}
                            </span>
                            <h3 className="text-lg font-display font-bold text-white">
                              {founder.name}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <input
                              type="file"
                              ref={(el) => {
                                fileInputRefs.current[idx] = el;
                              }}
                              onChange={(e) => handleFounderAvatarUpload(idx, e)}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRefs.current[idx]?.click()}
                              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors border border-zinc-800 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Camera className="w-3 h-3 text-amber-400" />
                              <span>Upload Photo</span>
                            </button>

                            {founder.avatar && (
                              <button
                                type="button"
                                onClick={() => handleDeleteFounderAvatar(idx)}
                                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 text-xs font-mono transition-colors border border-zinc-800 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove Photo</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRestoreFounderDefault(idx)}
                              className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors border border-zinc-800 cursor-pointer"
                            >
                              Default
                            </button>
                          </div>
                        </div>
                      </div>

                      {draftFounders.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteFounder(idx)}
                          className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-mono border border-red-800/40 cursor-pointer"
                        >
                          Remove Member
                        </button>
                      )}
                    </div>

                    {/* Form Fields for Founder */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={founder.name}
                          onChange={(e) => handleDraftFounderChange(idx, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 mb-1">
                          Studio Role / Title
                        </label>
                        <input
                          type="text"
                          value={founder.role}
                          onChange={(e) => handleDraftFounderChange(idx, 'role', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Bio & Engineering Philosophy
                      </label>
                      <textarea
                        rows={2}
                        value={founder.bio}
                        onChange={(e) => handleDraftFounderChange(idx, 'bio', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Attached Social & Account Links */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-amber-400 font-semibold">
                          ATTACHED ACCOUNTS & SOCIALS
                        </span>
                        <button
                          type="button"
                          onClick={() => setLinksModalFounderIdx(idx)}
                          className="text-[11px] font-mono text-zinc-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Advanced Formatter</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-amber-400" />
                            <span>Direct Email</span>
                          </label>
                          <input
                            type="email"
                            value={founder.email || ''}
                            onChange={(e) => handleDraftFounderChange(idx, 'email', e.target.value)}
                            placeholder="name@domain.com"
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
                            <Github className="w-3 h-3 text-zinc-300" />
                            <span>GitHub URL / Handle</span>
                          </label>
                          <input
                            type="text"
                            value={founder.github || ''}
                            onChange={(e) =>
                              handleDraftFounderChange(idx, 'github', e.target.value)
                            }
                            placeholder="https://github.com/user"
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1">
                            <Linkedin className="w-3 h-3 text-blue-400" />
                            <span>LinkedIn URL / Handle</span>
                          </label>
                          <input
                            type="text"
                            value={founder.linkedin || ''}
                            onChange={(e) =>
                              handleDraftFounderChange(idx, 'linkedin', e.target.value)
                            }
                            placeholder="https://linkedin.com/in/user"
                            className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Focus Areas */}
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Core Focus Areas (comma separated)
                      </label>
                      <input
                        type="text"
                        value={founder.focus.join(', ')}
                        onChange={(e) =>
                          handleDraftFounderChange(
                            idx,
                            'focus',
                            e.target.value
                              .split(',')
                              .map((f) => f.trim())
                              .filter(Boolean)
                          )
                        }
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sticky Save Changes Action Bar for Team */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-xs font-mono text-zinc-500">
                  {isFoundersDirty ? (
                    <span className="text-amber-400">● Unsaved team edits detected</span>
                  ) : (
                    <span>All team profiles synced</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isFoundersDirty && (
                    <button
                      type="button"
                      onClick={handleDiscardTeamChanges}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Discard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveTeamPanel}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: CONTACT & SOCIALS */}
          {/* ============================================================== */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Header with Save Changes Option */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                      Contact & Social Channels
                    </h2>
                    {isContactDirty && (
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px] font-mono font-bold">
                        Unsaved Changes
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Configure WhatsApp direct messaging, studio GitHub, and availability banners.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isContactDirty && (
                    <button
                      type="button"
                      onClick={handleDiscardContactChanges}
                      className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Discard
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveContactPanel}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveContactPanel} className="space-y-4">
                {/* WhatsApp Module */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span>WHATSAPP DIRECT ROUTING</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        WhatsApp Raw Number (e.g. 923001234567)
                      </label>
                      <input
                        type="text"
                        value={draftContact.whatsappNumber}
                        onChange={(e) =>
                          setDraftContact({ ...draftContact, whatsappNumber: e.target.value })
                        }
                        placeholder="923001234567"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Formatted Display Number
                      </label>
                      <input
                        type="text"
                        value={draftContact.whatsappFormatted}
                        onChange={(e) =>
                          setDraftContact({ ...draftContact, whatsappFormatted: e.target.value })
                        }
                        placeholder="+92 300 1234567"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      WhatsApp Pre-filled Message Template
                    </label>
                    <input
                      type="text"
                      value={draftContact.whatsappDefaultMessage}
                      onChange={(e) =>
                        setDraftContact({
                          ...draftContact,
                          whatsappDefaultMessage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* GitHub Account Module */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-zinc-300 font-semibold flex items-center gap-2">
                      <Github className="w-4 h-4 text-white" />
                      <span>STUDIO GITHUB ACCOUNT / REPOSITORY</span>
                    </div>
                    {draftContact.githubUrl ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-[10px] font-mono">
                        Removed
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      GitHub URL or Username
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draftContact.githubUrl || ''}
                        onChange={(e) =>
                          setDraftContact({ ...draftContact, githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/hamdansaleemi or username"
                        className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                      {draftContact.githubUrl && (
                        <button
                          type="button"
                          onClick={() => setDraftContact({ ...draftContact, githubUrl: '' })}
                          className="px-3 py-2 bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 rounded-lg text-xs font-mono cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email & Social Module */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="text-xs font-mono text-amber-400 font-semibold">
                    EMAIL & SOCIAL MEDIA
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Primary Contact Email
                      </label>
                      <input
                        type="email"
                        value={draftContact.email}
                        onChange={(e) =>
                          setDraftContact({ ...draftContact, email: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={draftContact.instagramHandle}
                        onChange={(e) =>
                          setDraftContact({ ...draftContact, instagramHandle: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability Module */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="text-xs font-mono text-amber-400 font-semibold">
                    STUDIO AVAILABILITY BANNER
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Availability Banner Text
                    </label>
                    <input
                      type="text"
                      value={draftContact.availability}
                      onChange={(e) =>
                        setDraftContact({ ...draftContact, availability: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Bottom Save Changes Action Bar for Contact */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-xs font-mono text-zinc-500">
                    {isContactDirty ? (
                      <span className="text-amber-400">● Unsaved contact settings detected</span>
                    ) : (
                      <span>All channels synced</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isContactDirty && (
                      <button
                        type="button"
                        onClick={handleDiscardContactChanges}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Discard
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: HEADLINES & BRAND COPY */}
          {/* ============================================================== */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              {/* Header with Save Changes Option */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                      Brand Headlines & Copy
                    </h2>
                    {isBrandDirty && (
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px] font-mono font-bold">
                        Unsaved Changes
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Customize studio title, hero tagline, subtext, and agency narrative.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isBrandDirty && (
                    <button
                      type="button"
                      onClick={handleDiscardBrandChanges}
                      className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Discard
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveBrandPanel}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveBrandPanel} className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Studio Wordmark / Name
                    </label>
                    <input
                      type="text"
                      value={draftBrand.name}
                      onChange={(e) => setDraftBrand({ ...draftBrand, name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Hero Main Headline / Tagline
                    </label>
                    <input
                      type="text"
                      value={draftBrand.tagline}
                      onChange={(e) => setDraftBrand({ ...draftBrand, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Hero Subheadline Description
                    </label>
                    <textarea
                      rows={2}
                      value={draftBrand.subheadline}
                      onChange={(e) =>
                        setDraftBrand({ ...draftBrand, subheadline: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="text-xs font-mono text-amber-400 font-semibold">
                    ABOUT SECTION NARRATIVE
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">
                      Agency Story & Mission
                    </label>
                    <textarea
                      rows={4}
                      value={draftBrand.aboutText}
                      onChange={(e) => setDraftBrand({ ...draftBrand, aboutText: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Bottom Save Changes Action Bar for Brand */}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-xs font-mono text-zinc-500">
                    {isBrandDirty ? (
                      <span className="text-amber-400">● Unsaved brand text detected</span>
                    ) : (
                      <span>Brand copy in sync</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isBrandDirty && (
                      <button
                        type="button"
                        onClick={handleDiscardBrandChanges}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Discard
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: SECURITY & PASSCODE MANAGEMENT */}
          {/* ============================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    Security & Admin Passcode
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage and update the master authentication passcode for the studio admin suite.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Authentication Active</span>
                  </div>
                </div>
              </div>

              {/* Status alerts */}
              {passError && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Form Column */}
                <div className="lg:col-span-7">
                  <form
                    onSubmit={handleChangePassword}
                    className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4"
                  >
                    <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-900">
                      <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Change Admin Passcode</h3>
                        <p className="text-xs text-zinc-400">Set a new passcode to secure studio controls.</p>
                      </div>
                    </div>

                    {/* Current Passcode */}
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                        Current Admin Passcode *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPass ? 'text' : 'password'}
                          value={currentPass}
                          onChange={(e) => {
                            setCurrentPass(e.target.value);
                            if (passError) setPassError('');
                          }}
                          placeholder="Enter your current passcode"
                          className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                          className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                          aria-label={showCurrentPass ? 'Hide passcode' : 'Show passcode'}
                        >
                          {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Passcode */}
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                        New Passcode *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPass}
                          onChange={(e) => {
                            setNewPass(e.target.value);
                            if (passError) setPassError('');
                          }}
                          placeholder="Create a new strong passcode"
                          className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                          aria-label={showNewPass ? 'Hide passcode' : 'Show passcode'}
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">Must be at least 3 characters long.</p>
                    </div>

                    {/* Confirm Passcode */}
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                        Confirm New Passcode *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          value={confirmPass}
                          onChange={(e) => {
                            setConfirmPass(e.target.value);
                            if (passError) setPassError('');
                          }}
                          placeholder="Re-enter your new passcode"
                          className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
                          aria-label={showConfirmPass ? 'Hide passcode' : 'Show passcode'}
                        >
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer active:scale-95"
                      >
                        <Lock className="w-4 h-4 text-zinc-950" />
                        <span>Update Admin Passcode</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right Column: Security Guidelines & Emergency Reset */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Security Best Practices */}
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="text-xs font-mono text-amber-400 font-semibold uppercase">
                      PASSCODE GUIDELINES
                    </div>
                    <ul className="space-y-2.5 text-xs text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>Use a memorable passcode known only to studio co-founders.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>Changes take effect immediately across the live studio environment.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>Your session will remain active after updating.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Emergency Reset */}
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="text-xs font-mono text-zinc-400 font-semibold uppercase flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>EMERGENCY PASSCODE RESTORATION</span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      If you ever need to reset the passcode back to standard studio factory default (786):
                    </p>
                    <button
                      type="button"
                      onClick={handleResetPasswordToDefault}
                      className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono border border-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Restore Default Passcode (786)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 8: BACKUP & EXPORT */}
          {/* ============================================================== */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                    Data Backup & Portability
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Download full JSON backups or restore factory settings.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-400/10 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .JSON Backup</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy JSON Configuration</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Copy the entire active portfolio database state directly to your clipboard for
                    safe keeping.
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyConfig}
                    className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Entire Config'}</span>
                  </button>
                </div>

                <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    <span>Factory Reset</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Reset all projects, services, and founder bios back to original studio defaults.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to reset all data to initial defaults? All changes will be replaced.'
                        )
                      ) {
                        resetToDefaults();
                        showSaveNotification('Portfolio reset to initial defaults.');
                      }
                    }}
                    className="w-full py-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-800/50 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Restore Initial Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Founder Photo Modal */}
      {photoModalFounderIdx !== null && (
        <AdminImageModal
          isOpen={photoModalFounderIdx !== null}
          onClose={() => setPhotoModalFounderIdx(null)}
          founder={draftFounders[photoModalFounderIdx] || null}
          founderIndex={photoModalFounderIdx}
          onUpdateFounderAvatar={(idx, avatarUrl) => {
            handleDraftFounderChange(idx, 'avatar', avatarUrl);
            setPhotoModalFounderIdx(null);
            showSaveNotification('Photo updated in draft! Click "Save Changes" to confirm.');
          }}
        />
      )}

      {/* Admin Founder Accounts & Socials Modal */}
      {linksModalFounderIdx !== null && (
        <AdminFounderLinksModal
          isOpen={linksModalFounderIdx !== null}
          onClose={() => setLinksModalFounderIdx(null)}
          founder={draftFounders[linksModalFounderIdx] || null}
          founderIndex={linksModalFounderIdx}
          onSaveFounderLinks={(idx, links) => {
            const updated = [...draftFounders];
            updated[idx] = {
              ...updated[idx],
              email: links.email,
              github: links.github,
              linkedin: links.linkedin,
            };
            setDraftFounders(updated);
            setLinksModalFounderIdx(null);
            showSaveNotification('Accounts updated in draft! Click "Save Changes" to confirm.');
          }}
        />
      )}
    </div>
  );
};
