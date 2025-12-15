import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterLink],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.css',
})
export class TeacherDashboard implements OnInit {
  classrooms: { id: number; name: string }[] = [];

  ngOnInit() {
    const stored = localStorage.getItem('teacher-classrooms');
    if (stored) {
      this.classrooms = JSON.parse(stored);
    }
  }

  createClassroom() {
    const newClassroom = {
      id: Date.now(),
      name: `Classroom ${this.classrooms.length + 1}`,
    };
    this.classrooms.push(newClassroom);
    localStorage.setItem('teacher-classrooms', JSON.stringify(this.classrooms));
  }
}
