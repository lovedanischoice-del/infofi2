
import React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { GrabHandleIcon } from './icons/GrabHandleIcon';

interface SidebarPanelProps {
  title: string;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  children: React.ReactNode;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ title, provided, snapshot, children }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg transition-shadow duration-200 ${snapshot.isDragging ? 'shadow-2xl' : ''}`}
    >
        <div 
            {...provided.dragHandleProps}
            className="flex items-center p-4 border-b border-white/20 cursor-grab active:cursor-grabbing"
            aria-label={`Drag to reorder ${title}`}
        >
            <GrabHandleIcon className="w-5 h-5 text-medium mr-3" />
            <h3 className="text-xl font-bold text-light">{title}</h3>
        </div>
        <div className="p-6 pt-4">
             {children}
        </div>
    </div>
  );
};

export default SidebarPanel;
