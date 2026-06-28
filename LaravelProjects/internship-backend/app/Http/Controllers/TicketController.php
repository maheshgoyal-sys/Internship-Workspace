<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;

class TicketController extends Controller
{
    // Get all tickets
   public function index()
{
    $tickets = Ticket::with(['assignedUser:id,name', 'user:id,name', 'department:id,name'])
        ->get()
        ->map(function ($t) {
            return [
                'id' => $t->id,
                'title' => $t->title,
                'description' => $t->description,
                'status' => $t->status,
                'priority' => $t->priority,

                // 🔥 FIX: SIMPLE FIELD FOR FRONTEND
                'assigned_user' => $t->assignedUser?->name,

                'created_at' => $t->created_at,
            ];
        });

 


    return response()->json([
        'success' => true,
        'data' => $tickets
    ]);
}

    // Create ticket
public function store(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'department_id' => 'required|exists:departments,id',
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'priority' => 'required|in:Low,Medium,High',
        'assigned_user_id' => 'nullable|exists:users,id'
    ]);

    $ticket = Ticket::create([
        'user_id' => $request->user_id,
        'department_id' => $request->department_id,
        'title' => $request->title,
        'description' => $request->description,
        'priority' => $request->priority,
        'assigned_user_id' => $request->assigned_user_id, // 👈 ADD THIS
        'status' => 'Open'
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Ticket Created Successfully',
        'data' => $ticket
    ], 201);
}


    // Update ticket
    public function update(Request $request, $id)
{
    $ticket = Ticket::findOrFail($id);

    $ticket->update([
        'title' => $request->title,
        'description' => $request->description,
        'priority' => $request->priority,
        'status' => $request->status,
        'assigned_user_id' => $request->assigned_user_id // 👈 ADD THIS
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Ticket Updated Successfully',
        'data' => $ticket
    ]);
}

    // Delete ticket
    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id);

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket Deleted Successfully'
        ]);
    }
}