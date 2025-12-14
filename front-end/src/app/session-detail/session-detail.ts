import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SessionService } from '../services/session.service';
import { ClassroomService } from '../services/classroom.service';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header],
  templateUrl: './session-detail.html',
  styleUrls: ['./session-detail.css']
})
export class SessionDetail implements OnInit {
  classroom: any = null;
  session: any = null;
  students: any[] = [];
  sortedStudents: any[] = [];
  sortBy: 'name' | 'status' = 'name';
  classroomId: number = 0;
  sessionId: number = 0;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private classroomService: ClassroomService
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
      this.classroomId = +params['classroomId'];
      this.sessionId = +params['sessionId'];
      this.loadData();
    });
  }

  loadData() {
    this.classroomService.getTeacherClassrooms().subscribe({
      next: (res: any) => {
        const classrooms = res.data || res || [];
        this.classroom = classrooms.find((c: any) => c.id === this.classroomId);
        if (!this.classroom) {
          this.router.navigate(['/teacher-dashboard']);
          return;
        }
        this.loadSession();
      },
      error: (err) => {
        this.message = 'Failed to load classroom.';
        console.error(err);
      }
    });
  }

  loadSession() {
    this.sessionService.getSessions(this.classroomId).subscribe({
      next: (res: any) => {
        const sessions = res.data || res || [];
        this.session = sessions.find((s: any) => s.id === this.sessionId);
        if (!this.session) {
          this.router.navigate(['/teacher-classroom', this.classroomId]);
          return;
        }
        this.loadStudents();
      },
      error: (err) => {
        this.message = 'Failed to load session.';
        console.error(err);
      }
    });
  }

  loadStudents() {
    // Get all students enrolled in the classroom
    const enrolledStudentIds = this.classroom.students?.map((s: any) => s.id) || [];
    
    // Get attendance records for this session
    const attendances = this.session.attendances || [];
    
    // Create a map of student_id to attendance
    const attendanceMap = new Map();
    attendances.forEach((att: any) => {
      attendanceMap.set(att.student_id, att);
    });

    // Combine students with their attendance
    this.students = this.classroom.students?.map((student: any) => {
      const attendance = attendanceMap.get(student.id);
      return {
        ...student,
        attendance: attendance || {
          id: null,
          status: 'absent',
          time_present: null
        }
      };
    }) || [];

    this.sortStudents();
  }

  sortStudents() {
    this.sortedStudents = [...this.students].sort((a, b) => {
      if (this.sortBy === 'name') {
        const nameA = `${a.last_name}, ${a.first_name}`.toLowerCase();
        const nameB = `${b.last_name}, ${b.first_name}`.toLowerCase();
        return nameA.localeCompare(nameB);
      } else {
        const statusOrder = { 'present': 1, 'late': 2, 'absent': 3 };
        const orderA = statusOrder[a.attendance.status as keyof typeof statusOrder] || 4;
        const orderB = statusOrder[b.attendance.status as keyof typeof statusOrder] || 4;
        return orderA - orderB;
      }
    });
  }

  onSortChange() {
    this.sortStudents();
  }

  updateStatus(studentId: number, status: 'present' | 'absent' | 'late') {
    const student = this.students.find(s => s.id === studentId);
    if (!student || !student.attendance.id) return;

    this.sessionService.updateAttendance(student.attendance.id, { status }).subscribe({
      next: () => {
        this.message = 'Status updated successfully!';
        this.loadSession();
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to update status.';
      }
    });
  }

  markLate(studentId: number) {
    const student = this.students.find(s => s.id === studentId);
    if (!student || !student.attendance.id) return;

    this.sessionService.markLate(student.attendance.id).subscribe({
      next: () => {
        this.message = 'Student marked as late!';
        this.loadSession();
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to mark as late.';
      }
    });
  }

  getFullName(student: any): string {
    return `${student.last_name}, ${student.first_name} ${student.middle_initial ? student.middle_initial + '.' : ''}`.trim();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'present': return 'status-present';
      case 'late': return 'status-late';
      case 'absent': return 'status-absent';
      default: return '';
    }
  }

  goBack() {
    this.router.navigate(['/teacher-classroom', this.classroomId]);
  }
}

