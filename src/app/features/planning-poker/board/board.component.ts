import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpService } from '../../../services/http.service';
import { CommonService } from '../../../services/common.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { ParticipantsComponent } from './participants/participants.component';
import { VoteComponent } from './vote/vote.component';
import { StoriesComponent } from './stories/stories.component';

interface User {
  _id?: string;
  name: string;
  email: string;
}

interface BoardDetails {
  name: string;
  description?: string;
  createdByEmail?: string;
  participants?: Participant[];
}

interface Participant {
  name: string;
  email: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    TagModule,
    CommonModule,
    RippleModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ListboxModule,
    ParticipantsComponent,
    VoteComponent,
    StoriesComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: string | null = null;
  boardDetails: BoardDetails | null = null;
  isAdmin: boolean = false;
  currentStoryId: string | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.boardId = params['boardId'];
      console.log('Board ID:', this.boardId);
      if (this.boardId) {
        this.loadBoardDetails();
      }
    });
  }

  loadBoardDetails(): void {
    if (!this.boardId) return;

    this.httpService.get<BoardDetails>(`/planning-poker/board/${this.boardId}`).subscribe({
      next: (board) => {
        this.boardDetails = board;
        this.checkIsAdmin();
        console.log('Board Details:', this.boardDetails);
      },
      error: (error) => {
        console.error('Failed to load board details:', error);
      }
    });
  }

  checkIsAdmin(): void {
    if (!this.boardDetails) {
      this.isAdmin = false;
      return;
    }
    
    const loggedInUserEmail = this.commonService.getUserEmailFromToken();
    this.isAdmin = loggedInUserEmail == this.boardDetails.createdByEmail;
    console.log('Logged in user email:', loggedInUserEmail);
    console.log('Board created by:', this.boardDetails.createdByEmail);
    console.log('Is Admin:', this.isAdmin);
  }

  goBack(): void {
    this.router.navigate(['/planning-poker']);
  }

  onStoryCreated(storyId: string): void {
    this.currentStoryId = storyId;
  }

  revealVotes(): void {
    console.log('Revealing votes...');
    // TODO: Implement reveal votes logic
  }

  completeStory(): void {
    console.log('Completing story...');
    // TODO: Implement complete story logic
  }

  resetVotes(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset all votes?',
      header: 'Confirm Reset',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Resetting votes...');
        // TODO: Implement reset votes logic
      }
    });
  }
}

