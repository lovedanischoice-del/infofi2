
import React, { useState } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import { PlusIcon } from './icons/PlusIcon';

interface TodoListProps {
  todos: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onAdd, onToggle, onDelete, canEdit }) => {
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim() === '' || !canEdit) return;
    onAdd(newTodo);
    setNewTodo('');
  };

  const sortedTodos = [...todos].sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <div>
      <p className="text-sm text-medium mb-4">{completedCount} / {todos.length} completed</p>
      {canEdit && <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-grow bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
        />
        <button
          onClick={addTodo}
          className="bg-accent hover:bg-fuchsia-600 text-white p-2 rounded-lg"
          aria-label="Add to-do"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            canEdit={canEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
