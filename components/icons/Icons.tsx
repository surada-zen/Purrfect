import React from 'react';
import {
  Download,
  Menu,
  Moon,
  NotebookPen,
  Search,
  Star,
  Sun,
  Trash2,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

// Using a more descriptive icon for creating a new note.
export const NewNoteIcon = NotebookPen;

// StarIcon wrapper to handle the 'filled' state, maintaining the existing prop interface.
export const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ filled, ...props }) => (
  <Star fill={filled ? 'currentColor' : 'none'} {...props} />
);

// Re-exporting other icons from lucide-react for use throughout the app.
export const TrashIcon = Trash2;
export const SearchIcon = Search;
export const MoonIcon = Moon;
export const SunIcon = Sun;
export const MenuIcon = Menu;
export const CloseIcon = X;
export const ExportIcon = Download;
export const SidebarCloseIcon = PanelLeftClose;
export const SidebarOpenIcon = PanelLeftOpen;