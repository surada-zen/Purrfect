
import React from 'react';
import { Note } from '../types';
import { StarIcon, TrashIcon } from './icons/Icons';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isActive, onSelect, onDelete, onToggleFavorite }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(note.id);
  };

  return (
    <div
      onClick={() => onSelect(note.id)}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
        isActive
          ? 'bg-white/20 dark:bg-black/20'
          : 'hover:bg-white/10 dark:hover:bg-black/10'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-md text-gray-800 dark:text-gray-100 truncate pr-2 flex-1">
          {note.title || 'Untitled Note'}
        </h3>
        <div className="flex items-center space-x-2">
            <button onClick={handleToggleFavorite} className={`transition-transform duration-200 ${note.isFavorite ? 'text-yellow-400' : 'text-gray-400 group-hover:text-yellow-400'}`}>
                <StarIcon filled={note.isFavorite} className="w-5 h-5" />
            </button>
            <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
        {note.content ? new DOMParser().parseFromString(note.content, 'text/html').body.textContent?.substring(0, 40) + '...' : 'No content'}
      </p>
    </div>
  );
};

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, activeNoteId, onSelectNote, onDeleteNote, onToggleFavorite }) => {
  if (notes.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 dark:text-gray-400">
        <p>No notes yet.</p>
        <p>Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isActive={note.id === activeNoteId}
          onSelect={onSelectNote}
          onDelete={onDeleteNote}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};