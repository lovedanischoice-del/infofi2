
import React, { useState } from 'react';
import { ImportantDate } from '../types';

interface ImportantDateModalProps {
  onClose: () => void;
  onSave: (date: Omit<ImportantDate, 'id'>) => void;
}

const ImportantDateModal: React.FC<ImportantDateModalProps> = ({ onClose, onSave }) => {
  const [date, setDate] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '' || date.trim() === '') {
        alert("Date and description are required.");
        return;
    }
    
    onSave({ date, text });
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
        <h2 className="text-2xl font-bold mb-6 text-light">Add Important Date</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="important-date" className="block text-sm font-medium text-medium mb-1">Date</label>
              <input
                id="important-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="important-text" className="block text-sm font-medium text-medium mb-1">Description</label>
              <input
                id="important-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="e.g., Yaping Ends"
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
              Save Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportantDateModal;
