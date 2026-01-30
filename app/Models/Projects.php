<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Projects extends Model
{
    protected $fillable = ['name', 'status', 'start_date', 'end_date'];

    public function tasks(): HasMany
    {
        return $this->hasMany(Tasks::class, 'project_id');
    }

    public function dependencies(): BelongsToMany
    {
        return $this->belongsToMany(Projects::class, 'project_dependencies', 'project_id', 'depends_on_id');
    }

    protected $appends = ['completion_progress'];

    public function getCompletionProgressAttribute(): float
    {
        $totalWeight = $this->tasks()->sum('weight');
        if ($totalWeight === 0) return 0;

        $doneWeight = $this->tasks()->where('status', 'Done')->sum('weight');
        return round(($doneWeight / $totalWeight) * 100, 2);
    }

    public function updateStatusBasedOnTasks()
    {
        $tasks = $this->tasks;

        $unfinishedDep = $this->dependencies()->where('status', '!=', 'Done')->exists();

        if ($tasks->isEmpty() || $tasks->every('status', 'Draft')) {
            $this->status = 'Draft';
        } elseif ($tasks->every('status', 'Done')) {
            if ($unfinishedDep) {
                $this->status = 'In Progress';
            } else {
                $this->status = 'Done';
            }
        } else {
            if ($unfinishedDep) {
                $this->status = 'Draft';
            } else {
                $this->status = 'In Progress';
            }
        }

        $this->save();
    }

    public function isCircular($targetId, $visited = []): bool
    {
        if ($this->id == $targetId) return true;
        if (in_array($this->id, $visited)) return false;
        $visited[] = $this->id;

        foreach ($this->dependencies as $dep) {
            if ($dep->isCircular($targetId, $visited)) return true;
        }
        return false;
    }
}
