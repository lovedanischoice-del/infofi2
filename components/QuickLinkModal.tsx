
import React, { useState } from 'react';
import { QuickLink } from '../types';

interface QuickLinkModalProps {
  onClose: () => void;
  onSave: (link: Omit<QuickLink, 'id'>) => void;
}

const QuickLinkModal: React.FC<QuickLinkModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || url.trim() === '') {
        alert("Title and URL are required.");
        return;
    }
    
    try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (_) {
        alert("Please enter a valid URL.");
        return;
    }
    
    onSave({ title, url });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-rose-50/80 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg w-full max-w-md p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-light">Add Quick Link</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="link-title" className="block text-sm font-medium text-medium mb-1">Title</label>
              <input
                id="link-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="e.g., Google"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="link-url" className="block text-sm font-medium text-medium mb-1">URL</label>
              <input
                id="link-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="example.com"
                required
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-light font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-fuchsia-600 text-white font-bold rounded-lg transition-colors"
            >
              Save Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickLinkModal;