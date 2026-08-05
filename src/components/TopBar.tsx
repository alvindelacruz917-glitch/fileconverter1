import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Settings, Menu, ArrowRight, X, Star, Crown, LogIn, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ConverterTool, UserProfile, CreditState } from '../types/converter';
import { ALL_TOOLS } from '../data/tools';
import { filterAndSortTools } from '../utils/searchUtils';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenSettings: () => void;
  onSelectTool?: (tool: ConverterTool) => void;
  user: UserProfile | null;
  credits: CreditState;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenPricing: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  onOpenSettings,
  onSelectTool,
  user,
  credits,
  onOpenAuth,
  onOpenProfile,
  onOpenPricing,
  onToggleMobileMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isPro = user?.plan === 'PRO';
  const matchedTools = filterAndSortTools(ALL_TOOLS, searchQuery);

  useEffect(() => {
    setIsOpen(searchQuery.trim().length > 0);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const displayedTools = matchedTools.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleToolClick = (tool: ConverterTool) => {
    setIsOpen(false);
    setSearchQuery('');
    if (onSelectTool) {
      onSelectTool(tool);
    }
  };

  return (
    <header
      className={`h-16 sm:h-20 px-3 sm:px-6 md:px-8 flex items-center justify-between gap-2 border-b select-none transition-colors duration-200 z-30 sticky top-0 shrink-0 backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-[#0B0F19]/90 border-white/10 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}
    >
      {/* Mobile Menu Button & Search Input Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className={`p-2 rounded-2xl border transition-all md:hidden shrink-0 ${
              theme === 'dark'
                ? 'bg-[#141A26] border-white/10 text-white hover:bg-white/10'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div ref={containerRef} className="relative w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsOpen(searchQuery.trim().length > 0)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(e.target.value.trim().length > 0);
              }}
              placeholder="Search tools..."
              className={`w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all outline-none border ${
                theme === 'dark'
                  ? 'bg-[#141A26] border-white/10 text-white placeholder-[#B5BDD1] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ULTRA-MODERN LIVE POPUP DROPDOWN */}
          {isOpen && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 rounded-3xl border shadow-2xl overflow-hidden z-50 animate-fade-in backdrop-blur-2xl ${
                theme === 'dark'
                  ? 'bg-[#141A26] border-white/10 text-white shadow-black/80'
                  : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
              }`}
            >
              {/* Header with Category Filter Tabs */}
              <div className="p-3 border-b border-inherit bg-[#0B0F19]/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#B5BDD1]">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Found {displayedTools.length} Tools</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#B5BDD1] bg-white/5 px-2 py-0.5 rounded-md border border-white/10 hidden sm:inline-block">
                    Press ↵ to Open
                  </span>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pdf', label: 'PDF' },
                    { id: 'image', label: 'Image' },
                    { id: 'document', label: 'Docs' },
                    { id: 'utility', label: 'Utility' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white/5 text-[#B5BDD1] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tool List Items */}
              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                {displayedTools.length > 0 ? (
                  displayedTools.map((tool) => {
                    const IconComp = (LucideIcons as any)[tool.icon] || LucideIcons.File;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => handleToolClick(tool)}
                        className={`p-2.5 sm:p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all transform hover:scale-[1.005] group ${
                          theme === 'dark'
                            ? 'hover:bg-[#1B2435] text-white border border-transparent hover:border-blue-500/30'
                            : 'hover:bg-blue-50/80 text-slate-900 border border-transparent hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-sm group-hover:scale-105 transition-transform">
                            <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                                {tool.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 text-[#B5BDD1] shrink-0">
                                {tool.category}
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-[#B5BDD1] truncate mt-0.5">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-[#B5BDD1] font-medium space-y-1">
                    <p>No converters found in "{selectedCategory}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* OFFLINE LOCAL ENGINE BADGE */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0"
          title="100% Client-side local conversion engine"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>100% Offline</span>
        </div>

        {/* CREDITS DISPLAY BADGE */}
        {isPro ? (
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-black bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm hover:scale-105 transition-transform"
            title="Pro Subscription Active - Unlimited File Conversions"
          >
            <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">PRO UNLIMITED</span>
            <span className="sm:hidden">PRO</span>
          </button>
        ) : (
          <button
            onClick={onOpenPricing}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
            title="Daily Free Credits"
          >
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
            <span>{credits.remaining}/{credits.max}</span>
          </button>
        )}

        {/* USER AUTH / PROFILE BUTTON */}
        {user ? (
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl border font-bold text-xs transition-all ${
              theme === 'dark'
                ? 'bg-[#141A26] border-white/10 text-white hover:border-blue-500'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-600'
            }`}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[80px] sm:max-w-[100px] truncate hidden md:inline">{user.name}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-[#141A26] border-white/10 text-amber-400 hover:bg-white/10'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={`p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-[#141A26] border-white/10 text-[#B5BDD1] hover:text-white hover:bg-white/10'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
