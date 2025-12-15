import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-student-attendance-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-attendance-calendar.html',
  styleUrls: ['./student-attendance-calendar.css']
})
export class StudentAttendanceCalendar implements OnInit {
  attendances: any[] = [];
  calendarData: any = {};
  classroomId: number = 0;
  user: any = null;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
      this.loadAttendance();
    });
  }

  loadAttendance() {
    this.sessionService.getStudentAttendance(this.user.id).subscribe({
      next: (res: any) => {
        const allAttendances = res.data || res || [];
        // Filter by classroom
        this.attendances = allAttendances.filter((att: any) => 
          att.session?.classroom_id === this.classroomId
        );
        this.buildCalendar();
      },
      error: (err) => {
        this.message = 'Failed to load attendance.';
        console.error(err);
      }
    });
  }

  buildCalendar() {
    this.calendarData = {};
    
    this.attendances.forEach((attendance: any) => {
      if (attendance.session?.date) {
        const date = new Date(attendance.session.date);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        this.calendarData[dateKey] = {
          status: attendance.status,
          topic: attendance.session.topic,
          time_present: attendance.time_present
        };
      }
    });
  }

  getStatusClass(date: string): string {
    const data = this.calendarData[date];
    if (!data) return '';
    
    switch(data.status) {
      case 'present': return 'calendar-present';
      case 'late': return 'calendar-late';
      case 'absent': return 'calendar-absent';
      default: return '';
    }
  }

  getStatusLabel(date: string): string {
    const data = this.calendarData[date];
    if (!data) return '';
    return data.status.charAt(0).toUpperCase() + data.status.slice(1);
  }

  getTopic(date: string): string {
    const data = this.calendarData[date];
    return data?.topic || '';
  }

  hasSession(date: string): boolean {
    return !!this.calendarData[date];
  }

  goBack() {
    this.router.navigate(['/student-classroom', this.classroomId]);
  }

  // Generate calendar days for current month
  getCalendarDays(): any[] {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: any[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, isEmpty: true });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      days.push({
        date: dateKey,
        day: day,
        isEmpty: false,
        isToday: this.isToday(date),
        hasSession: this.hasSession(dateKey)
      });
    }

    return days;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getMonthName(): string {
    const today = new Date();
    return today.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  getCountByStatus(status: string): number {
    return this.attendances.filter(att => att.status === status).length;
  }
}

