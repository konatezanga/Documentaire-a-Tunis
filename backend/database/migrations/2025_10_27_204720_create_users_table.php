<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->string('password')->nullable();
            $table->enum('role', [
                'admin',
                'inspection_manager',
                'production_manager',
                'jury_president',
                'jury_member'
            ])->default('jury_member');
            $table->timestampsTz(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
