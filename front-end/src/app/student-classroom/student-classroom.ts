import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-classroom',
  imports: [RouterLink],
  templateUrl: './student-classroom.html',
  styleUrl: './student-classroom.css',
})
export class StudentClassroom {
  joinSession(sessionName: string) {
    alert(`Joining session: ${sessionName}`);
  }
}

