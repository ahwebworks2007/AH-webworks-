/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { FeaturedWork } from './components/FeaturedWork';
import { Showreel } from './components/Showreel';
import { Technologies } from './components/Technologies';
import { Process } from './components/Process';
import { WhyUs } from './components/WhyUs';
import { ClientCta } from './components/ClientCta';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { Project } from './data/portfolioData';

function PortfolioApp() {
  const {
    viewMode,
    setViewMode,
    isAdminAuthenticated,
    activeProjectModal,
    setActiveProjectModal,
  } = usePortfolio();

  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Keyboard shortcut listener for discreet admin access (Ctrl+Shift+A or Cmd+Shift+A or Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && (e.key === 'a' || e.key === 'A')) {
        // Prevent default if combination was pressed
        if (e.shiftKey || e.altKey) {
          e.preventDefault();
          handleOpenAdmin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // Check URL hash for direct entrance (e.g. yourwebsite.com/#admin)
  useEffect(() => {
    if (window.location.hash === '#admin') {
      handleOpenAdmin();
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [isAdminAuthenticated]);

  const handleViewWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartProject = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Admin Mode, display full Studio Admin Dashboard
  if (viewMode === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Top Navigation Bar */}
      <Navbar
        onStartProject={handleStartProject}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onViewWork={handleViewWork} onStartProject={handleStartProject} />

        {/* About Co-Founders & Studio Section */}
        <About />

        {/* Services & Capabilities Section */}
        <Services onSelectService={handleSelectService} />

        {/* Selected Featured Work & Case Studies Section */}
        <FeaturedWork onOpenCaseStudy={(proj) => setActiveProjectModal(proj)} />

        {/* Interactive Showreel & Live Device Viewports Section */}
        <Showreel />

        {/* Technologies Stack Section */}
        <Technologies />

        {/* Process Timeline Section */}
        <Process />

        {/* Why Work With Us Section */}
        <WhyUs />

        {/* Client Call to Action Banner */}
        <ClientCta onStartProject={handleStartProject} />

        {/* Contact & Project Inquiry Section */}
        <Contact preselectedService={selectedService} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Case Study Lightbox Modal */}
      <ProjectModal
        project={activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
      />

      {/* Admin Access / Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
