import React, { useState } from 'react';
import { ConverterTool, FileBatchItem, ConversionOptions } from '../../types/converter';
import { DropZone } from '../DropZone';
import { FileListItem } from '../FileListItem';
import { convertSingleFile } from '../../utils/converterEngine';
import { addHistoryRecord } from '../../utils/storage';
import { PdfPreviewModal } from '../modals/PdfPreviewModal';
import {
  ArrowLeft,
  Folder,
  Play,
  XCircle,
  Download,
  Terminal,
  CheckCircle2,
  Sliders,
  Eye,
  X,
  FileText,
  Loader2
} from 'lucide-react';

interface GenericConverterPageProps {
  tool: ConverterTool;
  initialFiles?: FileBatchItem[];
  onBack: () => void;
  onSuccessToast: (msg: string) => void;
  theme: 'dark' | 'light';
  outputFolder: string;
}

export const GenericConverterPage: React.FC<GenericConverterPageProps> = ({
  tool,
  initialFiles = [],
  onBack,
  onSuccessToast,
  theme,
  outputFolder,
}) => {
  const [items, setItems] = useState<FileBatchItem[]>(initialFiles);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedResults, setCompletedResults] = useState<{ url: string; name: string }[]>([]);
  const [previewResult, setPreviewResult] = useState<{ url: string; name: string } | null>(null);

  const [options, setOptions] = useState<ConversionOptions>({
    rotateAngle: 90,
    watermarkText: '',
    quality: 90,
  });

  const appendLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleAddFiles = (fileList: FileList | File[]) => {
    const newItems: FileBatchItem[] = Array.from(fileList).map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      status: 'pending',
      progress: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
    appendLog(`Added ${newItems.length} file(s) to ${tool.name} queue.`);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
    setLogs([]);
    setCompletedResults([]);
    setOverallProgress(0);
  };

  const handleStartConversion = async () => {
    if (items.length === 0) return;
    setIsConverting(true);
    setCompletedResults([]);
    setOverallProgress(10);
    appendLog(`Starting batch conversion using tool: ${tool.name}...`);

    const results: { url: string; name: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      setItems((prev) =>
        prev.map((item) => (item.id === current.id ? { ...item, status: 'converting', progress: 30 } : item))
      );

      try {
        appendLog(`Processing: ${current.name}...`);
        const res = await convertSingleFile(current, tool.id, options, (pct) => {
          setItems((prev) =>
            prev.map((item) => (item.id === current.id ? { ...item, progress: pct } : item))
          );
        });

        results.push({ url: res.outputUrl, name: res.outputName });
        setItems((prev) =>
          prev.map((item) =>
            item.id === current.id
              ? { ...item, status: 'completed', progress: 100, outputUrl: res.outputUrl, outputName: res.outputName }
              : item
          )
        );

        appendLog(`✓ Converted ${current.name} -> ${res.outputName}`);

        addHistoryRecord({
          toolId: tool.id,
          toolName: tool.name,
          sourceFilesCount: 1,
          sourceNames: [current.name],
          outputName: res.outputName,
          outputUrl: res.outputUrl,
          outputSize: current.size,
          status: 'Success',
        });
      } catch (err: any) {
        appendLog(`❌ Error converting ${current.name}: ${err.message || err}`);
        setItems((prev) =>
          prev.map((item) => (item.id === current.id ? { ...item, status: 'error' } : item))
        );
      }

      const pct = Math.round(((i + 1) / items.length) * 100);
      setOverallProgress(pct);
    }

    setIsConverting(false);
    setCompletedResults(results);
    if (results.length > 0) {
      setPreviewResult(results[0]);
    }
    onSuccessToast(`Batch conversion completed for ${items.length} file(s)!`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {tool.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Upload Drop Zone */}
      <DropZone
        onFilesSelected={handleAddFiles}
        subtitle={`Select or drop ${tool.acceptedTypes.join(', ')} files`}
        acceptedTypes={tool.acceptedTypes}
        theme={theme}
      />

      {/* Target Format Selector & Output Naming for All Converters */}
      <div
        className={`p-6 rounded-3xl border space-y-4 shadow-sm ${
          theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
            <Sliders className="w-5 h-5 text-blue-500" />
            <span>Conversion Output Options & Naming</span>
          </div>
          <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Output Format: .{options.targetFormat || tool.targetExtension || 'png'}
          </span>
        </div>

        {/* Custom File Name Input Option */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Custom Output File Name (Optional)</span>
            <span className="text-[10px] text-blue-500 font-mono">Example: my_document_output</span>
          </label>
          <input
            type="text"
            value={options.outputName || ''}
            onChange={(e) => setOptions({ ...options, outputName: e.target.value })}
            placeholder="Enter desired custom file name here..."
            className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono outline-none transition-all ${
              theme === 'dark'
                ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Format Selectors */}
        {(tool.category === 'image' || tool.id === 'any_image_converter' || tool.category === 'pdf' || tool.category === 'document') && (
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Destination Format:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'png', label: 'PNG Image' },
                { id: 'jpg', label: 'JPG / JPEG' },
                { id: 'webp', label: 'WEBP Web' },
                { id: 'gif', label: 'GIF Anim' },
                { id: 'bmp', label: 'BMP Bitmap' },
                { id: 'ico', label: 'ICO Icon' },
                { id: 'svg', label: 'SVG Vector' },
                { id: 'pdf', label: 'PDF Document' },
                { id: 'docx', label: 'Word (.docx)' },
                { id: 'txt', label: 'Text (.txt)' },
                { id: 'xlsx', label: 'Excel (.xlsx)' },
              ].map((fmt) => {
                const active = (options.targetFormat || tool.targetExtension) === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setOptions({ ...options, targetFormat: fmt.id })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                      active
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                        : theme === 'dark'
                        ? 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {fmt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Output Directory Bar */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Folder className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Output Directory:</span>
          <span className="text-blue-600 dark:text-blue-400 font-mono text-xs">{outputFolder}</span>
        </div>
        <button
          onClick={() => alert(`Output files will be saved to your local browser downloads or: ${outputFolder}`)}
          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Change Folder
        </button>
      </div>

      {/* Queue Items List */}
      {items.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            File Queue ({items.length})
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <FileListItem key={item.id} item={item} onRemove={handleRemove} theme={theme} />
            ))}
          </div>
        </div>
      )}

      {/* Extra Tool Specific Options (e.g. Rotate or Watermark) */}
      {(tool.id.includes('rotate') || tool.id.includes('watermark')) && (
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <Sliders className="w-4 h-4 text-blue-500" />
            <span>Tool Specific Options</span>
          </div>

          {tool.id.includes('rotate') && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-xs font-semibold text-slate-400">Rotation Angle:</span>
              {[90, 180, 270].map((angle) => (
                <button
                  key={angle}
                  onClick={() => setOptions({ ...options, rotateAngle: angle })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    options.rotateAngle === angle
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {angle}° Clockwise
                </button>
              ))}
            </div>
          )}

          {tool.id.includes('watermark') && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-xs font-semibold text-slate-400">Watermark Text:</span>
              <input
                type="text"
                value={options.watermarkText || ''}
                onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                className="px-3 py-1.5 rounded-xl border bg-transparent text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Overall Progress & Execution Log */}
      {isConverting && (
        <div
          className={`p-5 rounded-2xl border space-y-3 shadow-lg transition-all animate-fade-in ${
            theme === 'dark'
              ? 'bg-[#1E293B]/90 border-blue-500/30 shadow-blue-900/10'
              : 'bg-white border-blue-200 shadow-blue-500/10'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 border border-blue-500/30 shrink-0">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Converting Files...
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                    {overallProgress}% Complete
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate mt-0.5">
                  {items.find((i) => i.status === 'converting')?.name
                    ? `Processing: ${items.find((i) => i.status === 'converting')?.name}`
                    : 'Optimizing & formatting output...'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 shrink-0 hidden sm:inline">
              {items.filter((i) => i.status === 'completed').length} / {items.length} Done
            </span>
          </div>

          {/* Smooth animated progress bar with glowing shimmer */}
          <div className="relative w-full bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300/50 dark:border-slate-700/50 shadow-inner">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-500 ease-out shadow-sm shadow-blue-500/50 overflow-hidden"
              style={{ width: `${Math.max(overallProgress, 4)}%` }}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div
          className={`p-4 rounded-2xl border font-mono text-xs space-y-1 ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-400'
          }`}
        >
          <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2 mb-2 font-sans font-bold text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>Conversion Execution Log</span>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-0.5">
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Results Batch Downloads & Premium Document Preview */}
      {completedResults.length > 0 && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-500 font-extrabold text-base">
              <CheckCircle2 className="w-6 h-6" />
              <span>Conversion Completed! {completedResults.length} {completedResults.length === 1 ? 'file' : 'files'} formatted & ready.</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              High-Precision Output
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {completedResults.map((res, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewResult(res)}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white font-extrabold text-xs border border-blue-500/20 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>

                <a
                  href={res.url}
                  download={res.name}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs shadow-xl shadow-emerald-500/20 border border-emerald-400/30 transition-all transform hover:scale-[1.03] active:scale-[0.97]"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>DOWNLOAD {res.name}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleClearAll}
          disabled={isConverting}
          className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={handleStartConversion}
          disabled={items.length === 0 || isConverting}
          className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Convert {items.length > 0 ? `(${items.length} Files)` : ''}</span>
        </button>
      </div>

      {/* FILE PREVIEW MODAL */}
      <PdfPreviewModal
        isOpen={!!previewResult}
        onClose={() => setPreviewResult(null)}
        pdfUrl={previewResult?.url || null}
        fileName={previewResult?.name || 'document.pdf'}
        theme={theme}
      />
    </div>
  );
};
