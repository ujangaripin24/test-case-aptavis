import { Button, Label, List, ListItem } from 'flowbite-react';
import React, { useState } from 'react';
import TaskDrawer from './Components/Drawer';

const TaskPage: React.FC = () => {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "FormTasks" | "FormProjects";
    mode: "Tambah" | "Edit";
  }>({
    isOpen: false,
    type: "FormProjects",
    mode: "Tambah",
  });

  const openDrawer = (type: "FormTasks" | "FormProjects", mode: "Tambah" | "Edit" = "Tambah") => {
    setModalConfig({ isOpen: true, type, mode });
  };

  const closeDrawer = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    <>
      <div className="container mx-auto px-2 mt-4">
        <div className="flex flex-col gap-4 mb-4 items-start">
          <Button color="green" onClick={() => openDrawer("FormProjects", "Tambah")}>
            Add Project
          </Button>
        </div>
        <div>
          <div>
            <div>
              <div className={"cursor-pointer text-blue-800"} onClick={() => openDrawer("FormProjects", "Edit")}>Edit Project 1</div>
              <div>
                <Button onClick={() => openDrawer("FormTasks", "Tambah")} size='sm' color="green">Tambah Task</Button>
              </div>
            </div>
            <div>
              <List>
                <ListItem onClick={() => openDrawer("FormTasks", "Edit")}>At least 10 characters (and up to 100 characters)</ListItem>
                <ListItem>At least one lowercase character</ListItem>
                <ListItem>Inclusion of at least one special character, e.g., ! @ # ?</ListItem>
              </List>
            </div>
          </div>
        </div>
      </div>
      <TaskDrawer
        isOpen={modalConfig.isOpen}
        onClose={closeDrawer}
        type={modalConfig.type}
        mode={modalConfig.mode}
      />
    </>
  );
};

export default TaskPage;
