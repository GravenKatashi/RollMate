import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch classrooms for the logged-in teacher
  getTeacherClassrooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/classrooms/teacher`);
  }

  // Fetch classrooms for the logged-in student
  getStudentClassrooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/classrooms/student`);
  }

  // Create a new classroom
  createClassroom(data: { subject: string; additional_info?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/classrooms`, data);
  }

  // Join a classroom using code
  joinClassroom(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/classrooms/join`, { code });
  }
}
