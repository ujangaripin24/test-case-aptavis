import React from 'react';
import { Drawer, DrawerHeader, DrawerItems } from 'flowbite-react';

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "FormTasks" | "FormProjects";
  mode: "Tambah" | "Edit";
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ isOpen, onClose, type, mode }) => {

  const renderContent = () => {
    switch (type) {
      case "FormTasks":
        return (
          <>
            <DrawerHeader title={`${mode} Task`} />
            <DrawerItems>
              <p>Konten formulir task untuk mode {mode}</p>
            </DrawerItems>
          </>
        );
      case "FormProjects":
        return (
          <>
            <DrawerHeader title={`${mode} Project`} />
            <DrawerItems>
              <p>Formulir {mode} proyek di sini.</p>
            </DrawerItems>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose} position="right" className="w-95">
      {renderContent()}
    </Drawer>
  );
};

export default TaskDrawer;
