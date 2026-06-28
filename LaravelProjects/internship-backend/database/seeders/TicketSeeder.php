<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        if ($users->count() == 0) {
            return;
        }

        $statuses = ['Open', 'In Progress', 'Closed'];
        $priorities = ['Low', 'Medium', 'High'];

        $tickets = [
            [
                'title' => 'Login page not working',
                'description' => 'Users are unable to login into system',
            ],
            [
                'title' => 'Dashboard slow loading',
                'description' => 'Dashboard takes too much time to load',
            ],
            [
                'title' => 'Email notification issue',
                'description' => 'Emails are not being sent properly',
            ],
            [
                'title' => 'Profile update error',
                'description' => 'Error while updating profile details',
            ],
            [
                'title' => 'Database connection timeout',
                'description' => 'Frequent DB connection failure',
            ],
            [
                'title' => 'UI alignment bug',
                'description' => 'Buttons are misaligned on mobile view',
            ],
            [
                'title' => 'Password reset not working',
                'description' => 'Reset link is not opening',
            ],
            [
                'title' => 'File upload failure',
                'description' => 'Unable to upload attachments',
            ],
            [
                'title' => 'Search feature broken',
                'description' => 'Search returns empty results',
            ],
            [
                'title' => 'API response delay',
                'description' => 'API is responding very slowly',
            ],
        ];

        foreach ($tickets as $index => $t) {
            Ticket::create([
                'user_id' => $users->first()->id,
                'department_id' => rand(1, 3),
                'title' => $t['title'],
                'description' => $t['description'],
                'priority' => $priorities[array_rand($priorities)],
                'status' => $statuses[array_rand($statuses)],
                'assigned_user_id' => $users->random()->id ?? null,
            ]);
        }
    }
}