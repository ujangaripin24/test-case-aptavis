<?php

namespace App\Http\Controllers;

use App\Models\Tasks;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'name'       => 'required|string|max:255',
            'status'     => 'required|in:Draft,In Progress,Done',
            'weight'     => 'required|integer|min:1',
            'dependencies' => 'nullable|array'
        ]);

        $task = Tasks::create($request->all());

        if ($request->has('dependencies')) {
            $task->dependencies()->sync($request->dependencies);
        }

        $task->project->updateStatusBasedOnTasks();
        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $task = Tasks::findOrFail($id);

        if ($request->status === 'Done') {
            $unfinished = $task->dependencies()->where('status', '!=', 'Done')->exists();

            if ($unfinished) {
                return back()->withErrors(['status' => "Gagal! Task prasyarat belum selesai (Done)."]);
            }
        }

        if ($request->has('dependencies')) {
            foreach ($request->dependencies as $depId) {
                $dependencyTask = Tasks::find($depId);
                if ($dependencyTask instanceof \App\Models\Tasks) {
                    if ($dependencyTask->isCircular($task->id)) {
                        return back()->withErrors(['dependencies' => "Opps! Terjadi Circular Dependency."]);
                    }
                }
            }
            $task->dependencies()->sync($request->dependencies);
        }

        $task->update($request->except('dependencies'));

        $task->project->updateStatusBasedOnTasks();
        return redirect()->back();
    }

    public function destroy($id)
    {
        $task = Tasks::findOrFail($id);
        $project = $task->project;

        $task->delete();

        $project->updateStatusBasedOnTasks();

        return redirect()->back();
    }
}
