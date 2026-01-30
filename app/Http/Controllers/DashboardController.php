<?php

namespace App\Http\Controllers;

use App\Models\Projects;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('TaskPage/TaskPage', [
            'projects' => Projects::with(['tasks.dependencies',, 'tasks.subtasks'])->get()
        ]);
    }
}
