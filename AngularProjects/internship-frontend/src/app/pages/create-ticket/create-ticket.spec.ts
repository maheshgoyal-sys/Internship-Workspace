import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CreateTicket } from './create-ticket';

describe('CreateTicket', () => {
  let component: CreateTicket;
  let fixture: ComponentFixture<CreateTicket>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTicket, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTicket);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve department lookup from the tickets API', () => {
    component.ticketForm.patchValue({ department_id: 2 });

    const req = httpMock.expectOne((request) => request.method === 'GET' && request.url === 'http://127.0.0.1:8000/tickets');
    expect(req.request.params.get('department_id')).toBe('2');

    req.flush({ lookup: { department: { id: 2, name: 'Support' } } });

    expect(component.departmentLookup?.name).toBe('Support');
  });
});
