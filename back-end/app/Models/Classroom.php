<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
        protected $fillable = [
        'subject',
        'code',
        'teacher_name'
    ];

    public function teacher() { 
        return $this->belongsTo(User::class, 'teacher_id'); 
    }
    
    public function students() { 
        return $this->belongsToMany(User::class, 'classroom_student', 'classroom_id', 'student_id'); 
    }
    
    public function sessions() { 
        return $this->hasMany(Session::class); 
    }
}
