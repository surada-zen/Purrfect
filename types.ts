
export interface Note {
  id: string;
  title:string;
  content: string;
  category: Category;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export type Category = string;

export type Theme = 'light' | 'dark';