import React, { useRef, useState } from 'react';
import { UploadCloud, FilePlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DropZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  subtitle?: string;
  acceptedTypes?: string[];
  theme: 'dark' | 'light';
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  subtitle = 'Drag and drop your files here or click select',
  acceptedTypes,
  theme,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      whileHover={{ scale: isDragOver ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`relative group cursor-pointer rounded-3xl p-8 md:p-12 text-center border-2 border-dashed transition-all duration-300 overflow-hidden ${
        isDragOver
          ? 'border-blue-500 bg-blue-500/20 ring-4 ring-blue-500/30 scale-[1.02] shadow-2xl shadow-blue-500/30'
          : theme === 'dark'
          ? 'bg-[#141A26] border-white/10 hover:border-blue-500/60 hover:bg-[#1B2435]'
          : 'bg-white border-slate-300 hover:border-blue-600 hover:bg-slate-50 shadow-sm'
      }`}
    >
      {/* Background Animated Gradient Pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        multiple
        accept={acceptedTypes ? acceptedTypes.join(',') : undefined}
        className="hidden"
      />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{
            scale: isDragOver ? 1.25 : 1,
            rotate: isDragOver ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-md ${
            isDragOver
              ? 'bg-blue-600 text-white shadow-blue-500/50'
              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white'
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </motion.div>

        <div>
          <AnimatePresence>
            {isDragOver && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Drop Files Now to Convert!
              </motion.span>
            )}
          </AnimatePresence>

          <h3
            className={`text-lg md:text-xl font-extrabold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {isDragOver ? 'Release files to load them' : 'Choose files or drag & drop them here'}
          </h3>
          <p
            className={`text-xs md:text-sm mt-1.5 max-w-md mx-auto font-medium ${
              theme === 'dark' ? 'text-[#B5BDD1]' : 'text-slate-600'
            }`}
          >
            {subtitle}
          </p>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition-all duration-200"
        >
          <FilePlus className="w-4 h-4" />
          <span>Select Files</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

