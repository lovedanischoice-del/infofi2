
import React, { useState, useCallback } from 'react';
import { Task, Todo, QuickLink, ImportantDate, SidebarLayout } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon } from './components/icons/PlusIcon';
import Sidebar from './components/Sidebar';
import useLocalStorage from './hooks/useLocalStorage';

const defaultSidebarLayout: SidebarLayout = {
  column1: ['pinned', 'quicklinks', 'dates'],
  column2: ['todos', 'notes'],
};

const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('crypto-missions:tasks', []);
  const [todos, setTodos] = useLocalStorage<Todo[]>('crypto-missions:todos', []);
  const [notes, setNotes] = useLocalStorage<string>('crypto-missions:notes', '');
  const [quickLinks, setQuickLinks] = useLocalStorage<QuickLink[]>('crypto-missions:quickLinks', []);
  const [importantDates, setImportantDates] = useLocalStorage<ImportantDate[]>('crypto-missions:importantDates', []);
  const [sidebarLayout, setSidebarLayout] = useLocalStorage<SidebarLayout>('crypto-missions:sidebarLayout', defaultSidebarLayout);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleOpenModal = useCallback((task: Task | null = null) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  }, []);

  const handleSaveTask = useCallback((task: Task) => {
    if (task.id) {
      setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks(prevTasks => [...prevTasks, { ...task, id: crypto.randomUUID(), isCompleted: false }]);
    }
    handleCloseModal();
  }, [handleCloseModal, setTasks]);

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.map(t => 
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  }, [setTasks]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTaskToDelete(taskId);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!taskToDelete) return;
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskToDelete));
    setTaskToDelete(null);
  }, [taskToDelete, setTasks]);

  const handleCancelDelete = useCallback(() => {
    setTaskToDelete(null);
  }, []);

  const handleNotesChange = useCallback((newNotes: string) => {
    setNotes(newNotes);
  }, [setNotes]);

  const handleLayoutChange = useCallback((newLayout: SidebarLayout) => {
      setSidebarLayout(newLayout);
  }, [setSidebarLayout]);
  
  const handleSaveQuickLink = useCallback((link: Omit<QuickLink, 'id'>) => {
    setQuickLinks(prev => [...prev, { ...link, id: crypto.randomUUID() }]);
  }, [setQuickLinks]);

  const handleDeleteQuickLink = useCallback((id: string) => {
    setQuickLinks(prev => prev.filter(link => link.id !== id));
  }, [setQuickLinks]);

  const handleSaveImportantDate = useCallback((newDate: Omit<ImportantDate, 'id'>) => {
    setImportantDates(prev => [...prev, { ...newDate, id: crypto.randomUUID() }]);
  }, [setImportantDates]);

  const handleDeleteImportantDate = useCallback((id: string) => {
    setImportantDates(prev => prev.filter(d => d.id !== id));
  }, [setImportantDates]);

  const handleAddTodo = useCallback((text: string) => {
    if (text.trim() === '') return;
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text, isCompleted: false }]);
  }, [setTodos]);

  const handleToggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  }, [setTodos]);

  const handleDeleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, [setTodos]);

  const handleExportData = useCallback(() => {
    const dataToExport = {
      tasks,
      todos,
      notes,
      quickLinks,
      importantDates,
      sidebarLayout,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infofi-mission-control-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [tasks, todos, notes, quickLinks, importantDates, sidebarLayout]);

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        const importedData = JSON.parse(text);

        if (window.confirm("Are you sure you want to import this data? This will overwrite your current data.")) {
          setTasks(importedData.tasks || []);
          setTodos(importedData.todos || []);
          setNotes(importedData.notes || '');
          setQuickLinks(importedData.quickLinks || []);
          setImportantDates(importedData.importantDates || []);
          setSidebarLayout(importedData.sidebarLayout || defaultSidebarLayout);
        }
      } catch (error) {
        alert("Error importing data. Please make sure the file is a valid backup file.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    // Reset file input to allow importing the same file again
    event.target.value = '';
  };

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen">
      <Header onExport={handleExportData} onImport={handleImportData} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/40 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-light">Missions Dashboard</h2>
                  <p className="text-medium">
                    {completedTasks} / {totalTasks} completed
                  </p>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full mb-6">
                <div
                  className="h-2 bg-accent rounded-full transition-all duration-500"
                  style={{ width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%' }}
                ></div>
              </div>

              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleOpenModal}
              />

              {tasks.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-medium">No missions yet.</p>
                  <button 
                    onClick={() => handleOpenModal()} 
                    className="mt-4 inline-flex items-center bg-accent hover:bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add your first mission
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:col-span-2">
            <Sidebar 
              tasks={tasks} 
              todos={todos} 
              notes={notes}
              onNotesChange={handleNotesChange}
              quickLinks={quickLinks}
              importantDates={importantDates}
              layout={sidebarLayout}
              setLayout={handleLayoutChange}
              onSaveQuickLink={handleSaveQuickLink}
              onDeleteQuickLink={handleDeleteQuickLink}
              onSaveImportantDate={handleSaveImportantDate}
              onDeleteImportantDate={handleDeleteImportantDate}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </main>
      
      {isModalOpen && (
        <TaskModal
          task={taskToEdit}
          onClose={handleCloseModal}
          onSave={handleSaveTask}
        />
      )}

      <ConfirmationModal
        isOpen={!!taskToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Mission"
        message="Are you sure you want to delete this mission? This action cannot be undone."
      />

      <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-8 right-8 bg-accent hover:bg-fuchsia-600 text-white p-4 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110"
        aria-label="Add new mission"
      >
        <PlusIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default App;
