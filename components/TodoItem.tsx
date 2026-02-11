
import React from 'react';
import { Todo } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between bg-white/50 p-2 rounded-md">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 rounded bg-slate-100 border-slate-300 text-accent focus:ring-accent focus:ring-2 cursor-pointer"
        />
        <span
          className={`ml-3 ${
            todo.isCompleted ? 'line-through text-medium' : 'text-light'
          }`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-medium hover:text-red-500"
        aria-label="Delete to-do"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TodoItem;