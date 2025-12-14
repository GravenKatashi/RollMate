import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials = { email: '', password: '' };
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.credentials.email || !this.credentials.password) {
      this.message = 'Please fill in all fields';
      return;
    }

    this.message = '';
    this.auth.login(this.credentials).subscribe({
      next: (res: any) => {
        // Save token and user info (backend returns access_token)
        if (res.access_token) {
          localStorage.setItem('token', res.access_token);
        }
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }

        // Role-based redirection
        if (res.user?.role === 'student') {
          this.router.navigate(['/student-dashboard']);
        } else if (res.user?.role === 'teacher') {
          this.router.navigate(['/teacher-dashboard']);
        } else {
          this.message = 'Invalid user role';
        }
      },
      error: (err) => {
        this.message = err.error?.message || err.error?.error || 'Login failed!';
      }
    });
  }
}
