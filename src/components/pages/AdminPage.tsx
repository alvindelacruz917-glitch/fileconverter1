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
  Star,
  Search,
  UserPlus,
  X
} from 'lucide-react';
import { UserProfile, HistoryRecord, FeedbackItem } from '../../types/converter';
import {
  PaymentSettings,
  getPaymentSettings,
  savePaymentSettings,
  fetchPaymentSettingsFirestore,
  DEFAULT_GCASH_QR,
  DEFAULT_MAYA_QR
} from '../../utils/paymentSettings';
import {
  getStoredHistory,
  getStoredFeedback,
  getRegisteredUsers,
  registerUserAccount,
  updateRegisteredUserCredits,
  updateRegisteredUserPlan,
  deleteRegisteredUser,
  RegisteredAccount
} from '../../utils/storage';
import {
  getAllFirestoreUsers,
  updateFirestoreUserCredits,
  updateFirestoreUserPlan,
  saveFirestoreUserDoc,
  FirestoreUserRecord
} from '../../lib/firebase';

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
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'ALL' | 'FREE' | 'PRO'>('ALL');
  const [customCreditInputs, setCustomCreditInputs] = useState<{ [key: string]: string }>({});

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserCredits, setNewUserCredits] = useState('10');
  const [newUserPlan, setNewUserPlan] = useState<'FREE' | 'PRO'>('FREE');

  const loadAllUsers = async () => {
    const localUsers = getRegisteredUsers();
    let fsUsers: FirestoreUserRecord[] = [];
    try {
      fsUsers = await getAllFirestoreUsers();
    } catch (e) {
      console.warn('Firestore fetch user notice:', e);
    }

    // Merge local and Firestore users cleanly
    const userMap = new Map<string, RegisteredAccount>();

    // Put local users first
    localUsers.forEach((u) => {
      userMap.set(u.id, u);
      if (u.email) userMap.set(u.email.toLowerCase(), u);
    });

    // Merge or add Firestore users
    fsUsers.forEach((fsU) => {
      const emailKey = fsU.email?.toLowerCase();
      const existing = (emailKey && userMap.get(emailKey)) || userMap.get(fsU.uid);
      if (existing) {
        existing.credits = typeof fsU.credits === 'number' ? fsU.credits : existing.credits;
        existing.plan = fsU.plan || existing.plan;
        existing.isAdmin = fsU.isAdmin || existing.isAdmin;
      } else {
        const merged: RegisteredAccount = {
          id: fsU.uid,
          name: fsU.displayName || fsU.email?.split('@')[0] || 'Member',
          email: fsU.email || '',
          passwordHash: 'cloud_account',
          createdAt: fsU.createdAt || new Date().toISOString(),
          credits: typeof fsU.credits === 'number' ? fsU.credits : 5,
          plan: fsU.plan || 'FREE',
          isAdmin: fsU.isAdmin
        };
        userMap.set(fsU.uid, merged);
      }
    });

    // Extract unique values
    const mergedList = Array.from(new Set(userMap.values()));
    setRegisteredUsers(mergedList);
  };

  useEffect(() => {
    // Fetch latest payment settings and users
    fetchPaymentSettingsFirestore().then((res) => setPaymentSettings(res));
    setHistory(getStoredHistory());
    setFeedbacks(getStoredFeedback());
    loadAllUsers();
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

  const handleAdjustCredits = async (userId: string, currentCredits: number, delta: number) => {
    const newCount = Math.max(0, currentCredits + delta);
    const updated = updateRegisteredUserCredits(userId, newCount);
    setRegisteredUsers(updated);

    // Sync to Firestore
    await updateFirestoreUserCredits(userId, newCount);
    onShowToast(`Credits updated successfully to ${newCount}!`, 'success');
  };

  const handleSetCustomCredits = async (userId: string) => {
    const valStr = customCreditInputs[userId];
    const valNum = parseInt(valStr, 10);
    if (isNaN(valNum) || valNum < 0) {
      onShowToast('Please enter a valid credit number.', 'error');
      return;
    }
    const updated = updateRegisteredUserCredits(userId, valNum);
    setRegisteredUsers(updated);
    setCustomCreditInputs({ ...customCreditInputs, [userId]: '' });

    // Sync to Firestore
    await updateFirestoreUserCredits(userId, valNum);
    onShowToast(`Set user credits to ${valNum}!`, 'success');
  };

  const handleToggleUserPlan = async (userId: string, currentPlan?: string) => {
    const nextPlan = currentPlan === 'PRO' ? 'FREE' : 'PRO';
    const updated = updateRegisteredUserPlan(userId, nextPlan);
    setRegisteredUsers(updated);

    // Sync to Firestore
    await updateFirestoreUserPlan(userId, nextPlan);
    onShowToast(`Updated user plan to ${nextPlan}!`, 'success');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user account?')) {
      const updated = deleteRegisteredUser(userId);
      setRegisteredUsers(updated);
      onShowToast('User account deleted.', 'info');
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      onShowToast('Please enter user name and email.', 'error');
      return;
    }

    const initialCredsNum = parseInt(newUserCredits, 10) || 10;
    const newAcc = registerUserAccount({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      passwordHash: newUserPassword || 'password123',
      credits: initialCredsNum,
      plan: newUserPlan,
    });

    // Also persist to Firestore
    await saveFirestoreUserDoc({
      uid: newAcc.id,
      email: newAcc.email,
      displayName: newAcc.name,
      plan: newAcc.plan,
      credits: newAcc.credits,
      createdAt: newAcc.createdAt,
    });

    onShowToast(`User "${newAcc.name}" created with ${initialCredsNum} credits!`, 'success');
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserCredits('10');
    loadAllUsers();
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
    onShowToast('VIP PRO UNLIMITED access granted!', 'success');
  };

  // Filtered users
  const filteredUsers = registeredUsers.filter((u) => {
    const queryMatch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase());

    const planMatch =
      planFilter === 'ALL' ? true : planFilter === 'PRO' ? u.plan === 'PRO' : u.plan !== 'PRO';

    return queryMatch && planMatch;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
              Admin Access Mode
            </span>
            <span className="text-xs text-slate-400 font-bold">System Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 mt-1">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-rose-500 shrink-0" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage user accounts, adjust credits, update payment QR codes, and view system logs.
          </p>
        </div>

        {/* Quick Admin Privileges Actions */}
        <div className="flex items-center gap-2 flex-wrap">
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
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'users', label: `User Accounts & Credits (${registeredUsers.length})`, icon: Users },
          { id: 'payment', label: 'GCash / Payment Settings', icon: QrCode },
          { id: 'conversions', label: 'Conversion Logs', icon: Activity },
          { id: 'feedback', label: 'User Feedback', icon: MessageSquare },
        ].map((tab) => {
          const IconComp = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 sm:px-4 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
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

      {/* TAB 1: USER MANAGEMENT & CREDIT BOOSTING */}
      {activeTab === 'users' && (
        <div
          className={`p-4 sm:p-6 rounded-3xl border space-y-6 ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>User Account & Credit Management</span>
              </h3>
              <p className="text-xs text-slate-400">
                Select a user account to grant credits, toggle PRO plan, or manage details.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md flex items-center gap-2 transition-transform hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add New User</span>
              </button>

              <button
                onClick={loadAllUsers}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-white transition-colors"
                title="Refresh user list"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search user by name or email address..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none border transition-all ${
                  theme === 'dark'
                    ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
              {(['ALL', 'FREE', 'PRO'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPlanFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    planFilter === filter
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter === 'ALL' ? 'All Users' : `${filter} Plan`}
                </button>
              ))}
            </div>
          </div>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center space-y-2 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
              <Users className="w-10 h-10 text-slate-500 mx-auto opacity-40" />
              <p className="text-xs text-slate-400 font-bold">No user accounts found matching query.</p>
              <button
                onClick={() => {
                  setUserSearchQuery('');
                  setPlanFilter('ALL');
                }}
                className="text-xs text-blue-500 font-extrabold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const credits = typeof user.credits === 'number' ? user.credits : 5;
                return (
                  <div
                    key={user.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {user.name}
                          </h4>
                          {(user.email?.toLowerCase() === 'alvindelacruz917@gmail.com' || user.isAdmin) && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-500 border border-rose-500/30 shrink-0">
                              ADMIN
                            </span>
                          )}
                          {user.plan === 'PRO' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-500 border border-amber-500/30 shrink-0">
                              PRO PLAN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-400 shrink-0">
                              FREE USER
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-400 truncate">{user.email}</p>
                        <p className="text-[10px] text-slate-500">
                          Registered: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Credit Control & Quick Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                      {/* Current Credits Badge */}
                      <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-extrabold leading-none">Credits</p>
                          <p className="text-xs font-mono font-black text-amber-500">{credits} Remaining</p>
                        </div>
                      </div>

                      {/* Quick Add Credit Buttons */}
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
                          +5
                        </button>

                        <button
                          onClick={() => handleAdjustCredits(user.id, credits, 10)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all text-xs font-extrabold border border-blue-500/20"
                          title="Add +10 credits"
                        >
                          +10
                        </button>

                        <button
                          onClick={() => handleAdjustCredits(user.id, credits, 50)}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-600 hover:text-white transition-all text-xs font-extrabold border border-purple-500/20"
                          title="Add +50 credits"
                        >
                          +50
                        </button>
                      </div>

                      {/* Custom Credit Input */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={customCreditInputs[user.id] || ''}
                          onChange={(e) =>
                            setCustomCreditInputs({ ...customCreditInputs, [user.id]: e.target.value })
                          }
                          className={`w-16 px-2.5 py-1.5 rounded-lg text-xs font-mono outline-none border ${
                            theme === 'dark'
                              ? 'bg-[#0F172A] border-slate-700 text-white'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <button
                          onClick={() => handleSetCustomCredits(user.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-colors"
                        >
                          Set
                        </button>
                      </div>

                      {/* Toggle Plan */}
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

                      {/* Delete User */}
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

      {/* TAB 2: PAYMENT METHOD & QR CODE MANAGER */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSavePaymentSettings} className="space-y-6">
          <div
            className={`p-4 sm:p-6 rounded-3xl border space-y-6 ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80 shadow-md' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
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
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
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
                <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src={qrFilePreview || paymentSettings.gcashQrCode || DEFAULT_GCASH_QR}
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
                <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src={mayaQrPreview || paymentSettings.mayaQrCode || DEFAULT_MAYA_QR}
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

      {/* TAB 3: CONVERSION LOGS */}
      {activeTab === 'conversions' && (
        <div
          className={`p-4 sm:p-6 rounded-3xl border space-y-6 ${
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
          className={`p-4 sm:p-6 rounded-3xl border space-y-6 ${
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

      {/* ADD NEW USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-5 sm:p-6 border shadow-2xl relative overflow-y-auto max-h-[92vh] ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Add New User Account</h3>
                  <p className="text-[11px] text-slate-400">Create a new user account and assign initial credits</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan Cruz"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className={`w-full mt-1 px-3.5 py-2.5 rounded-xl font-bold outline-none border ${
                    theme === 'dark' ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="juan@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className={`w-full mt-1 px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none border ${
                    theme === 'dark' ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-400">Password</label>
                <input
                  type="password"
                  placeholder="Initial password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className={`w-full mt-1 px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none border ${
                    theme === 'dark' ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-400">Initial Credits</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newUserCredits}
                    onChange={(e) => setNewUserCredits(e.target.value)}
                    className={`w-full mt-1 px-3.5 py-2.5 rounded-xl font-mono font-bold outline-none border ${
                      theme === 'dark' ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-400">Account Plan</label>
                  <select
                    value={newUserPlan}
                    onChange={(e) => setNewUserPlan(e.target.value as any)}
                    className={`w-full mt-1 px-3 py-2.5 rounded-xl font-bold outline-none border ${
                      theme === 'dark' ? 'bg-[#0F172A] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="FREE">FREE Plan</option>
                    <option value="PRO">PRO UNLIMITED</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
