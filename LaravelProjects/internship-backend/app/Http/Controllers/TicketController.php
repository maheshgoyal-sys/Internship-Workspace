<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;

class TicketController extends Controller
{
    // Get all tickets
    public function index()
    {
        $tickets = Ticket::all();

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
        'priority' => 'required|in:Low,Medium,High'
    ]);

    $ticket = Ticket::create([
        'user_id' => $request->user_id,
        'department_id' => $request->department_id,
        'title' => $request->title,
        'description' => $request->description,
        'priority' => $request->priority,
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

        $ticket->update($request->all());

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