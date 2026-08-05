import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Toast } from './components/Toast';
import { HomePage } from './components/pages/HomePage';
import { CategoryToolsPage } from './components/pages/CategoryToolsPage';
import { ImageToPdfStudio } from './components/pages/ImageToPdfStudio';
import { GenericConverterPage } from './components/pages/GenericConverterPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { AboutPage } from './components/pages/AboutPage';
import { PricingPage } from './components/pages/PricingPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { FeedbackPage } from './components/pages/FeedbackPage';
import { AdminPage } from './components/pages/AdminPage';

import { AuthModal } from './components/modals/AuthModal';
import { PaymentModal } from './components/modals/PaymentModal';
import { NoCreditsModal } from './components/modals/NoCreditsModal';

import { PageView, ConverterTool, FileBatchItem, HistoryRecord, AppSettings, UserProfile, CreditState } from './types/converter';
import { ALL_TOOLS } from './data/tools';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredHistory,
  getStoredUser,
  getStoredCredits,
  logoutUser,
  consumeCredit,
} from './utils/storage';

import { auth, onAuthStateChanged, logOut } from './lib/firebase';

export default function App() {
  const [activeView, setActiveView] = useState<PageView>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ConverterTool | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(getStoredHistory());
  const [toastMsg, setToastMsg] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const [droppedFiles, setDroppedFiles] = useState<FileBatchItem[]>([]);

  // User & Credits State
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [credits, setCredits] = useState<CreditState>(getStoredCredits());

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const currentUserProfile: UserProfile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
          email: fbUser.email || 'user@example.com',
          plan: user?.plan || 'FREE',
          subscriptionDate: user?.subscriptionDate || new Date().toLocaleDateString(),
        };
        setUser(currentUserProfile);
      }
    });
    return () => unsubscribe();
  }, []);

  // Modals visibility
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);

  // Apply Dark/Light theme to html class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveStoredSettings(settings);
  }, [settings]);

  // Keep credits updated
  useEffect(() => {
    setCredits(getStoredCredits());
  }, [user]);

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg({ message, type });
  };

  const handleSelectTool = (tool: ConverterTool, files?: FileList | File[]) => {
    // Check credit limits for free users
    const isPro = user?.plan === 'PRO';
    if (!isPro && credits.remaining <= 0) {
      setShowNoCreditsModal(true);
      return;
    }

    setSelectedTool(tool);
    if (files) {
      const batch: FileBatchItem[] = Array.from(files).map((f) => ({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
        status: 'pending',
        progress: 0,
      }));
      setDroppedFiles(batch);
    } else {
      setDroppedFiles([]);
    }

    if (tool.id === 'img_to_pdf') {
      setActiveView('img_to_pdf_studio');
    } else {
      setActiveView('converter');
    }
  };

  const handleFilesDroppedFromHome = (files: FileList | File[], targetToolId?: string) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    let matchedTool: ConverterTool | undefined;
    if (targetToolId) {
      matchedTool = ALL_TOOLS.find((t) => t.id === targetToolId);
    }

    if (!matchedTool) {
      const first = fileArray[0];
      const ext = first.name.substring(first.name.lastIndexOf('.')).toLowerCase();
      matchedTool = ALL_TOOLS.find((t) => t.acceptedTypes.includes(ext));
    }

    if (!matchedTool) matchedTool = ALL_TOOLS[0]; // Fallback Image to PDF

    handleSelectTool(matchedTool, files);
  };

  const handleRefreshHistory = () => {
    setHistoryRecords(getStoredHistory());
    // Also update credits after conversion
    const isPro = user?.plan === 'PRO';
    if (!isPro) {
      const updatedCreds = consumeCredit();
      setCredits(updatedCreds);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    logoutUser();
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <div
      className={`h-screen flex overflow-hidden font-sans antialiased transition-colors duration-200 ${
        settings.theme === 'dark' ? 'bg-[#0F172A] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setSelectedTool(null);
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        theme={settings.theme}
        isPro={user?.plan === 'PRO'}
        isAdmin={user?.isAdmin}
      />

      {/* Main Content Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={settings.theme}
          toggleTheme={toggleTheme}
          onOpenSettings={() => {
            setActiveView('settings');
            setSelectedTool(null);
          }}
          onSelectTool={handleSelectTool}
          user={user}
          credits={credits}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenProfile={() => setActiveView('profile')}
          onOpenPricing={() => setActiveView('pricing')}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeView === 'home' && (
            <HomePage
              onSelectTool={handleSelectTool}
              onFilesDropped={handleFilesDroppedFromHome}
              searchQuery={searchQuery}
              theme={settings.theme}
              onOpenPricing={() => setActiveView('pricing')}
              onOpenPayment={() => setShowPaymentModal(true)}
              isPro={user?.plan === 'PRO'}
            />
          )}

          {activeView === 'pdf_tools' && (
            <CategoryToolsPage
              category="pdf"
              title="PDF Tools"
              description="Convert, merge, split, compress, and edit PDF documents"
              onSelectTool={handleSelectTool}
              theme={settings.theme}
            />
          )}

          {activeView === 'image_tools' && (
            <CategoryToolsPage
              category="image"
              title="Image Tools"
              description="Convert formats, resize, compress, crop, rotate, flip, and watermark images"
              onSelectTool={handleSelectTool}
              theme={settings.theme}
            />
          )}

          {activeView === 'doc_tools' && (
            <CategoryToolsPage
              category="document"
              title="Document Tools"
              description="Convert Word DOCX, plain text, HTML, Excel XLSX, and CSV data"
              onSelectTool={handleSelectTool}
              theme={settings.theme}
            />
          )}

          {activeView === 'img_to_pdf_studio' && (
            <ImageToPdfStudio
              initialFiles={droppedFiles}
              onBack={() => setActiveView('home')}
              onSuccessToast={(msg) => {
                showToast(msg);
                handleRefreshHistory();
              }}
              theme={settings.theme}
            />
          )}

          {activeView === 'converter' && selectedTool && (
            <GenericConverterPage
              tool={selectedTool}
              initialFiles={droppedFiles}
              onBack={() => setActiveView('home')}
              onSuccessToast={(msg) => {
                showToast(msg);
                handleRefreshHistory();
              }}
              theme={settings.theme}
              outputFolder={settings.outputFolder}
            />
          )}

          {activeView === 'history' && (
            <HistoryPage
              historyRecords={historyRecords}
              onRefreshHistory={handleRefreshHistory}
              theme={settings.theme}
            />
          )}

          {activeView === 'pricing' && (
            <PricingPage
              user={user}
              onOpenPayment={() => setShowPaymentModal(true)}
              theme={settings.theme}
            />
          )}

          {activeView === 'profile' && (
            <ProfilePage
              user={user}
              credits={credits}
              history={historyRecords}
              onLogout={handleLogout}
              onOpenAuth={() => setShowAuthModal(true)}
              onOpenPricing={() => setActiveView('pricing')}
              theme={settings.theme}
            />
          )}

          {activeView === 'feedback' && (
            <FeedbackPage
              user={user}
              onSuccessToast={showToast}
              theme={settings.theme}
            />
          )}

          {activeView === 'admin' && (
            user?.isAdmin ? (
              <AdminPage
                currentUser={user}
                onUpdateCurrentUser={setUser}
                onShowToast={showToast}
                theme={settings.theme}
              />
            ) : (
              <div className="p-12 max-w-md mx-auto text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                  <span className="font-black text-2xl">🔒</span>
                </div>
                <h2 className="text-2xl font-black text-red-500">Access Restricted</h2>
                <p className="text-xs text-slate-400">
                  Ang Admin Panel ay para lamang sa opisyal na Admin ng Universal Converter.
                </p>
                <button
                  onClick={() => setActiveView('home')}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  Bumalik sa Home
                </button>
              </div>
            )
          )}

          {activeView === 'settings' && (
            <SettingsPage
              settings={settings}
              onUpdateSettings={setSettings}
              onSuccessToast={showToast}
              theme={settings.theme}
            />
          )}

          {activeView === 'about' && (
            <AboutPage
              theme={settings.theme}
              onOpenFeedback={() => setActiveView('feedback')}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccessLogin={(loggedInUser) => {
          setUser(loggedInUser);
          showToast(`Welcome back, ${loggedInUser.name}!`);
        }}
        theme={settings.theme}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        currentUser={user}
        onPaymentSuccess={(proUser) => {
          setUser(proUser);
          showToast('PRO UNLIMITED activated successfully!', 'success');
        }}
        theme={settings.theme}
      />

      <NoCreditsModal
        isOpen={showNoCreditsModal}
        onClose={() => setShowNoCreditsModal(false)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenPricing={() => setActiveView('pricing')}
        theme={settings.theme}
      />

      {/* Floating Toast Alert */}
      {toastMsg && (
        <Toast message={toastMsg.message} type={toastMsg.type} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
}

