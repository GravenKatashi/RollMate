<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'class_session_id',
        'student_id',
        'time_present',
        'status'
    ];

    public function session() { 
        return $this->belongsTo(Session::class, 'class_session_id'); 
    }
    
    public function student() { 
        return $this->belongsTo(User::class, 'student_id'); 
    }
}
