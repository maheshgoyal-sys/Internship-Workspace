import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.css']
})
export class TicketList implements OnInit {
  tickets: any[] = [];
  loading = true;

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.loading = true;

    fetch('http://127.0.0.1:8000/tickets')
      .then((res) => res.json())
      .then((result) => {
        // Backend might return either: { data: [...] } OR just [...]
        const data = (result && (result.data ?? result)) as any[];
        this.tickets = Array.isArray(data) ? data : [];
      })
      .catch((err) => {
        console.error('Failed to load tickets', err);
        this.tickets = [];
      })
      .finally(() => {
        this.loading = false;
      });
  }
}

