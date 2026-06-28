<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            Ticket::create([
                'user_id' => 1,
                'department_id' => rand(1, 3),
                'title' => "Test Ticket $i",
                'description' => "This is description for ticket $i",
                'priority' => ['Low', 'Medium', 'High'][rand(0, 2)],
                'status' => ['Open', 'In Progress', 'Closed'][rand(0, 2)],
            ]);
        }
    }
}