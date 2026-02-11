
import React from 'react';
import { Task } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LinkIcon } from './icons/LinkIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId:string) => void;
  onEdit: (task: Task) => void;
}

const getDaysRemainingText = (endDate?: string): { text: string; color: string } => {
    if (!endDate) return { text: '', color: '' };

    const end = new Date(endDate);
    const now = new Date();
    end.setHours(23, 59, 59, 999); // Set to end of day
    now.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: `Ended ${Math.abs(diffDays)}d ago`, color: 'text-red-500' };
    }
    if (diffDays === 0) {
        return { text: 'Ends today', color: 'text-amber-600' };
    }
    if (diffDays <= 3) {
        return { text: `${diffDays}d left`, color: 'text-amber-600' };
    }
    return { text: `${diffDays}d left`, color: 'text-medium' };
};


const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const { text: daysRemainingText, color: daysRemainingColor } = getDaysRemainingText(task.endDate);

  return (
    <div
      className={`flex items-center p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
        task.isCompleted ? 'bg-white/30 opacity-60 hover:opacity-75' : 'bg-white/50 hover:bg-white/70'
      }`}
    >
      <div className="flex-shrink-0">
         <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleComplete(task.id)}
          className="w-6 h-6 rounded-md bg-slate-100 border-slate-300 text-accent focus:ring-accent focus:ring-2 cursor-pointer"
        />
      </div>

      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center mx-4">
        {task.logo ? (
            <img src={task.logo} alt={`${task.title} logo`} className="w-full h-full rounded-lg object-cover" />
        ) : (
            <div className="w-full h-full rounded-lg bg-slate-200 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-500">{task.title.charAt(0).toUpperCase()}</span>
            </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center space-x-3">
            <h3 className={`font-bold text-lg ${task.isCompleted ? 'line-through text-medium' : 'text-light'}`}>
                {task.title}
            </h3>
            <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-medium hover:text-accent transition-colors"
                aria-label={`Link to ${task.title}`}
                title="Go to mission page"
            >
                <LinkIcon className="w-5 h-5" />
            </a>
        </div>
        <p className={`text-sm ${task.isCompleted ? 'line-through text-gray-500' : 'text-medium'}`}>
          {task.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
            {task.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs font-semibold text-fuchsia-800 bg-fuchsia-100 rounded-full">
                    {tag}
                </span>
            ))}
            {daysRemainingText && (
                <span className={`text-xs font-bold ${daysRemainingColor}`}>{daysRemainingText}</span>
            )}
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center space-x-1">
        {task.referralUrl && (
          <a
            href={task.referralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-medium hover:text-green-500 rounded-full hover:bg-slate-200 transition-colors"
            aria-label="Open referral link"
            title="Contains a referral link"
          >
            <UserPlusIcon className="w-5 h-5" />
          </a>
        )}
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-medium hover:text-light rounded-full hover:bg-slate-200 transition-colors"
          aria-label="Edit task"
          title="Edit mission"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-medium hover:text-red-500 rounded-full hover:bg-slate-200 transition-colors"
          aria-label="Delete task"
          title="Delete mission"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;