import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ClassroomService } from '../services/classroom.service';
import { Header } from '../components/header/header';

@Component({
  selector: 'teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header],
  templateUrl: './teacher-dashboard.html',
  styleUrls: ['./teacher-dashboard.css']
})
export class TeacherDashboard implements OnInit {
  user: any;
  classrooms: any[] = [];
  
  newClassroom = { subject: '', additional_info: '' };
  
  message = '';
  showClassroomPopup = false;

  constructor(
    private auth: AuthService,
    private classroomService: ClassroomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      if (this.user.role !== 'teacher') {
        this.router.navigate(['/login']);
        return;
      }
      this.loadClassrooms();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadClassrooms() {
    this.classroomService.getTeacherClassrooms().subscribe({
      next: (res: any) => {
        this.classrooms = res.data || res || [];
      },
      error: (err) => {
        this.message = 'Failed to load classrooms.';
        console.error(err);
      }
    });
  }

  createClassroom() {
    if (!this.newClassroom.subject) {
      this.message = 'Subject name is required.';
      return;
    }
    
    this.message = '';
    this.classroomService.createClassroom(this.newClassroom).subscribe({
      next: (res: any) => {
        this.message = 'Classroom created successfully!';
        this.showClassroomPopup = false;
        this.newClassroom = { subject: '', additional_info: '' };
        this.loadClassrooms();
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to create classroom.';
      }
    });
  }

  selectClassroom(classroom: any) {
    this.router.navigate(['/teacher-classroom', classroom.id]);
  }

}
