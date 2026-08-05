import React from 'react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';
import { ConverterTool } from '../types/converter';

interface ToolCardProps {
  tool: ConverterTool;
  onClick: (tool: ConverterTool) => void;
  theme: 'dark' | 'light';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, theme }) => {
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.File;

  return (
    <motion.div
      onClick={() => onClick(tool)}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group cursor-pointer relative p-6 rounded-3xl border transition-colors duration-300 select-none flex flex-col justify-between overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#141A26] border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20'
          : 'bg-white border-slate-200/90 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/15'
      }`}
    >
      {/* Dynamic Animated Glow Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
          <IconComponent className="w-6 h-6" />
        </div>

        <h3
          className={`font-extrabold text-base transition-colors ${
            theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'
          }`}
        >
          {tool.name}
        </h3>

        <p
          className={`text-xs mt-2 leading-relaxed line-clamp-2 font-medium ${
            theme === 'dark' ? 'text-[#B5BDD1]' : 'text-slate-600'
          }`}
        >
          {tool.description}
        </p>
      </div>

      <div
        className={`relative z-10 mt-5 pt-3.5 flex items-center justify-between text-xs font-bold transition-opacity ${
          theme === 'dark'
            ? 'border-t border-white/10 text-blue-400 opacity-90 group-hover:opacity-100'
            : 'border-t border-slate-200 text-blue-600 group-hover:text-blue-700'
        }`}
      >
        <span>Start Converting</span>
        <LucideIcons.ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200 text-blue-500" />
      </div>
    </motion.div>
  );
};

