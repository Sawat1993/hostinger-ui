import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HttpService } from '../../../../services/http.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

interface Participant {
  name: string;
  email: string;
}

interface User {
  _id?: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    RippleModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    AutoCompleteModule,
    ConfirmDialogModule,
  ],
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent {
  @Input() participants: Participant[] = [];
  @Input() isAdmin: boolean = false;
  @Input() boardId: string | null = null;
  @Output() participantAdded = new EventEmitter<Participant>();
  @Output() participantRemoved = new EventEmitter<Participant>();

  // Dialog properties
  showAddParticipantDialog: boolean = false;
  searchResults: User[] = [];
  searchQuery: string = '';
  selectedUser: User | null = null;
  private searchSubject = new Subject<string>();

  constructor(
    private httpService: HttpService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
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
        // Filter out already added participants
        const participantEmails = this.participants.map(p => p.email.toLowerCase());
        this.searchResults = results.filter(
          (user) => !participantEmails.includes(user.email.toLowerCase())
        );
        this.cdr.detectChanges();
      });
  }

  openAddParticipantDialog(): void {
    this.showAddParticipantDialog = true;
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedUser = null;
  }

  onSearch(event: any): void {
    const query = event.query;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  onParticipantSelect(event: any): void {
    const user: User = event.value;
    this.selectedUser = user;
  }

  addParticipant(): void {
    if (!this.selectedUser || !this.boardId) return;

    this.httpService.post(`/planning-poker/board/${this.boardId}/participant`, { email: this.selectedUser.email }).subscribe({
      next: () => {
        // Add to local list and emit event
        const newParticipant: Participant = {
          name: this.selectedUser!.name,
          email: this.selectedUser!.email
        };
        this.participants.push(newParticipant);
        this.participantAdded.emit(newParticipant);
        
        // Reset and close dialog
        this.showAddParticipantDialog = false;
        this.searchQuery = '';
        this.searchResults = [];
        this.selectedUser = null;
        this.cdr.detectChanges();
        
        console.log('Participant added successfully');
      },
      error: (error) => {
        console.error('Failed to add participant:', error);
      }
    });
  }

  removeParticipant(participant: Participant): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove ${participant.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // API call to remove participant
        this.httpService.delete(`/planning-poker/board/${this.boardId}/participant/${participant.email}`).subscribe({
          next: () => {
            this.participants = this.participants.filter(p => p.email !== participant.email);
            this.participantRemoved.emit(participant);
            console.log('Participant removed successfully');
          },
          error: (error) => {
            console.error('Failed to remove participant:', error);
          }
        });
      }
    });
  }
}
