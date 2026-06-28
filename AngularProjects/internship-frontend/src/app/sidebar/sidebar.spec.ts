import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar open state', () => {
    expect(component.isOpen).toBeFalsy();

    component.toggleSidebar();

    expect(component.isOpen).toBeTruthy();
  });

  it('should close sidebar', () => {
    component.isOpen = true;

    component.closeSidebar();

    expect(component.isOpen).toBeFalsy();
  });

  it('should toggle tickets accordion', () => {
    expect(component.ticketsExpanded).toBeFalsy();

    component.toggleTickets();

    expect(component.ticketsExpanded).toBeTruthy();
  });
});