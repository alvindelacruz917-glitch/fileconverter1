import React, { useState } from 'react';
import { HistoryRecord } from '../../types/converter';
import { clearStoredHistory, removeHistoryRecord } from '../../utils/storage';
import { PdfPreviewModal } from '../modals/PdfPreviewModal';
import { History as HistoryIcon, Search, Trash2, Download, FileText, CheckCircle2, X, Eye } from 'lucide-react';

interface HistoryPageProps {
  historyRecords: HistoryRecord[];
  onRefreshHistory: () => void;
  theme: 'dark' | 'light';
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  historyRecords,
  onRefreshHistory,
  theme,
}) => {
  const [query, setQuery] = useState('');
  const [records, setRecords] = useState<HistoryRecord[]>(historyRecords);
  const [previewRecord, setPreviewRecord] = useState<{ url: string; name: string } | null>(null);

  // Keep local records state synced when props change
  React.useEffect(() => {
    setRecords(historyRecords);
  }, [historyRecords]);

  const filtered = records.filter(
    (r) =>
      r.toolName.toLowerCase().includes(query.toLowerCase()) ||
      r.outputName.toLowerCase().includes(query.toLowerCase())
  );

  const handleClearAll = () => {
    if (confirm('Sigurado ka bang gusto mong idelete ang LAHAT ng conversion history mo?')) {
      clearStoredHistory();
      setRecords([]);
      onRefreshHistory();
      // Delete from firestore for each record if applicable
      records.forEach((r) => {
        if (r.id) {
          import('../../lib/firebase').then(({ deleteConversionRecord }) => {
            deleteConversionRecord(r.id);
          }).catch(e => console.warn('Firestore delete notice:', e));
        }
      });
    }
  };

  const handleRemoveSingle = (id: string, name: string) => {
    const updated = removeHistoryRecord(id);
    setRecords(updated);
    onRefreshHistory();
    // Delete from Firestore
    import('../../lib/firebase').then(({ deleteConversionRecord }) => {
      deleteConversionRecord(id);
    }).catch(e => console.warn('Firestore delete notice:', e));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-blue-600" />
            <span>Conversion History</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log of all your local file conversions and processed documents
          </p>
        </div>

        {records.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Entire History</span>
          </button>
        )}
      </div>

      {/* Filter Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter history records by tool or filename..."
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-all ${
            theme === 'dark'
              ? 'bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600'
          }`}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* History Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
          <FileText className="w-12 h-12 mx-auto text-slate-400/50" />
          <p className="font-bold text-base text-slate-700 dark:text-slate-300">
            {records.length === 0 ? 'No history records found' : 'No records match your filter'}
          </p>
          <p className="text-xs">Your converted files will automatically be logged here.</p>
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80 shadow-md' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`text-xs uppercase font-black tracking-wider border-b ${
                  theme === 'dark'
                    ? 'bg-slate-900/60 text-slate-400 border-slate-800'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                <tr>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Tool Used</th>
                  <th className="p-4">Output File</th>
                  <th className="p-4">Files</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-blue-500/5 transition-colors group">
                    <td className="p-4 text-xs font-mono text-slate-400">{r.timestamp}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{r.toolName}</td>
                    <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold truncate max-w-xs">
                      {r.outputName}
                    </td>
                    <td className="p-4 text-xs text-slate-500">{r.sourceFilesCount} file(s)</td>
                    <td className="p-4 text-xs text-slate-400 font-mono">{formatSize(r.outputSize)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.outputUrl && (
                          <>
                            <button
                              onClick={() => setPreviewRecord({ url: r.outputUrl!, name: r.outputName })}
                              className="p-2 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                              title="Preview Document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={r.outputUrl}
                              download={r.outputName}
                              className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </>
                        )}
                        <button
                          onClick={() => handleRemoveSingle(r.id, r.outputName)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          title="Delete from history"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PDF PREVIEW MODAL */}
      <PdfPreviewModal
        isOpen={!!previewRecord}
        onClose={() => setPreviewRecord(null)}
        pdfUrl={previewRecord?.url || null}
        fileName={previewRecord?.name || 'document.pdf'}
        theme={theme}
      />
    </div>
  );
};
