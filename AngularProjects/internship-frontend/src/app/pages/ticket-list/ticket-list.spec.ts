import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TicketList, Ticket } from './ticket-list';

// ── mock data ──────────────────────────────────────────────────────────────────
const MOCK_TICKETS: Ticket[] = [
  { id: 1, title: 'Login Issue',            description: 'Unable to login',        status: 'open',        priority: 'high',   assigned_to: 'Rahul Sharma',  created_at: '2025-05-14T10:30:00Z' },
  { id: 2, title: 'Password Reset',         description: 'Link not received',      status: 'open',        priority: 'medium', assigned_to: 'Priya Singh',   created_at: '2025-05-14T11:15:00Z' },
  { id: 3, title: 'Email Not Working',      description: 'Not receiving emails',   status: 'in_progress', priority: 'high',   assigned_to: 'Amit Kumar',    created_at: '2025-05-14T12:05:00Z' },
  { id: 4, title: 'System Performance Slow',description: 'System is running slow', status: 'in_progress', priority: 'low',    assigned_to: 'Neha Verma',    created_at: '2025-05-14T12:45:00Z' },
  { id: 5, title: 'Page Not Loading',       description: 'Dashboard not loading',  status: 'closed',      priority: 'medium', assigned_to: 'Sanjay Patel',  created_at: '2025-05-13T16:20:00Z' },
];

// ── helpers ────────────────────────────────────────────────────────────────────
function setup() {
  TestBed.configureTestingModule({
    imports: [TicketList, HttpClientTestingModule, FormsModule],
  }).compileComponents();

  const fixture  = TestBed.createComponent(TicketList);
  const component = fixture.componentInstance;
  const http     = TestBed.inject(HttpTestingController);
  return { fixture, component, http };
}

function flushTickets(http: HttpTestingController, body: any = MOCK_TICKETS) {
  const req = http.expectOne('http://127.0.0.1:8000/tickets');
  expect(req.request.method).toBe('GET');
  req.flush(body);
}

// ── test suites ────────────────────────────────────────────────────────────────

describe('TicketList — creation', () => {
  it('should create the component', () => {
    const { fixture, component, http } = setup();
    fixture.detectChanges();
    flushTickets(http);
    expect(component).toBeTruthy();
    http.verify();
  });
});

// ── API loading ────────────────────────────────────────────────────────────────
describe('TicketList — API loading', () => {
  let fixture:   ComponentFixture<TicketList>;
  let component: TicketList;
  let http:      HttpTestingController;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
  });

  afterEach(() => http.verify());

  it('should show loading=true before response arrives', () => {
    fixture.detectChanges();
    expect(component.loading).toBeTrue();
  });

  it('should load tickets from a plain array response', () => {
    fixture.detectChanges();
    flushTickets(http, MOCK_TICKETS);
    expect(component.allTickets.length).toBe(5);
    expect(component.loading).toBeFalse();
  });

  it('should load tickets from { data: [...] } envelope', () => {
    fixture.detectChanges();
    flushTickets(http, { data: MOCK_TICKETS });
    expect(component.allTickets.length).toBe(5);
  });

  it('should load tickets from { tickets: [...] } envelope', () => {
    fixture.detectChanges();
    flushTickets(http, { tickets: MOCK_TICKETS });
    expect(component.allTickets.length).toBe(5);
  });

  it('should load tickets from { results: [...] } envelope', () => {
    fixture.detectChanges();
    flushTickets(http, { results: MOCK_TICKETS });
    expect(component.allTickets.length).toBe(5);
  });

  it('should set error on HTTP failure and stop loading', () => {
    fixture.detectChanges();
    const req = http.expectOne('http://127.0.0.1:8000/tickets');
    req.error(new ProgressEvent('network error'));
    expect(component.loading).toBeFalse();
    expect(component.error).toBeTruthy();
  });
});

// ── stats ──────────────────────────────────────────────────────────────────────
describe('TicketList — stats', () => {
  let fixture:   ComponentFixture<TicketList>;
  let component: TicketList;
  let http:      HttpTestingController;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
    fixture.detectChanges();
    flushTickets(http);
  });

  afterEach(() => http.verify());

  it('should compute statTotal correctly', () => {
    expect(component.statTotal).toBe(5);
  });

  it('should compute statOpen correctly', () => {
    expect(component.statOpen).toBe(2);
  });

  it('should compute statInProgress correctly', () => {
    expect(component.statInProgress).toBe(2);
  });

  it('should compute statClosed correctly', () => {
    expect(component.statClosed).toBe(1);
  });
});

