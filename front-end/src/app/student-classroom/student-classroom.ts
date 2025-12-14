import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClassroomService } from '../services/classroom.service';
import { SessionService } from '../services/session.service';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-student-classroom',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header],
  templateUrl: './student-classroom.html',
  styleUrls: ['./student-classroom.css']
})
export class StudentClassroom implements OnInit {
  classroom: any = null;
  sessions: any[] = [];
  classroomId: number = 0;
  user: any = null;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classroomService: ClassroomService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = JSON.parse(storedUser);
    if (this.user.role !== 'student') {
      this.router.navigate(['/student-dashboard']);
      return;
    }

    this.route.params.subscribe(params => {
      this.classroomId = +params['id'];
      this.loadClassroom();
      this.loadSessions();
    });
  }

  loadClassroom() {
    this.classroomService.getStudentClassrooms().subscribe({
      next: (res: any) => {
        const classrooms = res.data || res || [];
        this.classroom = classrooms.find((c: any) => c.id === this.classroomId);
        if (!this.classroom) {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: (err) => {
        this.message = 'Failed to load classroom.';
        console.error(err);
      }
    });
  }

  loadSessions() {
    this.sessionService.getSessions(this.classroomId).subscribe({
      next: (res: any) => {
        this.sessions = (res.data || res || []).sort((a: any, b: any) => {
          const dateA = new Date(a.date + ' ' + a.time_created);
          const dateB = new Date(b.date + ' ' + b.time_created);
          return dateB.getTime() - dateA.getTime(); // Newest first
        });
      },
      error: (err) => {
        this.message = 'Failed to load sessions.';
        console.error(err);
      }
    });
  }

  markPresent(sessionId: number) {
    this.sessionService.markPresent(sessionId).subscribe({
      next: (res: any) => {
        this.message = 'Attendance marked successfully!';
        this.loadSessions();
      },
      error: (err) => {
        this.message = err.error?.error || err.error?.message || 'Failed to mark attendance.';
      }
    });
  }

  viewAttendance() {
    this.router.navigate(['/student-classroom', this.classroomId, 'attendance']);
  }

  getFullName(user: any): string {
    if (!user) return '';
    return `${user.last_name}, ${user.first_name} ${user.middle_initial ? user.middle_initial + '.' : ''}`.trim();
  }

  getStudentStatus(session: any): string {
    if (!session.attendances) return 'absent';
    const myAttendance = session.attendances.find((a: any) => a.student_id === this.user.id);
    return myAttendance?.status || 'absent';
  }

  isAlreadyPresent(session: any): boolean {
    const status = this.getStudentStatus(session);
    return status === 'present' || status === 'late';
  }

  goBack() {
    this.router.navigate(['/student-dashboard']);
  }
}

