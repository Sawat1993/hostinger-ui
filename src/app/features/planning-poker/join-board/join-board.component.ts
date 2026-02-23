import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-join-board',
  standalone: true,
  imports: [ButtonModule, InputTextModule, TextareaModule, FormsModule],
  templateUrl: './join-board.component.html',
  styleUrls: ['./join-board.component.scss']
})
export class JoinBoardComponent {
  boardCode: string = '';

  constructor(
    private router: Router,
    private httpService: HttpService,
    private messageService: MessageService
  ) {}

  joinBoard(): void {
    if (!this.boardCode.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please enter a board code',
      });
      return;
    }

    this.httpService.get<any>(`/planning-poker/board/${this.boardCode}`).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Joined board successfully!',
        });

        this.router.navigate(['/planning-poker/board', response.boardId || this.boardCode]);
      },
      error: (error) => {
        console.error('Failed to join board:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/planning-poker']);
  }
}
