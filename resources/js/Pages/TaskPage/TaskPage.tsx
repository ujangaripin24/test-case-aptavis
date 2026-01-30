import { Button, Select, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import TaskDrawer from './Components/Drawer';
import { FaPencilAlt, FaRegCalendarAlt } from 'react-icons/fa';

const TaskPage: React.FC<{ projects: any[] }> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "FormTasks" | "FormProjects";
    mode: "Tambah" | "Edit";
    data?: any;
  }>({
    isOpen: false,
    type: "FormProjects",
    mode: "Tambah",
  });

  const openDrawer = (type: "FormTasks" | "FormProjects", mode: "Tambah" | "Edit", data?: any) => {
    setModalConfig({ isOpen: true, type, mode, data });
  };

  const filterTasks = (tasks: any[]): any[] => {
    if (!tasks) return [];
    return tasks
      .map(task => {
        const filteredSubtasks = task.subtasks ? filterTasks(task.subtasks) : [];

        const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || task.status === statusFilter;

        if ((matchesSearch && matchesStatus) || filteredSubtasks.length > 0) {
          return {
            ...task,
            subtasks: filteredSubtasks
          };
        }
        return null;
      })
      .filter(Boolean) as any[];
  };

  const filteredProjects = projects.map((project: any) => {
    const rootTasks = project.tasks?.filter((t: any) => !t.parent_id) || [];
    return {
      ...project,
      tasks: filterTasks(rootTasks)
    };
  }).filter(project => {
    const projectMatches = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    return projectMatches || project.tasks.length > 0;
  });

  const renderTaskRow = (task: any, depth = 0) => (
    <React.Fragment key={task.id}>
      <div
        onClick={() => openDrawer("FormTasks", "Edit", task)}
        style={{ marginLeft: `${depth * 24}px` }}
        className={`flex items-center justify-between p-3 mb-1 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all ${
          depth > 0 ? 'border-l-2 border-l-blue-400' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            task.status === 'Done' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-yellow-400' : 'bg-gray-400'
          }`} />
          <span className={`text-sm font-medium ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border text-gray-500 uppercase">
            {task.status}
          </span>
        </div>
      </div>
      {task.subtasks && task.subtasks.map((sub: any) => renderTaskRow(sub, depth + 1))}
    </React.Fragment>
  );

  return (
    <>
      <div className="container mx-auto px-4 mt-8 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          <Button color="blue" onClick={() => openDrawer("FormProjects", "Tambah")}>+ Add Project</Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex-1">
            <TextInput
              placeholder="Cari project, task, atau subtask..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">Semua Status Task</option>
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="p-5 border rounded-xl shadow-sm bg-white border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3
                      className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex items-center"
                      onClick={() => openDrawer("FormProjects", "Edit", project)}
                    >
                      {project.name}
                      <span className={`ml-3 text-[10px] px-2 py-0.5 rounded-full uppercase ${
                        project.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <FaRegCalendarAlt className="flex-shrink-0" />
                      <span>{project.start_date} s/d {project.end_date}</span>
                    </div>
                  </div>

                  <Button size="xs" color="light" onClick={() => openDrawer("FormTasks", "Tambah", { project_id: project.id })}>
                    + Add Task
                  </Button>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">Overall Progress</span>
                    <span className="text-xs font-bold text-gray-900">{project.completion_progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${project.completion_progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <FaPencilAlt className="text-gray-400" />
                    <span>Tasks & Subtasks</span>
                  </h4>
                  <div className="space-y-1">
                    {project.tasks && project.tasks.length > 0 ? (
                      project.tasks.map((task: any) => renderTaskRow(task))
                    ) : (
                      <p className="text-xs text-gray-400 italic py-2">Tidak ada task yang cocok dengan filter.</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">Opps! Data tidak ditemukan dengan kata kunci "{searchQuery}"</p>
            </div>
          )}
        </div>

        <TaskDrawer
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          type={modalConfig.type}
          mode={modalConfig.mode}
          selectedData={modalConfig.data}
        />
      </div>
    </>
  );
};

export default TaskPage;