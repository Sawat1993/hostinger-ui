import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../../services/http.service';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

interface User {
  _id?: string;
  email: string;
  name?: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-create-board',
  standalone: true,
  imports: [
    InputTextModule,
    TextareaModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    CommonModule,
  ],
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss']
})
export class CreateBoardComponent implements OnInit {
  boardName: string = '';
  description: string = '';
  participants: User[] = [];
  searchResults: User[] = [];
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Set up search with debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => {
          if (!query || query.trim().length === 0) {
            return of([]);
          }
          return this.httpService.get<User[]>('/users/search', { q: query }).pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe((results: User[]) => {
        // Filter out already selected participants
        const selectedEmails = this.participants.map(p => p.email);
        this.searchResults = results.filter(r => !selectedEmails.includes(r.email));
        this.cdr.detectChanges();
      });
  }

  onSearch(event: any): void {
    const query = event.query;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  onParticipantSelect(event: any): void {
    const user: User = event.value;
    // Check if user is already added
    if (!this.participants.find(p => p.email === user.email)) {
      this.participants = [...this.participants, user];
      this.searchQuery = '';
      this.searchResults = [];
      this.cdr.detectChanges();
    }
  }

  removeParticipant(email: string): void {
    this.participants = this.participants.filter(p => p.email !== email);
    this.cdr.detectChanges();
  }

  isFormValid(): boolean {
    return (
      this.boardName.trim().length > 0 &&
      this.participants.length > 0
    );
  }

  createBoard(): void {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in board name and select at least one participant',
      });
      return;
    }

    const boardData = {
      name: this.boardName,
      description: this.description,
      participants: this.participants.map(p => p.email)
    };

    this.httpService.post<any>('/planning-poker/board', boardData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Board created successfully!',
        });

        this.router.navigate(['/planning-poker/board', response.boardId]);
      },
      error: (error) => {
        console.error('Failed to create board:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/planning-poker']);
  }
}
