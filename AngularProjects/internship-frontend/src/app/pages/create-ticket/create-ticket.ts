import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, FormsModule, HttpClientModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {

  ticket = {
    user_id: 1,
    department_id: 1,
    title: '',
    description: '',
    priority: 'Medium'
  };
  private readonly API = 'http://127.0.0.1:8000';

constructor(
  private http: HttpClient,
  private router: Router
) {}

 saveTicket() {
  this.http.post(`${this.API}/tickets`, this.ticket).subscribe({
    next: (res) => {
      console.log(res);
      alert('Ticket Created Successfully');
      this.router.navigate(['/tickets']);
    },
    error: (err) => {
      console.error(err);
      alert('Ticket Create Failed');
    }
  });
}
}