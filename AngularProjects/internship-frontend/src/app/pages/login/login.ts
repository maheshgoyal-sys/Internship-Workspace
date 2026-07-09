
  
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router,
  private http: HttpClient
) {

  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

}

 loginForm: ReturnType<FormBuilder['group']>;

  errorMessage = '';

  // login() ...
  get email() {
  return this.loginForm.controls['email'];
}

get password() {
  return this.loginForm.controls['password'];
}
 
login() {

  console.log("Login button clicked");

  
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.authService.login(this.loginForm.value).subscribe({

    next: (res: any) => {

      console.log("Laravel Response:", res);

      if (res.success) {

        console.log("Calling OTP API...");

        this.http.post('http://localhost:5000/send-otp', {
          email: res.user.email
        }).subscribe({

          next: (otpRes: any) => {

            console.log("OTP Response:", otpRes);

            // OTP verify ke liye email temporarily store kar rahe hain
            sessionStorage.setItem("email", res.user.email);

            alert("OTP Sent Successfully");

            this.router.navigate(['/otp']);

          },

          error: (err) => {

            console.error("OTP Error:", err);

            alert("Failed to send OTP");

          }

        });

      }

    },

    error: (err) => {

      console.error("Login Error:", err);

      this.errorMessage = err.error.message;

    }
    

  });
  

}
}