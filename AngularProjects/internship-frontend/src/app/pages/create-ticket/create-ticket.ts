import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface LookupResult {
  id: number;
  name: string;
  department?: { id: number; name: string };
  assigned_user?: { id: number; name: string };
  photo?: string;
}

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-ticket.html',
  styleUrls: ['./create-ticket.css']
})
export class CreateTicket {
  ticketForm: FormGroup;
  departmentLookup: LookupResult | null = null;
  assigneeLookup: LookupResult | null = null;
  lookupStatus: 'idle' | 'loading' | 'found' | 'not-found' = 'idle';
  assigneeStatus: 'idle' | 'loading' | 'found' | 'not-found' = 'idle';
  lookupMessage = '';
  assigneeMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.ticketForm = this.fb.group({
      user_id: ['', Validators.required],
      department_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      priority: ['Low', Validators.required],
      assigned_user_id: ['']
    });

    this.ticketForm.get('department_id')?.valueChanges.subscribe((value: string | number | null) => {
      this.validateDepartment(value);
    });

    this.ticketForm.get('assigned_user_id')?.valueChanges.subscribe((value: string | number | null) => {
      this.validateAssignee(value);
    });
  }

  private validateDepartment(value: string | number | null): void {
    const id = Number(value);
    if (!value || Number.isNaN(id)) {
      this.departmentLookup = null;
      this.lookupStatus = 'idle';
      this.lookupMessage = '';
      return;
    }

    this.lookupStatus = 'loading';
    this.lookupMessage = 'Checking department…';

    this.http.get<any>('http://127.0.0.1:8000/tickets', { params: { department_id: id } }).subscribe({
      next: (res) => {
        const department = res?.lookup?.department ?? null;
        if (department) {
          this.departmentLookup = { id: department.id, name: department.name };
          this.lookupStatus = 'found';
          this.lookupMessage = `Department matched: ${department.name}`;
        } else {
          this.departmentLookup = null;
          this.lookupStatus = 'not-found';
          this.lookupMessage = 'No department matched this ID.';
        }
      },
      error: () => {
        this.departmentLookup = null;
        this.lookupStatus = 'not-found';
        this.lookupMessage = 'Unable to validate department right now.';
      }
    });
  }

  private validateAssignee(value: string | number | null): void {
    const id = Number(value);
    if (!value || Number.isNaN(id)) {
      this.assigneeLookup = null;
      this.assigneeStatus = 'idle';
      this.assigneeMessage = '';
      return;
    }

    this.assigneeStatus = 'loading';
    this.assigneeMessage = 'Checking assignee…';

    this.http.get<any>('http://127.0.0.1:8000/tickets', { params: { assigned_user_id: id } }).subscribe({
      next: (res) => {
        const assignee = res?.lookup?.assigned_user ?? null;
        if (assignee) {
          this.assigneeLookup = {
            id: assignee.id,
            name: assignee.name,
            photo: assignee.photo ?? ''
          };
          this.assigneeStatus = 'found';
          this.assigneeMessage = `Assigned agent: ${assignee.name}`;
        } else {
          this.assigneeLookup = null;
          this.assigneeStatus = 'not-found';
          this.assigneeMessage = 'No assignee matched this ID.';
        }
      },
      error: () => {
        this.assigneeLookup = null;
        this.assigneeStatus = 'not-found';
        this.assigneeMessage = 'Unable to validate assignee right now.';
      }
    });
  }
submitted = false;
  onSubmit() {
      this.submitted = true;
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.ticketForm.value,
      user_id: Number(this.ticketForm.value.user_id),
      department_id: Number(this.ticketForm.value.department_id),
      assigned_user_id: this.ticketForm.value.assigned_user_id ? Number(this.ticketForm.value.assigned_user_id) : null,
      title: (this.ticketForm.value.title ?? '').trim(),
      description: (this.ticketForm.value.description ?? '').trim(),
    };

    this.http.post('http://127.0.0.1:8000/tickets', payload).subscribe({
      next: () => {
        alert('Ticket Created Successfully');
        this.ticketForm.reset({
          priority: 'Low'
        });
        this.departmentLookup = null;
        this.assigneeLookup = null;
        this.lookupStatus = 'idle';
        this.assigneeStatus = 'idle';
        this.lookupMessage = '';
        this.assigneeMessage = '';
      },
      error: (err) => {
        console.error(err);
        alert('Ticket Create Failed');
      }
    });
  }
}