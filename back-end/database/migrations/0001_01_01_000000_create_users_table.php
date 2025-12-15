<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->enum('role', ['student', 'teacher']);

            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_initial')->nullable();

            $table->integer('age');
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->date('date_of_birth');

            $table->string('school_affiliation')->nullable();

            $table->string('email')->unique();
            $table->string('password');
            
            $table->string('recovery_email')->nullable()->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
