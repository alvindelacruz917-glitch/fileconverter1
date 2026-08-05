import React from 'react';
import {
  Home,
  FileText,
  Image as ImageIcon,
  FolderArchive,
  History,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
  User,
  MessageSquare,
  ShieldCheck,
  X,
} from 'lucide-react';
import { PageView } from '../types/converter';

interface SidebarProps {
  activeView: PageView;
  setActiveView: (view: PageView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  isPro?: boolean;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  theme,
  isPro = false,
  isAdmin = false,
}) => {
  const navItems = [
    { id: 'home' as PageView, label: 'Home', icon: Home, badge: null },
    { id: 'pdf_tools' as PageView, label: 'PDF Tools', icon: FileText, badge: '22' },
    { id: 'image_tools' as PageView, label: 'Image Tools', icon: ImageIcon, badge: '19' },
    { id: 'doc_tools' as PageView, label: 'Document Tools', icon: FolderArchive, badge: '6' },
    ...(isAdmin ? [{ id: 'admin' as PageView, label: 'Admin Panel', icon: ShieldCheck, badge: 'ADMIN' }] : []),
    { id: 'pricing' as PageView, label: 'PRO Pricing', icon: Crown, badge: isPro ? 'ACTIVE' : 'PRO' },
    { id: 'profile' as PageView, label: 'Profile', icon: User, badge: null },
    { id: 'history' as PageView, label: 'History', icon: History, badge: null },
    { id: 'settings' as PageView, label: 'Settings', icon: Settings, badge: null },
    { id: 'feedback' as PageView, label: 'Feedback', icon: MessageSquare, badge: null },
    { id: 'about' as PageView, label: 'About Developer', icon: Info, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r select-none shrink-0 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'} ${
          theme === 'dark'
            ? 'bg-[#0B0F19] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Top Header Logo in Sidebar */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-inherit shrink-0">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div className="overflow-hidden min-w-0">
                <h1 className="font-extrabold text-sm leading-tight tracking-tight text-slate-900 dark:text-white truncate">
                  Universal Converter
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    PRO
                  </span>
                  <span className="text-[10px] font-semibold text-[#B5BDD1] truncate">
                    by Alvin
                  </span>
                </div>
              </div>
            </div>
          )}

          {collapsed && !mobileOpen && (
            <div className="mx-auto w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Zap className="w-6 h-6 fill-current" />
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 md:hidden"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden md:block ${
              collapsed ? 'mx-auto' : ''
            }`}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            const isPricing = item.id === 'pricing';
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 group relative ${
                  isActive
                    ? isPricing
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : theme === 'dark'
                    ? 'hover:bg-[#141A26] text-[#B5BDD1] hover:text-white'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  } ${isPricing && !isActive ? 'text-amber-400' : ''}`}
                />
                {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}

                {(!collapsed || mobileOpen) && item.badge && (
                  <span
                    className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      item.badge === 'PRO' || item.badge === 'ACTIVE'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : isActive
                        ? 'bg-white/20 text-white'
                        : theme === 'dark'
                        ? 'bg-[#141A26] text-[#B5BDD1] border border-white/10'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active Bar Indicator */}
                {isActive && (
                  <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${isPricing ? 'bg-amber-300' : 'bg-white'}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Branding Tag */}
        {(!collapsed || mobileOpen) && (
          <div className="p-4 m-3 rounded-2xl bg-[#141A26] text-center border border-white/10 space-y-1 shrink-0">
            <p className="text-xs font-black text-white">
              Universal Converter Pro
            </p>
            <p className="text-[11px] font-extrabold text-blue-400">
              Developed by Alvin
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
