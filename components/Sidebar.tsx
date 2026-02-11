
import React, { useMemo, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task, Todo, QuickLink, ImportantDate, SidebarLayout } from '../types';

import TodoList from './TodoList';
import Notes from './Notes';
import PinnedMissions from './PinnedMissions';
import QuickLinks from './QuickLinks';
import ImportantDates from './ImportantDates';
import SidebarPanel from './SidebarPanel';
import QuickLinkModal from './QuickLinkModal';
import ImportantDateModal from './ImportantDateModal';


interface SidebarProps {
  tasks: Task[];
  todos: Todo[];
  notes: string;
  onNotesChange: (notes: string) => void;
  quickLinks: QuickLink[];
  importantDates: ImportantDate[];
  layout: SidebarLayout;
  setLayout: (layout: SidebarLayout) => void;
  onSaveQuickLink: (link: Omit<QuickLink, 'id'>) => void;
  onDeleteQuickLink: (id: string) => void;
  onSaveImportantDate: (date: Omit<ImportantDate, 'id'>) => void;
  onDeleteImportantDate: (id: string) => void;
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { 
    tasks, layout, setLayout, onNotesChange, 
    onSaveQuickLink, onDeleteQuickLink, onSaveImportantDate, onDeleteImportantDate,
    onAddTodo, onToggleTodo, onDeleteTodo
  } = props;
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const yapingMissions = useMemo(() => tasks.filter(task => 
    task.tags.some(tag => tag.toLowerCase() === 'yaping')
  ), [tasks]);

  const componentMap: { [key: string]: { title: string; component: React.ReactNode; hidden?: boolean } } = {
    pinned: { title: "Yaping Leaderboards", component: <PinnedMissions tasks={yapingMissions} />, hidden: yapingMissions.length === 0 },
    quicklinks: { title: "Quick Links", component: <QuickLinks links={props.quickLinks} onDelete={onDeleteQuickLink} onOpenModal={() => setActiveModal('quicklink')} /> },
    dates: { title: "중요일정", component: <ImportantDates importantDates={props.importantDates} onDelete={onDeleteImportantDate} onOpenModal={() => setActiveModal('importantdate')} /> },
    todos: { title: "To-Do List", component: <TodoList todos={props.todos} onAdd={onAddTodo} onToggle={onToggleTodo} onDelete={onDeleteTodo} /> },
    notes: { title: "Notes", component: <Notes notes={props.notes} onNotesChange={onNotesChange} /> },
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    
    const newLayout = { ...layout };
    const sourceCol = [...newLayout[sourceColId as keyof SidebarLayout]];
    const [movedItem] = sourceCol.splice(source.index, 1);

    if (sourceColId === destColId) {
      sourceCol.splice(destination.index, 0, movedItem);
      newLayout[sourceColId as keyof SidebarLayout] = sourceCol;
    } else {
      const destCol = [...newLayout[destColId as keyof SidebarLayout]];
      destCol.splice(destination.index, 0, movedItem);
      newLayout[sourceColId as keyof SidebarLayout] = sourceCol;
      newLayout[destColId as keyof SidebarLayout] = destCol;
    }
    setLayout(newLayout);
  };

  const renderColumn = (columnId: keyof SidebarLayout) => (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div 
          ref={provided.innerRef} 
          {...provided.droppableProps}
          className={`space-y-8 transition-colors duration-200 rounded-2xl ${snapshot.isDraggingOver ? 'bg-white/20' : ''}`}
        >
          {layout[columnId].map((key, index) => {
            const item = componentMap[key];
            if (item.hidden) return null;
            return (
              <Draggable key={key} draggableId={key} index={index}>
                {(provided, snapshot) => (
                   <SidebarPanel 
                      title={item.title}
                      provided={provided}
                      snapshot={snapshot}
                    >
                      {item.component}
                   </SidebarPanel>
                )}
              </Draggable>
            )
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderColumn('column1')}
              {renderColumn('column2')}
          </div>
      </DragDropContext>

      {activeModal === 'quicklink' && (
        <QuickLinkModal 
            onClose={() => setActiveModal(null)} 
            onSave={onSaveQuickLink} 
        />
      )}
      {activeModal === 'importantdate' && (
        <ImportantDateModal 
            onClose={() => setActiveModal(null)} 
            onSave={onSaveImportantDate} 
        />
      )}
    </>
  );
};

export default Sidebar;