
import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';
import useAuthWithRole from './hooks/useAuthWithRole';

import { Task, Todo, QuickLink, ImportantDate, SidebarLayout } from './types';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon } from './components/icons/PlusIcon';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';

const defaultSidebarLayout: SidebarLayout = {
  column1: ['pinned', 'quicklinks', 'dates'],
  column2: ['todos', 'notes'],
};

const App: React.FC = () => {
  const { user, role, loading } = useAuthWithRole();
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [sidebarLayout, setSidebarLayout] = useState<SidebarLayout>(defaultSidebarLayout);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const canEdit = role === 'admin' || role === 'editor';

  useEffect(() => {
    // Show auth modal on load if user is not logged in
    if (!loading && !user) {
      setAuthModalOpen(true);
    }
  }, [user, loading]);

  useEffect(() => {
    const dataDocRef = doc(db, 'sharedDashboard', 'data');

    const unsubscribes: (() => void)[] = [];

    const createCollectionSubscription = <T,>(collectionName: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
      const unsubscribe = onSnapshot(collection(dataDocRef, collectionName), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as T[];
        setter(data);
      });
      unsubscribes.push(unsubscribe);
    };

    createCollectionSubscription<Task>('tasks', setTasks);
    createCollectionSubscription<Todo>('todos', setTodos);
    createCollectionSubscription<QuickLink>('quickLinks', setQuickLinks);
    createCollectionSubscription<ImportantDate>('importantDates', setImportantDates);
    
    const unsubscribeDashboard = onSnapshot(dataDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setNotes(data.notes || '');
            setSidebarLayout(data.sidebarLayout || defaultSidebarLayout);
        }
    });
    unsubscribes.push(unsubscribeDashboard);

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const handleOpenModal = useCallback((task: Task | null = null) => {
    if (!canEdit) return;
    setTaskToEdit(task);
    setIsModalOpen(true);
  }, [canEdit]);

  const handleCloseModal = useCallback(() => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  }, []);

  const handleSaveTask = useCallback(async (task: Task) => {
    if (!canEdit) return;
    const { id, ...taskData } = task;
    const collectionRef = collection(db, 'sharedDashboard', 'data', 'tasks');
    if (id) {
      await updateDoc(doc(collectionRef, id), taskData);
    } else {
      await addDoc(collectionRef, taskData);
    }
    handleCloseModal();
  }, [canEdit, handleCloseModal]);
  
  const handleToggleComplete = useCallback(async (taskId: string) => {
    if (!canEdit) return;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateDoc(doc(db, 'sharedDashboard', 'data', 'tasks', taskId), { isCompleted: !task.isCompleted });
    }
  }, [canEdit, tasks]);

  const handleDeleteTask = useCallback((taskId: string) => {
      if (!canEdit) return;
      setTaskToDelete(taskId);
  }, [canEdit]);
  
  const handleConfirmDelete = useCallback(async () => {
    if (!taskToDelete || !canEdit) return;
    await deleteDoc(doc(db, 'sharedDashboard', 'data', 'tasks', taskToDelete));
    setTaskToDelete(null);
  }, [taskToDelete, canEdit]);

  const handleCancelDelete = useCallback(() => setTaskToDelete(null), []);

  const handleNotesChange = useCallback(async (newNotes: string) => {
    setNotes(newNotes); // Optimistic update
    if (!canEdit) return;
    await setDoc(doc(db, 'sharedDashboard', 'data'), { notes: newNotes }, { merge: true });
  }, [canEdit]);

  const handleLayoutChange = useCallback(async (newLayout: SidebarLayout) => {
    if (!canEdit) return;
    setSidebarLayout(newLayout);
    await setDoc(doc(db, 'sharedDashboard', 'data'), { sidebarLayout: newLayout }, { merge: true });
  }, [canEdit]);
  
  const handleSaveQuickLink = useCallback(async (link: Omit<QuickLink, 'id'>) => {
    if (!canEdit) return;
    await addDoc(collection(db, 'sharedDashboard', 'data', 'quickLinks'), link);
  }, [canEdit]);

  const handleDeleteQuickLink = useCallback(async (id: string) => {
    if (!canEdit) return;
    await deleteDoc(doc(db, 'sharedDashboard', 'data', 'quickLinks', id));
  }, [canEdit]);

  const handleSaveImportantDate = useCallback(async (newDate: Omit<ImportantDate, 'id'>) => {
    if (!canEdit) return;
    await addDoc(collection(db, 'sharedDashboard', 'data', 'importantDates'), newDate);
  }, [canEdit]);

  const handleDeleteImportantDate = useCallback(async (id: string) => {
    if (!canEdit) return;
    await deleteDoc(doc(db, 'sharedDashboard', 'data', 'importantDates', id));
  }, [canEdit]);

  const handleAddTodo = useCallback(async (text: string) => {
    if (text.trim() === '' || !canEdit) return;
    await addDoc(collection(db, 'sharedDashboard', 'data', 'todos'), { text, isCompleted: false });
  }, [canEdit]);

  const handleToggleTodo = useCallback(async (id: string) => {
    if (!canEdit) return;
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateDoc(doc(db, 'sharedDashboard', 'data', 'todos', id), { isCompleted: !todo.isCompleted });
    }
  }, [canEdit, todos]);

  const handleDeleteTodo = useCallback(async (id: string) => {
    if (!canEdit) return;
    await deleteDoc(doc(db, 'sharedDashboard', 'data', 'todos', id));
  }, [canEdit]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold text-medium">Loading Mission Control...</h1>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen">
      <Header user={user} onLoginClick={() => setAuthModalOpen(true)} />
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
                canEdit={canEdit}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleOpenModal}
              />

              {tasks.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-medium">No missions yet.</p>
                  {canEdit && <button 
                    onClick={() => handleOpenModal()} 
                    className="mt-4 inline-flex items-center bg-accent hover:bg-fuchsia-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add your first mission
                  </button>}
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
              canEdit={canEdit}
            />
          </div>
        </div>
      </main>
      
      {isAuthModalOpen && <Auth onClose={() => setAuthModalOpen(false)} />}
      
      {isModalOpen && canEdit && (
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

      {canEdit && <button
        onClick={() => handleOpenModal()}
        className="fixed bottom-8 right-8 bg-accent hover:bg-fuchsia-600 text-white p-4 rounded-full shadow-lg transition-transform duration-200 transform hover:scale-110"
        aria-label="Add new mission"
      >
        <PlusIcon className="w-8 h-8" />
      </button>}
    </div>
  );
};

export default App;