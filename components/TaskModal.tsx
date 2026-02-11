
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import ImageDropzone from './ImageDropzone';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [endDate, setEndDate] = useState('');
  const [referralUrl, setReferralUrl] = useState('');


  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setUrl(task.url);
      setDescription(task.description);
      setTags(task.tags.join(', '));
      setLogo(task.logo || null);
      setEndDate(task.endDate || '');
      setReferralUrl(task.referralUrl || '');
    } else {
        setTitle('');
        setUrl('');
        setDescription('');
        setTags('');
        setLogo(null);
        setEndDate('');
        setReferralUrl('');
    }
  }, [task]);

  const handleUrlBlur = useCallback(async () => {
    if (logo || !url.trim()) {
      return;
    }

    try {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      const hostname = new URL(fullUrl).hostname;
      // Using a more robust favicon service: icon.horse
      const faviconUrl = `https://icon.horse/icon/${hostname}`;
      
      const response = await fetch(faviconUrl);
      if (!response.ok) {
        console.warn(`Favicon not found for ${hostname}`);
        return;
      }

      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        console.warn(`Response from favicon service was not an image for ${hostname}`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.warn('Could not fetch favicon for the provided URL.', error);
    }
  }, [url, logo]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
        alert('Title and URL are required.');
        return;
    }
    onSave({
      id: task ? task.id : '',
      title,
      url,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isCompleted: task ? task.isCompleted : false,
      logo: logo || undefined,
      endDate: endDate || undefined,
      referralUrl: referralUrl || undefined,
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-rose-50/80 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-light">{task ? 'Edit Mission' : 'Add New Mission'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <ImageDropzone logo={logo} onLogoChange={setLogo} />
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-medium mb-1">Title / Project Name</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="e.g., Project XYZ"
                required
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-medium mb-1">URL (Event/Leaderboard)</label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="https://example.com/event"
                required
              />
            </div>
            <div>
              <label htmlFor="referralUrl" className="block text-sm font-medium text-medium mb-1">Referral URL (Optional)</label>
              <input
                id="referralUrl"
                type="url"
                value={referralUrl}
                onChange={(e) => setReferralUrl(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="https://example.com/signup?ref=123"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-medium mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="e.g., Daily check-in, vote on proposal"
                rows={3}
              ></textarea>
            </div>
             <div>
              <label htmlFor="tags" className="block text-sm font-medium text-medium mb-1">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
                placeholder="e.g., Daily, Airdrop, SocialFi"
              />
            </div>
             <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-medium mb-1">End Date (Optional)</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white/70 border-slate-300 text-light rounded-md p-2 focus:ring-accent focus:border-accent"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-light font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-fuchsia-600 text-white font-bold rounded-lg transition-colors"
            >
              Save Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
