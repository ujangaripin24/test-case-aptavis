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
        return $this->hasMany(Tasks::class);
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
}
