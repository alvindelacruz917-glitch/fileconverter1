export type ToolCategory = 'pdf' | 'image' | 'document' | 'utility';

export type PageView =
  | 'home'
  | 'pdf_tools'
  | 'image_tools'
  | 'doc_tools'
  | 'converter'
  | 'img_to_pdf_studio'
  | 'pricing'
  | 'profile'
  | 'history'
  | 'settings'
  | 'about'
  | 'feedback'
  | 'admin';

export interface ConverterTool {
  id: string;
  name: string;
  category: ToolCategory;
  icon: string;
  description: string;
  acceptedTypes: string[];
  targetExtension: string;
  popular?: boolean;
}

export interface FileBatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  outputUrl?: string;
  outputName?: string;
  errorMsg?: string;
}

export interface ConversionOptions {
  outputName?: string;
  targetFormat?: string; // e.g. 'png' | 'jpg' | 'webp' | 'pdf' | 'docx' | 'txt' | 'svg' | 'bmp' | 'ico'
  merge?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal' | 'Auto';
  orientation?: 'Portrait' | 'Landscape' | 'Auto';
  margins?: 'none' | 'small' | 'medium' | 'large';
  imageFit?: 'fit' | 'fill' | 'original' | 'stretch';
  quality?: number; // 1-100
  rotateAngle?: number; // 90, 180, 270
  resizeWidth?: number;
  resizeHeight?: number;
  compressRatio?: number;
  watermarkText?: string;
  password?: string;
}

export interface HistoryRecord {
  id: string;
  toolId: string;
  toolName: string;
  sourceFilesCount: number;
  sourceNames: string[];
  outputName: string;
  outputUrl?: string;
  outputSize: number;
  timestamp: string;
  status: 'Success' | 'Failed';
}

export interface AppSettings {
  theme: 'dark' | 'light';
  accentColor: string;
  outputFolder: string;
  rememberLastFolder: boolean;
  autoOpenOutput: boolean;
  rememberWindowSize: boolean;
  language: string;
  soundEffects: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: 'FREE' | 'PRO';
  isAdmin?: boolean;
  avatar?: string;
  subscriptionDate?: string;
  subscriptionExpiry?: string;
  paymentMethod?: string;
  paymentHistory?: {
    id: string;
    date: string;
    amount: string;
    method: string;
    plan: string;
  }[];
}

export interface CreditState {
  remaining: number;
  max: number;
  lastResetDate: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  type: 'Suggestion' | 'Bug Report' | 'Review';
  rating: number;
  message: string;
  timestamp: string;
}

