import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

interface Task {
  id: number;
  name: string;
  status: 'Draft' | 'In Progress' | 'Done';
  weight: number;
  subtasks?: Task[];
}

interface Project {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  tasks: Task[];
}

const TaskPage: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="relative flex min-h-screen bg-gray-50 overflow-hidden">
      <Head title="Project Tracker" />

      <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarOpen ? 'mr-[400px]' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mini Aplikasi Project Tracker</h1>
          <div className="space-x-2">
            <button
              onClick={() => { setSelectedItem(null); setIsSidebarOpen(true) }}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow"
            >
              Add Project
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search tasks or subtasks..."
          className="w-full p-2 mb-6 border rounded shadow-sm"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="space-y-4">
        </div>
      </main>

      <aside className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} border-l`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Add Project/Task</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="space-y-4">
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 bg-gray-50 flex justify-between border-t">
            <button className="text-red-600 font-medium">Hapus</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded">Simpan</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default TaskPage;