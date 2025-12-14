<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $table = 'class_sessions';

    protected $fillable = [
        'classroom_id',
        'topic',
        'date',
        'time_created',
        'is_open'
    ];

    protected $casts = [
        'date' => 'date',
        'time_created' => 'datetime',
        'is_open' => 'boolean'
    ];

    public function classroom()
    { 
        return $this->belongsTo(Classroom::class); 
    }
    
    public function attendances()
    { 
        return $this->hasMany(Attendance::class, 'class_session_id'); 
    }
}
