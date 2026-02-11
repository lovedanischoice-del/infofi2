
import React, { useMemo } from 'react';
import { ImportantDate } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImportantDatesProps {
  importantDates: ImportantDate[];
  onDelete: (id: string) => void;
  onOpenModal: () => void;
}

const ImportantDates: React.FC<ImportantDatesProps> = ({ importantDates, onDelete, onOpenModal }) => {
    
    const sortedDates = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare with the start of today
        
        return [...importantDates]
            .filter(d => new Date(d.date.replace(/-/g, '/')) >= today) // Filter out past dates
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [importantDates]);

    return (
        <div className="relative">
            {importantDates.length > 0 && (
                <button
                    onClick={onOpenModal}
                    className="absolute -top-14 right-0 bg-accent hover:bg-fuchsia-600 text-white p-2 rounded-lg"
                    aria-label="Add important date"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            )}
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {sortedDates.map((d) => (
                    <div key={d.id} className="flex items-center justify-between bg-white/50 p-2 rounded-md group">
                        <div className="flex items-center space-x-3 text-light truncate">
                            <div className="text-center flex-shrink-0 w-12">
                                <p className="text-xs text-accent uppercase font-bold">{new Date(d.date.replace(/-/g, '/')).toLocaleDateString('en-US', { month: 'short' })}</p>
                                <p className="font-bold text-lg">{new Date(d.date.replace(/-/g, '/')).getUTCDate()}</p>
                            </div>
                            <div className="truncate">
                                <p className="font-semibold text-sm truncate" title={d.text}>{d.text}</p>
                                <p className="text-xs text-medium">{new Date(d.date.replace(/-/g, '/')).toLocaleDateString('ko-KR', { weekday: 'long' })}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onDelete(d.id)}
                            className="text-medium hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`'${d.text}' 삭제`}
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {importantDates.length === 0 && (
                     <button 
                      onClick={onOpenModal}
                      className="flex w-full items-center justify-center rounded-lg bg-accent py-3 text-center text-white font-bold transition-colors duration-200 hover:bg-fuchsia-600"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      <span>Add important date</span>
                    </button>
                )}
                 {importantDates.length > 0 && sortedDates.length === 0 && (
                     <p className="text-center text-sm text-medium py-2">남아있는 일정이 없습니다.</p>
                 )}
            </div>
        </div>
    );
};
export default ImportantDates;