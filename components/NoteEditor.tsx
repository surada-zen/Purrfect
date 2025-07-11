import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Note } from '../types';
import { ExportIcon } from './icons/Icons';
import { BongoCat } from './BongoCat';

interface NoteEditorProps {
  note: Note;
  allCategories: string[];
  updateNote: (id: string, updates: Partial<Note>) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, allCategories, updateNote }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
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
    <div className="flex-1 flex flex-col p-4 md:p-8 h-full bg-purr-pink-light/80 dark:bg-purr-bg-dark/80 backdrop-blur-md overflow-y-auto relative">
      <div className="flex-shrink-0 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="relative">
            {!isEditingCategory ? (
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="appearance-none bg-purr-pink-light dark:bg-purr-bg-dark-secondary text-purr-text-light dark:text-purr-text-dark text-sm font-semibold py-1 px-3 rounded-full cursor-pointer"
                >
                    <option value="" disabled>No Category</option>
                    {allCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="new_category">+ New Category</option>
                </select>
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
            <button
                onClick={() => setExportMenuOpen(v => !v)}
                className="p-2 rounded-full text-purr-text-light dark:text-purr-text-dark hover:bg-purr-pink-light/50 dark:hover:bg-purr-bg-dark-secondary/50 transition-colors"
                title="Export Note"
            >
                <ExportIcon className="w-5 h-5"/>
                <span className="sr-only">Export Note</span>
            </button>
            {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-purr-bg-dark-secondary rounded-md shadow-lg py-1 z-10 border border-purr-pink dark:border-gray-600">
                    <button
                        onClick={() => { exportAs('txt'); setExportMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-purr-text-light dark:text-purr-text-dark hover:bg-purr-pink dark:hover:bg-purr-bg-dark transition-colors"
                    >
                        As Text (.txt)
                    </button>
                    <button
                        onClick={() => { exportAs('html'); setExportMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-purr-text-light dark:text-purr-text-dark hover:bg-purr-pink dark:hover:bg-purr-bg-dark transition-colors"
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
        className="w-full text-3xl md:text-4xl font-bold bg-transparent focus:outline-none mb-4 text-purr-text-light dark:text-purr-text-dark placeholder-gray-400"
      />
       <div
        ref={editorRef}
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
        onKeyDown={handleEditorKeyDown}
        contentEditable
        suppressContentEditableWarning={true}
        data-placeholder="Start writing your purrfect thoughts here..."
        className="flex-1 w-full bg-transparent focus:outline-none text-lg resize-none text-purr-text-light dark:text-purr-text-dark leading-relaxed 
                   [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:float-left"
      />
      <BongoCat isTyping={isTyping} />
    </div>
  );
};