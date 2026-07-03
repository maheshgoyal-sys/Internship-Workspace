import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrls: ['./create-ticket.css']
})


export class CreateTicket {

  ticketForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {

    this.ticketForm = this.fb.group({
      user_id: ['', Validators.required],
      department_id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['Low', Validators.required],
      assigned_user_id: ['']
    });

  }

  onSubmit() {

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    console.log(this.ticketForm.value);

    this.http.post('http://127.0.0.1:8000/tickets', this.ticketForm.value)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          alert('Ticket Created Successfully');
          this.ticketForm.reset();
        },
        error: (err) => {
          console.log(err);
          alert('Ticket Create Failed');
        }
      });

  }
  

}