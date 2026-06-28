<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            DepartmentSeeder::class,
            TicketSeeder::class,
        ]);
    }
}