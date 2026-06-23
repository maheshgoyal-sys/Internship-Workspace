import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css'
})
export class TicketListComponent{

  tickets = [
    {
      ticketId: 101,
      title: 'Login Issue',
      status: 'Open',
      priority: 'High',
      assignedUser: 'John Doe'
    },
    {
      ticketId: 102,
      title: 'Profile Update Bug',
      status: 'In Progress',
      priority: 'Medium',
      assignedUser: 'Alice Smith'
    }
  ];
}