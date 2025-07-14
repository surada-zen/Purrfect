import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Note } from '../types';
import { ExportIcon, TrashIcon, CloseIcon } from './icons/Icons';

const FONT_SIZES = [
  { label: 'Small', value: 'text-base' },
  { label: 'Medium', value: 'text-lg' },
  { label: 'Large', value: 'text-xl' },
  { label: 'Extra Large', value: 'text-2xl' },
];

interface NoteEditorProps {
  note: Note;
  allCategories: string[];
  updateNote: (id: string, updates: Partial<Note>) => void;
  addCategory: (newCategory: string) => void;
  onDeleteCategory: (category: string) => void;
  theme: 'light' | 'dark';
  onCloseNote?: () => void;
}

type CustomDropdownOption = { value: string; label: string; disabled?: boolean };
interface CustomDropdownProps {
  options: CustomDropdownOption[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  buttonClass?: string;
  menuClass?: string;
  itemClass?: string;
  label?: string;
  style?: React.CSSProperties;
}
function CustomDropdown({ options, value, onChange, className, buttonClass, menuClass, itemClass, label, style, theme }: CustomDropdownProps & { theme: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div className={className} style={style} ref={ref}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? selected.label : label}
        <span className="ml-2">▼</span>
      </button>
      {open && (
        <ul className={menuClass} tabIndex={-1} role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              className={
                (opt.disabled
                  ? 'text-[#b0aeb8] font-normal cursor-not-allowed '
                  : (opt.value === value
                      ? (theme === 'light'
                          ? 'font-bold bg-[#f9bec5]/60 text-[#b83280] '
                          : 'font-bold bg-[#fff]/20 text-purr-text-dark ')
                      : '')) +
                ' overflow-hidden whitespace-nowrap truncate ' +
                itemClass
              }
              role="option"
              aria-selected={opt.value === value}
              aria-disabled={!!opt.disabled}
              tabIndex={opt.disabled ? -1 : 0}
              onClick={() => { if (!opt.disabled) { onChange(opt.value); setOpen(false); } }}
              onKeyDown={(e: React.KeyboardEvent) => { if (!opt.disabled && e.key === 'Enter') { onChange(opt.value); setOpen(false); }}}
              style={opt.disabled ? { pointerEvents: 'none' } : {}}
              title={opt.label}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, allCategories, updateNote, addCategory, onDeleteCategory, theme, onCloseNote }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fontSize, setFontSize] = useState('text-lg');
  
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // This effect syncs the editor's state and DOM content when the note prop changes.
  useEffect(() => {
    setTitle(note.title);
    setCategory(note.category);
    setContent(note.content);

    // Imperatively update the editor's content ONLY when the note prop changes.
    // This avoids re-rendering the div from React's side during typing,
    // which is the cause of the cursor jump.
    if (editorRef.current && editorRef.current.innerHTML !== note.content) {
      editorRef.current.innerHTML = note.content;
    }
  }, [note]); // Depend on the entire note object to detect changes.

  // Debounced autosave
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only save if the content has actually changed from what's in the note prop.
      if (title !== note.title || content !== note.content || category !== note.category) {
        updateNote(note.id, { 
            title, 
            content, 
            category,
            updatedAt: Date.now() 
        });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, category, note, updateNote]);

