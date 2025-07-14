import React, { useState, ChangeEvent } from 'react';
import { Note, Category, Theme } from '../types';
import { NoteList } from './NoteList';
import { NewNoteIcon, StarIcon, SearchIcon } from './icons/Icons';
import { Sun, Moon } from 'lucide-react';

interface SidebarProps {
  notes: Note[];
  categories: Category[];
  activeNoteId: string | null;
  onAddNote: () => void;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  onSearch: (query: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  categories,
  activeNoteId,
  onAddNote,
  onSelectNote,
  onDeleteNote,
  onToggleFavorite,
  categoryFilter,
  setCategoryFilter,
  onSearch,
  theme,
  setTheme,
}) => {
  const handleThemeChange = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    onSearch(e.target.value);
  };

  const filteredNotes = notes
    .filter((note: Note) => {
      if (categoryFilter === 'all') return true;
      if (categoryFilter === 'favorites') return note.isFavorite;
      return note.category === categoryFilter;
    })
    .sort((a: Note, b: Note) => b.updatedAt - a.updatedAt);

  interface FilterButtonProps {
    value: string;
    label: React.ReactNode;
  }

  const FilterButton: React.FC<FilterButtonProps> = ({ value, label }) => (
    <button
      onClick={() => setCategoryFilter(value)}
      className={`px-3 py-1 text-sm rounded-full transition-colors min-w-[80px] w-24 overflow-hidden whitespace-nowrap truncate
      ${theme === 'light'
        ? categoryFilter === value
          ? 'bg-[#f9bec5] text-[#b83280] font-semibold shadow-md'
          : 'bg-[#ffe4ec] text-[#b83280] hover:bg-[#ffd1e3] hover:text-[#9a7b94]'
        : categoryFilter === value
          ? 'bg-purr-pink-dark dark:text-purr-text-dark text-black font-semibold'
          : 'bg-black/20 dark:text-purr-text-dark text-gray-200 hover:bg-black/30'}
    `}
    style={{ transition: 'background 0.2s, color 0.2s' }}
    title={typeof label === 'string' ? label : (typeof value === 'string' ? value : undefined)}
  >
    {label}
  </button>
);

  return (
    <aside className="w-72 flex-shrink-0 h-full flex flex-col bg-purr-pink-light/20 dark:bg-purr-bg-dark-secondary/40 backdrop-blur-lg text-gray-800 dark:text-gray-200 border-r border-white/10 dark:border-black/20 overflow-hidden" style={theme === 'dark' ? {} : { color: '#9a7b94' }}>
        <div className="h-32 p-4 border-b border-white/20 dark:border-black/20 flex items-center justify-between flex-shrink-0 relative">
            {/* Only the logo, large and high-res */}
            <img src="/assets/pp.png" alt="Purrfect Pages Logo" className="h-full w-full object-contain mx-auto" />
            <button
              onClick={handleThemeChange}
              className="p-2 rounded-full backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/30 dark:border-black/30 transition-colors text-gray-500 dark:text-gray-200 z-20 text-2xl shadow-sm hover:bg-white/40 dark:hover:bg-black/40"
              title={`Theme: ${theme}`}
            >
              {theme === 'light' ? (
                <Sun className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <Moon className="w-6 h-6" strokeWidth={1.5} />
              )}
            </button>
        </div>

        <div className="p-4 border-b border-white/20 dark:border-black/20 flex-shrink-0 space-y-4">
             <button
                onClick={onAddNote}
                className="w-full flex items-center justify-center space-x-2 text-sm p-2 rounded-lg bg-white/20 dark:bg-black/20 text-[#b83280] dark:text-white hover:bg-white/30 dark:hover:bg-black/30 transition-colors overflow-hidden whitespace-nowrap truncate"
            >
                <NewNoteIcon className="w-5 h-5" />
                <span>New Note</span>
            </button>
             <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 dark:bg-black/20 border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                onChange={handleSearch}
              />
            </div>
        </div>

        <div className="p-3 border-b border-white/20 dark:border-black/20 flex-shrink-0">
            <h2 className="text-md font-bold mb-2 px-1" style={theme === 'dark' ? {} : { color: '#9a7b94' }}>Filters</h2>
            <div className="flex flex-wrap gap-2">
                <FilterButton value="all" label="All" />
                <FilterButton value="favorites" label={<StarIcon className="w-4 h-4 inline-block" />} />
                {categories.map((cat) => (
                <FilterButton key={cat} value={cat} label={cat} />
                ))}
            </div>
        </div>

        <div className="flex-grow overflow-y-auto">
            <NoteList
                notes={filteredNotes}
                activeNoteId={activeNoteId}
                onSelectNote={onSelectNote}
                onDeleteNote={onDeleteNote}
                onToggleFavorite={onToggleFavorite}
            />
        </div>
    </aside>
  );
};