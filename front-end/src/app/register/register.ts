import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  userData = {
    role: 'student',
    first_name: '',
    middle_initial: '',
    last_name: '',
    age: null as number | null,
    gender: '',
    date_of_birth: '',
    email: '',
    password: '',
    password_confirmation: '',
    recovery_email: '',
    school_affiliation: ''
  };

  message = '';
  loading = false;
  fieldErrors: { [key: string]: string[] } = {};

  constructor(private auth: AuthService, private router: Router) {}

  selectRole(role: 'student' | 'teacher') {
    this.userData.role = role;
    // Clear school_affiliation error when switching roles
    if (role === 'student') {
      delete this.fieldErrors['school_affiliation'];
    }
  }

  clearFieldError(field: string) {
    delete this.fieldErrors[field];
  }

  hasError(field: string): boolean {
    return !!this.fieldErrors[field] && this.fieldErrors[field].length > 0;
  }

  getError(field: string): string {
    return this.fieldErrors[field]?.[0] || '';
  }

  register() {
    // Clear previous errors
    this.fieldErrors = {};
    this.message = '';

    // Client-side validation
    let hasClientErrors = false;

    if (!this.userData.first_name) {
      this.fieldErrors['first_name'] = ['First name is required'];
      hasClientErrors = true;
    }

    if (!this.userData.last_name) {
      this.fieldErrors['last_name'] = ['Last name is required'];
      hasClientErrors = true;
    }

    if (!this.userData.email) {
      this.fieldErrors['email'] = ['Email is required'];
      hasClientErrors = true;
    } else if (!this.isValidEmail(this.userData.email)) {
      this.fieldErrors['email'] = ['Please enter a valid email address'];
      hasClientErrors = true;
    }

    if (!this.userData.password) {
      this.fieldErrors['password'] = ['Password is required'];
      hasClientErrors = true;
    } else if (this.userData.password.length < 8) {
      this.fieldErrors['password'] = ['Password must be at least 8 characters'];
      hasClientErrors = true;
    }

    if (!this.userData.password_confirmation) {
      this.fieldErrors['password_confirmation'] = ['Please confirm your password'];
      hasClientErrors = true;
    } else if (this.userData.password !== this.userData.password_confirmation) {
      this.fieldErrors['password_confirmation'] = ['Passwords do not match'];
      this.fieldErrors['password'] = ['Passwords do not match'];
      hasClientErrors = true;
    }

    if (!this.userData.recovery_email) {
      this.fieldErrors['recovery_email'] = ['Recovery email is required'];
      hasClientErrors = true;
    } else if (!this.isValidEmail(this.userData.recovery_email)) {
      this.fieldErrors['recovery_email'] = ['Please enter a valid email address'];
      hasClientErrors = true;
    }

    if (!this.userData.age || this.userData.age < 1) {
      this.fieldErrors['age'] = ['Age is required and must be at least 1'];
      hasClientErrors = true;
    }

    if (!this.userData.gender) {
      this.fieldErrors['gender'] = ['Gender is required'];
      hasClientErrors = true;
    }

    if (!this.userData.date_of_birth) {
      this.fieldErrors['date_of_birth'] = ['Date of birth is required'];
      hasClientErrors = true;
    }

    if (this.userData.role === 'teacher' && !this.userData.school_affiliation) {
      this.fieldErrors['school_affiliation'] = ['School affiliation is required for teachers'];
      hasClientErrors = true;
    }

    if (hasClientErrors) {
      this.message = 'Please fix the errors below';
      return;
    }

    this.loading = true;
    
    this.auth.register(this.userData).subscribe({
      next: (res) => {
        this.message = 'Registration successful! Redirecting to login...';
        this.fieldErrors = {};
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.fieldErrors = {};
        
        console.error('Registration error:', err);
        
        // Check for network/connection errors
        if (err.status === 0 || err.status === undefined) {
          this.message = 'Unable to connect to server. Please check if the backend is running.';
          return;
        }
        
        if (err.error?.errors) {
          // Map backend validation errors to field errors
          const backendErrors = err.error.errors;
          Object.keys(backendErrors).forEach(field => {
            // Map backend field names to frontend field names
            const fieldMap: { [key: string]: string } = {
              'first_name': 'first_name',
              'middle_initial': 'middle_initial',
              'last_name': 'last_name',
              'age': 'age',
              'gender': 'gender',
              'date_of_birth': 'date_of_birth',
              'email': 'email',
              'password': 'password',
              'password_confirmation': 'password_confirmation',
              'recovery_email': 'recovery_email',
              'school_affiliation': 'school_affiliation',
              'role': 'role'
            };
            
            const frontendField = fieldMap[field] || field;
            this.fieldErrors[frontendField] = Array.isArray(backendErrors[field]) 
              ? backendErrors[field] 
              : [backendErrors[field]];
          });
          this.message = 'Please fix the errors below';
        } else {
          // Show more detailed error message
          const errorMessage = err.error?.message || err.message || 'Registration failed!';
          this.message = `Registration failed: ${errorMessage}`;
          
          // If it's a server error (500), provide more context
          if (err.status === 500) {
            this.message = 'Server error occurred. Please try again later or contact support.';
          }
        }
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