  // Handle clicks outside export menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
        if(typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    }
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new_category') {
      setIsEditingCategory(true);
    } else {
      setCategory(value);
      setIsEditingCategory(false);
    }
  };
  
  const handleNewCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        const newCat = e.currentTarget.value.trim();
        if(newCat) {
            addCategory(newCat);
            setCategory(newCat);
            setIsEditingCategory(false);
        }
    }
  }

  const exportAs = (format: 'txt' | 'html') => {
    const blob = new Blob([format === 'txt' ? new DOMParser().parseFromString(content, 'text/html').body.textContent || '' : content], { type: format === 'txt' ? 'text/plain' : 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'untitled'}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formattedDate = useMemo(() => {
    return new Date(note.updatedAt).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [note.updatedAt]);

  const handleEditorKeyDown = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(true);
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 700); // User is "typing" for 700ms after last keypress
  };

  return (
    <div className="flex flex-col h-screen p-4 md:p-8 bg-purr-pink-light/80 dark:bg-purr-bg-dark/80 backdrop-blur-md relative">
      <div className="flex-shrink-0 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="relative">
            {!isEditingCategory ? (
                <div className="relative flex items-center gap-2">
                  {/* Category Selector */}
                  <CustomDropdown
                    options={[
                      { value: '', label: 'No Category', disabled: true },
                      ...allCategories.map(cat => ({ value: cat, label: cat })),
                      { value: 'new_category', label: '+ New Category' },
                    ]}
                    value={category}
                    onChange={val => {
                      if (val === 'new_category') setIsEditingCategory(true);
                      else { setCategory(val); setIsEditingCategory(false); }
                    }}
                    className="relative"
                    buttonClass={`px-3 py-1 text-sm rounded-full min-w-[80px] w-24 truncate overflow-hidden whitespace-nowrap font-semibold transition-colors shadow-md flex items-center justify-between
                      ${theme === 'light'
                        ? 'bg-[#ffe4ec] text-[#b83280]'
                        : category
                          ? 'bg-purr-pink-dark text-purr-text-dark font-semibold'
                          : 'bg-black/20 text-purr-text-dark hover:bg-black/30'}
                    `}
                    menuClass={`absolute left-0 mt-1 w-full rounded-xl shadow-lg z-20 border border-white/30 dark:border-black/30
                      ${theme === 'light' ? 'bg-[#ffe4ec]' : 'bg-[#2C2A3A]'}
                    `}
                    itemClass={`px-3 py-2 cursor-pointer rounded-xl transition-colors overflow-hidden whitespace-nowrap truncate
                      ${theme === 'light' ? 'text-[#b83280]' : 'text-purr-text-dark'}
                    `}
                    label="Category"
                    theme={theme}
                  />
                </div>
            ) : (
                <input
                    type="text"
                    placeholder="New category..."
                    autoFocus
                    onKeyDown={handleNewCategory}
                    onBlur={() => setIsEditingCategory(false)}
                    className="bg-white dark:bg-gray-700 text-sm py-1 px-3 rounded-full border border-purr-pink"
                />
            )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {formattedDate}
            </span>
        </div>
        <div className="relative" ref={exportMenuRef}>
          {onCloseNote && (
            <button
              onClick={onCloseNote}
              className="ml-2 p-2 rounded-full backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/30 dark:border-black/30 transition-colors text-gray-500 dark:text-gray-200 shadow-sm hover:bg-white/40 dark:hover:bg-black/40"
              title="Close Note"
              aria-label="Close Note"
              style={{ minWidth: 40, minHeight: 40, position: 'absolute', right: 0, top: 0 }}
            >
              <CloseIcon className="w-5 h-5" strokeWidth={1.5} />
            </button>
          )}
          <button
            onClick={() => setExportMenuOpen(v => !v)}
            className="p-2 rounded-full text-purr-text-light dark:text-purr-text-dark hover:bg-purr-pink-light/50 dark:hover:bg-purr-bg-dark-secondary/50 transition-colors"
            title="Export Note"
            style={{ marginRight: onCloseNote ? 48 : 0 }}
          >
            <ExportIcon className="w-5 h-5"/>
            <span className="sr-only">Export Note</span>
          </button>
          {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/30 dark:bg-purr-bg-dark-secondary/60 backdrop-blur-lg border border-white/30 dark:border-black/30 shadow-lg rounded-md py-1 z-10">
                    <button
                        onClick={() => { exportAs('txt'); setExportMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-purr-pink dark:hover:bg-purr-bg-dark transition-colors"
                        style={{ color: theme === 'dark' ? '#f8f8f8' : '#b83280' }}
                    >
                        As Text (.txt)
                    </button>
                    <button
                        onClick={() => { exportAs('html'); setExportMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-purr-pink dark:hover:bg-purr-bg-dark transition-colors"
                        style={{ color: theme === 'dark' ? '#f8f8f8' : '#b83280' }}
                    >
                        As HTML (.html)
                    </button>
                </div>
            )}
        </div>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleEditorKeyDown}
        placeholder="Note Title"
        className="w-full text-3xl md:text-4xl font-bold bg-transparent focus:outline-none mb-4 text-purr-text-light dark:text-purr-text-dark placeholder-c08497"
        style={theme === 'dark' ? {} : { color: '#9a7b94', caretColor: '#9a7b94' }}
      />
      <hr className="border-t-2 border-white/30 dark:border-black/30 my-2 mx-auto w-full" />
      <div
        ref={editorRef}
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        onKeyDown={handleEditorKeyDown}
        contentEditable
        suppressContentEditableWarning={true}
        data-placeholder="Start writing your purrfect thoughts here..."
        className={`flex-grow min-h-0 w-full overflow-y-auto bg-white/30 dark:bg-purr-bg-dark/40 backdrop-blur-lg rounded-2xl border border-white/30 dark:border-black/30 shadow-lg p-6 focus:outline-none ${fontSize} text-purr-text-light dark:text-purr-text-dark leading-relaxed scrollbar-thin scrollbar-thumb-purr-pink/40 scrollbar-track-transparent transition-all [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:float-left`}
        style={theme === 'dark' ? {} : { color: '#9a7b94', caretColor: '#9a7b94' }}
      />
    </div>
  );
};