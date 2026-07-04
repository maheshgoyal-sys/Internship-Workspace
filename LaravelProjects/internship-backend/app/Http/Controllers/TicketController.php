<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use App\Models\Ticket;
use App\Models\User;

class TicketController extends Controller
{
    // Get all tickets
    public function index(Request $request)
    {
        if ($request->filled('department_id')) {
            $department = Department::find($request->department_id);

            return response()->json([
                'success' => true,
                'lookup' => [
                    'department' => $department ? [
                        'id' => $department->id,
                        'name' => $department->name,
                    ] : null,
                ],
            ]);
        }

        if ($request->filled('assigned_user_id')) {
            $user = User::find($request->assigned_user_id);
            $department = $user && $user->department_id ? Department::find($user->department_id) : null;
            $photo = $user ? $this->buildUserPhoto($user) : null;

            return response()->json([
                'success' => true,
                'lookup' => [
                    'assigned_user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'department' => $department?->name,
                        'photo' => $photo,
                    ] : null,
                ],
            ]);
        }

        $tickets = Ticket::with(['assignedUser:id,name', 'user:id,name', 'department:id,name'])
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'title' => $t->title,
                    'description' => $t->description,
                    'status' => $t->status,
                    'priority' => $t->priority,
                    'assigned_user' => $t->assignedUser?->name,
                    'assigned_user_photo' => $t->assignedUser ? $this->buildUserPhoto($t->assignedUser) : null,
                    'created_at' => $t->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    private function buildUserPhoto(User $user): string
    {
        $seed = urlencode($user->name ?: $user->email ?: $user->id);
        return "https://api.dicebear.com/10.x/lorelei/svg?seed={$seed}";
    }

public function show($id)
{
    $ticket = Ticket::with(['assignedUser', 'department'])
        ->find($id);

    if (!$ticket) {
        return response()->json([
            'message' => 'Ticket not found'
        ], 404);
    }

    return response()->json([
    'id' => $ticket->id,
    'title' => $ticket->title,
    'description' => $ticket->description,
    'status' => $ticket->status,
    'priority' => $ticket->priority,
    'assigned_user' => $ticket->assignedUser?->name,
    'assigned_user_photo' => $ticket->assignedUser ? $this->buildUserPhoto($ticket->assignedUser) : null,
    'department' => $ticket->department?->name,
    'created_at' => $ticket->created_at
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

    $payload = [
        'user_id' => (int) $request->user_id,
        'department_id' => (int) $request->department_id,
        'title' => trim((string) $request->title),
        'description' => trim((string) $request->description),
        'priority' => $request->priority,
        'assigned_user_id' => $request->filled('assigned_user_id') ? (int) $request->assigned_user_id : null,
        'status' => 'Open'
    ];

    $ticket = Ticket::create($payload);

    return response()->json([
        'success' => true,
        'message' => 'Ticket Created Successfully',
        'data' => $ticket
    ], 201);
}


    // Update ticket
    public function update(Request $request, $id)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'priority' => 'required|in:Low,Medium,High',
        'status' => 'required|in:Open,In Progress,Closed',
        'assigned_user_id' => 'nullable|exists:users,id',
    ]);

    $ticket = Ticket::findOrFail($id);

    $ticket->update([
        'title' => $request->title,
        'description' => $request->description,
        'priority' => $request->priority,
        'status' => $request->status,
        'assigned_user_id' => $request->assigned_user_id,
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