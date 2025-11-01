<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'first_name' => 'Admin',
            'last_name' => 'Principal',
            'email' => 'admin@docatunis.tn',
            'password' => Hash::make('password1234'),
            'role' => 'admin',
        ]);
    }
}