// ── filters ────────────────────────────────────────────────────────────────────
describe('TicketList — filters', () => {
  let fixture:   ComponentFixture<TicketList>;
  let component: TicketList;
  let http:      HttpTestingController;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
    fixture.detectChanges();
    flushTickets(http);
  });

  afterEach(() => http.verify());

  it('should filter by search query (title)', () => {
    component.searchQuery = 'login';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(1);
    expect(component.filteredTickets[0].id).toBe(1);
  });

  it('should filter by search query (description)', () => {
    component.searchQuery = 'not receiving';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(1);
    expect(component.filteredTickets[0].id).toBe(3);
  });

  it('should filter by status=open', () => {
    component.filterStatus = 'open';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(2);
    component.filteredTickets.forEach(t => expect(t.status).toBe('open'));
  });

  it('should filter by status=in_progress', () => {
    component.filterStatus = 'in_progress';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(2);
  });

  it('should filter by status=closed', () => {
    component.filterStatus = 'closed';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(1);
  });

  it('should filter by priority=high', () => {
    component.filterPriority = 'high';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(2);
  });

  it('should filter by priority=medium', () => {
    component.filterPriority = 'medium';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(2);
  });

  it('should filter by assigned user', () => {
    component.filterUser = 'Rahul Sharma';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(1);
    expect(component.filteredTickets[0].id).toBe(1);
  });

  it('should combine multiple filters', () => {
    component.filterStatus   = 'open';
    component.filterPriority = 'high';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(1);
    expect(component.filteredTickets[0].id).toBe(1);
  });

  it('should return all tickets when filters are empty', () => {
    component.filterStatus   = '';
    component.filterPriority = '';
    component.filterUser     = '';
    component.searchQuery    = '';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(5);
  });

  it('should clear all filters with clearFilters()', () => {
    component.searchQuery  = 'login';
    component.filterStatus = 'open';
    component.applyFilters();
    expect(component.filteredTickets.length).toBe(1);

    component.clearFilters();
    expect(component.filteredTickets.length).toBe(5);
    expect(component.searchQuery).toBe('');
    expect(component.filterStatus).toBe('');
  });

  it('should reset to page 1 after applying filters', () => {
    component.currentPage = 3;
    component.applyFilters();
    expect(component.currentPage).toBe(1);
  });
});

// ── helpers ────────────────────────────────────────────────────────────────────
describe('TicketList — helper methods', () => {
  let component: TicketList;
  let http:      HttpTestingController;
  let fixture:   ComponentFixture<TicketList>;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
    fixture.detectChanges();
    flushTickets(http);
  });

  afterEach(() => http.verify());

  // assigneeName
  it('assigneeName should read assigned_to', () => {
    expect(component.assigneeName(MOCK_TICKETS[0])).toBe('Rahul Sharma');
  });

  it('assigneeName should fall back to assigned_user', () => {
    const t = { ...MOCK_TICKETS[0], assigned_to: undefined, assigned_user: 'Priya' } as any;
    expect(component.assigneeName(t)).toBe('Priya');
  });

  it('assigneeName should fall back to assignee', () => {
    const t = { ...MOCK_TICKETS[0], assigned_to: undefined, assigned_user: undefined, assignee: 'Amit' } as any;
    expect(component.assigneeName(t)).toBe('Amit');
  });

  // initials
  it('initials should return two-char uppercase', () => {
    expect(component.initials('Rahul Sharma')).toBe('RS');
  });

  it('initials should handle single name', () => {
    expect(component.initials('Admin')).toBe('A');
  });

  // statusClass
  it('statusClass should return badge-open for open', () => {
    expect(component.statusClass('open')).toBe('badge-open');
  });

  it('statusClass should return badge-in-progress for in_progress', () => {
    expect(component.statusClass('in_progress')).toBe('badge-in-progress');
  });

  it('statusClass should return badge-in-progress for "In Progress" with spaces', () => {
    expect(component.statusClass('In Progress')).toBe('badge-in-progress');
  });

  it('statusClass should return badge-closed for closed', () => {
    expect(component.statusClass('closed')).toBe('badge-closed');
  });

  // statusLabel
  it('statusLabel should return "In Progress" for in_progress', () => {
    expect(component.statusLabel('in_progress')).toBe('In Progress');
  });

  // priorityClass
  it('priorityClass should return badge-high for High', () => {
    expect(component.priorityClass('High')).toBe('badge-high');
  });

  it('priorityClass should return badge-medium for medium', () => {
    expect(component.priorityClass('medium')).toBe('badge-medium');
  });

  // priorityLabel
  it('priorityLabel should capitalise first letter', () => {
    expect(component.priorityLabel('high')).toBe('High');
  });

  // formatDate
  it('formatDate should return — for empty string', () => {
    expect(component.formatDate('')).toBe('—');
  });

  it('formatDate should return — for undefined', () => {
    expect(component.formatDate(undefined)).toBe('—');
  });

  it('formatDate should return a formatted string for valid ISO date', () => {
    const result = component.formatDate('2025-05-14T10:30:00Z');
    expect(result).toContain('2025');
    expect(result).toContain('May');
  });
});

