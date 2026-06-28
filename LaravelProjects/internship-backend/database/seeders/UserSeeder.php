<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Agent One',
            'email' => 'agent1@test.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Agent Two',
            'email' => 'agent2@test.com',
            'password' => Hash::make('password'),
        ]);
    }
}