import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ConverterTool } from '../types/converter';

interface ToolCardProps {
  tool: ConverterTool;
  onClick: (tool: ConverterTool) => void;
  theme: 'dark' | 'light';
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, theme }) => {
  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.File;

  return (
    <div
      onClick={() => onClick(tool)}
      className={`group cursor-pointer relative p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 select-none flex flex-col justify-between overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#141A26] border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10'
          : 'bg-white border-slate-200/90 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/10'
      }`}
    >
      {/* Subtle Glow Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
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
        className={`mt-5 pt-3.5 flex items-center justify-between text-xs font-bold transition-opacity ${
          theme === 'dark'
            ? 'border-t border-white/10 text-blue-400 opacity-90 group-hover:opacity-100'
            : 'border-t border-slate-200 text-blue-600 group-hover:text-blue-700'
        }`}
      >
        <span>Start Converting</span>
        <LucideIcons.ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
