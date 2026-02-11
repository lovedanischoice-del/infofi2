
import React from 'react';
import { Task } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface PinnedMissionsProps {
  tasks: Task[];
}

const PinnedMissions: React.FC<PinnedMissionsProps> = ({ tasks }) => {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <a
          key={task.id}
          href={task.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-white/50 hover:bg-white/70 p-3 rounded-md transition-colors"
        >
          <span className="text-light font-medium">{task.title}</span>
          <LinkIcon className="w-5 h-5 text-medium" />
        </a>
      ))}
    </div>
  );
};

export default PinnedMissions;