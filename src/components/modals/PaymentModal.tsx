import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Crown,
  Sparkles,
  Smartphone,
  Landmark,
  Lock,
  ArrowRight,
  QrCode,
  Tag,
  Check,
  Zap,
  HelpCircle,
  Clock,
  Info
} from 'lucide-react';
import { UserProfile } from '../../types/converter';
import { saveStoredUser } from '../../utils/storage';
import {
  PaymentSettings,
  getPaymentSettings,
  fetchPaymentSettingsFirestore,
  subscribePaymentSettings,
  DEFAULT_GCASH_QR,
  DEFAULT_MAYA_QR
} from '../../utils/paymentSettings';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onPaymentSuccess: (updatedUser: UserProfile) => void;
  theme: 'dark' | 'light';
}

type PaymentMethod = 'gcash' | 'maya' | 'paypal' | 'visa' | 'mastercard' | 'amex' | 'bank';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPaymentSuccess,
  theme,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [method, setMethod] = useState<PaymentMethod>('gcash');

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [refNumber, setRefNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(getPaymentSettings());

  useEffect(() => {
    if (isOpen) {
      fetchPaymentSettingsFirestore().then((res) => setPaymentSettings(res));
      const unsubscribe = subscribePaymentSettings((updated) => setPaymentSettings(updated));
      return () => unsubscribe();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Price Calculations
  const basePrice = billingCycle === 'monthly' ? 120 : 1200; // PHP
  const discountAmount = appliedPromo ? (basePrice * appliedPromo.discountPercent) / 100 : 0;
  const subtotal = basePrice - discountAmount;
  const taxRate = 0.00; // Included/No extra tax
  const taxAmount = subtotal * taxRate;
  const finalTotal = subtotal + taxAmount;

  const planAmountStr = `₱${finalTotal.toFixed(2)} ${billingCycle === 'monthly' ? '/ month' : '/ year'}`;

  const handleApplyPromo = () => {
    setPromoError(null);
    const codeUpper = promoCode.trim().toUpperCase();
    if (codeUpper === 'PRO50' || codeUpper === 'DISCOUNT50') {
      setAppliedPromo({ code: codeUpper, discountPercent: 50 });
    } else if (codeUpper === 'VIP100' || codeUpper === 'ALVINPRO') {
      setAppliedPromo({ code: codeUpper, discountPercent: 100 });
    } else {
      setPromoError('Invalid promo code. Try "PRO50" or "ALVINPRO".');
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    setTimeout(() => {
      if (simulateFailure) {
        setIsProcessing(false);
        setErrorMessage('Payment Declined: Your payment provider or account was declined. PRO subscription was NOT activated.');
        return;
      }

      if (['visa', 'mastercard', 'amex'].includes(method) && cardNumber.replace(/\s+/g, '').length < 12) {
        setIsProcessing(false);
        setErrorMessage('Invalid Card Number: Please enter a valid 16-digit credit or debit card number.');
        return;
      }

      if (['gcash', 'maya'].includes(method) && mobileNumber.replace(/\s+/g, '').length < 10) {
        setIsProcessing(false);
        setErrorMessage('Invalid Mobile Number: Please enter a valid 11-digit mobile number.');
        return;
      }

      // Success
      setIsProcessing(false);
      const today = new Date();
      const expiry = new Date(
        Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 86400000
      );

      const methodNames: Record<PaymentMethod, string> = {
        gcash: 'GCash QR',
        maya: 'Maya QR',
        paypal: 'PayPal Express',
        visa: 'Visa Card',
        mastercard: 'Mastercard',
        amex: 'American Express',
        bank: 'Bank Transfer'
      };

      const updatedUser: UserProfile = {
        id: currentUser?.id || `usr_pro_${Date.now()}`,
        name: currentUser?.name || 'Pro Member',
        email: currentUser?.email || 'user@example.com',
        plan: 'PRO',
        subscriptionDate: today.toLocaleDateString(),
        subscriptionExpiry: expiry.toLocaleDateString(),
        paymentMethod: methodNames[method],
        paymentHistory: [
          {
            id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
            date: today.toLocaleDateString(),
            amount: planAmountStr,
            method: method.toUpperCase(),
            plan: `PRO UNLIMITED (${billingCycle.toUpperCase()})`,
          },
          ...(currentUser?.paymentHistory || []),
        ],
      };

      saveStoredUser(updatedUser);
      setSuccessReceipt(updatedUser);
      onPaymentSuccess(updatedUser);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div
        className={`w-full max-w-4xl rounded-3xl border shadow-2xl relative overflow-hidden my-auto transition-all ${
          theme === 'dark'
            ? 'bg-[#0B0F19] border-white/10 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#141A26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Crown className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Universal Pro Checkout
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SECURE 256-BIT SSL
                </span>
              </div>
              <p className="text-xs text-[#B5BDD1]">
                Instant VIP activation for unlimited offline batch conversions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successReceipt ? (
          /* SUCCESS CONFIRMATION RECEIPT CARD */
          <div className="p-8 sm:p-12 space-y-8 text-center max-w-xl mx-auto animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Crown className="w-3.5 h-3.5 fill-amber-400" />
                <span>PRO UNLIMITED ACTIVATED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Payment Successful!</h2>
              <p className="text-xs sm:text-sm text-[#B5BDD1]">
                Thank you! Your PRO subscription is now active across all tools.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141A26] border border-white/10 space-y-3 text-xs text-left">
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-[#B5BDD1]">Subscriber:</span>
                <span className="font-bold text-white">{successReceipt.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-[#B5BDD1]">Amount Paid:</span>
                <span className="font-bold text-amber-400">{planAmountStr}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span className="text-[#B5BDD1]">Subscription Expiry:</span>
                <span className="font-bold text-white">{successReceipt.subscriptionExpiry}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#B5BDD1]">Payment Method:</span>
                <span className="font-bold text-white">{successReceipt.paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <span>Start Converting Files</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Stripe-style 2-Column Checkout Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left Column: Plan Summary & Order Details */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#141A26] border-b lg:border-b-0 lg:border-r border-white/10 space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Order Summary
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">PRO Membership</h3>
              </div>

              {/* Billing Cycle Switcher */}
              <div className="p-1 rounded-2xl bg-[#0B0F19] border border-white/10 grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-[#B5BDD1] hover:text-white'
                  }`}
                >
                  Monthly (₱120)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all relative ${
                    billingCycle === 'annual'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-[#B5BDD1] hover:text-white'
                  }`}
                >
                  Annual (₱1,200)
                  <span className="absolute -top-2 -right-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase shadow">
                    SAVE 16%
                  </span>
                </button>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 text-xs text-[#B5BDD1]">
                {[
                  'Unlimited daily file conversions',
                  '100% offline local processing',
                  'Unlimited batch image-to-PDF merging',
                  'Priority processing speed',
                  'VIP 24/7 technical support'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-white/90">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Order Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-[#0B0F19] border border-white/10 space-y-3 text-xs">
                <div className="flex justify-between text-[#B5BDD1]">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₱{basePrice.toFixed(2)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Promo ({appliedPromo.code} -{appliedPromo.discountPercent}%)
                    </span>
                    <span className="font-mono">-₱{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#B5BDD1]">
                  <span>Tax (Included)</span>
                  <span className="font-mono text-white">₱0.00</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">Total Due</span>
                  <div className="text-right">
                    <span className="font-mono font-black text-xl text-blue-400">
                      ₱{finalTotal.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#B5BDD1] block font-sans">
                      {billingCycle === 'monthly' ? 'per month' : 'per year'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code Input Box */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#B5BDD1] uppercase tracking-wider block">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code (e.g. PRO50)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-400 font-semibold">{promoError}</p>
                )}
                {appliedPromo && (
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Applied code {appliedPromo.code}!
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Payment Methods & Inputs */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-3">
                    Select Payment Method
                  </h4>

                  {/* Payment Method Selector Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'gcash', label: 'GCash', brand: 'bg-blue-600/20 border-blue-500/50 text-blue-400' },
                      { id: 'maya', label: 'Maya', brand: 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' },
                      { id: 'visa', label: 'Visa', brand: 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400' },
                      { id: 'mastercard', label: 'Mastercard', brand: 'bg-orange-600/20 border-orange-500/50 text-orange-400' },
                      { id: 'amex', label: 'AMEX', brand: 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400' },
                      { id: 'paypal', label: 'PayPal', brand: 'bg-blue-500/20 border-blue-400/50 text-blue-300' },
                      { id: 'bank', label: 'Bank Transfer', brand: 'bg-amber-600/20 border-amber-500/50 text-amber-400' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMethod(item.id as PaymentMethod)}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold relative group ${
                          method === item.id
                            ? `${item.brand} ring-2 ring-blue-500 shadow-lg scale-[1.02]`
                            : 'bg-[#141A26] border-white/10 text-[#B5BDD1] hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {item.id === 'gcash' && <QrCode className="w-5 h-5 text-blue-400" />}
                        {item.id === 'maya' && <Smartphone className="w-5 h-5 text-emerald-400" />}
                        {item.id === 'paypal' && <CreditCard className="w-5 h-5 text-sky-400" />}
                        {['visa', 'mastercard', 'amex'].includes(item.id) && <CreditCard className="w-5 h-5 text-amber-400" />}
                        {item.id === 'bank' && <Landmark className="w-5 h-5 text-amber-400" />}

                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Container */}
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  {/* GCash Display */}
                  {method === 'gcash' && (
                    <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-blue-600 text-white shadow">
                          GCASH QR PAYMENT
                        </span>
                        <div className="w-48 h-48 sm:w-56 sm:h-56 p-2 rounded-2xl bg-white border border-blue-500/30 shadow-lg flex items-center justify-center">
                          <img
                            src={paymentSettings.gcashQrCode || DEFAULT_GCASH_QR}
                            alt="GCash QR Code"
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                        <p className="text-xs font-bold text-white">Account: {paymentSettings.gcashName}</p>
                        <p className="text-sm font-mono font-black text-blue-400">{paymentSettings.gcashNumber}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[11px] font-bold text-[#B5BDD1]">Your GCash Number</label>
                          <input
                            type="text"
                            required
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="0917 000 0000"
                            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#B5BDD1]">GCash Ref Number</label>
                          <input
                            type="text"
                            required
                            value={refNumber}
                            onChange={(e) => setRefNumber(e.target.value)}
                            placeholder="e.g. 1009823456"
                            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Maya Display */}
                  {method === 'maya' && (
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow">
                          MAYA QR PAYMENT
                        </span>
                        <div className="w-48 h-48 sm:w-56 sm:h-56 p-2 rounded-2xl bg-white border border-emerald-500/30 shadow-lg flex items-center justify-center">
                          <img
                            src={paymentSettings.mayaQrCode || DEFAULT_MAYA_QR}
                            alt="Maya QR Code"
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                        <p className="text-xs font-bold text-white">Account: {paymentSettings.mayaName}</p>
                        <p className="text-sm font-mono font-black text-emerald-400">{paymentSettings.mayaNumber}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[11px] font-bold text-[#B5BDD1]">Maya Mobile Number</label>
                          <input
                            type="text"
                            required
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="0918 000 0000"
                            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#B5BDD1]">Maya Ref Number</label>
                          <input
                            type="text"
                            required
                            value={refNumber}
                            onChange={(e) => setRefNumber(e.target.value)}
                            placeholder="Ref # 8827361"
                            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Display (Visa, Mastercard, AMEX) */}
                  {['visa', 'mastercard', 'amex'].includes(method) && (
                    <div className="space-y-3.5 p-4 rounded-2xl bg-[#141A26] border border-white/10">
                      <div>
                        <label className="text-xs font-bold text-[#B5BDD1]">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#B5BDD1]">Card Number</label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4000 0000 0000 0000"
                          className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-[#B5BDD1]">Expiry Date</label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#B5BDD1]">CVC / CVV</label>
                          <input
                            type="text"
                            required
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="123"
                            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs font-mono outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PayPal Display */}
                  {method === 'paypal' && (
                    <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                      <label className="text-xs font-bold text-[#B5BDD1]">PayPal Account Email</label>
                      <input
                        type="email"
                        required
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="your-paypal@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-white text-xs outline-none focus:border-blue-500"
                      />
                      <p className="text-[11px] text-[#B5BDD1]">
                        You will be redirected to PayPal to complete express payment verification.
                      </p>
                    </div>
                  )}

                  {/* Bank Transfer Display */}
                  {method === 'bank' && (
                    <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3 text-xs">
                      <div className="font-extrabold text-amber-400 flex items-center gap-2">
                        <Landmark className="w-4 h-4" />
                        <span>Direct Bank Wire Details</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0B0F19] border border-white/10 font-mono text-white/90 space-y-1">
                        <p><span className="text-[#B5BDD1] font-sans font-bold">Bank:</span> {paymentSettings.bankName || 'BDO / BPI'}</p>
                        <p><span className="text-[#B5BDD1] font-sans font-bold">Account Name:</span> {paymentSettings.bankAccountName || 'Universal Converter'}</p>
                        <p><span className="text-[#B5BDD1] font-sans font-bold">Account No:</span> {paymentSettings.bankAccountNumber || '001234567890'}</p>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold text-center animate-fade-in">
                      {errorMessage}
                    </div>
                  )}

                  {/* Simulation Switcher for Testing */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold text-[#B5BDD1]">
                    <span>Simulate Result:</span>
                    <button
                      type="button"
                      onClick={() => setSimulateFailure(!simulateFailure)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                        simulateFailure
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {simulateFailure ? '❌ Force Decline' : '✓ Normal Success'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Verifying Payment...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          Pay ₱{finalTotal.toFixed(2)} & Activate PRO
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#B5BDD1] pt-4 border-t border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant Activation • 256-Bit Encrypted • Developed by Alvin</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
