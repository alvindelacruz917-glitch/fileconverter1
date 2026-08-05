import React, { useState } from 'react';
import { DropZone } from '../DropZone';
import { FileBatchItem, ConversionOptions } from '../../types/converter';
import { convertSingleFile, convertMultipleImagesToPdf } from '../../utils/converterEngine';
import { addHistoryRecord } from '../../utils/storage';
import { PdfPreviewModal } from '../modals/PdfPreviewModal';
import {
  ArrowLeft,
  FileImage,
  GripVertical,
  Trash2,
  Download,
  CheckCircle2,
  Sparkles,
  Sliders,
  Layers,
  Eye,
  X,
  FileText
} from 'lucide-react';

interface ImageToPdfStudioProps {
  initialFiles?: FileBatchItem[];
  onBack: () => void;
  onSuccessToast: (msg: string) => void;
  theme: 'dark' | 'light';
}

export const ImageToPdfStudio: React.FC<ImageToPdfStudioProps> = ({
  initialFiles = [],
  onBack,
  onSuccessToast,
  theme,
}) => {
  const [items, setItems] = useState<FileBatchItem[]>(initialFiles);
  const [options, setOptions] = useState<ConversionOptions>({
    outputName: 'converted_images.pdf',
    merge: true,
    pageSize: 'A4',
    orientation: 'Portrait',
    margins: 'small',
    imageFit: 'fit',
    quality: 90,
  });

  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState<string>('converted_images.pdf');
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);

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
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIdx === index) {
      setDragOverIdx(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) {
      setDragOverIdx(null);
      return;
    }

    const newItems = [...items];
    const [movedItem] = newItems.splice(draggedIdx, 1);
    newItems.splice(dropIndex, 0, movedItem);

    setItems(newItems);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleStartConvert = async () => {
    if (items.length === 0) return;
    setIsConverting(true);
    setProgress(15);

    try {
      // Convert all items in batch to PDF with selected options
      const res = await convertMultipleImagesToPdf(items, options, (pct) => setProgress(pct));
      setResultUrl(res.outputUrl);
      setResultName(res.outputName);
      setShowPdfPreviewModal(true);
      
      addHistoryRecord({
        toolId: 'img_to_pdf',
        toolName: 'Image to PDF Studio',
        sourceFilesCount: items.length,
        sourceNames: items.map((i) => i.name),
        outputName: res.outputName,
        outputUrl: res.outputUrl,
        outputSize: Math.round(items.reduce((acc, curr) => acc + curr.size, 0) * 0.85),
        status: 'Success',
      });
      onSuccessToast(`Successfully converted ${items.length} ${items.length === 1 ? 'image' : 'images'} into PDF document!`);
    } catch (e: any) {
      console.error('Image to PDF studio error:', e);
    } finally {
      setIsConverting(false);
      setProgress(100);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileImage className="w-7 h-7 text-blue-600" />
              <span>Image to PDF Studio</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arrange pages, choose paper size, orientation, and margins
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setItems([])}
            className="text-xs font-semibold text-rose-500 hover:underline"
          >
            Clear All Images
          </button>
        )}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Image Drop Area & Reorderable Thumbnails */}
        <div className="lg:col-span-2 space-y-6">
          <DropZone
            onFilesSelected={handleAddFiles}
            subtitle="Add JPG, PNG, WEBP, BMP, TIFF, GIF, HEIC images"
            acceptedTypes={['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.gif', '.heic']}
            theme={theme}
          />

          {/* Page Reorder Grid */}
          <div
            className={`p-6 rounded-[24px] border space-y-4 ${
              theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-inherit pb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <span>Page Order ({items.length} pages)</span>
              </h3>
              <span className="text-xs text-slate-400">Drag or use arrows to reorder pages</span>
            </div>

            {items.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm font-medium">
                No images added yet. Drop images above to start arranging.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragLeave={(e) => handleDragLeave(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`relative group rounded-2xl border p-3 flex flex-col justify-between transition-all duration-150 cursor-grab active:cursor-grabbing ${
                      draggedIdx === idx
                        ? 'opacity-40 border-dashed border-blue-500 scale-95'
                        : dragOverIdx === idx && draggedIdx !== idx
                        ? 'ring-2 ring-blue-500 border-blue-500 scale-[1.02] bg-blue-50/40 dark:bg-blue-950/40 shadow-md'
                        : theme === 'dark'
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200/90 hover:border-blue-400 hover:bg-white shadow-sm'
                    }`}
                  >
                    {/* Header Badges & Drag handle */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow">
                        Page {idx + 1}
                      </span>
                      <GripVertical className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100" />
                    </div>

                    {/* Image Thumbnail */}
                    <div className="w-full h-32 my-1.5 flex items-center justify-center overflow-hidden rounded-xl bg-black/10 border border-black/5">
                      {item.previewUrl ? (
                        <img src={item.previewUrl} alt={item.name} className="h-full w-full object-contain" />
                      ) : (
                        <FileImage className="w-10 h-10 text-slate-400" />
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-1 text-xs pt-2 border-t border-inherit">
                      <span className="truncate font-extrabold text-[11px] text-slate-700 dark:text-slate-300 max-w-[90px]">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (idx === 0) return;
                            const newItems = [...items];
                            const temp = newItems[idx];
                            newItems[idx] = newItems[idx - 1];
                            newItems[idx - 1] = temp;
                            setItems(newItems);
                          }}
                          disabled={idx === 0}
                          className="px-1.5 py-0.5 rounded-md bg-slate-500/10 hover:bg-blue-600 hover:text-white text-slate-500 font-black disabled:opacity-20 text-[10px]"
                          title="Move page up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (idx === items.length - 1) return;
                            const newItems = [...items];
                            const temp = newItems[idx];
                            newItems[idx] = newItems[idx + 1];
                            newItems[idx + 1] = temp;
                            setItems(newItems);
                          }}
                          disabled={idx === items.length - 1}
                          className="px-1.5 py-0.5 rounded-md bg-slate-500/10 hover:bg-blue-600 hover:text-white text-slate-500 font-black disabled:opacity-20 text-[10px]"
                          title="Move page down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="p-1 text-rose-500 hover:bg-rose-500/15 rounded-md transition-colors"
                          title="Delete page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: PDF Settings Panel */}
        <div
          className={`p-6 rounded-[24px] border space-y-6 flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#1E293B] border-slate-700/80' : 'bg-white border-slate-200'
          }`}
        >
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-inherit">
              <Sliders className="w-5 h-5 text-blue-600" />
              <span>PDF Settings</span>
            </h3>

            {/* Custom Output File Name Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase flex items-center justify-between">
                <span>Output File Name</span>
                <span className="text-[10px] text-blue-500 font-normal">Custom Name</span>
              </label>
              <input
                type="text"
                value={options.outputName || ''}
                onChange={(e) => setOptions({ ...options, outputName: e.target.value })}
                placeholder="my_converted_document.pdf"
                className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Merge Option */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.merge}
                onChange={(e) => setOptions({ ...options, merge: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Merge all into single PDF document
              </span>
            </label>

            {/* Page Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Page Size</label>
              <select
                value={options.pageSize}
                onChange={(e) => setOptions({ ...options, pageSize: e.target.value as any })}
                className={`w-full p-2.5 rounded-xl border text-sm outline-none cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="A4" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>A4 Standard</option>
                <option value="Letter" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>US Letter</option>
                <option value="Legal" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Legal</option>
                <option value="Auto" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Auto Size (Match Image)</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Orientation</label>
              <select
                value={options.orientation}
                onChange={(e) => setOptions({ ...options, orientation: e.target.value as any })}
                className={`w-full p-2.5 rounded-xl border text-sm outline-none cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="Portrait" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Portrait</option>
                <option value="Landscape" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Landscape</option>
                <option value="Auto" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Auto Detect</option>
              </select>
            </div>

            {/* Margins */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Margins</label>
              <select
                value={options.margins}
                onChange={(e) => setOptions({ ...options, margins: e.target.value as any })}
                className={`w-full p-2.5 rounded-xl border text-sm outline-none cursor-pointer ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="none" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>None (0px)</option>
                <option value="small" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Small (10px)</option>
                <option value="medium" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Medium (20px)</option>
                <option value="large" className={theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-900'}>Large (30px)</option>
              </select>
            </div>

            {/* Image Fit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Image Fit</label>
              <select
                value={options.imageFit}
                onChange={(e) => setOptions({ ...options, imageFit: e.target.value as any })}
                className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="fit">Fit (Preserve Aspect Ratio)</option>
                <option value="fill">Fill (Crop to fill page)</option>
                <option value="stretch">Stretch to Page</option>
              </select>
            </div>

            {/* Quality Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                <span>Image Quality</span>
                <span>{options.quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={options.quality}
                onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Action Button & Progress */}
          <div className="space-y-4 pt-4 border-t border-inherit">
            {isConverting && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-blue-500">
                  <span>Converting images...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {resultUrl && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPdfPreviewModal(true)}
                  className="w-full py-3.5 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-extrabold text-sm flex items-center justify-center gap-2 border border-blue-500/20 transition-all shadow-sm"
                >
                  <Eye className="w-5 h-5" />
                  <span>PREVIEW CONVERTED PDF DOCUMENT</span>
                </button>

                <a
                  href={resultUrl}
                  download={resultName || options.outputName || 'converted_images.pdf'}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 border border-emerald-400/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-5 h-5 animate-bounce" />
                  <span>DOWNLOAD CONVERTED PDF FILE ({resultName})</span>
                </a>
              </div>
            )}

            <button
              onClick={handleStartConvert}
              disabled={items.length === 0 || isConverting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Convert to PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      <PdfPreviewModal
        isOpen={showPdfPreviewModal}
        onClose={() => setShowPdfPreviewModal(false)}
        pdfUrl={resultUrl}
        fileName={resultName}
        theme={theme}
      />
    </div>
  );
};
