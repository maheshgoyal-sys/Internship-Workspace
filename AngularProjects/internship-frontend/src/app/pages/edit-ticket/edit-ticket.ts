import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface LookupResult {
  id: number;
  name: string;
  photo?: string;
}

@Component({
  selector: 'app-edit-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-ticket.html',
  styleUrls: ['./edit-ticket.css']
})
export class EditTicket implements OnInit {

  ticketId!: number;
  submitted = false;

  ticketForm: FormGroup;

  assigneeLookup: LookupResult | null = null;

  assigneeStatus: 'idle' | 'loading' | 'found' | 'not-found' = 'idle';
  assigneeMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      priority: ['Low', Validators.required],
      status: ['Open', Validators.required],
      assigned_user_id: ['']
    });

    this.ticketForm.get('assigned_user_id')?.valueChanges.subscribe(value => {
      this.validateAssignee(value);
    });
  }

  ngOnInit(): void {

    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadTicket();

  }

  loadTicket() {

    this.http.get<any>(`http://127.0.0.1:8000/tickets/${this.ticketId}`)
      .subscribe({

        next: (res) => {

          this.ticketForm.patchValue({

            title: res.title,
            description: res.description,
            priority: res.priority,
            status: res.status,
            assigned_user_id: res.assigned_user?.id ?? ''

          });

          if (res.assigned_user) {

            this.assigneeLookup = {

              id: res.assigned_user.id,
              name: res.assigned_user.name,
              photo: res.assigned_user.photo

            };

            this.assigneeStatus = 'found';
            this.assigneeMessage = `Assigned agent: ${res.assigned_user.name}`;

          }

        },

        error: () => {

          alert('Unable to load ticket.');

        }

      });

  }

  validateAssignee(value: any) {

    const id = Number(value);

    if (!value || Number.isNaN(id)) {

      this.assigneeLookup = null;
      this.assigneeStatus = 'idle';
      this.assigneeMessage = '';

      return;

    }

    this.assigneeStatus = 'loading';
    this.assigneeMessage = 'Checking assignee...';

    this.http.get<any>('http://127.0.0.1:8000/tickets', {

      params: {
        assigned_user_id: id
      }

    }).subscribe({

      next: (res) => {

        const assignee = res.lookup?.assigned_user;

        if (assignee) {

          this.assigneeLookup = {

            id: assignee.id,
            name: assignee.name,
            photo: assignee.photo

          };

          this.assigneeStatus = 'found';
          this.assigneeMessage = `Assigned agent: ${assignee.name}`;

        } else {

          this.assigneeLookup = null;
          this.assigneeStatus = 'not-found';
          this.assigneeMessage = 'Agent not found';

        }

      },

      error: () => {

        this.assigneeLookup = null;
        this.assigneeStatus = 'not-found';
        this.assigneeMessage = 'Unable to validate agent';

      }

    });

  }

  onSubmit() {

    this.submitted = true;

    if (this.ticketForm.invalid) {

      this.ticketForm.markAllAsTouched();

      return;

    }

    const payload = {

      title: this.ticketForm.value.title.trim(),
      description: this.ticketForm.value.description.trim(),
      priority: this.ticketForm.value.priority,
      status: this.ticketForm.value.status,
      assigned_user_id: this.ticketForm.value.assigned_user_id
        ? Number(this.ticketForm.value.assigned_user_id)
        : null

    };

    this.http.put(

      `http://127.0.0.1:8000/tickets/${this.ticketId}`,
      payload

    ).subscribe({

      next: () => {

        alert('Ticket Updated Successfully');

        this.router.navigate(['/tickets']);

      },

      error: (err) => {

        console.error(err);

        alert('Ticket Update Failed');

      }

    });

  }

}