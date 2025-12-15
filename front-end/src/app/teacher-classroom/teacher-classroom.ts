import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-classroom',
  imports: [RouterLink],
  templateUrl: './teacher-classroom.html',
  styleUrl: './teacher-classroom.css',
})
export class TeacherClassroom {
  startSession(sessionId: number) {
    // Start session functionality
    console.log(`Starting session: ${sessionId}`);
  }
}

