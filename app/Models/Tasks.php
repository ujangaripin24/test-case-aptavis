<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tasks extends Model
{
    protected $fillable = ['project_id', 'parent_id', 'name', 'status', 'weight'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Projects::class);
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Tasks::class, 'parent_id')->with('subtasks');
    }

    public function dependencies(): BelongsToMany
    {
        return $this->belongsToMany(Tasks::class, 'task_dependencies', 'task_id', 'depends_on_id');
    }

    public function isCircular($targetId, $visited = []): bool
    {
        if (in_array($this->id, $visited)) return false;
        if ($this->id == $targetId) return true;

        $visited[] = $this->id;
        foreach ($this->dependencies as $dep) {
            if ($dep->isCircular($targetId, $visited)) return true;
        }
        return false;
    }
}
