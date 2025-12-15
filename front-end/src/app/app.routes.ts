import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'profile', loadComponent: () => import('./profile/profile').then(m => m.Profile) },
  { path: 'student/dashboard', loadComponent: () => import('./student-dashboard/student-dashboard').then(m => m.StudentDashboard) },
  { path: 'teacher/dashboard', loadComponent: () => import('./teacher-dashboard/teacher-dashboard').then(m => m.TeacherDashboard) },
  { path: 'student/classroom/:id', loadComponent: () => import('./student-classroom/student-classroom').then(m => m.StudentClassroom) },
  { path: 'teacher/classroom/:id', loadComponent: () => import('./teacher-classroom/teacher-classroom').then(m => m.TeacherClassroom) },
  { path: 'session-detail/:classroomId/:sessionId', loadComponent: () => import('./session-detail/session-detail').then(m => m.SessionDetail) },
  { path: 'student/classroom/:id/attendance', loadComponent: () => import('./student-attendance-calendar/student-attendance-calendar').then(m => m.StudentAttendanceCalendar) },
  { path: '**', redirectTo: '/login' }
];
