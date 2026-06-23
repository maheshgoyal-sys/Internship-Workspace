<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TicketController extends Controller
{
    // List Tickets
    public function index()
    {
        return response()->json([
            'success' => true,
            'message' => 'All tickets fetched successfully'
        ]);
    }

    // Create Ticket
    public function store(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Ticket created successfully'
        ]);
    }

    // Update Ticket
    public function update(Request $request, $id)
    {
        return response()->json([
            'success' => true,
            'message' => "Ticket {$id} updated successfully"
        ]);
    }

    // Delete Ticket
    public function destroy($id)
    {
        return response()->json([
            'success' => true,
            'message' => "Ticket {$id} deleted successfully"
        ]);
    }
}