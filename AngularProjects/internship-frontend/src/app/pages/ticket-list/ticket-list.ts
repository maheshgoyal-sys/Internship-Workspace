import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to?: string;
  assigned_user?: string;
  assigned_user_photo?: string;
  assignee?: string;
  created_at?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.css'],
})
export class TicketList implements OnInit {
  private readonly API = 'http://127.0.0.1:8000';

  // raw data
  allTickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  pagedTickets: Ticket[] = [];

  // state
  loading = true;
  error = '';

  // filters
  searchQuery = '';
  filterStatus = '';
  filterPriority = '';
  filterUser = '';
  uniqueUsers: string[] = [];

  // pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  pages: number[] = [];

  // stats
  statTotal = 0;
  statOpen = 0;
  statInProgress = 0;
  statClosed = 0;

  // delete confirmation modal
  showDeleteModal = false;
  ticketToDelete: Ticket | null = null;
  deleting = false;

  // toast notification
  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
  private http: HttpClient,
  private router: Router
) {}

  ngOnInit(): void {
    this.fetchTickets();
  }

  fetchTickets(): void {
    this.loading = true;
    this.error = '';

    this.http.get<any>(`${this.API}/tickets`).subscribe({
      next: (result) => {
        const raw: Ticket[] = Array.isArray(result)
          ? result
          : result?.data ?? result?.tickets ?? result?.results ?? result?.items ?? [];

        this.allTickets = Array.isArray(raw) ? raw : [];
        this.buildDerivedState();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load tickets', err);
        this.error =
          'Could not connect to the API. Make sure your Django server is running and CORS is enabled.';
        this.loading = false;
      },
    });
  }

  private buildDerivedState(): void {
    const norm = (s: string) => (s ?? '').toLowerCase().replace(/[\s\-]/g, '_');

    this.statTotal = this.allTickets.length;
    this.statOpen = this.allTickets.filter((t) => norm(t.status) === 'open').length;
    this.statInProgress = this.allTickets.filter((t) =>
      ['in_progress', 'inprogress'].includes(norm(t.status))
    ).length;
    this.statClosed = this.allTickets.filter((t) => norm(t.status) === 'closed').length;

    this.uniqueUsers = [
      ...new Set(this.allTickets.map((t) => this.assigneeName(t)).filter(Boolean)),
    ].sort();

    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchQuery.toLowerCase();
    const norm = (s: string) => (s ?? '').toLowerCase().replace(/[\s\-]/g, '_');

    this.filteredTickets = this.allTickets.filter((t) => {
      const matchQ =
        !q ||
        (t.title ?? '').toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q);
      const matchStatus =
        !this.filterStatus || norm(t.status) === this.filterStatus;
      const matchPriority =
        !this.filterPriority || norm(t.priority) === this.filterPriority;
      const matchUser =
        !this.filterUser ||
        this.assigneeName(t).toLowerCase().includes(this.filterUser.toLowerCase());

      return matchQ && matchStatus && matchPriority && matchUser;
    });

    this.currentPage = 1;
    this.buildPagination();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterUser = '';
    this.applyFilters();
  }

  private buildPagination(): void {
    this.totalPages = Math.ceil(this.filteredTickets.length / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    // build visible page numbers with ellipsis slots
    const p: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (
        i === 1 ||
        i === this.totalPages ||
        Math.abs(i - this.currentPage) <= 1
      ) {
        p.push(i);
      } else if (p[p.length - 1] !== -1) {
        p.push(-1); // -1 = ellipsis
      }
    }
    this.pages = p;
    this.slicePage();
  }

  private slicePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedTickets = this.filteredTickets.slice(start, start + this.pageSize);
  }

  goPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.slicePage();
    this.buildPagination();
  }

  get showStart(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredTickets.length);
  }

  // ── helpers ──────────────────────────────────────────

  assigneeName(t: Ticket): string {
    return (t.assigned_to ?? t.assigned_user ?? t.assignee ?? '') as string;
  }

  initials(name: string): string {
    return (name || '?')
      .split(' ')
      .map((w) => w[0] ?? '')
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      open: 'badge-open',
      in_progress: 'badge-in-progress',
      inprogress: 'badge-in-progress',
      closed: 'badge-closed',
      pending: 'badge-pending',
    };
    return map[(status ?? '').toLowerCase().replace(/[\s\-]/g, '_')] ?? 'badge-closed';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      open: 'Open',
      in_progress: 'In Progress',
      inprogress: 'In Progress',
      closed: 'Closed',
      pending: 'Pending',
    };
    return map[(status ?? '').toLowerCase().replace(/[\s\-]/g, '_')] ?? (status || 'Unknown');
  }

  priorityClass(priority: string): string {
    const map: Record<string, string> = {
      critical: 'badge-critical',
      high: 'badge-high',
      medium: 'badge-medium',
      low: 'badge-low',
    };
    return map[(priority ?? '').toLowerCase()] ?? 'badge-low';
  }

  priorityLabel(priority: string): string {
    return priority
      ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
      : '—';
  }

  formatDate(raw: string | undefined): string {
    if (!raw) return '—';
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return (
      d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' ' +
      d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    );
  }

  onAvatarError(event: Event): void {
     const img = event.target as HTMLImageElement;
     img.style.display = 'none';
     const fallback = img.nextElementSibling as HTMLElement | null;
     if (fallback) fallback.style.display = 'flex';
   }
  ticketDate(t: Ticket): string {
    return this.formatDate(t.created_at ?? t.createdAt);
  }

  // ── actions ──────────────────────────────────────────

  viewTicket(id: number): void {
  this.router.navigate(['/ticket', id]);
}

  editTicket(id: number) {
  this.router.navigate(['/tickets/edit', id]);
}

  // ── delete flow ─────────────────────────────────────

  /** Opens the confirmation dialog for a given ticket. Does not delete anything yet. */
  requestDelete(ticket: Ticket): void {
    this.ticketToDelete = ticket;
    this.showDeleteModal = true;
  }

  /** Cancels the pending delete and closes the confirmation dialog. */
  cancelDelete(): void {
    if (this.deleting) return; // don't allow closing mid-request
    this.showDeleteModal = false;
    this.ticketToDelete = null;
  }

  /** Called when the user confirms deletion in the dialog. */
  // confirmDelete(): void {
  //   if (!this.ticketToDelete) return;
  //   const ticket = this.ticketToDelete;
  //   this.deleting = true;

  //   this.http.delete(`${this.API}/tickets/${ticket.id}`).subscribe({
  //     next: () => {
        
  //       this.allTickets = this.allTickets.filter((t) => t.id !== ticket.id);
  //       this.buildDerivedState();
  //       this.deleting = false;
  //       this.showDeleteModal = false;
  //       this.ticketToDelete = null;
  //       this.showToast(`Ticket #${ticket.id} "${ticket.title}" was deleted successfully.`, 'success');
  //     },
  //     error: (err) => {
  //       console.error('Failed to delete ticket', err);
  //       this.deleting = false;
  //       this.showDeleteModal = false;
  //       this.ticketToDelete = null;

  //       const serverMessage = err?.error?.detail || err?.error?.message;
  //       const message =
  //         serverMessage ||
  //         (err?.status === 0
  //           ? 'Could not reach the server. Check your connection and try again.'
  //           : err?.status
  //           ? `Server responded with an error (${err.status}). Please try again.`
  //           : 'Something went wrong while deleting the ticket. Please try again.');

  //       this.showToast(`Failed to delete ticket #${ticket.id}: ${message}`, 'error');
  //     },
  //   });
  // }
  confirmDelete(): void {
  if (!this.ticketToDelete) return;

  const ticket = this.ticketToDelete;
  this.deleting = true;

  console.log("Delete started");

  this.http.delete(`${this.API}/tickets/${ticket.id}`).subscribe({
    next: (res) => {
      console.log("NEXT CALLED");
      console.log(res);

      this.allTickets = this.allTickets.filter((t) => t.id !== ticket.id);

      this.buildDerivedState();

      this.deleting = false;
      console.log("deleting =", this.deleting);

      this.showDeleteModal = false;
      this.ticketToDelete = null;

      console.log("Before toast");
      this.showToast("Deleted Successfully", "success");
      console.log("After toast", this.toast);
    },

    error: (err) => {
      console.log("ERROR", err);
    }
  });
}

 createTicket(): void {
  this.router.navigate(['/tickets/create']);
}

  refresh(): void {
    this.fetchTickets();
  }

  // ── toast notifications ─────────────────────────────

  showToast(message: string, type: 'success' | 'error'): void {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }
    this.toast = { message, type };
    this.toastTimeoutId = setTimeout(() => {
      this.toast = null;
      this.toastTimeoutId = null;
    }, 4000);
  }
//   showToast(message: string, type: 'success' | 'error'): void {
//   alert(message);

//   this.toast = { message, type };

//   setTimeout(() => {
//     this.toast = null;
//   }, 4000);
// }

  dismissToast(): void {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
    this.toast = null;
  }
}