<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_ratings_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRatingsTable extends Migration
{
    public function up()
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('screening_id')->constrained()->onDelete('cascade');
            $table->foreignId('jury_member_id')->constrained()->onDelete('cascade');
            $table->decimal('score', 5, 2); // Note sur 100 avec 2 décimales
            $table->text('comment')->nullable();
            $table->timestamps();

            // Un membre du jury ne peut noter qu'une seule fois une projection
            $table->unique(['screening_id', 'jury_member_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('ratings');
    }
}