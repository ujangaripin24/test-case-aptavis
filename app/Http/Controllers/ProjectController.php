<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $conflict = Projects::where(function ($query) use ($request) {
            $query->where('start_date', '<=', $request->end_date)
                ->where('end_date', '>=', $request->start_date);
        })->first();

        if ($conflict) {
            return back()->withErrors(['schedule' => "Gagal simpan! Jadwal bentrok dengan: {$conflict->name}"]);
        }

        Projects::create([
            'name' => $request->name,
            'status' => 'Draft',
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $project = Projects::findOrFail($id);

        if (in_array($request->status, ['In Progress', 'Done'])) {
            $unfinished = $project->dependencies()->where('status', '!=', 'Done')->exists();
            if ($unfinished) {
                return back()->withErrors(['status' => "Proyek ini belum bisa dimulai/selesai karena ada proyek prasyarat yang belum Done!"]);
            }
        }

        if ($request->has('dependencies')) {
            foreach ($request->dependencies as $depId) {
                $depProject = Projects::find($depId);
                if ($depProject instanceof \App\Models\Projects) {
                    if ($depProject->isCircular($project->id)) {
                        return back()->withErrors(['dependencies' => "Opps! Terjadi Circular Dependency antar proyek."]);
                    }
                }
            }
            $project->dependencies()->sync($request->dependencies);
        }

        $oldStatus = $project->getOriginal('status');
        $project->update($request->all());

        if ($oldStatus === 'Done' && $project->status !== 'Done') {
            $dependents = Projects::whereHas('dependencies', function ($q) use ($project) {
                $q->where('depends_on_id', $project->id);
            })->get();

            foreach ($dependents as $dep) {
                $dep->update(['status' => 'Draft']);
            }
        }

        return redirect()->back();
    }

    public function destroy($id)
    {
        Projects::findOrFail($id)->delete();
        return redirect()->back();
    }
}
