import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Create a new session
  createSession(data: { classroom_id: number; topic: string; date: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/class_sessions/create`, data);
  }

  // Close a session
  closeSession(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/class_sessions/${id}/close`, {});
  }

  // Mark present for a session
  markPresent(sessionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/class_sessions/${sessionId}/present`, {});
  }

  // Get sessions for a classroom
  getSessions(classroomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/classrooms/${classroomId}/sessions`);
  }

  // Get class attendance
  getClassAttendance(classroomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance/classroom/${classroomId}`);
  }

  // Get student attendance
  getStudentAttendance(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/attendance/student/${studentId}`);
  }

  // Update attendance
  updateAttendance(attendanceId: number, data: { status: string; time_present?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/attendance/${attendanceId}`, data);
  }

  // Mark student as late
  markLate(attendanceId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance/${attendanceId}/late`, {});
  }
}

