<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('screenings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('documentary_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('time');
            $table->string('room');
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            // Pour éviter les conflits de salle
            $table->unique(['date', 'time', 'room']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screenings');
    }
};
