
import React from 'react';
import { QuickLink } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LinkIcon } from './icons/LinkIcon';

interface QuickLinksProps {
  links: QuickLink[];
  onDelete: (id: string) => void;
  onOpenModal: () => void;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ links, onDelete, onOpenModal }) => {
  
  return (
    <div className="relative">
       {links.length > 0 && (
        <button
          onClick={onOpenModal}
          className="absolute -top-14 right-0 bg-accent hover:bg-fuchsia-600 text-white p-2 rounded-lg"
          aria-label="Add link"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      )}
    
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between bg-white/50 p-2 rounded-md group">
            <a
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-light hover:text-accent transition-colors truncate"
            >
              <LinkIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate" title={link.title}>{link.title}</span>
            </a>
            <button
              onClick={() => onDelete(link.id)}
              className="text-medium hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete ${link.title}`}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        {links.length === 0 && (
          <button 
            onClick={onOpenModal}
            className="flex w-full items-center justify-center rounded-lg bg-accent py-3 text-center text-white font-bold transition-colors duration-200 hover:bg-fuchsia-600"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span>Add your quick link</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickLinks;