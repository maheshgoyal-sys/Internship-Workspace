import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.css'
})
export class Otp {

  otp = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  verifyOtp() {

    const email = sessionStorage.getItem('email');

    this.http.post('http://localhost:5000/verify-otp', {
      email: email,
      otp: this.otp
    }).subscribe({

      next: (res: any) => {

        alert(res.message);

        // OTP verify hone ke baad login complete
        localStorage.setItem('isLoggedIn', 'true');

        this.router.navigate(['/home']);

      },

      error: (err) => {

        alert(err.error.message);

      }

    });

  }

}