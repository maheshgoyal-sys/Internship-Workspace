<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->foreignId('department_id')
                  ->constrained()
                  ->onDelete('cascade');

            $table->string('title');

            $table->text('description');

            $table->enum('priority', [
                'Low',
                'Medium',
                'High'
            ]);

            $table->enum('status', [
                'Open',
                'In Progress',
                'Resolved',
                'Closed'
            ])->default('Open');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};