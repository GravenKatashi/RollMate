import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClassroomService } from '../services/classroom.service';
import { SessionService } from '../services/session.service';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-teacher-classroom',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header],
  templateUrl: './teacher-classroom.html',
  styleUrls: ['./teacher-classroom.css']
})
export class TeacherClassroom implements OnInit {
  classroom: any = null;
  sessions: any[] = [];
  newSession = { topic: '', date: '' };
  message = '';
  showSessionPopup = false;
  classroomId: number = 0;

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

    const user = JSON.parse(storedUser);
    if (user.role !== 'teacher') {
      this.router.navigate(['/teacher-dashboard']);
      return;
    }

    this.route.params.subscribe(params => {
      this.classroomId = +params['id'];
      this.loadClassroom();
      this.loadSessions();
    });
  }

  loadClassroom() {
    this.classroomService.getTeacherClassrooms().subscribe({
      next: (res: any) => {
        const classrooms = res.data || res || [];
        this.classroom = classrooms.find((c: any) => c.id === this.classroomId);
        if (!this.classroom) {
          this.router.navigate(['/teacher-dashboard']);
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

  createSession() {
    if (!this.newSession.topic || !this.newSession.date) {
      this.message = 'Topic and date are required.';
      return;
    }

    this.message = '';
    this.sessionService.createSession({
      classroom_id: this.classroomId,
      topic: this.newSession.topic,
      date: this.newSession.date
    }).subscribe({
      next: (res: any) => {
        this.message = 'Session created successfully!';
        this.showSessionPopup = false;
        this.newSession = { topic: '', date: '' };
        this.loadSessions();
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to create session.';
      }
    });
  }

  closeSession(sessionId: number) {
    if (confirm('Are you sure you want to close this session?')) {
      this.sessionService.closeSession(sessionId).subscribe({
        next: () => {
          this.message = 'Session closed successfully!';
          this.loadSessions();
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to close session.';
        }
      });
    }
  }

  viewSession(sessionId: number) {
    this.router.navigate(['/teacher-classroom', this.classroomId, 'session', sessionId]);
  }

  goBack() {
    this.router.navigate(['/teacher-dashboard']);
  }
}

