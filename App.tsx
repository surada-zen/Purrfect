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
        <div className="flex-1 flex flex-col justify-center items-center text-center p-8 select-none text-white">
            {hasNotes ? (
                <div className="flex items-center justify-center gap-4 mb-4">
                    {/* DEBUG: Using a relative path and adding a border to troubleshoot */}
                    <img src="mascot.png" alt="Purrfect Pages Mascot" className="w-28 h-28 drop-shadow-lg border-4 border-red-500" />
                    <img src="https://res.cloudinary.com/your-cloud-name/image/upload/your-image-url" alt="Description" className="w-28 h-28 drop-shadow-lg border-4 border-red-500" />
                    <div className="text-left">
                        <h2 className="text-4xl font-bold mb-2 drop-shadow-lg" style={{textShadow: '0 2px 10px rgba(255, 105, 180, 0.7)'}}>
                            Select a note
                        </h2>
                        <p className="text-lg text-gray-300 drop-shadow-lg">
                            Choose a note to continue.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-center gap-4 mb-4">
                         {/* DEBUG: Using a relative path and adding a border to troubleshoot */}
                        <img src="./assets/mascot.png" alt="Purrfect Pages Mascot" className="w-20 h-20 drop-shadow-lg border-4 border-red-500" />
                        <img src="https://res.cloudinary.com/your-cloud-name/image/upload/your-image-url" alt="Description" className="w-28 h-28 drop-shadow-lg border-4 border-red-500" />
                        <h2 className="text-4xl font-bold drop-shadow-lg" style={{textShadow: '0 2px 10px rgba(255, 105, 180, 0.7)'}}>
                            Welcome to Purrfect Pages! 🎀
                        </h2>
                    </div>

                    <div className="max-w-md text-left text-lg text-gray-200 mt-4 space-y-2 drop-shadow-lg">
                        <p>Hello there! This is your new cute and cozy notepad.</p>
                        <p>Here are a few tips to get you started:</p>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Create new notes with the '<strong>+ New Note</strong>' button.</li>
                            <li>Click on a note in the list to edit it.</li>
                            <li>Use the ⭐ to mark your favorites.</li>
                            <li>Organize with categories!</li>
                        </ul>
                        <p className="text-center pt-4">Happy writing!</p>
                    </div>
                </>
            )}
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

  const allCategories = useMemo(() => {
    const categories = new Set(notes.map(n => n.category));
    return Array.from(categories).filter(c => c && c !== 'Uncategorized');
  }, [notes]);
  
  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    if(window.innerWidth < 768) setSidebarOpen(false);
  }

  return (
    <div className="h-screen w-screen font-sans text-gray-800 dark:text-gray-200 relative">
      <AnimatedStarryNight />
      <div className="relative z-10 h-full w-full flex overflow-hidden">
        
        {/* Sidebar container. Animates width, hides overflow. */}
        <div className={`flex-shrink-0 h-full transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
            <Sidebar
                notes={filteredNotesBySearch}
                categories={[...allCategories, 'Uncategorized']}
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
                            allCategories={[...allCategories, 'Uncategorized']}
                            updateNote={updateNote}
                        />
                    ) : (
                        <WelcomeScreen hasNotes={notes.length > 0} />
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}