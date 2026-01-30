import { Button, Label, List, ListItem } from 'flowbite-react';
import React, { useState } from 'react';
import TaskDrawer from './Components/Drawer';

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

  const closeDrawer = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    <>
      <div className="container mx-auto px-4 mt-8">
        <Button color="blue" onClick={() => openDrawer("FormProjects", "Tambah")}>Add Project</Button>

        <div className="mt-8 space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className="text-lg font-bold text-blue-700 cursor-pointer hover:underline"
                    onClick={() => openDrawer("FormProjects", "Edit", project)}
                  >
                    {project.name}
                    <span className="ml-2 text-sm font-normal text-gray-500">({project.status})</span>
                  </h3>
                  <p className="text-sm text-gray-500 italic">
                    Jadwal: {project.start_date} s/d {project.end_date}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${project.completion_progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">Progress: {project.completion_progress}%</p>
                </div>

                <Button size="xs" color="gray" onClick={() => openDrawer("FormTasks", "Tambah", { project_id: project.id })}>
                  + Add Task
                </Button>
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
