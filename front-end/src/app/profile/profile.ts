import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  user: any = null;
  originalUser: any = null;
  isEditing = false;
  message = '';
  selectedFile: File | null = null;
  previewUrl: string = '';
  password = '';
  passwordConfirmation = '';

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = JSON.parse(storedUser);
    this.originalUser = JSON.parse(JSON.stringify(this.user));
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res.data || res;
        this.originalUser = JSON.parse(JSON.stringify(this.user));
        this.updatePreviewUrl();
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(this.user));
      },
      error: (err) => {
        this.message = 'Failed to load profile.';
        console.error(err);
      }
    });
  }

  enableEdit() {
    this.isEditing = true;
    this.message = '';
    this.password = '';
    this.passwordConfirmation = '';
  }

  cancelEdit() {
    this.isEditing = false;
    this.user = JSON.parse(JSON.stringify(this.originalUser));
    this.selectedFile = null;
    this.previewUrl = '';
    this.password = '';
    this.passwordConfirmation = '';
    this.updatePreviewUrl();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.message = 'File size must be less than 2MB';
        return;
      }
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        this.message = 'Only JPEG, PNG, and GIF images are allowed';
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updatePreviewUrl() {
    if (this.user?.profile_picture) {
      if (this.user.profile_picture.startsWith('http')) {
        this.previewUrl = this.user.profile_picture;
      } else {
        this.previewUrl = `/storage/${this.user.profile_picture}`;
      }
    } else {
      this.previewUrl = '/images/blankpfp.png';
    }
  }

  saveChanges() {
    this.message = '';

    // Validate password if provided
    if (this.password) {
      if (this.password.length < 8) {
        this.message = 'Password must be at least 8 characters';
        return;
      }
      if (this.password !== this.passwordConfirmation) {
        this.message = 'Passwords do not match';
        return;
      }
    }

    // Upload profile picture first if selected
    if (this.selectedFile) {
      this.profileService.uploadProfilePicture(this.selectedFile).subscribe({
        next: (res: any) => {
          if (res.user) {
            this.user = res.user;
          } else {
            this.user.profile_picture = res.profile_picture;
          }
          this.updatePreviewUrl();
          this.updateUserData();
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to upload profile picture';
        }
      });
    } else {
      this.updateUserData();
    }
  }

  updateUserData() {
    const updateData: any = {
      first_name: this.user.first_name,
      middle_initial: this.user.middle_initial || '',
      last_name: this.user.last_name,
      age: this.user.age,
      gender: this.user.gender,
      date_of_birth: this.user.date_of_birth,
      recovery_email: this.user.recovery_email,
      phone: this.user.phone || '',
    };

    if (this.user.school_affiliation !== undefined) {
      updateData.school_affiliation = this.user.school_affiliation || null;
    }

    if (this.password) {
      updateData.password = this.password;
      updateData.password_confirmation = this.passwordConfirmation;
    }

    this.profileService.updateProfile(updateData).subscribe({
      next: (res: any) => {
        this.user = res.user || res.data || this.user;
        this.originalUser = JSON.parse(JSON.stringify(this.user));
        localStorage.setItem('user', JSON.stringify(this.user));
        this.updatePreviewUrl();
        this.message = 'Profile updated successfully!';
        this.isEditing = false;
        this.selectedFile = null;
        this.password = '';
        this.passwordConfirmation = '';
        // Trigger window event to refresh header
        window.dispatchEvent(new Event('userUpdated'));
      },
      error: (err) => {
        if (err.error?.errors) {
          const errors = err.error.errors;
          this.message = Object.values(errors).flat().join(', ');
        } else {
          this.message = err.error?.message || 'Failed to update profile';
        }
      }
    });
  }

  getFullName(): string {
    if (!this.user) return '';
    return `${this.user.last_name}, ${this.user.first_name} ${this.user.middle_initial ? this.user.middle_initial + '.' : ''}`.trim();
  }

  saveProfile() {
    this.saveChanges();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getProfilePictureUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl;
    }
    return '/images/blankpfp.png';
  }
}

