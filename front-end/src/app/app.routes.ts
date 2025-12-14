import { Route } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { TeacherDashboard } from './teacher-dashboard/teacher-dashboard';
import { TeacherClassroom } from './teacher-classroom/teacher-classroom';
import { SessionDetail } from './session-detail/session-detail';
import { StudentClassroom } from './student-classroom/student-classroom';
import { StudentAttendanceCalendar } from './student-attendance-calendar/student-attendance-calendar';
import { Profile } from './profile/profile';

export const routes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'student-dashboard', component: StudentDashboard },
  { path: 'teacher-dashboard', component: TeacherDashboard },
  { path: 'teacher-classroom/:id', component: TeacherClassroom },
  { path: 'teacher-classroom/:classroomId/session/:sessionId', component: SessionDetail },
  { path: 'student-classroom/:id', component: StudentClassroom },
  { path: 'student-classroom/:id/attendance', component: StudentAttendanceCalendar },
  { path: 'profile', component: Profile },
  { path: '**', redirectTo: 'login' }
];
