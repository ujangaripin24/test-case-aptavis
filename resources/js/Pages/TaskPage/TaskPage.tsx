import { Button, Label, List, ListItem } from 'flowbite-react';
import React, { useState } from 'react';
import TaskDrawer from './Components/Drawer';
import { FaPencilAlt, FaRegCalendarAlt } from 'react-icons/fa';
import { FaNoteSticky, FaPencil } from 'react-icons/fa6';

const TaskPage: React.FC<{ projects: any[] }> = ({ projects }) => {
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

  return (
    <>
      <div className="container mx-auto px-4 mt-8 pb-20">
        <Button color="blue" onClick={() => openDrawer("FormProjects", "Tambah")}>Add Project</Button>
        <div className="mt-8 space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="p-5 border rounded-xl shadow-sm bg-white border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3
                    className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => openDrawer("FormProjects", "Edit", project)}
                  >
                    {project.name}
                    <span className={`ml-3 text-xs px-2 py-1 rounded-full uppercase ${project.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                      {project.status}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FaRegCalendarAlt className="flex-shrink-0" />
                    <span>{project.start_date} - {project.end_date}</span>
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
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${project.completion_progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FaPencilAlt className="flex-shrink-0" />
                    <span>Task List</span>
                  </div>
                </h4>
                <div className="space-y-2">
                  {project.tasks && project.tasks.length > 0 ? (
                    project.tasks.map((task: any) => (
                      <div
                        key={task.id}
                        onClick={() => openDrawer("FormTasks", "Edit", task)}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${task.status === 'Done' ? 'bg-green-500' : task.status === 'In Progress' ? 'bg-yellow-400' : 'bg-gray-400'
                            }`} />
                          <span className={`text-sm font-medium ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {task.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border text-gray-500">
                            W: {task.weight}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold w-20 text-right">
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic py-2">Belum ada task untuk proyek ini.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
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
