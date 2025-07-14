import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Note } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';
import { SidebarCloseIcon, SidebarOpenIcon } from './components/icons/Icons';
import AnimatedStarryNight from './components/AnimatedStarryNight';

const WelcomeScreen: React.FC<{ hasNotes: boolean }> = ({ hasNotes }) => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-6 select-none">
            <img src="/assets/kitty.png" alt="Purrfect Pages Mascot" className="w-36 h-36 mt-0 mb-0 drop-shadow-lg" />
            <img src="/assets/pp.png" alt="Purrfect Pages Logo" className="w-80 h-80 -mt-20 -mb-16 drop-shadow-lg" />
            <div className="max-w-md bg-white/20 dark:bg-purr-bg-dark-secondary/40 rounded-xl p-4 mt-1 shadow-lg backdrop-blur-md">
                <h3 className="text-xl font-semibold mb-1 text-[#9a7b94] dark:text-white">About Notepad</h3>
                <p className="mb-1 text-[#9a7b94] dark:text-white">Purrfect Pages is a lightweight, distraction-free notepad designed to help you capture your thoughts with ease and joy.</p>
                <ul className="list-disc list-inside text-left space-y-1 pl-4 text-[#9a7b94] dark:text-white">
                    <li>Create, edit, and delete notes instantly</li>
                    <li>Organize notes with custom categories</li>
                    <li>Mark your favorite notes for quick access</li>
                    <li>Enjoy a beautiful, minimalist, and responsive design</li>
                    <li>All your notes are saved locally for privacy and speed</li>
                </ul>
            </div>
        </div>
    );
};


export default function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('purrfect-notes', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [theme, setTheme] = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  }

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      category: 'Uncategorized',
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    if(window.innerWidth < 768) setSidebarOpen(false);
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.length > 1 ? notes.find(n => n.id !== id)?.id || null : null);
    }
  }, [activeNoteId, notes, setNotes]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      )
    );
  }, [setNotes]);
  
  const toggleFavorite = useCallback((id: string) => {
    setNotes((prev) => 
        prev.map((note) => 
            note.id === id ? {...note, isFavorite: !note.isFavorite, updatedAt: Date.now()} : note
        )
    )
  }, [setNotes]);

  const activeNote = useMemo(() => notes.find((note) => note.id === activeNoteId), [notes, activeNoteId]);

  const filteredNotesBySearch = useMemo(() => {
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      new DOMParser().parseFromString(note.content, 'text/html').body.textContent?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  // Handler to add a new category
  const addCategory = useCallback((newCategory: string) => {
    setCategories((prev) => {
      if (!prev.includes(newCategory) && newCategory !== 'Uncategorized') {
        return [...prev, newCategory];
      }
      return prev;
    });
  }, []);

  // Handler to delete a category and reassign notes
  const deleteCategory = useCallback((catToDelete: string) => {
    setCategories((prev) => prev.filter((cat) => cat !== catToDelete));
    setNotes((prevNotes) => prevNotes.map(note =>
      note.category === catToDelete ? { ...note, category: 'Uncategorized', updatedAt: Date.now() } : note
    ));
  }, [setCategories, setNotes]);
  
  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    if(window.innerWidth < 768) setSidebarOpen(false);
  }

  const handleCloseNote = () => setActiveNoteId(null);

  return (
    <div className="h-screen w-screen font-sans text-gray-800 dark:text-gray-200 relative">
      <AnimatedStarryNight theme={theme} />
      <div className="relative z-10 h-full w-full flex overflow-hidden">
        
        {/* Sidebar container. Animates width, hides overflow. */}
        <div className={`flex-shrink-0 h-full transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
            <Sidebar
                notes={filteredNotesBySearch}
                categories={[...categories, 'Uncategorized']}
                activeNoteId={activeNoteId}
                onAddNote={addNote}
                onSelectNote={handleSelectNote}
                onDeleteNote={deleteNote}
                onToggleFavorite={toggleFavorite}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                onSearch={setSearchQuery}
                theme={theme}
                setTheme={setTheme}
            />
        </div>
        
        {/* Main content area that will grow and shrink */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
            {/* Button is positioned relative to this content area */}
            <button
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-0 z-40 p-2 bg-purr-bg-dark-secondary/80 border border-purr-bg-dark rounded-full text-gray-300 hover:bg-purr-bg-dark-secondary"
            >
                {isSidebarOpen ? <SidebarCloseIcon className="w-4 h-4" /> : <SidebarOpenIcon className="w-4 h-4" />}
            </button>
        
            <div className="flex-1 flex flex-col">
                <AnimatedStarryNight theme={theme} />
                <div className="relative z-10">
                    {activeNote ? (
                        <NoteEditor
                            key={activeNote.id}
                            note={activeNote}
                            allCategories={[...categories, 'Uncategorized']}
                            addCategory={addCategory}
                            onDeleteCategory={deleteCategory}
                            updateNote={updateNote}
                            theme={theme}
                            onCloseNote={handleCloseNote}
                        />
                    ) : (
                        <WelcomeScreen hasNotes={false} />
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}