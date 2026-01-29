<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        return Inertia::render('TaskPage/TaskPage', [
            'projects' => Projects::with(['dependencies', 'tasks.subtasks'])->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'dependencies' => 'array' 
        ]);

        $conflict = Projects::where(function ($query) use ($request) {
            $query->where('start_date', '<=', $request->end_date)
                ->where('end_date', '>=', $request->start_date);
        })->first();

        if ($conflict) {
            return back()->withErrors(['schedule' => "Jadwal bentrok dengan Project: {$conflict->name} ({$conflict->start_date} s/d {$conflict->end_date})"]);
        }

        return DB::transaction(function () use ($request) {
            $project = Projects::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => 'Draft'
            ]);

            if ($request->has('dependencies')) {
                $project->dependencies()->attach($request->dependencies);
            }

            return redirect()->back()->with('message', 'Project berhasil dibuat!');
        });
    }

    public function update(Request $request, $id)
    {
        $project = Projects::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $conflict = Projects::where('id', '!=', $id)
            ->where(function ($query) use ($request) {
                $query->where('start_date', '<=', $request->end_date)
                    ->where('end_date', '>=', $request->start_date);
            })->first();

        if ($conflict) {
            return back()->withErrors(['schedule' => "Konflik dengan {$conflict->name}"]);
        }

        if ($request->status !== 'Draft') {
            $unresolved = $project->dependencies()->where('status', '!=', 'Done')->exists();
            if ($unresolved) {
                return back()->withErrors(['status' => 'Gagal! Project dependensi belum berstatus Done.']);
            }
        }

        $project->update($request->all());

        if ($request->has('dependencies')) {
            $project->dependencies()->sync($request->dependencies);
        }

        return redirect()->back();
    }

    public function destroy($id)
    {
        Projects::findOrFail($id)->delete();
        return redirect()->back();
    }
}
