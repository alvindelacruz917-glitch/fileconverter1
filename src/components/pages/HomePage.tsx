import React, { useState, useRef, useEffect } from 'react';
import { DropZone } from '../DropZone';
import { ToolCard } from '../ToolCard';
import { ConverterTool } from '../../types/converter';
import { ALL_TOOLS, POPULAR_TOOLS } from '../../data/tools';
import { filterAndSortTools } from '../../utils/searchUtils';
import * as LucideIcons from 'lucide-react';
import {
  Zap,
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Flame,
  Infinity as InfinityIcon,
  ChevronDown,
  ArrowRight,
  X,
  Star,
  Lock,
  FileCheck,
  Search,
  Check,
} from 'lucide-react';

interface HomePageProps {
  onSelectTool: (tool: ConverterTool, files?: FileList | File[]) => void;
  onFilesDropped: (files: FileList | File[], targetToolId?: string) => void;
  searchQuery: string;
  theme: 'dark' | 'light';
  onOpenPricing: () => void;
  onOpenPayment: () => void;
  isPro: boolean;
}

// Custom Ultra-Modern Tool Selector Dropdown
const CustomToolDropdown: React.FC<{
  selectedToolId: string;
  onSelect: (toolId: string) => void;
  theme: 'dark' | 'light';
}> = ({ selectedToolId, onSelect, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTool = ALL_TOOLS.find((t) => t.id === selectedToolId) || ALL_TOOLS[0];
  const CurrentIcon = (LucideIcons as any)[currentTool.icon] || LucideIcons.File;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTools = ALL_TOOLS.filter((t) => {
    const matchesCat = selectedCat === 'all' || t.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesQuery =
      t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div ref={dropdownRef} className="relative flex-1 min-w-[280px]">
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-2xl border font-bold text-sm flex items-center justify-between gap-3 transition-all duration-200 outline-none ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
            : theme === 'dark'
            ? 'bg-[#1E293B] border-slate-700 text-white hover:border-slate-600'
            : 'bg-white border-slate-300 text-slate-900 hover:border-slate-400 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center shrink-0 font-bold border border-blue-500/20">
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div className="text-left truncate">
            <div className="font-extrabold text-xs sm:text-sm truncate">{currentTool.name}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {currentTool.category} Converter
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 hidden sm:inline">
            Change
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-500' : ''
            }`}
          />
        </div>
      </button>

      {/* DROPDOWN POPUP MENU */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 right-0 mt-2.5 rounded-2xl border shadow-2xl z-50 overflow-hidden animate-fade-in backdrop-blur-2xl ${
            theme === 'dark'
              ? 'bg-[#1E293B]/95 border-slate-700/90 text-white shadow-blue-900/30'
              : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-300/60'
          }`}
        >
          {/* Header Search & Filter Pills */}
          <div className="p-3 border-b border-inherit bg-slate-500/5 space-y-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter tools..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none border transition-all ${
                  theme === 'dark'
                    ? 'bg-[#0F172A] border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600'
                }`}
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'pdf', label: 'PDF' },
                { id: 'image', label: 'Image' },
                { id: 'document', label: 'Docs' },
                { id: 'utility', label: 'Utility' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all shrink-0 ${
                    selectedCat === cat.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-500/10 text-slate-400 hover:text-slate-200 hover:bg-slate-500/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid List */}
          <div className="p-1.5 max-h-72 overflow-y-auto space-y-1">
            {filteredTools.length > 0 ? (
              filteredTools.map((t) => {
                const IconComp = (LucideIcons as any)[t.icon] || LucideIcons.File;
                const isSelected = t.id === selectedToolId;

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelect(t.id);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'bg-blue-600/15 border border-blue-500/30 text-blue-500 font-extrabold'
                        : theme === 'dark'
                        ? 'hover:bg-slate-800 text-slate-200'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold truncate">{t.name}</span>
                          <span className="px-1 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-slate-500/15 text-slate-400">
                            {t.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">No converter tools match</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface HomePageProps {
  onSelectTool: (tool: ConverterTool, files?: FileList | File[]) => void;
  onFilesDropped: (files: FileList | File[], targetToolId?: string) => void;
  searchQuery: string;
  theme: 'dark' | 'light';
  onOpenPricing: () => void;
  onOpenPayment: () => void;
  isPro: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onFilesDropped,
  searchQuery,
  theme,
  onOpenPricing,
  onOpenPayment,
  isPro,
}) => {
  const [selectedToolId, setSelectedToolId] = useState<string>('img_to_pdf');

  // Filter tools by search query
  const filteredTools = searchQuery ? filterAndSortTools(ALL_TOOLS, searchQuery) : [];

  const currentTargetTool = ALL_TOOLS.find((t) => t.id === selectedToolId) || ALL_TOOLS[0];

  const handleDropWithTarget = (files: FileList | File[]) => {
    onFilesDropped(files, selectedToolId);
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8 sm:space-y-12 animate-fade-in">
      {/* If Search Active, Display Search Results */}
      {searchQuery ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Search Results ({filteredTools.length})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Matching converters sorted by first letter prefix
              </p>
            </div>
          </div>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onClick={onSelectTool} theme={theme} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-100 dark:bg-slate-800/50">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No converter tools found matching "{searchQuery}"
              </p>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* LARGE HERO SECTION WITH CONVERTER SELECTOR */}
          <section
            className={`relative overflow-hidden rounded-[28px] p-8 md:p-12 border transition-all ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] border-slate-700/80 shadow-2xl'
                : 'bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border-slate-200 shadow-xl'
            }`}
          >
            {/* Background Accent Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Header Badge & Title */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Universal Converter Pro • Developed by Alvin</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                    Convert Files Instantly
                  </h1>

                  <p className="text-sm md:text-base font-semibold text-slate-500 dark:text-slate-300 flex items-center gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">Fast Engine</span> •{' '}
                    <span className="text-emerald-500 font-bold">100% Offline Security</span> •{' '}
                    <span className="text-amber-500 font-bold">Unlimited Batch Processing</span>
                  </p>
                </div>

                {/* Pro VIP Marketing Trigger Badge */}
                <button
                  onClick={onOpenPricing}
                  className="self-start md:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2.5 transition-all transform hover:scale-[1.02]"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>{isPro ? 'PRO UNLIMITED ACTIVE' : 'UPGRADE TO PRO UNLIMITED'}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CONVERTER SELECTOR (Choose converter before dropping) */}
              <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-500" />
                    <span>Step 1: Select Target Converter Tool</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Selected: <strong className="text-blue-500">{currentTargetTool.name}</strong>
                  </span>
                </div>

                {/* Dropdown Tool Selector & Preset Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <CustomToolDropdown
                    selectedToolId={selectedToolId}
                    onSelect={(id) => {
                      setSelectedToolId(id);
                      const toolObj = ALL_TOOLS.find((t) => t.id === id);
                      if (toolObj) onSelectTool(toolObj);
                    }}
                    theme={theme}
                  />

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'image_bg_remove', label: '✂️ Remove BG' },
                      { id: 'img_to_pdf', label: '🖼️ Image to PDF' },
                      { id: 'pdf_to_word', label: '📝 PDF to Word' },
                      { id: 'pdf_to_img', label: '🖼️ PDF to Image' },
                      { id: 'word_to_pdf', label: '📄 Word to PDF' },
                      { id: 'pdf_merge', label: '📑 PDF Merge' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          setSelectedToolId(btn.id);
                          const toolObj = ALL_TOOLS.find((t) => t.id === btn.id);
                          if (toolObj) onSelectTool(toolObj);
                        }}
                        className={`px-3.5 py-3 rounded-2xl text-xs font-extrabold border transition-all ${
                          selectedToolId === btn.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                            : theme === 'dark'
                            ? 'bg-[#1E293B] text-slate-300 border-slate-700 hover:bg-slate-800'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Large Drag & Drop Upload Area linked to Selected Converter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                  <span>Step 2: Upload or Drop Your Files</span>
                  <span>Target: {currentTargetTool.name}</span>
                </div>
                <DropZone
                  onFilesSelected={handleDropWithTarget}
                  subtitle={`Drop files to instantly launch ${currentTargetTool.name}`}
                  acceptedFormats={currentTargetTool.acceptedTypes.join(', ')}
                  theme={theme}
                />
              </div>
            </div>
          </section>

          {/* MARKETING PRO UNLIMITED SECTION */}
          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-[24px] p-8 md:p-10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    <Crown className="w-3.5 h-3.5 fill-amber-400" />
                    <span>PRO UNLIMITED SUBSCRIPTION</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    Convert Unlimited Files with Zero Limits
                  </h2>

                  <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                    Enjoy high-speed offline batch processing. Convert unlimited PDF pages, merge endless image documents, extract text via OCR, and export HD quality images without daily quota caps.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <InfinityIcon className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-white">Unlimited Files</div>
                      <div className="text-[10px] text-slate-400 font-medium">No daily limit</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-white">Faster Speed</div>
                      <div className="text-[10px] text-slate-400 font-medium">Multi-thread GPU</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <Crown className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-white">Priority Support</div>
                      <div className="text-[10px] text-slate-400 font-medium">Alvin Developer Help</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <div className="text-xs font-bold text-white">100% Offline</div>
                      <div className="text-[10px] text-slate-400 font-medium">Private & local</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-5 text-center">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
                      AFFORDABLE PRO SUBSCRIPTION
                    </div>
                    <div className="text-4xl font-black text-white">
                      ₱120 <span className="text-sm font-normal text-slate-300">/ month</span>
                    </div>
                    <p className="text-xs text-amber-300 font-bold">
                      Approx. $2.15 USD / mo (or ₱1,200 / yr)
                    </p>
                  </div>

                  <button
                    onClick={onOpenPayment}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                  >
                    <span>{isPro ? 'PRO Active - View Benefits' : 'Subscribe Now for ₱120/mo ($2.15 USD)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* POPULAR TOOLS SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                  POPULAR CONVERTERS
                </h2>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Most Frequently Used Tools
                </p>
              </div>
            </div>

            {/* Grid of Popular Tools Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {POPULAR_TOOLS.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onClick={onSelectTool} theme={theme} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
