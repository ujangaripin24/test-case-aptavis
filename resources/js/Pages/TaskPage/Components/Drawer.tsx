import React, { useEffect } from 'react';
import { Button, Drawer, DrawerHeader, DrawerItems, Label, Select, TextInput } from 'flowbite-react';
import { useForm, usePage } from '@inertiajs/react';

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: "FormTasks" | "FormProjects";
  mode: "Tambah" | "Edit";
  selectedData?: any;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ isOpen, onClose, type, mode, selectedData }) => {
  const { projects } = usePage<any>().props;
  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    id: null,
    name: '',
    start_date: '',
    end_date: '',
    project_id: '',
    status: 'Draft',
    weight: 0,
    dependencies: [] as number[],
  });

  useEffect(() => {
    if (mode === "Edit" && selectedData) {
      setData({
        id: selectedData.id,
        name: selectedData.name,
        project_id: selectedData.project_id || '',
        status: selectedData.status || 'Draft',
        weight: selectedData.weight || 0,
        dependencies: selectedData.dependencies ? selectedData.dependencies.map((d: any) => d.id) : [],
      });
    } else {
      reset();
      if (type === "FormTasks" && selectedData?.project_id) {
        setData('project_id', selectedData.project_id);
      }
    }
    clearErrors();
  }, [selectedData, mode, isOpen]);

  const handleSubmit = () => {
    if (type === "FormProjects") {
      if (mode === "Tambah") {
        post('/projects', {
          onSuccess: () => onClose(),
          onError: (e) => console.log(e)
        });
      } else {
        put(`/projects/${data.id}`, {
          onSuccess: () => onClose()
        });
      }
    } else if (type === "FormTasks") {
      if (mode === "Tambah") {
        post('/tasks', {
          onSuccess: () => {
            onClose();
            reset();
          }
        });
      } else {
        put(`/tasks/${data.id}`, {
          onSuccess: () => onClose()
        });
      }
    }
  };

  const handleDelete = () => {
    if (data.id && confirm('Yakin ingin menghapus project ini?')) {
      destroy(route('project.destroy', { id: data.id }), {
        onSuccess: () => onClose()
      });
    }
  };

  const renderContent = () => {
    switch (type) {
      case "FormTasks":
        return (
          <>
            <DrawerHeader title={`${mode} Task`} />
            <DrawerItems className="space-y-4">
              <div>
                <Label htmlFor="project_id">Project</Label>
                <Select
                  id="project_id"
                  value={data.project_id}
                  onChange={e => setData('project_id', e.target.value)}
                  disabled
                  color={errors.name ? 'failure' : 'gray'}
                >
                  <option value="">Pilih Project</option>
                  {projects.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="task_name">Nama Task</Label>
                <TextInput
                  id="task_name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  placeholder="Contoh: Integrasi API"
                />
              </div>

              <div>
                <Label htmlFor="task_status">Status</Label>
                <Select id="task_status" value={data.status} onChange={e => setData('status', e.target.value)}>
                  <option value="Draft">Draft</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </Select>
              </div>

              <TextInput
                id="weight"
                type="number"
                value={data.weight}
                onChange={e => setData('weight', parseInt(e.target.value) || 0)}
                placeholder="Masukkan angka (e.g. 1, 2, 5)"
              />

              <div className="mt-4">
                <Label className="mb-2 block">Task ini bergantung pada (Prasyarat):</Label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border p-3 rounded-lg bg-gray-50 border-gray-200">
                  {projects.find((p: any) => p.id == data.project_id)?.tasks
                    ?.filter((t: any) => t.id !== data.id)
                    .map((t: any) => (
                      <label key={t.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          checked={data.dependencies.includes(t.id)}
                          onChange={(e) => {
                            const selected = e.target.checked
                              ? [...data.dependencies, t.id]
                              : data.dependencies.filter(id => id !== t.id);
                            setData('dependencies', selected);
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700">{t.name}</span>
                          <span className={`text-[10px] uppercase font-bold ${t.status === 'Done' ? 'text-green-500' : 'text-gray-400'}`}>
                            Status: {t.status}
                          </span>
                        </div>
                      </label>
                    ))}
                  {(!projects.find((p: any) => p.id == data.project_id)?.tasks ||
                    projects.find((p: any) => p.id == data.project_id)?.tasks.length <= 1) && (
                      <p className="text-xs text-gray-400 italic">Tidak ada task lain untuk dijadikan prasyarat.</p>
                    )}
                </div>
                {errors.dependencies && <p className="text-red-500 text-xs mt-1">{errors.dependencies}</p>}
              </div>

              <div className="flex justify-between mt-8 border-t pt-4">
                {mode === "Edit" && (
                  <Button color="red">Hapus</Button>
                )}
                <Button color="green" className="ml-auto" onClick={handleSubmit}>
                  Simpan Task
                </Button>
              </div>
            </DrawerItems>
          </>
        );
      case "FormProjects":
        return (
          <>
            <DrawerHeader title={`${mode} Project`} />
            <DrawerItems className="space-y-6">
              <div>
                <Label htmlFor="name">Nama Project</Label>
                <TextInput
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  color={errors.name ? 'failure' : 'gray'}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Mulai</Label>
                  <TextInput
                    type="date"
                    value={data.start_date}
                    onChange={e => setData('start_date', e.target.value)}
                    color={(errors as any).start_date ? 'failure' : 'gray'}
                  />
                </div>
                <div>
                  <Label>Tanggal Selesai</Label>
                  <TextInput
                    type="date"
                    value={data.end_date}
                    onChange={e => setData('end_date', e.target.value)}
                    color={(errors as any).end_date ? 'failure' : 'gray'}
                  />
                </div>
              </div>

              {(errors as any).schedule && (
                <p className="text-red-500 text-sm italic font-medium">
                  {(errors as any).schedule}
                </p>
              )}

              {mode === "Edit" && selectedData && (
                <div>
                  <Label>Overall Progress {selectedData.completion_progress}%</Label>
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${selectedData.completion_progress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex justify-between mt-8 border-t pt-5">
                {mode === "Edit" && (
                  <Button color="red" onClick={handleDelete} disabled={processing}>Hapus</Button>
                )}
                <Button color="green" className="ml-auto px-6" onClick={handleSubmit} disabled={processing}>
                  {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </DrawerItems>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer backdrop={true} open={isOpen} onClose={onClose} position="right" className="w-[900px]">
      {renderContent()}
    </Drawer>
  );
};

export default TaskDrawer;
