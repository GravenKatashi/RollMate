import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-session-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './session-detail.html',
  styleUrl: './session-detail.css',
})
export class SessionDetail {
  session: any = null;
  students: any[] = [];
  sortedStudents: any[] = [];
  sortBy: 'name' | 'status' = 'name';
  classroomId: number = 0;
  sessionId: number = 0;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Mock data for demonstration
    this.route.params.subscribe(params => {
      this.classroomId = +params['classroomId'];
      this.sessionId = +params['sessionId'];

      // Mock session data
      this.session = {
        id: this.sessionId,
        topic: 'Introduction to Algebra',
        date: '2025-12-15',
        time_created: '2025-12-15T08:00:00',
        is_open: true
      };

      // Mock students data
      this.students = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          middle_initial: 'A',
          attendance: {
            id: 1,
            status: 'present',
            time_present: '08:15 AM'
          }
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          middle_initial: 'B',
          attendance: {
            id: 2,
            status: 'late',
            time_present: '08:45 AM'
          }
        },
        {
          id: 3,
          first_name: 'Bob',
          last_name: 'Johnson',
          middle_initial: 'C',
          attendance: {
            id: 3,
            status: 'absent',
            time_present: null
          }
        }
      ];

      this.sortStudents();
    });
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
    if (student) {
      student.attendance.status = status;
      if (status === 'present' && !student.attendance.time_present) {
        student.attendance.time_present = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
      this.sortStudents();
      this.message = 'Status updated successfully!';
    }
  }

  markLate(studentId: number) {
    this.updateStatus(studentId, 'late');
    this.message = 'Student marked as late!';
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

