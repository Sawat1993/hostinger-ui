import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpService } from '../../../../services/http.service';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, ToastModule],
  providers: [MessageService],
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
})
export class VoteComponent {
  @Input() currentStoryId: string | null = null;
  @Input() boardId: string | null = null;

  currentVote: number | null = null;
  isSubmitting: boolean = false;
  voteOptions: number[] = [0, 1, 2, 3, 5, 8, 13, 21];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
  ) {}

  onSelectVote(value: number): void {
    this.currentVote = value;
  }

  submitVote(): void {
    if (this.currentVote === null) {
      return;
    }

    if (!this.boardId || !this.currentStoryId) {
      console.warn('Missing boardId or storyId');
      return;
    }

    this.isSubmitting = true;
    const voteValue = this.currentVote.toString();

    this.httpService.post(
      `/planning-poker/board/${this.boardId}/story/${this.currentStoryId}/vote`,
      { vote: voteValue }
    ).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Vote submitted: ${this.currentVote}`,
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Failed to submit vote:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to submit vote',
        });
      },
    });
  }
}
