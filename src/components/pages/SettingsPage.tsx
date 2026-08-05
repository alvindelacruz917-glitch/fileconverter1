import React from 'react';
import { AppSettings } from '../../types/converter';
import { Settings as SettingsIcon, Moon, Sun, Palette, Folder, Volume2, Check } from 'lucide-react';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onSuccessToast: (msg: string) => void;
  theme: 'dark' | 'light';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onSuccessToast,
  theme,
}) => {
  const accentColors = [
    { name: 'Royal Blue', hex: '#2563EB' },
    { name: 'Purple Accent', hex: '#7C3AED' },
    { name: 'Emerald Green', hex: '#10B981' },
    { name: 'Sky Cyan', hex: '#0EA5E9' },
    { name: 'Rose Pink', hex: '#EC4899' },
  ];

  const handleSave = () => {
    onSuccessToast('Settings updated and saved successfully!');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          <span>Application Settings</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize conversion preferences, themes, sound effects, and default directories
        </p>
      </div>

      <div
        className={`p-8 rounded-[24px] border space-y-8 ${
          theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
        }`}
      >
        {/* Theme Setting */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <span>Appearance Theme</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Toggle between Dark and Light visual themes</p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                settings.theme === 'dark'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark Mode
            </button>
            <button
              onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                settings.theme === 'light'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              Light Mode
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              <span>Accent Theme Color</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Choose primary highlight accent color</p>
          </div>

          <div className="flex items-center gap-3">
            {accentColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => onUpdateSettings({ ...settings, accentColor: color.hex })}
                style={{ backgroundColor: color.hex }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform ${
                  settings.accentColor === color.hex ? 'scale-125 ring-4 ring-blue-500/30' : 'hover:scale-110'
                }`}
                title={color.name}
              >
                {settings.accentColor === color.hex && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Output Directory */}
        <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-500" />
            <span>Default Output Folder</span>
          </h3>
          <p className="text-xs text-slate-400">Target path for converted file downloads</p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={settings.outputFolder}
              onChange={(e) => onUpdateSettings({ ...settings, outputFolder: e.target.value })}
              className={`w-full p-3 rounded-xl border text-sm font-mono outline-none ${
                theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Preference Checkboxes */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoOpenOutput}
              onChange={(e) => onUpdateSettings({ ...settings, autoOpenOutput: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Auto open PDF / output file after conversion
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.rememberLastFolder}
              onChange={(e) => onUpdateSettings({ ...settings, rememberLastFolder: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Remember last used directory folder
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.rememberWindowSize}
              onChange={(e) => onUpdateSettings({ ...settings, rememberWindowSize: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Remember window geometry and state
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => onUpdateSettings({ ...settings, soundEffects: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              Enable completion sound notifications
            </span>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
