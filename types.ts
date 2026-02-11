
export interface Task {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  isCompleted: boolean;
  logo?: string;
  endDate?: string;
  referralUrl?: string;
}

export interface Todo {
    id: string;
    text: string;
    isCompleted: boolean;
}

export interface QuickLink {
    id:string;
    title: string;
    url: string;
}

export interface ImportantDate {
    id: string;
    date: string;
    text: string;
}

export interface SidebarLayout {
  column1: string[];
  column2: string[];
}