// ── pagination ─────────────────────────────────────────────────────────────────
describe('TicketList — pagination', () => {
  let fixture:   ComponentFixture<TicketList>;
  let component: TicketList;
  let http:      HttpTestingController;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
    component.pageSize = 2; // force multi-page with 5 items
    fixture.detectChanges();
    flushTickets(http);
  });

  afterEach(() => http.verify());

  it('should calculate totalPages correctly', () => {
    expect(component.totalPages).toBe(3);
  });

  it('goPage should change currentPage', () => {
    component.goPage(2);
    expect(component.currentPage).toBe(2);
  });

  it('goPage should not go below page 1', () => {
    component.goPage(0);
    expect(component.currentPage).toBe(1);
  });

  it('goPage should not exceed totalPages', () => {
    component.goPage(99);
    expect(component.currentPage).toBe(1); // stays at 1 (invalid)
  });

  it('showStart should reflect current page', () => {
    component.goPage(2);
    expect(component.showStart).toBe(3);
  });

  it('showEnd should clamp to total items', () => {
    component.goPage(3);
    expect(component.showEnd).toBe(5);
  });

  it('pagedTickets should contain only the current page slice', () => {
    component.goPage(1);
    expect(component.pagedTickets.length).toBe(2);
    expect(component.pagedTickets[0].id).toBe(1);
  });
});

// ── unique users ───────────────────────────────────────────────────────────────
describe('TicketList — unique users dropdown', () => {
  let fixture:   ComponentFixture<TicketList>;
  let component: TicketList;
  let http:      HttpTestingController;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
    fixture.detectChanges();
    flushTickets(http);
  });

  afterEach(() => http.verify());

  it('should populate uniqueUsers from ticket data', () => {
    expect(component.uniqueUsers.length).toBe(5);
    expect(component.uniqueUsers).toContain('Rahul Sharma');
  });

  it('uniqueUsers should be sorted alphabetically', () => {
    const sorted = [...component.uniqueUsers].sort();
    expect(component.uniqueUsers).toEqual(sorted);
  });
});

// ── delete ─────────────────────────────────────────────────────────────────────
describe('TicketList — deleteTicket', () => {
  let fixture:   ComponentFixture<TicketList>;
  let component: TicketList;
  let http:      HttpTestingController;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
    fixture.detectChanges();
    flushTickets(http);
    spyOn(window, 'confirm').and.returnValue(true);
  });

  afterEach(() => http.verify());

  it('should call DELETE /tickets/:id and remove from list', () => {
    component.deleteTicket(1);
    const req = http.expectOne('http://127.0.0.1:8000/tickets/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(component.allTickets.find(t => t.id === 1)).toBeUndefined();
    expect(component.statTotal).toBe(4);
  });

  it('should not delete if user cancels confirm', () => {
    (window.confirm as jasmine.Spy).and.returnValue(false);
    component.deleteTicket(1);
    http.expectNone('http://127.0.0.1:8000/tickets/1');
    expect(component.allTickets.length).toBe(5);
  });
});

// ── template rendering ─────────────────────────────────────────────────────────
describe('TicketList — template', () => {
  let fixture:   ComponentFixture<TicketList>;
  let component: TicketList;
  let http:      HttpTestingController;

  beforeEach(() => {
    ({ fixture, component, http } = setup());
    fixture.detectChanges();
    flushTickets(http);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('should render 5 table rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(5);
  });

  it('should display the ticket title in each row', () => {
    const first = fixture.debugElement.query(By.css('tbody tr:first-child .ticket-title'));
    expect(first.nativeElement.textContent.trim()).toBe('Login Issue');
  });

  it('should render stat-value elements with correct numbers', () => {
    const values = fixture.debugElement.queryAll(By.css('.stat-value'));
    expect(values[0].nativeElement.textContent.trim()).toBe('5'); // total
    expect(values[1].nativeElement.textContent.trim()).toBe('2'); // open
    expect(values[2].nativeElement.textContent.trim()).toBe('2'); // in progress
    expect(values[3].nativeElement.textContent.trim()).toBe('1'); // closed
  });

  it('should not show error banner when load succeeds', () => {
    const err = fixture.debugElement.query(By.css('.tl-error'));
    expect(err).toBeNull();
  });

  it('should show loading spinner before data arrives', () => {
    const { fixture: f2, component: c2, http: h2 } = setup();
    f2.detectChanges();
    const spinner = f2.debugElement.query(By.css('.spinner'));
    expect(spinner).toBeTruthy();
    flushTickets(h2);
    h2.verify();
  });
});

function spyOn(window: Window & typeof globalThis, arg1: string) {
  throw new Error('Function not implemented.');
}
