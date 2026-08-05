import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Download,
  X,
  ExternalLink,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  FileCode,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to matching version
if (typeof window !== 'undefined') {
  const version = pdfjsLib.version || '6.2.108';
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  fileName?: string;
  theme?: 'dark' | 'light';
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  fileName = 'document.pdf',
  theme = 'dark',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isTextLoading, setIsTextLoading] = useState(false);

  // PDF JS State
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  const lowerName = fileName.toLowerCase();
  const isImage = lowerName.match(/\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i) || pdfUrl?.startsWith('data:image/');
  const isPdf = lowerName.endsWith('.pdf') || pdfUrl?.startsWith('data:application/pdf');
  const isText = lowerName.match(/\.(txt|csv|json|md|html|xml|js|ts|css)$/i);

  // Load PDF Document with PDF.JS
  useEffect(() => {
    let isCancelled = false;

    if (isOpen && pdfUrl && pdfUrl.trim() !== '' && isPdf) {
      setPdfLoading(true);
      setPdfError(null);
      setCurrentPage(1);

      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
        loadingTask.promise
          .then((pdfDoc) => {
            if (isCancelled) return;
            setNumPages(pdfDoc.numPages);
            setPdfLoading(false);
            renderPdfPage(pdfDoc, 1, scale);
          })
          .catch((err) => {
            if (isCancelled) return;
            console.error('PDF.js loading error:', err);
            setPdfError('Failed to parse PDF document into canvas. You can download or open in a new tab.');
            setPdfLoading(false);
          });
      } catch (err) {
        if (!isCancelled) {
          console.error('PDF.js init error:', err);
          setPdfError('Failed to initialize PDF preview.');
          setPdfLoading(false);
        }
      }
    }

    return () => {
      isCancelled = true;
    };
  }, [isOpen, pdfUrl, isPdf]);

  // Re-render current page when page or scale changes
  useEffect(() => {
    if (isOpen && pdfUrl && pdfUrl.trim() !== '' && isPdf && numPages > 0) {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
        loadingTask.promise.then((pdfDoc) => {
          renderPdfPage(pdfDoc, currentPage, scale);
        }).catch((err) => {
          console.error('Page render error:', err);
        });
      } catch (e) {
        console.error('Page render exception:', e);
      }
    }
  }, [currentPage, scale]);

  const renderPdfPage = async (pdfDoc: any, pageNum: number, zoomScale: number) => {
    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const viewport = page.getViewport({ scale: zoomScale });
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const renderTask = page.render(renderContext);
      renderTaskRef.current = renderTask;
      await renderTask.promise;
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error:', err);
      }
    }
  };

  // If text file, try reading content for inline preview
  useEffect(() => {
    if (isOpen && pdfUrl && isText) {
      setIsTextLoading(true);
      fetch(pdfUrl)
        .then((res) => res.text())
        .then((text) => {
          setTextContent(text);
          setIsTextLoading(false);
        })
        .catch(() => {
          setTextContent(null);
          setIsTextLoading(false);
        });
    } else {
      setTextContent(null);
    }
  }, [isOpen, pdfUrl, isText]);

  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-full h-full rounded-none' : 'max-w-5xl h-[90vh] sm:h-[85vh] rounded-3xl'
        } border border-white/10 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#0B0F19] text-white' : 'bg-slate-900 text-white'
        }`}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-[#141A26]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                isImage
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  : isPdf
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {isImage ? (
                <ImageIcon className="w-5 h-5" />
              ) : isText ? (
                <FileCode className="w-5 h-5" />
              ) : (
                <FileText className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xs sm:text-base text-white truncate">
                  Document Preview Inspector
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 hidden sm:inline-block">
                  READY
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#B5BDD1] font-mono truncate">{fileName}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={pdfUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Open in new window / tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            <a
              href={pdfUrl || '#'}
              download={fileName}
              className="px-3 sm:px-4 py-2 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors hidden sm:block"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar for PDF Navigation & Zoom */}
        {isPdf && numPages > 0 && !pdfError && (
          <div className="bg-[#101622] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-[#B5BDD1] shrink-0 overflow-x-auto">
            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs">
                Page <span className="text-white font-bold">{currentPage}</span> of{' '}
                <span className="text-white font-bold">{numPages}</span>
              </span>
              <button
                disabled={currentPage >= numPages}
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-white">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setScale(1.2)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10"
                title="Reset Zoom"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Body Preview Content */}
        <div className="flex-1 bg-[#090D16] p-2 sm:p-4 flex flex-col items-center justify-center overflow-auto relative">
          {pdfLoading ? (
            <div className="flex flex-col items-center justify-center space-y-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-xs font-mono">Rendering PDF Canvas Preview...</p>
            </div>
          ) : isPdf && !pdfError ? (
            <div className="max-w-full max-h-full overflow-auto p-4 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="rounded-xl shadow-2xl border border-white/10 bg-white max-w-full"
              />
            </div>
          ) : isPdf && pdfError ? (
            <div className="p-8 text-center max-w-md bg-[#141A26] rounded-3xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Direct Preview Blocked</h4>
              <p className="text-xs text-[#B5BDD1] leading-relaxed">{pdfError}</p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href={pdfUrl || '#'}
                  download={fileName}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center p-2 overflow-auto">
              {pdfUrl ? (
                <img
                  src={pdfUrl}
                  alt={fileName}
                  className="max-h-full max-w-full object-contain rounded-2xl border border-white/10 shadow-2xl bg-[#141A26]"
                />
              ) : null}
            </div>
          ) : isText ? (
            <div className="w-full h-full bg-[#141A26] rounded-2xl border border-white/10 p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-auto whitespace-pre-wrap">
              {isTextLoading ? (
                <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
                  Loading preview text...
                </div>
              ) : textContent !== null ? (
                textContent
              ) : (
                <div className="p-8 text-center text-slate-400 font-mono text-xs">
                  Preview not available for this text file.
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center max-w-md bg-[#141A26] rounded-3xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-white">Document Converted Successfully</h4>
              <p className="text-xs text-[#B5BDD1]">
                Your document is converted and ready. Click download to save it locally.
              </p>
              <a
                href={pdfUrl || '#'}
                download={fileName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download {fileName}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
