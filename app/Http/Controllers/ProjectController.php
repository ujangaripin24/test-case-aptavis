<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $conflict = Projects::where(function ($query) use ($request) {
            $query->where('start_date', '<=', $request->end_date)
                ->where('end_date', '>=', $request->start_date);
        })->first();

        if ($conflict) {
            return back()->withErrors(['schedule' => "Konflik jadwal dengan Project: {$conflict->name}"]);
        }

        Projects::create($request->all());
        return redirect()->back();
    }
}
