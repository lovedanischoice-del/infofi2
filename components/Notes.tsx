
import React from 'react';

interface NotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const Notes: React.FC<NotesProps> = ({ notes, onNotesChange }) => {
  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Jot down your notes here..."
        className="w-full h-48 bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
      ></textarea>
    </div>
  );
};

export default Notes;