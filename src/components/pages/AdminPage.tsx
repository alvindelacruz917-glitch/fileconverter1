import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  QrCode,
  Upload,
  Users,
  Activity,
  MessageSquare,
  Save,
  CheckCircle2,
  Crown,
  Trash2,
  RefreshCw,
  Sparkles,
  Smartphone,
  Landmark,
  Key,
  Database,
  Lock,
  UserCheck,
  Plus,
  Minus,
  Star
} from 'lucide-react';
import { UserProfile, HistoryRecord, FeedbackItem } from '../../types/converter';
import {
  PaymentSettings,
  getPaymentSettings,
  savePaymentSettings,
  fetchPaymentSettingsFirestore
} from '../../utils/paymentSettings';
import {
  getStoredHistory,
  getStoredFeedback,
  getRegisteredUsers,
  updateRegisteredUserCredits,
  updateRegisteredUserPlan,
  deleteRegisteredUser,
  RegisteredAccount
} from '../../utils/storage';

interface AdminPageProps {
  currentUser: UserProfile | null;
  onUpdateCurrentUser: (user: UserProfile) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  theme: 'dark' | 'light';
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onShowToast,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'payment' | 'users' | 'conversions' | 'feedback'>('payment');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(getPaymentSettings());
  const [qrFilePreview, setQrFilePreview] = useState<string | null>(null);
  const [mayaQrPreview, setMayaQrPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Stats, logs & registered user accounts
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredAccount[]>([]);
  const [customCreditInputs, setCustomCreditInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Fetch latest payment settings and users
    fetchPaymentSettingsFirestore().then((res) => setPaymentSettings(res));
    setHistory(getStoredHistory());
    setFeedbacks(getStoredFeedback());
    setRegisteredUsers(getRegisteredUsers());
  }, []);

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'gcash' | 'maya') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Invalid file format! Please upload an image file (PNG/JPG/WEBP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const result = evt.target?.result as string;
      let updated: PaymentSettings;
      if (target === 'gcash') {
        setQrFilePreview(result);
        updated = { ...paymentSettings, gcashQrCode: result };
      } else {
        setMayaQrPreview(result);
        updated = { ...paymentSettings, mayaQrCode: result };
      }
      setPaymentSettings(updated);
      await savePaymentSettings(updated);
      onShowToast(`Auto-updated & broadcasted new ${target.toUpperCase()} QR Code image!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQrCode = async (target: 'gcash' | 'maya') => {
    let updated: PaymentSettings;
    if (target === 'gcash') {
      setQrFilePreview(null);
      updated = { ...paymentSettings, gcashQrCode: '' };
    } else {
      setMayaQrPreview(null);
      updated = { ...paymentSettings, mayaQrCode: '' };
    }
    setPaymentSettings(updated);
    await savePaymentSettings(updated);
    onShowToast(`Removed ${target.toUpperCase()} QR Code image successfully!`, 'info');
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await savePaymentSettings(paymentSettings);
      setIsSaving(false);
      onShowToast('Payment Settings & QR Codes saved successfully!', 'success');
    } catch (err) {
      setIsSaving(false);
      onShowToast('Error saving payment settings.', 'error');
    }
  };

  const handleAdjustCredits = (userId: string, currentCredits: number, delta: number) => {
    const newCount = Math.max(0, currentCredits + delta);
    const updated = updateRegisteredUserCredits(userId, newCount);
    setRegisteredUsers(updated);
    onShowToast(`Updated user credits to ${newCount}!`, 'success');
  };

  const handleSetCustomCredits = (userId: string) => {
    const valStr = customCreditInputs[userId];
    const valNum = parseInt(valStr, 10);
    if (isNaN(valNum) || valNum < 0) {
      onShowToast('Please enter a valid credit number.', 'error');
      return;
    }
    const updated = updateRegisteredUserCredits(userId, valNum);
    setRegisteredUsers(updated);
    setCustomCreditInputs({ ...customCreditInputs, [userId]: '' });
    onShowToast(`Set user credits to ${valNum}!`, 'success');
  };

  const handleToggleUserPlan = (userId: string, currentPlan?: string) => {
    const nextPlan = currentPlan === 'PRO' ? 'FREE' : 'PRO';
    const updated = updateRegisteredUserPlan(userId, nextPlan);
    setRegisteredUsers(updated);
    onShowToast(`Updated user plan to ${nextPlan}!`, 'success');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      const updated = deleteRegisteredUser(userId);
      setRegisteredUsers(updated);
      onShowToast('User account deleted.', 'info');
    }
  };

  const handleToggleAdminStatus = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      isAdmin: !currentUser.isAdmin,
    };
    onUpdateCurrentUser(updated);
    onShowToast(
      updated.isAdmin
        ? 'Naka-activate na ang Admin privileges sa account mo!'
        : 'Na-off na ang Admin mode.',
      'info'
    );
  };

  const handleGrantPro = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      plan: 'PRO',
      subscriptionDate: new Date().toLocaleDateString(),
      subscriptionExpiry: 'Lifetime (Admin Granted)',
    };
    onUpdateCurrentUser(updated);
    onShowToast('Na-grant ang VIP PRO UNLIMITED access!', 'success');
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
              Admin Access Mode
            </span>
            <span className="text-xs text-slate-400 font-bold">System Manager</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 mt-1">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            I-manage ang GCash QR Code, Subscription payment details, User permissions, at system logs.
          </p>
        </div>

        {/* Quick Admin Privileges Actions */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Admin ✓</span>
          </div>

          <button
            onClick={handleGrantPro}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 shadow-md"
          >
            <Crown className="w-4 h-4 fill-slate-950" />
            <span>Grant Self VIP PRO</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {[
          { id: 'payment', label: 'GCash / Payment Settings', icon: QrCode },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'conversions', label: 'Conversion Logs', icon: Activity },
          { id: 'feedback', label: 'User Feedback', icon: MessageSquare },
        ].map((tab) => {
          const IconComp = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PAYMENT METHOD & QR CODE MANAGER */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSavePaymentSettings} className="space-y-6">
          <div
            className={`p-6 rounded-3xl border space-y-6 ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80 shadow-md' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Subscription Payment Methods & QR Codes
                  </h3>
                  <p className="text-xs text-slate-400">
                    I-configure ang GCash QR Code picture, GCash mobile number, at Bank details na lalabas sa Subscription modal ng mga users.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Payment Settings'}</span>
              </button>
            </div>

            {/* GCash QR Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400">
                  <Smartphone className="w-5 h-5" />
                  <span>GCash Payment Configuration</span>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-400">GCash Account Name</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.gcashName}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, gcashName: e.target.value })
                    }
                    placeholder="ALVIN D."
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-400">GCash Mobile / Account Number</label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.gcashNumber}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, gcashNumber: e.target.value })
                    }
                    placeholder="0917 123 4567"
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-400">Upload / Remove GCash QR Code Image</label>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold flex items-center gap-2 border border-blue-500/20">
                      <Upload className="w-4 h-4" />
                      <span>Choose QR Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleQrImageUpload(e, 'gcash')}
                        className="hidden"
                      />
                    </label>

                    {(qrFilePreview || paymentSettings.gcashQrCode) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQrCode('gcash')}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 border border-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove QR Image</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">
                  Live User Preview
                </span>
                <div className="w-44 h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src={qrFilePreview || paymentSettings.gcashQrCode}
                    alt="GCash QR Code"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    {paymentSettings.gcashName || 'GCash Name'}
                  </p>
                  <p className="font-mono text-blue-600 dark:text-blue-400 font-black">
                    {paymentSettings.gcashNumber || '0917 000 0000'}
                  </p>
                </div>
              </div>
            </div>

            {/* Maya / PayMaya Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                  <span>Maya / PayMaya Configuration</span>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-400">Maya Account Name</label>
                  <input
                    type="text"
                    value={paymentSettings.mayaName}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, mayaName: e.target.value })
                    }
                    placeholder="ALVIN D."
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-400">Maya Mobile Number</label>
                  <input
                    type="text"
                    value={paymentSettings.mayaNumber}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, mayaNumber: e.target.value })
                    }
                    placeholder="0918 987 6543"
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-400">Upload / Remove Maya QR Image</label>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                      <Upload className="w-4 h-4" />
                      <span>Choose Maya QR</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleQrImageUpload(e, 'maya')}
                        className="hidden"
                      />
                    </label>

                    {(mayaQrPreview || paymentSettings.mayaQrCode) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQrCode('maya')}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 border border-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove QR Image</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Maya QR Preview
                </span>
                <div className="w-44 h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src={mayaQrPreview || paymentSettings.mayaQrCode}
                    alt="Maya QR Code"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    {paymentSettings.mayaName || 'Maya Name'}
                  </p>
                  <p className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
                    {paymentSettings.mayaNumber || '0918 000 0000'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Transfer Configuration */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-amber-500">
                <Landmark className="w-5 h-5" />
                <span>Direct Bank Transfer Details</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-400">Bank Name</label>
                  <input
                    type="text"
                    value={paymentSettings.bankName}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, bankName: e.target.value })
                    }
                    placeholder="BDO / BPI / UnionBank"
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-400">Account Name</label>
                  <input
                    type="text"
                    value={paymentSettings.bankAccountName}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, bankAccountName: e.target.value })
                    }
                    placeholder="Universal Converter Corp"
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-400">Account Number</label>
                  <input
                    type="text"
                    value={paymentSettings.bankAccountNumber}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, bankAccountNumber: e.target.value })
                    }
                    placeholder="001234567890"
                    className={`w-full mt-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold outline-none border ${
                      theme === 'dark'
                        ? 'bg-[#0F172A] border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-400">
                Payment Instructions (Lalabas sa Payment Dialog)
              </label>
              <textarea
                rows={3}
                value={paymentSettings.instructions}
                onChange={(e) =>
                  setPaymentSettings({ ...paymentSettings, instructions: e.target.value })
                }
                placeholder="I-scan ang QR code..."
                className={`w-full p-3 rounded-2xl text-xs outline-none border ${
                  theme === 'dark'
                    ? 'bg-[#0F172A] border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: USER MANAGEMENT & CREDIT BOOSTING */}
      {activeTab === 'users' && (
        <div
          className={`p-6 rounded-3xl border space-y-6 ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>Registered Accounts & Daily Credits ({registeredUsers.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                View user accounts, adjust daily conversion credits, and grant PRO permissions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Default New Quota: 5 Credits
              </span>
            </div>
          </div>

          {registeredUsers.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-500 mx-auto opacity-40" />
              <p className="text-xs text-slate-400">No registered user accounts found yet. New signups will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredUsers.map((user) => {
                const credits = typeof user.credits === 'number' ? user.credits : 5;
                return (
                  <div
                    key={user.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {user.name}
                          </h4>
                          {(user.email?.toLowerCase() === 'alvindelacruz917@gmail.com' || user.isAdmin) && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-500 border border-rose-500/30">
                              ADMIN
                            </span>
                          )}
                          {user.plan === 'PRO' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30">
                              PRO PLAN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-400">
                              FREE USER
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-400">{user.email}</p>
                        <p className="text-[10px] text-slate-500">
                          Registered: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Credit Control & Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                      <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-extrabold leading-none">Credits</p>
                          <p className="text-xs font-mono font-black text-amber-500">{credits} Available</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustCredits(user.id, credits, -1)}
                          className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-white hover:bg-rose-500 transition-colors"
                          title="Deduct 1 credit"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjustCredits(user.id, credits, 5)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-xs font-extrabold border border-emerald-500/20"
                          title="Add +5 credits"
                        >
                          +5 Credits
                        </button>
                        <button
                          onClick={() => handleAdjustCredits(user.id, credits, 10)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all text-xs font-extrabold border border-blue-500/20"
                          title="Add +10 credits"
                        >
                          +10 Credits
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="Set #"
                          value={customCreditInputs[user.id] || ''}
                          onChange={(e) => setCustomCreditInputs({ ...customCreditInputs, [user.id]: e.target.value })}
                          className={`w-16 px-2.5 py-1.5 rounded-lg text-xs font-mono outline-none border ${
                            theme === 'dark' ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <button
                          onClick={() => handleSetCustomCredits(user.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition-colors"
                        >
                          Set
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleUserPlan(user.id, user.plan)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          user.plan === 'PRO'
                            ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {user.plan === 'PRO' ? 'Revoke PRO' : 'Grant PRO'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONVERSION LOGS */}
      {activeTab === 'conversions' && (
        <div
          className={`p-6 rounded-3xl border space-y-6 ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>Global System Conversion Logs</span>
              </h3>
              <p className="text-xs text-slate-400">Total recorded conversions: {history.length}</p>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Wala pang conversion records.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900/60 uppercase font-bold text-slate-400">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Tool</th>
                    <th className="p-3">Output File</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td className="p-3 font-mono text-slate-400">{h.timestamp}</td>
                      <td className="p-3 font-bold">{h.toolName}</td>
                      <td className="p-3 font-mono text-blue-500">{h.outputName}</td>
                      <td className="p-3 text-emerald-500 font-bold">{h.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USER FEEDBACK */}
      {activeTab === 'feedback' && (
        <div
          className={`p-6 rounded-3xl border space-y-6 ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span>User Feedback & Reviews ({feedbacks.length})</span>
            </h3>
          </div>

          {feedbacks.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Wala pang user feedback na na-receive.</p>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{f.name} ({f.email})</span>
                    <span className="text-[10px] font-mono text-slate-400">{f.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{f.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
