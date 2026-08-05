import React, { useState } from 'react';
import { ConverterTool, ToolCategory } from '../../types/converter';
import { ALL_TOOLS } from '../../data/tools';
import { filterAndSortTools } from '../../utils/searchUtils';
import { ToolCard } from '../ToolCard';
import { Search } from 'lucide-react';

interface CategoryToolsPageProps {
  category: ToolCategory;
  title: string;
  description: string;
  onSelectTool: (tool: ConverterTool) => void;
  theme: 'dark' | 'light';
}

export const CategoryToolsPage: React.FC<CategoryToolsPageProps> = ({
  category,
  title,
  description,
  onSelectTool,
  theme,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const catSubset = ALL_TOOLS.filter((t) => t.category === category);
  const categoryTools = filterQuery ? filterAndSortTools(catSubset, filterQuery) : catSubset;

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">
            {description}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={`Filter ${title}...`}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border ${
              theme === 'dark'
                ? 'bg-[#1E293B] border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600'
            }`}
          />
        </div>
      </div>

      {categoryTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={onSelectTool} theme={theme} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-100 dark:bg-slate-800/50">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No tools found matching "{filterQuery}"
          </p>
        </div>
      )}
    </div>
  );
};
