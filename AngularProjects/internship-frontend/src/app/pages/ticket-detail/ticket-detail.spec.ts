import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketDetail } from './ticket-detail';

describe('TicketDetailComponent', () => {
  let component: TicketDetail;
  let fixture: ComponentFixture<TicketDetail>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockTicket = {
    id: 8,
    title: 'Login page not loading',
    description: 'Users unable to access login page after latest deploy.',
    status: 'Open',
    priority: 'High',
    assigned_user: { id: 3, name: 'John Doe' },
    department: { id: 1, name: 'IT Support' },
    created_at: '2025-06-20T10:30:00Z'
  };

  const apiUrl = 'http://127.0.0.1:8000/tickets';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketDetail],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: '8' }) }
          }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();

  const req = httpMock.expectOne(`${apiUrl}/8`);
  req.flush(mockTicket);

  component.goBack();

  expect(router.navigate).toHaveBeenCalledWith(['/tickets']);

    fixture = TestBed.createComponent(TicketDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify(); // ensure no unexpected/pending requests
  });

  it('should create the component', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${apiUrl}/8`);
    req.flush(mockTicket);
    expect(component).toBeTruthy();
  });

  it('should fetch ticket details on init using the route id', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${apiUrl}/8`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTicket);

    expect(component.ticket).toEqual(mockTicket as any);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeNull();
  });

  it('should set error state when the API call fails', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${apiUrl}/8`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(component.error).toBe('Failed to load ticket details. Please try again.');
    expect(component.loading).toBeFalsy();
    expect(component.ticket).toBeNull();
  });

  it('should set an error when the id param is missing or invalid', () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: {
        snapshot: { paramMap: convertToParamMap({}) }
      }
    });
    fixture = TestBed.createComponent(TicketDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error).toBe('Invalid ticket ID.');
    expect(component.loading).toBeFalsy();
    httpMock.expectNone(`${apiUrl}/NaN`);
  });

  it('should navigate back to ticket list when goBack is called', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${apiUrl}/8`);
    req.flush(mockTicket);

    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/tickets']);
  });

  it('should resolve assignedUserName correctly for object shape', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${apiUrl}/8`);
    req.flush(mockTicket);

    expect(component.assignedUserName).toBe('John Doe');
  });

  it('should resolve assignedUserName as "Unassigned" when null', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${apiUrl}/8`);
    req.flush({ ...mockTicket, assigned_user: null });

    expect(component.assignedUserName).toBe('Unassigned');
  });

  it('should resolve departmentName correctly for object shape', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${apiUrl}/8`);
    req.flush(mockTicket);

    expect(component.departmentName).toBe('IT Support');
  });

  it('should resolve departmentName as "N/A" when null', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`${apiUrl}/8`);
    req.flush({ ...mockTicket, department: null });

    expect(component.departmentName).toBe('N/A');
  });
});