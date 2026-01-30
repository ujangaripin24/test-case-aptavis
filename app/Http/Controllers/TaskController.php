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
        ]);

        $task = Tasks::create($request->all());

        $task->project->updateStatusBasedOnTasks();

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $task = Tasks::findOrFail($id);

        $request->validate([
            'name'   => 'required|string',
            'status' => 'required|in:Draft,In Progress,Done',
            'weight' => 'required|integer|min:1',
        ]);

        $task->update($request->all());

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
