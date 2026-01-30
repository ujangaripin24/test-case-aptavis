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

        $request->validate([
            'name' => 'required|string',
        ]);

        if ($request->has(['start_date', 'end_date'])) {
            $conflict = Projects::where('id', '!=', $id)
                ->where(function ($query) use ($request) {
                    $query->where('start_date', '<=', $request->end_date)
                        ->where('end_date', '>=', $request->start_date);
                })->first();

            if ($conflict) {
                return back()->withErrors(['schedule' => "Jadwal bentrok dengan: {$conflict->name}"]);
            }
        }

        $project->update($request->only(['name', 'start_date', 'end_date']));

        return redirect()->back();
    }

    public function destroy($id)
    {
        Projects::findOrFail($id)->delete();
        return redirect()->back();
    }
}
