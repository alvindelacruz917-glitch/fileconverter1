import { getDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PaymentSettings {
  gcashName: string;
  gcashNumber: string;
  gcashQrCode: string;
  mayaName: string;
  mayaNumber: string;
  mayaQrCode: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  instructions: string;
}

const PAYMENT_SETTINGS_KEY = 'universal_file_converter_payment_settings';

// Default GCash QR code SVG Data URI as clean fallback
export const DEFAULT_GCASH_QR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="24" fill="%230055FF"/><rect x="20" y="20" width="260" height="260" rx="16" fill="white"/><text x="150" y="48" font-family="sans-serif" font-weight="bold" font-size="16" fill="%230055FF" text-anchor="middle">OFFICIAL GCASH QR</text><rect x="45" y="65" width="70" height="70" rx="8" fill="%230055FF"/><rect x="55" y="75" width="50" height="50" rx="4" fill="white"/><rect x="65" y="85" width="30" height="30" fill="%230055FF"/><rect x="185" y="65" width="70" height="70" rx="8" fill="%230055FF"/><rect x="195" y="75" width="50" height="50" rx="4" fill="white"/><rect x="205" y="85" width="30" height="30" fill="%230055FF"/><rect x="45" y="185" width="70" height="70" rx="8" fill="%230055FF"/><rect x="55" y="195" width="50" height="50" rx="4" fill="white"/><rect x="65" y="205" width="30" height="30" fill="%230055FF"/><rect x="135" y="70" width="25" height="25" fill="%230055FF"/><rect x="135" y="110" width="40" height="15" fill="%230055FF"/><rect x="185" y="150" width="25" height="35" fill="%230055FF"/><rect x="145" y="185" width="45" height="25" fill="%230055FF"/><rect x="215" y="195" width="30" height="40" fill="%230055FF"/><circle cx="150" cy="150" r="18" fill="%230055FF"/><text x="150" y="155" font-family="sans-serif" font-weight="bold" font-size="14" fill="white" text-anchor="middle">G</text><text x="150" y="272" font-family="sans-serif" font-weight="bold" font-size="12" fill="%2364748B" text-anchor="middle">SCAN TO PAY VIA GCASH</text></svg>`;

export const DEFAULT_MAYA_QR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="24" fill="%2310B981"/><rect x="20" y="20" width="260" height="260" rx="16" fill="white"/><text x="150" y="48" font-family="sans-serif" font-weight="bold" font-size="16" fill="%2310B981" text-anchor="middle">MAYA / PAYMAYA QR</text><rect x="45" y="65" width="70" height="70" rx="8" fill="%2310B981"/><rect x="55" y="75" width="50" height="50" rx="4" fill="white"/><rect x="65" y="85" width="30" height="30" fill="%2310B981"/><rect x="185" y="65" width="70" height="70" rx="8" fill="%2310B981"/><rect x="195" y="75" width="50" height="50" rx="4" fill="white"/><rect x="205" y="85" width="30" height="30" fill="%2310B981"/><rect x="45" y="185" width="70" height="70" rx="8" fill="%2310B981"/><rect x="55" y="195" width="50" height="50" rx="4" fill="white"/><rect x="65" y="205" width="30" height="30" fill="%2310B981"/><circle cx="150" cy="150" r="18" fill="%2310B981"/><text x="150" y="155" font-family="sans-serif" font-weight="bold" font-size="14" fill="white" text-anchor="middle">M</text><text x="150" y="272" font-family="sans-serif" font-weight="bold" font-size="12" fill="%2364748B" text-anchor="middle">SCAN TO PAY VIA MAYA</text></svg>`;

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  gcashName: 'ALVIN D. (Admin)',
  gcashNumber: '0917 123 4567',
  gcashQrCode: DEFAULT_GCASH_QR,
  mayaName: 'ALVIN D.',
  mayaNumber: '0918 987 6543',
  mayaQrCode: DEFAULT_MAYA_QR,
  bankName: 'BDO Unibank',
  bankAccountName: 'Universal Converter Corp',
  bankAccountNumber: '001234567890',
  instructions: 'I-scan ang GCash/Maya QR code o i-transfer sa Account Number. Pagkatapos magbayad, i-enter ang mobile/reference number para agad na ma-activate ang PRO Unlimited!',
};

export const getPaymentSettings = (): PaymentSettings => {
  try {
    const raw = localStorage.getItem(PAYMENT_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_PAYMENT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load local payment settings:', e);
  }
  return DEFAULT_PAYMENT_SETTINGS;
};

export const savePaymentSettings = async (settings: PaymentSettings) => {
  try {
    localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('payment-settings-changed', { detail: settings }));
    // Also save to Firestore under 'settings/payment'
    const ref = doc(db, 'settings', 'payment');
    await setDoc(ref, settings, { merge: true });
  } catch (e) {
    console.warn('Failed to save payment settings to Firestore, saved to localStorage instead:', e);
  }
};

export const fetchPaymentSettingsFirestore = async (): Promise<PaymentSettings> => {
  try {
    const ref = doc(db, 'settings', 'payment');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as PaymentSettings;
      localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('payment-settings-changed', { detail: data }));
      return data;
    }
  } catch (e) {
    console.warn('Firestore payment settings load notice:', e);
  }
  return getPaymentSettings();
};

export const subscribePaymentSettings = (callback: (settings: PaymentSettings) => void) => {
  const handleCustomEvent = (e: any) => {
    if (e.detail) callback(e.detail);
  };
  window.addEventListener('payment-settings-changed', handleCustomEvent);

  const ref = doc(db, 'settings', 'payment');
  const unsubscribeFirestore = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data = snap.data() as PaymentSettings;
      localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(data));
      callback(data);
    }
  }, (err) => {
    console.warn('Firestore payment settings snapshot notice:', err);
  });

  return () => {
    window.removeEventListener('payment-settings-changed', handleCustomEvent);
    unsubscribeFirestore();
  };
};
