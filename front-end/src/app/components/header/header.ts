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
  @Input() title: string = 'RollMate';
  user: any = null;
  showProfileMenu: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
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

  goToLogin() {
    this.closeProfileMenu();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    if (!this.user) {
      alert('Not signed in');
      this.closeProfileMenu();
      return;
    }
    this.closeProfileMenu();
    this.router.navigate(['/profile']);
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
    if (!this.user) return 'Guest';
    return `${this.user.first_name} ${this.user.middle_initial ? this.user.middle_initial + '.' : ''} ${this.user.last_name}`.trim();
  }

  getProfilePictureUrl(): string {
    if (!this.user) return '/images/blankpfp.png';
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

