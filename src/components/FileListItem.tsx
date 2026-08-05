import React from 'react';
import { FileText, Trash2, CheckCircle2, AlertCircle, GripVertical, Download } from 'lucide-react';
import { FileBatchItem } from '../types/converter';

interface FileListItemProps {
  item: FileBatchItem;
  onRemove: (id: string) => void;
  theme: 'dark' | 'light';
}

export const FileListItem: React.FC<FileListItemProps> = ({ item, onRemove, theme }) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all shadow-sm ${
        theme === 'dark'
          ? 'bg-[#141A26] border-white/10 text-white hover:border-white/20'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <GripVertical className="w-4 h-4 text-slate-500 cursor-grab shrink-0 hover:text-white transition-colors" />
        
        {/* Thumbnail Preview or Icon */}
        {item.previewUrl ? (
          <img
            src={item.previewUrl}
            alt={item.name}
            className="w-10 h-10 object-cover rounded-xl border border-white/10 shrink-0 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p
            className={`font-bold text-xs sm:text-sm truncate ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {item.name}
          </p>
          <span
            className={`text-[11px] font-mono ${
              theme === 'dark' ? 'text-[#B5BDD1]' : 'text-slate-500'
            }`}
          >
            {formatSize(item.size)}
          </span>

          {/* Progress Bar */}
          {item.status === 'converting' && (
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
              <div
                className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {item.status === 'completed' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
            {item.outputUrl && (
              <a
                href={item.outputUrl}
                download={item.outputName || 'converted_file'}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
                title="Download Converted File"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            )}
          </div>
        )}

        {item.status === 'error' && (
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Failed
          </span>
        )}

        <button
          onClick={() => onRemove(item.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Remove File"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
