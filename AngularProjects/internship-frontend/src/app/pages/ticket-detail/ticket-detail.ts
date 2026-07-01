import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_user: string | { id: number; name: string } | null;
  department: string | { id: number; name: string } | null;
  created_at: string;
}

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './ticket-detail.html',
  styleUrls: ['./ticket-detail.css']
})
export class TicketDetail implements OnInit {
  ticket: Ticket | null = null;
  loading = true;
  error: string | null = null;

  private apiUrl = 'http://127.0.0.1:8000/tickets'; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || isNaN(id)) {
      this.error = 'Invalid ticket ID.';
      this.loading = false;
      return;
    }
// reload(): void {
//   this.fetchTicket(); // replace with whatever your fetch method is actually called
// }
this.loadTicket(id);
  }

  loadTicket(id: number): void {
    this.loading = true;
    this.error = null;

    this.http.get<Ticket>(`${this.apiUrl}/${id}`).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load ticket details. Please try again.';
        this.loading = false;
      }
    });
  }
initials(name: string) {
  return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  get assignedUserName(): string {
    const u = this.ticket?.assigned_user;
    if (!u) return 'Unassigned';
    return typeof u === 'string' ? u : u.name;
  }

  get departmentName(): string {
    const d = this.ticket?.department;
    if (!d) return 'N/A';
    return typeof d === 'string' ? d : d.name;
  }

  statusClass(status: string): string {
    return 'badge-status-' + (status || '').toLowerCase().replace(/\s+/g, '_');
  }

  priorityClass(priority: string): string {
    return 'badge-priority-' + (priority || '').toLowerCase();
  }
}