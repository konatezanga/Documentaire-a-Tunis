<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJuryMembersTable extends Migration
{
    public function up()
    {
        Schema::create('jury_members', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('expertise'); // Ex: "Cinéma", "Documentaire", "Journalisme"
            $table->string('role')->nullable(); // "president", "member"
            $table->string('email')->unique()->nullable();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jury_members');
    }
}