<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
       User::updateOrCreate(
    ['email' => 'admin@example.com'],
    [
        'name' => 'Admin User',
        'password' => bcrypt('password')
    ]
);

User::updateOrCreate(
    ['email' => 'user@example.com'],
    [
        'name' => 'Test User',
        'password' => bcrypt('password')
    ]
);
    }
}