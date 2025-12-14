import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  @Input() title: string = 'Attendance Tracking System';
  user: any = null;
  showProfileMenu: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
    // Listen for user updates
    window.addEventListener('userUpdated', () => {
      this.loadUser();
    });
  }

  loadUser() {
    this.user = this.auth.getCurrentUser();
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  closeProfileMenu() {
    this.showProfileMenu = false;
  }

  goToProfile() {
    this.closeProfileMenu();
    this.router.navigate(['/profile']).then(() => {
      // Reload user data after navigation in case profile was updated
      setTimeout(() => this.loadUser(), 500);
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  getFullName(): string {
    if (!this.user) return '';
    return `${this.user.first_name} ${this.user.middle_initial ? this.user.middle_initial + '.' : ''} ${this.user.last_name}`.trim();
  }

  getProfilePictureUrl(): string {
    if (this.user?.profile_picture) {
      // If it's a full URL, return as is
      if (this.user.profile_picture.startsWith('http')) {
        return this.user.profile_picture;
      }
      // If it's a path, construct the URL
      // Check if it already includes /storage/
      if (this.user.profile_picture.startsWith('storage/') || this.user.profile_picture.startsWith('/storage/')) {
        return this.user.profile_picture.startsWith('/') ? this.user.profile_picture : `/${this.user.profile_picture}`;
      }
      return `/storage/${this.user.profile_picture}`;
    }
    return '/images/blankpfp.png';
  }
}

