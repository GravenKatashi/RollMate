import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  model = {
    full_name: '',
    email: '',
    role: 'student',
    password: '',
    password_confirmation: '',
    school_affiliation: '',
  };
  message = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onRegister() {
    if (!this.model.full_name || !this.model.email || !this.model.password || !this.model.password_confirmation) {
      this.message = 'Please fill in all required fields';
      return;
    }

    if (this.model.password !== this.model.password_confirmation) {
      this.message = 'Passwords do not match';
      return;
    }

    this.message = '';
    this.isLoading = true;

    // Prepare data for backend
    const userData = {
      full_name: this.model.full_name,
      email: this.model.email,
      password: this.model.password,
      password_confirmation: this.model.password_confirmation,
      role: this.model.role,
    };

    this.auth.register(userData).subscribe({
      next: (res: any) => {
        this.message = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        this.isLoading = false;
      },
      error: (err) => {
        alert(JSON.stringify(err.error));
        this.isLoading = false;
      }
    });
  }
}
