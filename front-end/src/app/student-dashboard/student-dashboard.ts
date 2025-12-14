import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ClassroomService } from '../services/classroom.service';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css']
})
export class StudentDashboard implements OnInit {
  user: any;
  classrooms: any[] = [];
  
  joinCode = '';
  message = '';
  showJoinModal = false;

  constructor(
    private auth: AuthService,
    private classroomService: ClassroomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      if (this.user.role !== 'student') {
        this.router.navigate(['/login']);
        return;
      }
      this.loadClassrooms();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadClassrooms() {
    this.classroomService.getStudentClassrooms().subscribe({
      next: (res: any) => {
        this.classrooms = res.data || res || [];
      },
      error: (err) => {
        this.message = 'Failed to load classrooms.';
        console.error(err);
      }
    });
  }

  joinClassroom() {
    if (!this.joinCode.trim()) {
      this.message = 'Please enter a classroom code.';
      return;
    }

    this.message = '';
    this.classroomService.joinClassroom(this.joinCode.toUpperCase()).subscribe({
      next: (res: any) => {
        this.message = 'Successfully joined classroom!';
        this.showJoinModal = false;
        this.joinCode = '';
        this.loadClassrooms();
      },
      error: (err) => {
        this.message = err.error?.error || err.error?.message || 'Failed to join classroom.';
      }
    });
  }

  selectClassroom(classroom: any) {
    this.router.navigate(['/student-classroom', classroom.id]);
  }

  getFullName(user: any): string {
    if (!user) return '';
    return `${user.last_name}, ${user.first_name} ${user.middle_initial ? user.middle_initial + '.' : ''}`.trim();
  }
}
